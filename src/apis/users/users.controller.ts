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
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CodeDto, LoginDto, NINDto, ResetPasswordDto, UserDto } from './dto/user.dto';
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
  @Post('verification')
  async verification(@Res() res: Response, @Body() codeDto: CodeDto) {
    const result = await this.usersService.verification(codeDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'User Logged in', result });
  }
  @Post('forgotPassword')
  async forgotPassword(@Res() res: Response, @Body('email') email: string) {
    const result = await this.usersService.forgotPassword(email);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Mail sent to User', result });
  }
  @Post('confirmCode')
  async confirmCode(@Res() res: Response, @Body('code') code: number) {
    const result = await this.usersService.confirmCode(code);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Code confirmed', result });
  }
  @Post('resetPassword')
  async resetPassword(
    @Res() res: Response,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const result = await this.usersService.resetPassword(resetPasswordDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'User Logged in', result });
  }
  @Put('verifyBVN')
  async verifyBVN(
    @Req() req: any,
    @Res() res: Response,
    @Body() nINDto: NINDto,
  ) {
    nINDto.userId = req.user.userId
    const result = await this.usersService.verifyBVN(nINDto);
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
