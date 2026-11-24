import type { APIRoute } from "astro";
import { callbackFormSchema, createCallbackRequest } from "@/features/contacts/server";
import type { CallbackResult } from "@/features/contacts/types/callbackForm";

export const prerender = false;

const maxBodyBytes = 32 * 1024;

async function readForm(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return new URLSearchParams();

  const decoder = new TextDecoder();
  let size = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
    return new URLSearchParams(body + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}

export const POST: APIRoute = async ({ request }) => {
  function respond(result: CallbackResult, status: number, message: string) {
    const headers = { "Cache-Control": "no-store" };
    if (request.headers.get("accept")?.includes("application/json")) {
      return Response.json(result, { status, headers });
    }
    return new Response(message, {
      status,
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const invalid = { ok: false, code: "invalid" } as const;
  const contentType = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (contentType !== "application/x-www-form-urlencoded") {
    return respond(invalid, 415, "Неподдерживаемый формат заявки.");
  }

  let form: URLSearchParams | null;
  try {
    form = await readForm(request);
  } catch {
    return respond(invalid, 400, "Не удалось прочитать заявку.");
  }
  if (!form) return respond(invalid, 413, "Заявка слишком большая.");

  const consent = form.get("consent");
  const parsed = callbackFormSchema.safeParse({
    name: form.get("name"),
    phone: form.get("phone"),
    property: form.get("property"),
    message: form.get("message"),
    consent: consent === "true" || consent === "on",
  });
  if (!parsed.success) return respond(invalid, 422, "Проверьте данные заявки.");

  try {
    const result = await createCallbackRequest(parsed.data);
    if (result === "created") return respond({ ok: true }, 201, "Заявка отправлена.");
    if (result === "property_unavailable") {
      return respond({ ok: false, code: result }, 422, "Этот тип объекта больше недоступен. Выберите другой.");
    }
  } catch {
    console.error("Directus callback request failed.");
  }
  return respond({ ok: false, code: "unavailable" }, 503, "Не удалось отправить заявку. Попробуйте позже.");
};
