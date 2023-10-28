import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { LoginDto } from './dto/login.dto';
import { UserLib } from '../feature/user/user.lib';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userLib: UserLib,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() loginDto: LoginDto, @Res() res: Response) {
    const verifiedUser = await this.userLib.verifyUser(loginDto);

    // JWT 발급
    const payload = { id: verifiedUser.id, username: verifiedUser.username };
    const accessToken = await this.jwtService.signAsync(payload);

    // Set-Cookie 헤더로 JWT 반환
    return res.cookie('accessToken', accessToken, { httpOnly: true }).send();
  }
}
