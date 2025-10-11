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
  UseGuards,
} from '@nestjs/common';
import { AppResponse } from 'src/common/app.response';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

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
  asyfindAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@Req() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    const result = await this.usersService.dashboard(userId);
    return res
      .status(HttpStatus.OK)
      .json(success('User retrieved successfully', 200, result));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
