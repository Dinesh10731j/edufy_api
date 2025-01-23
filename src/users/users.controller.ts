import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto as UserDto } from 'src/dto/users.dto';
import { loginDto as LoginDto } from 'src/dto/users.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('create')
  createUser(@Body() user: UserDto): Promise<{ token: string }> {
    return this.userService.createUser(user);
  }

  @Post('login')
  login(@Body() user: LoginDto): Promise<{ token: string }> {
    return this.userService.login(user);
  }
}
