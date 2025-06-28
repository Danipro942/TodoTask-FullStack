import axios, {AxiosError} from 'axios'
import { ErrorResponse, UserResponse } from '../types/user'
import { useMutation } from '@tanstack/react-query'

type LoginUser = {
    email: string
    password: string
}

const postUserLogin = async (dataUser: LoginUser) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`

    const response = await axios.put<UserResponse>(URL,
        dataUser
    )
    return response.data
}

export default function useLogin() {
    return useMutation<UserResponse, AxiosError<ErrorResponse>, LoginUser>({
        mutationFn: postUserLogin,
    })
}