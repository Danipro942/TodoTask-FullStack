import axios, {AxiosError} from 'axios'
import { ErrorResponse, RegisterUser, UserResponse } from '../types/user'
import { useMutation } from '@tanstack/react-query'
import { AddTaskResponse } from '../types/tasks'
import { AddTaskForm } from '../Schemas/Todo/AddTask'
import { getSession } from '../utils/localStorage'



const postAddTask = async (dataForm: AddTaskForm) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/task/create-task`
    const token = getSession()// Replace with your actual token

    const response = await axios.post<AddTaskResponse>(URL, dataForm, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export default function addTask() {
    return useMutation<AddTaskResponse, AxiosError<ErrorResponse>, AddTaskForm>({
        mutationFn: postAddTask,
    })
}