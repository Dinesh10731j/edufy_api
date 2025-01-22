import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto as UserDto } from 'src/dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('create')
  createUser(@Body() user: UserDto): Promise<string | { message: string }> {
    return this.userService.createUser(user);
  }
}
