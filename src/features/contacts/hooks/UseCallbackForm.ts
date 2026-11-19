import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { callbackFormSchema, propertyTypes, type CallbackFormValues } from "../model/CallbackFormSchema";

const submissionMessage = "Отправка через сайт пока недоступна. Позвоните нам или напишите в Telegram.";

function useCallbackForm() {
  const [feedback, setFeedback] = useState("");
  const { control, register, handleSubmit, formState: { errors } } = useForm<CallbackFormValues>({
    resolver: zodResolver(callbackFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      property: propertyTypes[0].value,
      message: "",
      consent: false,
    },
  });

  return {
    control,
    register,
    errors,
    feedback,
    onSubmit: handleSubmit(() => setFeedback(submissionMessage)),
  };
}

export { useCallbackForm };
