import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from 'src/dto/users.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: loginDto, @Res() res: Response): Promise<any> {
    // Validate user credentials
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token for the valid user
    const token = await this.authService.generateJwtToken({
      id: user._id as string,
      email: user.email,
    });

    return res.status(HttpStatus.OK).json({ token });
  }
}
