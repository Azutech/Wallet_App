import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { LoginDto, UserDto } from './dto/user.dto';
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

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly walletsRepository: WalletsRepository,
    private readonly tokenRepository: TokenRepository,
    readonly jwtService: JwtService,

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

      // create wallet (store returned value)
      const wallet = await walletsRepo.create({
        userId: user.id,
        currency: 'NGN',
      });

      await walletsRepo.save(wallet);

      // assign wallet reference before commit
      user.wallets = [wallet];

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
      role: findUserEmail?.id,
    };
  }

  async dashboard(userId: string) {
    const user = await this.usersRepository.findWithWallets(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
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
