import axios, {AxiosError} from 'axios'
import { ErrorResponse, RegisterUser, UserResponse } from '../types/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { get } from 'react-hook-form'
import { TasksList, TasksResponse } from '../types/tasks'
import { getSession } from '../utils/localStorage'



const FetchTasks = async (page: number, status: Boolean) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/task?page=${page}&status=${status}`
    const token = getSession()

    const response = await axios.get<TasksResponse>(URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export default function UseGetTasks(page: number, status: Boolean) {
    return useQuery({
        queryKey: ['tasks', page, status],
        queryFn: () => FetchTasks(page, status),
        enabled: !!page

    })
}
