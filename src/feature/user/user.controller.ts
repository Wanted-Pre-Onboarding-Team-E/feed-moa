import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUpUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.checkUserExists(createUserDto.username);
    await this.userService.checkPasswordValidate(
      createUserDto.password,
      createUserDto.confirmPassword,
    );
    await this.userService.createUser(createUserDto);

    return {
      message: '가입요청이 완료되었습니다.',
      data: createUserDto,
    };
  }
}
