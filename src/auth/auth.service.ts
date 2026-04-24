import { UsersService } from 'src/users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async login(email: string, plainPassword: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const passwordMatch = await bcrypt.compare(plainPassword, user.password)

        if (!passwordMatch) {
            throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED)
        }

        const tokens = await this.generateToken(user.id, user.email, user.role)
        await this.saveRefreshToken(user.id, tokens)
        return tokens
    }

    async generateToken(sub: string, email: string, role: Role) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({sub, email, role}, {expiresIn: '15m'}),
            this.jwtService.signAsync({sub, email, role}, {expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET})
        ])
        return {access_token, refresh_token}
    }

    async saveRefreshToken(userId: string, tokens: {refresh_token: string}) {
        const hash = await bcrypt.hash(tokens.refresh_token, 10)
        await this.usersService.updateRefreshToken(userId, hash)
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, '')
    }
}