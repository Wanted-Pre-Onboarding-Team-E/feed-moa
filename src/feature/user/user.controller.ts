import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { UserService } from './user.service';
import { LoginRequestDto } from './dto/loginRequest.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async userLogin(
    @Body() loginRequestDto: LoginRequestDto,
    @Res() res: Response,
  ) {
    const { username, password } = loginRequestDto;
    const verifiedUser = await this.userService.verifyUser(username, password);

    // JWT 발급
    const payload = { id: verifiedUser.id, username: verifiedUser.username };
    const accessToken = await this.jwtService.signAsync(payload);

    // Set-Cookie 헤더로 JWT 반환
    return res.cookie('accessToken', accessToken, { httpOnly: true }).send();
  }
}
