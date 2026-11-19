import { useId } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Field, FieldError, FieldLabel } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/Input";
import { SelectField } from "@/shared/ui/SelectField";
import { Textarea } from "@/shared/ui/Textarea";
import { useCallbackForm } from "../hooks/UseCallbackForm";
import { propertyTypes } from "../model/CallbackFormSchema";

function CallbackForm() {
  const id = useId();
  const { control, register, errors, feedback, onSubmit } = useCallbackForm();
  const nameErrorId = `${id}-name-error`;
  const phoneErrorId = `${id}-phone-error`;
  const messageErrorId = `${id}-message-error`;

  return (
    <form
      data-callback-form
      method="post"
      noValidate
      onSubmit={onSubmit}
      aria-label="Заявка на замер и расчет сметы"
      className="grid min-w-0 gap-16px bg-background-base text-text-primary"
    >
      <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-16px">
        <Field data-invalid={Boolean(errors.name) || undefined}>
          <FieldLabel htmlFor={`${id}-name`}>
            ИМЯ <span className="text-text-accent" aria-hidden="true">*</span>
          </FieldLabel>
          <Input
            {...register("name")}
            id={`${id}-name`}
            placeholder="Константин"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? nameErrorId : undefined}
          />
          <FieldError id={nameErrorId} errors={[errors.name]} />
        </Field>

        <Field data-invalid={Boolean(errors.phone) || undefined}>
          <FieldLabel htmlFor={`${id}-phone`}>
            НОМЕР ТЕЛЕФОНА <span className="text-text-accent" aria-hidden="true">*</span>
          </FieldLabel>
          <Input
            {...register("phone")}
            id={`${id}-phone`}
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            required
            aria-invalid={Boolean(errors.phone) || undefined}
            aria-describedby={errors.phone ? phoneErrorId : undefined}
          />
          <FieldError id={phoneErrorId} errors={[errors.phone]} />
        </Field>
      </div>

      <Controller
        control={control}
        name="property"
        render={({ field, fieldState }) => (
          <SelectField
            id={`${id}-property`}
            label="ТИП ОБЪЕКТА"
            options={propertyTypes}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            triggerRef={field.ref}
            error={fieldState.error?.message}
          />
        )}
      />

      <Field data-invalid={Boolean(errors.message) || undefined}>
        <FieldLabel htmlFor={`${id}-message`}>
          ВАШЕ СООБЩЕНИЕ <span className="text-text-accent" aria-hidden="true">*</span>
        </FieldLabel>
        <Textarea
          {...register("message")}
          id={`${id}-message`}
          placeholder="Укажите адрес, площадь или пожелания к ремонту"
          required
          aria-invalid={Boolean(errors.message) || undefined}
          aria-describedby={errors.message ? messageErrorId : undefined}
        />
        <FieldError id={messageErrorId} errors={[errors.message]} />
      </Field>

      <Controller
        control={control}
        name="consent"
        render={({ field, fieldState }) => (
          <Field
            orientation="horizontal"
            data-invalid={fieldState.invalid || undefined}
            className="min-h-ui-checkbox-row"
          >
            <Checkbox
              id={`${id}-consent`}
              name={field.name}
              ref={field.ref}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
              onBlur={field.onBlur}
              required
              aria-invalid={fieldState.invalid || undefined}
            />
            <FieldLabel
              htmlFor={`${id}-consent`}
              className="block min-w-0 cursor-pointer text-desktop-body-extra-small text-text-tertiary group-data-[invalid=true]/field:text-error"
            >
              Согласен на обработку персональных данных для обратного звонка <span aria-hidden="true">*</span>
            </FieldLabel>
          </Field>
        )}
      />

      <Button
        type="submit"
        leftIcon="send"
        rightIcon={false}
        className="h-auto min-h-ui-button-large w-full px-16px text-center whitespace-normal"
      >
        ОБСУДИТЬ ПОХОЖИЙ ПРОЕКТ
      </Button>
      <output className="empty:sr-only text-desktop-body-medium text-error">{feedback}</output>
    </form>
  );
}

export { CallbackForm };
