import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './types/jwt-payload.type';
import { RefreshGuard } from './jwt/refresh.guard';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.login(dto.email, dto.password)
        console.log('user', user)
        return user
    }

    @Post('refresh')
    @UseGuards(RefreshGuard)
    async refresh(@CurrentUser() user: JwtPayload) {
        return this.authService.generateToken(user.sub, user.email, user.role)
    }

    @Post('logout')
    @UseGuards(JwtGuard)
    async logout(@CurrentUser() user: JwtPayload) {
        return this.authService.logout(user.sub)
    }
}
