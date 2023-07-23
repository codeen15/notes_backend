import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../auth.service";


@Injectable()
export class TokenGuard implements CanActivate {
    constructor(private reflector: Reflector, private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();


        const token = request.headers?.authorization.split(' ')[1];

        const user = await this.authService.validateUserByToken(token);

        if (user) {
            request.headers.user = user;
            Logger.debug(request.headers.user);
            return true;
        }

        return false;
    }
}