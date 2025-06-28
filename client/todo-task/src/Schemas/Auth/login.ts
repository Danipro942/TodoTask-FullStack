import {z} from 'zod'

export const loginSchema = z.object({
    email: z.string().min(1, 'This field is required')
    .email('Invalid email address')
    .min(3, 'The title must be at least 3 characters long').max(100, 'The title is too long'),
    password: z.string().min(1, 'This field is required')
})


export type LoginForm = z.infer<typeof loginSchema>