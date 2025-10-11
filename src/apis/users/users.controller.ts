import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { AppResponse } from 'src/common/app.response';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';

const { success } = AppResponse;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('addUser')
  async create(@Res() res: Response, @Body() createUserDto: UserDto) {
    const result = await this.usersService.createUser(createUserDto);
    return res
      .status(HttpStatus.CREATED)
      .json(success('User created successfully', 201, result));
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
