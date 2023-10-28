import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/createUser.dto';

import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('/signup')
  async signUpUser(@Body() createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const userExist = await this.userRepository.findOneByUsername(username);
    if (userExist) {
      throw new BadRequestException(`${username}은 이미 존재하는 계정입니다.`);
    }

    const passwordValid =
      await this.userService.checkPasswordValidate(password);
    if (!passwordValid) {
      throw new BadRequestException(`적절하지 않은 패스워드 입니다.`);
    }

    await this.authService.createAuthCode(email);
    await this.userService.createUser(createUserDto);

    return {
      message: '가입요청이 완료되었습니다.',
      data: createUserDto,
    };
  }
}
