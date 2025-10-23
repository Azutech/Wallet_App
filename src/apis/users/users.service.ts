import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as moment from 'moment';
import {
  BVNDto,
  CodeDto,
  LoginDto,
  NINDto,
  ResetPasswordDto,
  UserDto,
} from './dto/user.dto';
import { UsersRepository } from './repository/user.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { DataSource } from 'typeorm';
import { WalletsRepository } from '../wallets/repository/wallet.repository';
import { validatePassword } from './enums/passwordValidator.enum';
// import { AppResponse } from 'src/common/app.response';
import { JwtService } from 'src/guards/jwt/jwt.service';
import { User } from './entity/user.entity';
import { Wallet } from '../wallets/entity/wallet.entity';
import { TokenRepository } from './repository/token.repository';
import { generateRandomNumbers } from './enums/random.enum';
import { trimObjectStrings } from 'src/common/utils/trim-object.util';
import { Status } from './enums/enums';
import { VerificationService } from '../verification/verification.service';
import { CurrencyEnum, WalletTypeEnum } from '../wallets/enum/enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly walletsRepository: WalletsRepository,
    private readonly tokenRepository: TokenRepository,
    readonly jwtService: JwtService,
    readonly verificationService: VerificationService,

    private readonly dataSource: DataSource,
  ) {}

  async createUser(dto: UserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sanitizedDto = trimObjectStrings(dto);

      let { password } = sanitizedDto;
      const usersRepo = queryRunner.manager.getRepository(User);
      const walletsRepo = queryRunner.manager.getRepository(Wallet);

      // check for existing user
      const existingUser = await usersRepo.findOne({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with that email already exists');
      }

      const checkPassword = validatePassword(password);

      if (!checkPassword) {
        throw new BadRequestException(
          'Password must be atleast 8 characters long and contain a number, a special character and an uppercase letter',
        );
      }

      password = hashSync(password, genSaltSync());

      // create user
      const user = await usersRepo.create({
        ...dto,
        password,
        avatar: `https://ui-avatars.com/api/?name=${dto.firstName}+${dto.lastName}&background=f5f5f5`,
      });

      await usersRepo.save(user);

      const walletData = [
        {
          userId: user.id,
          walletType: WalletTypeEnum.FIAT,
          currency: CurrencyEnum.NGN,
        },
        {
          userId: user.id,
          walletType: WalletTypeEnum.FIAT,
          currency: CurrencyEnum.USD,
        },
        {
          userId: user.id,
          walletType: WalletTypeEnum.CRYPTO,
          currency: CurrencyEnum.USDT,
          network: 'TRC20',
        },
      ];

      const wallets = await walletsRepo.save(walletData);
      user.wallets = wallets;

      // assign wallet reference before commit

      const authTokenParam = {
        userId: user?.id,
        // role: user?.role,
      };
      const final = {
        auth: this.jwtService.createEncryptedToken(authTokenParam),
        message: 'sign up successful \u2705',
      };

      await queryRunner.commitTransaction();

      try {
        await this.sendMailToken(user.email);
      } catch (emailError) {
        // Log the error but don't throw it
        console.error('Failed to send verification email:', emailError);
        // Optionally: Queue the email for retry or log to monitoring service
      }

      return final;
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      err.location = `UsersService.${this.createUser.name} method`;
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const findUserEmail = await this.usersRepository.findUserEmail(email);
    if (!findUserEmail) {
      throw new NotFoundException(`User not found`);
    }

    const inactiveStatuses = [
      Status.PENDING,
      Status.SUSPENDED,
      Status.DEACTIVATED,
    ];

    if (inactiveStatuses.includes(findUserEmail?.status as Status)) {
      const messages = {
        [Status.PENDING]: 'Please verify your email before logging in',
        [Status.SUSPENDED]: 'Your account has been suspended',
        [Status.DEACTIVATED]: 'Your account has been deactivated',
      };

      throw new BadRequestException(messages[findUserEmail.status]);
    }

    const validPassword = compareSync(password, findUserEmail?.password);

    if (!validPassword) {
      throw new BadRequestException(`Wrong Password`);
    }

    const authTokenParam = {
      userId: findUserEmail?.id,
    };

    return {
      auth: this.jwtService.createEncryptedToken(authTokenParam),
      userId: findUserEmail?.id,
    };
  }

  async verification(codeDto: CodeDto) {
    const { code } = codeDto;
    const findUser = await this.tokenRepository.findTokenByCode(code);

    if (!findUser) {
      throw new BadRequestException('Verification Code is not Found');
    }

    if (moment().isAfter(findUser?.expiresAt)) {
      await this.tokenRepository.deleteTokenCode(code);

      throw new HttpException(
        'Code has expired, please request another.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const verifyUser = await this.usersRepository.updateUser(findUser?.email, {
      isActive: true,
      status: Status.ACTIVE,
    });

    await this.tokenRepository.deleteTokenCode(code);

    const { password, ...user } = verifyUser;

    return {
      message: 'User verified successfully',
      user,
    };
  }

  async dashboard(userId: string) {
    const user = await this.usersRepository.findUser(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findUserEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user);

    const verCode = generateRandomNumbers();
    const newToken = await this.tokenRepository.createToken({
      userId: user.id, // ← Use user.id (UUID) instead of email
      email: user.email,
      code: verCode,
      expiresAt: moment().add(15, 'minutes').toDate(), // token expires in 15 minutes
    });

    return verCode;
  }

  async confirmCode(code: number): Promise<any> {
    const theCode = await this.tokenRepository.findTokenByCode(code);

    if (!theCode) {
      throw new NotFoundException(`Code not Found`);
    }

    const theUser = await this.usersRepository.findUserEmail(theCode.email);
    if (!theUser) {
      throw new NotFoundException('User not Found');
    }

    if (moment().isAfter(theCode?.expiresAt)) {
      await this.tokenRepository.deleteTokenCode(code);
      throw new HttpException(
        'Token has expired. Please request a new one',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.tokenRepository.deleteTokenCode(code);

    const authTokenParam = {
      userId: theUser?.id,
    };

    const token = this.jwtService.createEncryptedToken(authTokenParam);

    return token;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { newPassword, confirmPassword, token } = resetPasswordDto;

    let decoded;
    try {
      decoded = this.jwtService.verifyAndDecryptToken(token);
    } catch (error) {
      throw new UnauthorizedException(`Invalid or expired token.`);
    }

    const user = await this.usersRepository.findUser(decoded.userId);

    if (!user) {
      throw new NotFoundException(`User not Found`);
    }

    const checkPassword = validatePassword(newPassword);

    if (!checkPassword) {
      throw new BadRequestException(
        'Password must be atleast 8 characters long and contain a number, a special character and an uppercase letter',
      );
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password does not match');
    }
    const validPassword = compareSync(newPassword, user?.password);
    if (validPassword) {
      throw new BadRequestException(
        'Your new password must be different to previously used passwords',
      );
    }

    // Hash the new password
    const hashedPassword = hashSync(newPassword, genSaltSync());

    // Update user's password in the database
    const updatePassword = await this.usersRepository.updateUserId(user.id, {
      password: hashedPassword,
    });

    return updatePassword?.email;
  }

  async verifyNIN(nINDto: NINDto) {
    const { userId, NIN } = nINDto;
    const findUser = await this.usersRepository.findUser(userId);
    if (!findUser) {
      throw new NotFoundException('User is not found');
    }

    const userNin = await this.verificationService.verifyNIN(NIN);

    await this.usersRepository.updateUserId(findUser.id, {
      NIN: nINDto.NIN,
    });

    const { password, ...user } = findUser;

    return {
      message: `NIN verified successfully`,
      user,
    };
  }
  async verifyBVN(nINDto: BVNDto) {
    const { userId, BVN } = nINDto;
    const findUser = await this.usersRepository.findUser(userId);
    if (!findUser) {
      throw new NotFoundException('User is not found');
    }

    const userNin = await this.verificationService.verifyBVN(BVN);

    await this.usersRepository.updateUserId(findUser.id, {
      NIN: nINDto.BVN,
    });

    const { password, ...user } = findUser;

    return {
      message: `NIN verified successfully`,
      user,
    };
  }

  async sendMailToken(email: string) {
    // check if user exists
    const user = await this.usersRepository.findUserEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // generate token
    const verCode = generateRandomNumbers();

    // save token to db
    const newToken = await this.tokenRepository.createToken({
      userId: user.id, // ← Use user.id (UUID) instead of email
      email: user.email,
      code: verCode,
      expiresAt: moment().add(15, 'minutes').toDate(), // token expires in 15 minutes
    });

    // send token to user's email - TODO

    return {
      message: 'Token sent to email',
      newToken,
    };
  }
}
