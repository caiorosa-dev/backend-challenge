import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @IsPublic()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  async me(@ActiveUserId() userId: number) {
    return this.usersService.findOne(userId);
  }
}
