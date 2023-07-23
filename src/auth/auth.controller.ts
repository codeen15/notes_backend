import { Body, Controller, Get, HttpCode, Post, UseGuards, Request, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() body: RegisterDto,) {
        return this.authService.register(body);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() body: LoginDto,) {
        return this.authService.login(body);
    }

    @Get('user')
    @UseGuards(AuthGuard('token'))
    user(@Request() request: any) {
        return request.user;
    }

    @Post('logout')
    @HttpCode(204)
    @UseGuards(AuthGuard('token'))
    logout(@Request() request: any) {
        const authorization = request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException('No Token');
        }

        const token = authorization.split(' ')[1];

        this.authService.logout(token);
    }

    @Post('logout-all')
    @HttpCode(204)
    @UseGuards(AuthGuard('token'))
    logoutAll(@Request() request: any) {
        this.authService.logoutAll(request.user);
    }

}
