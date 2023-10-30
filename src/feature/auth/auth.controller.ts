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
import { ApproveMembershipRequestDto } from './dto/approveMembershipRequest.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /** 사용자 회원가입 API
   * @Param createUserDto 회원가입 입력 정보 */
  @Post('/signup')
  async signUpUser(@Body() createUserDto: CreateUserDto) {
    await this.authService.checkUserExists(createUserDto.username);
    await this.authService.checkPasswordValidate(
      createUserDto.password,
      createUserDto.confirmPassword,
    );
    const authCode = await this.authService.createUser(createUserDto);

    return {
      message: '가입요청이 완료되었습니다.',
      data: { authCode },
    };
  }

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
  @HttpCode(HttpStatus.OK)
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