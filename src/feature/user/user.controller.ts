import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 사용자 회원가입 API
   * @Param createUserDto 회원가입 입력 정보 */
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
