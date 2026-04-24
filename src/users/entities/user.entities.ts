export type Role = 'user' | 'admin'

export class User {
    id: string
    role: Role
    email: string
    password: string
    refreshToken: string
}