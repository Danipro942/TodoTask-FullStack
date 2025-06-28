import {z} from 'zod'

export const PasswordSchema = z.object({

    password: z.string().min(1, 'This field is required'),
    confirmPassword: z.string().min(1, 'This field is required')
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type PasswordForm = z.infer<typeof PasswordSchema>