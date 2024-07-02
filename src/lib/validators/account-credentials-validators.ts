import { z } from "zod";

export const AuthCredentialsValidator = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  terms: z.boolean(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>

export const LoginCredentialsValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
})

export type TLoginCredentialsValidator = z.infer<typeof LoginCredentialsValidator>
