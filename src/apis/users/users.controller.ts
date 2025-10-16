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
import { UsersService } from './users.service';
import { LoginDto, UserDto } from './dto/user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('addUser')
  async create(@Res() res: Response, @Body() createUserDto: UserDto) {
    const result = await this.usersService.createUser(createUserDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'User created successfully', result });
  }
  @Post('login')
  async userLogin(@Res() res: Response, @Body() loginDto: LoginDto) {
    const result = await this.usersService.login(loginDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'User Logged in', result });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@Req() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    const result = await this.usersService.dashboard(userId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'User retrieved successfully', result });
  }
}
