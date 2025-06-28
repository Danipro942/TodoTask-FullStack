import {z} from 'zod'

export const addTaskSchema = z.object({
    title: z.string().min(3, 'This field is required').max(30, 'The title is too long'),
    description: z.string().min(3, 'This field is required').max(100, 'The title is too long')
})

export type AddTaskForm = z.infer<typeof addTaskSchema>