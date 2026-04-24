import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './jwt/jwt.guard';
import { RolesGuards } from './guards/roles.guard';
import { SelfOrAdminGuard } from './guards/owner-or-admin.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10m' },
      }),
    }),
  ],
  providers: [AuthService, JwtGuard, RolesGuards, SelfOrAdminGuard],
  controllers: [AuthController],
  exports: [JwtGuard, JwtModule, RolesGuards, SelfOrAdminGuard],
})
export class AuthModule {}