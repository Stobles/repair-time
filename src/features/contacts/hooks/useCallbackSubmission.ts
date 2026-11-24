import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { callbackFormSchema, type CallbackFormValues } from "../model/CallbackFormSchema";
import type { CallbackFormProps, CallbackResult } from "../types/callbackForm";

const failedMessage = "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами напрямую.";

export function useCallbackSubmission({ propertyTypes, submitUrl }: CallbackFormProps) {
  const pending = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; error: boolean }>();
  const { control, register, handleSubmit, reset, setError, setFocus, formState: { errors } } = useForm<CallbackFormValues>({
    resolver: zodResolver(callbackFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      property: propertyTypes[0]?.value ?? "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (pending.current || propertyTypes.length === 0) return;

    pending.current = true;
    setIsSubmitting(true);
    setFeedback(undefined);
    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({ ...values, consent: String(values.consent) }),
      });
      const result: CallbackResult = await response.json();
      if (response.ok && result.ok) {
        reset();
        setFeedback({ message: "Заявка отправлена. Мы свяжемся с вами.", error: false });
        return;
      }

      if (!result.ok && result.code === "property_unavailable") {
        setError("property", { type: "server", message: "Этот тип объекта больше недоступен. Выберите другой." });
        setFocus("property");
        return;
      }
      setFeedback({ message: failedMessage, error: true });
    } catch {
      setFeedback({ message: failedMessage, error: true });
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  }, () => setFeedback(undefined));

  return { control, register, errors, feedback, isSubmitting, onSubmit };
}
