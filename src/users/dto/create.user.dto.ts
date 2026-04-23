import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    readonly password: string
}