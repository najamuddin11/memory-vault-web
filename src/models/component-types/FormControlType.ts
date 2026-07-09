import type { ChangeEvent } from "react";

export default interface FormControlType {
  name: string;
  email: string;
  message: string;
  company: string;
}

export interface ContactSubmitPayload extends FormControlType {
  csrfToken: string;
  recaptchaToken?: string;
}

export type InputChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
