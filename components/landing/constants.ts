import * as z from "zod";
import { FieldError, UseFormRegister } from "react-hook-form";

export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export const formSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name is required."
    }),
    lastName: z.string().min(1, {
        message: "Last name is required."
    }),
    email: z.string()
    .min(1, { message: "Email is required." })
    .email("This is not a valid email."),
    message: z.string().min(1, {
        message: "Message is required."
    }),
});


export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  icon: string;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ValidFieldNames =
| "firstName"
| "lastName"
| "email"
| "message";