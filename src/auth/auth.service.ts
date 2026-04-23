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

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)

        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED)
        }

        const payload = { sub: user.id, email: user.email }

        return { access_token: this.jwtService.sign(payload) }
    }
}
