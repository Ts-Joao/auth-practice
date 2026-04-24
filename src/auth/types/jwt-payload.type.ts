import { Role } from "@prisma/client"

export type JwtPayload = {
    role: Role
    sub: string
    email: string
}