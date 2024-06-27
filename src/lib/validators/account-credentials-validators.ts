import { z } from "zod";

export const AuthCredentialsValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>

export const LoginCredentialsValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
})

export type TLoginCredentialsValidator = z.infer<typeof LoginCredentialsValidator>
