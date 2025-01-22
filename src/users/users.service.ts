import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { userDto as UserDto } from 'src/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

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

    //checking if user already exists

    const isUserExist = await this.userModel.findOne({ email: user.email });

    if (isUserExist) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new this.userModel(user);
    try {
      await newUser.save();
      return { message: 'User created successfully' };
    } catch {
      throw new HttpException(
        { message: 'Error creating user' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
