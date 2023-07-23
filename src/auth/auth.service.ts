import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthToken } from 'src/entities/auth_token.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(AuthToken)
        private authTokenRepository: Repository<AuthToken>,
    ) { }


    async register(data: RegisterDto) {
        try {

            const round = await bcrypt.genSalt();
            const password = data.password;
            const hashed_password = await bcrypt.hash(password, round);

            const user = new User();

            user.name = data.name;
            user.email = data.email;
            user.password = hashed_password;

            await this.usersRepository.save(user);

            return;


        } catch {
            throw new BadRequestException('Email already exists!');
        }

    }


    async login(data: LoginDto) {

        const user = await this.usersRepository.findOne({ where: { email: data.email } });

        if (!user) {
            throw new BadRequestException('Email or password is invalid!');
        }


        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            throw new BadRequestException('Email or password is invalid!');
        }

        const token = randomBytes(64).toString('hex');

        const round = await bcrypt.genSalt();
        const authToken = new AuthToken()
        authToken.user = user;
        authToken.token_key = token.slice(0, 10);
        authToken.hashed = await bcrypt.hash(token, round);

        const tokenSaved = await this.authTokenRepository.save(authToken);

        if (!tokenSaved) {
            throw new BadRequestException('Login failed!');
        }

        const { password, ...userData } = user;

        return {
            user: userData,
            token
        }

    }

    async logout(token: string) {
        const res = await this.authTokenRepository.delete({ token_key: token.slice(0, 10) });

        if (res.affected == 0) {
            throw new UnauthorizedException('Token invalid');
        }

        return;
    }

    async logoutAll(u: User) {
        const res = await this.authTokenRepository.delete({ user: u });

        if (res.affected == 0) {
            throw new UnauthorizedException('Token invalid');
        }

        return;
    }

    async validateUserByToken(token: string): Promise<any> {

        const authToken = await this.authTokenRepository.findOne({
            where: { token_key: token.slice(0, 10) },
            relations: {
                user: true
            }
        });

        if (!authToken) {
            return null;
        }

        const matched = await bcrypt.compare(token, authToken.hashed);

        if (matched) {
            const { password, ...result } = authToken.user;
            return result;
        }

        return null;
    }

}
