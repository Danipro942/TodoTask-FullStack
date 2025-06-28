
export type UserType = {
    username: string,
    email: string,
    _id: string
    exp: number,
    iat: number
}

export type RegisterUser = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type UserResponse = {
    message: string,
    token: string
}

export interface ErrorResponse {
    message: string; // El formato que esperas del servidor
  }

