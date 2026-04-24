import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.type";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuards implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): any {
        const roles = this.reflector.get<String[]>('roles', context.getHandler())
        if (!roles) return true

        const user: JwtPayload = context.switchToHttp().getRequest().user
        if(!roles.includes(user.role)) throw new ForbiddenException()

        return true
    }
}