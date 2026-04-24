import { UsersService } from 'src/users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async login(user: any) {
        const passwordMatch = await bcrypt.compare(user.password, user.password)

        if (!passwordMatch) {
            throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED)
        }

        const tokens = await this.generateToken(user.id, user.email)
        await this.saveRefreshToken(user.id, tokens)
        return tokens
    }

    async generateToken(sub: string, email: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({sub, email}, {expiresIn: '15m'}),
            this.jwtService.signAsync({sub, email}, {expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET})
        ])
        return {access_token, refresh_token}
    }

    async saveRefreshToken(userId: string, tokens: {refresh_token: string}) {
        const hash = await bcrypt.hash(tokens.refresh_token, 10)
        await this.usersService.updateRefreshToken(userId, hash)
    }
}