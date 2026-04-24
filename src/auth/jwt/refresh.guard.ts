import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>()
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_REFRESH_SECRET })

            const user = await this.usersService.getById(payload.sub)
            if (!user?.refreshToken) {
                throw new UnauthorizedException('invalid refresh token')
            }

            const valid = await bcrypt.compare(token, user.refreshToken)
            if (!valid) {
                throw new UnauthorizedException('invalid refresh token')
            }

            req['user'] = payload
            return true
        } catch {
            throw new UnauthorizedException('invalid refresh token')
        }
    }
}