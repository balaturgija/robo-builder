import {
    Controller,
    Post,
    UseGuards,
    Res,
    Inject,
    HttpCode,
    Body,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserCreateDto } from '../users/dto/create-user.dto';
import { UserLoginDto } from '../users/dto/login-user.dto';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
    /**
     *
     */
    constructor(
        private authService: AuthService,
        @Inject('SERIALIZER') private readonly serializer: any
    ) {}

    @Post('register')
    @ApiTags('auth')
    async register(@Body() user: UserCreateDto, @Res() res: Response) {
        const createdUser = await this.authService.createAsync(user);
        res.send(this.serializer.serialize('users', createdUser));
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiTags('auth')
    @HttpCode(200)
    @ApiBody({ type: UserLoginDto })
    async login(@AuthUser() user, @Res() res: Response) {
        const tokenOptions: TokenOptions = {
            id: user.id,
            username: user.username,
            password: user.password,
            email: user.email,
            roleId: user.roleId,
            walletId: user.walletId,
            wallet: user.wallet,
            role: user.role,
        };

        const token = await this.authService.createToken(tokenOptions);
        res.header('access-token', token);
        res.send(
            this.serializer.serialize('users', {
                id: user.id,
                username: user.username,
                email: user.email,
            })
        );
    }
}
