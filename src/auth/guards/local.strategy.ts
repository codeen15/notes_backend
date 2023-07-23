import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-custom";
import { Request } from "express";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'token') {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(req: Request) {

        const authorization = req.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException('No Token');
        }

        const token = authorization.split(' ')[1];

        const user = await this.authService.validateUserByToken(token);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}