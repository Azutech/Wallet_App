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
import {
  BVNDto,
  CodeDto,
  LoginDto,
  NINDto,
  ProfileSetupDto,
  ResetPasswordDto,
  UserDto,
} from './dto/user.dto';
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

  @UseGuards(JwtAuthGuard)
  @Put('verifyNIN')
  async verifyNIN(
    @Req() req: any,
    @Res() res: Response,
    @Body() nINDto: NINDto,
  ) {
    nINDto.userId = req.user.userId;
    const result = await this.usersService.verifyNIN(nINDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Password  Updated', result });
  }

  @UseGuards(JwtAuthGuard)
  @Put('userProfile')
  async userProfile(
    @Req() req: any,
    @Res() res: Response,
    @Body() profileSetupDto: ProfileSetupDto,
  ) {
    profileSetupDto.userId = req.user.userId;
    const result = await this.usersService.userProfile(profileSetupDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Password  Updated', result });
  }
  @UseGuards(JwtAuthGuard)
  @Put('verifyBVN')
  async verifyBVN(
    @Req() req: any,
    @Res() res: Response,
    @Body() bvnDto: BVNDto,
  ) {
    bvnDto.userId = req.user.userId;
    const result = await this.usersService.verifyBVN(bvnDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Password  Updated', result });
  }

  @UseGuards(JwtAuthGuard)
  @Put('onboardCustomer')
  async onboardCustomer(
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;
    const result = await this.usersService.onboardCustomer(userId);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Password  Updated', result });
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
