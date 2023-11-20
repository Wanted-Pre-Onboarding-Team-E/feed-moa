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
import { CreateUserDto } from './dto/createUser.dto';
import { ApproveMembershipRequestDto } from './dto/approveMembershipRequest.dto';
import { LoginDto } from './dto/login.dto';
import { SuccessType } from '../../enum/successType.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /** 사용자 회원가입 API
   * @param createUserDto 회원가입 입력 정보 */
  @Post('/register')
  async signUpUser(@Body() createUserDto: CreateUserDto) {
    await this.authService.checkUserExists(createUserDto.username);
    await this.authService.checkPasswordValidate(
      createUserDto.password,
      createUserDto.confirmPassword,
    );
    const authCode = await this.authService.createUser(createUserDto);

    return {
      message: SuccessType.USER_SIGN_UP,
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
    return res.cookie('accessToken', accessToken, { httpOnly: true }).json({
      message: SuccessType.USER_SIGN_IN,
      data: payload,
    });
  }

  @Post('approve')
  @HttpCode(HttpStatus.OK)
  async approveMembership(
    @Body()
    approveMembershipRequestDto: ApproveMembershipRequestDto,
  ) {
    await this.authService.activateUser(approveMembershipRequestDto);
    return {
      message: SuccessType.USER_APPROVE,
    };
  }
}
