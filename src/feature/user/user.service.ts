import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser({ username, email, password }: CreateUserDto) {
    const user = this.userRepository.create({
      username,
      email,
      password,
    });

    return await this.userRepository.save(user);
  }

  async checkPasswordValidate(password: string) {
    if (password.length < 10) {
      return false; // 최소 10자 이상
    }

    const characterTypes = [
      /[a-zA-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*]/.test(password),
    ].filter(Boolean).length;
    if (characterTypes < 2) {
      return false;
    }

    return !/(\w)\1\1/.test(password);
  }
}
