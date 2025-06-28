import axios, {AxiosError} from 'axios'
import { ErrorResponse, RegisterUser, UserResponse } from '../types/user'
import { useMutation } from '@tanstack/react-query'

const postUserRegister = async (dataUser: RegisterUser) => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`

    const response = await axios.post<UserResponse>(URL,
        dataUser
    )
    return response.data
}

export default function useRegister() {
    return useMutation<UserResponse, AxiosError<ErrorResponse>, RegisterUser>({
        mutationFn: postUserRegister,
    })
}