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

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApproveMembershipRequestDto } from './dto/approveMembershipRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() loginDto: LoginDto, @Res() res: Response) {
    const verifiedUser = await this.authService.verifyUser(loginDto);

    // JWT 발급
    const payload = {
      id: verifiedUser.id,
      username: verifiedUser.username,
      email: verifiedUser.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    // Set-Cookie 헤더로 JWT 토큰 & 응답 body로 사용자 정보 반환
    return res
      .cookie('accessToken', accessToken, { httpOnly: true })
      .json(payload);
  }

  @Post('approve')
  async approveMembership(
    @Body()
    approveMembershipRequestDto: ApproveMembershipRequestDto,
  ) {
    await this.authService.activateUser(approveMembershipRequestDto);
    return {
      message: '가입 승인되었습니다.',
    };
  }
}
