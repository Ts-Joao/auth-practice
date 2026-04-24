import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { JwtPayload } from "../types/jwt-payload.type";

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): any {
        const request = context.switchToHttp().getRequest()
        const user: JwtPayload = request.user
        const id = request.params.id

        if (user.role === 'admin' || user.sub === id) return true

        throw new ForbiddenException()
    }
}