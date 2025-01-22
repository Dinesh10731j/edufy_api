import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { userDto as UserDto } from 'src/dto/users.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  getHello(): string {
    return 'Hello World! from UserService';
  }

  async createUser(user: UserDto): Promise<string | { message: string }> {
    if (user.password !== user.confirmPassword) {
      throw new HttpException(
        { message: 'Password and confirmPassword do not match' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await this.hashPassword(user.password);
    const hashedConfirmPassword = await this.hashPassword(user.confirmPassword);

    user.password = hashedPassword;
    user.confirmPassword = hashedConfirmPassword;

    return 'User created successfully';
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
