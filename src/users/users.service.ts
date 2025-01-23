import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { userDto as UserDto } from 'src/dto/users.dto';
import { loginDto as LoginDto } from 'src/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World! from UserService';
  }

  async createUser(user: UserDto): Promise<{ token: string }> {
    if (user.password !== user.confirmPassword) {
      throw new HttpException(
        { message: 'Password and confirmPassword do not match' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await this.hashPassword(user.password);

    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;

    // Check if user already exists
    const isUserExist = await this.userModel.findOne({ email: user.email });
    if (isUserExist) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new this.userModel(user);
    try {
      const savedUser = await newUser.save();
      const token = this.generateJwtToken(savedUser);
      return { token }; // Return the JWT token
    } catch {
      throw new HttpException(
        { message: 'Error creating user' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(user: LoginDto): Promise<{ token: string }> {
    const existingUser = await this.userModel.findOne({ email: user.email });
    if (!existingUser) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        { message: 'Invalid credentials' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.generateJwtToken(existingUser);
    return { token }; // Return the JWT token
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private generateJwtToken(user: User): string {
    const payload = { sub: user._id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
