import { z } from "zod";

function isPhoneNumber(phone: string) {
  if (!/^\+?(?:\d|\(\d{1,5}\))(?:[\d .\u00a0\u202f-]|\(\d{1,5}\))*\d$/.test(phone)) return false;

  const digits = phone.replace(/\D/g, "");
  if (/^(\d)\1+$/.test(digits)) return false;

  if (phone.startsWith("+")) {
    return digits.startsWith("7") ? digits.length === 11 : /^[1-9]\d{7,14}$/.test(digits);
  }

  return /^(?:[78])?[3489]\d{9}$/.test(digits);
}

const callbackFormSchema = z.object({
  name: z.string().trim().min(1, "Укажите ваше имя.").max(120, "Имя должно быть не длиннее 120 символов."),
  phone: z.string().trim().min(1, "Укажите номер телефона.").max(64, "Проверьте номер телефона.")
    .pipe(z.string().refine(isPhoneNumber, "Введите корректный номер телефона.")),
  property: z.string().regex(/^[a-z0-9_-]{1,64}$/, "Выберите тип объекта."),
  message: z.string().trim().min(1, "Введите сообщение или укажите площадь.")
    .max(2000, "Сообщение должно быть не длиннее 2000 символов."),
  consent: z.boolean().refine(Boolean, "Подтвердите согласие на обработку персональных данных."),
});

type CallbackFormValues = z.infer<typeof callbackFormSchema>;

export { callbackFormSchema, type CallbackFormValues };
