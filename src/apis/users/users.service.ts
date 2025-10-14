import { HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './repository/user.repository';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { DataSource } from 'typeorm';
import { WalletsRepository } from '../wallets/repository/wallet.repository';
import { validatePassword } from './enums/passwordValidator.enum';
import { AppResponse } from 'src/common/app.response';
import { JwtService } from 'src/guards/jwt/jwt.service';
import { User } from './entity/user.entity';
import { Wallet } from '../wallets/entity/wallet.entity';
import { TokenRepository } from './repository/token.repository';
import { generateRandomNumbers } from './enums/random.enum';
import { trimObjectStrings } from 'src/common/utils/trim-object.util';

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
        AppResponse.error({
          message: 'User with that email already exists',
          status: HttpStatus.CONFLICT,
        });
      }

      const checkPassword = validatePassword(password);

      if (!checkPassword) {
        AppResponse.error({
          message:
            'Password must be atleast 8 characters long and contain a number, a special character and an uppercase letter',
          status: HttpStatus.BAD_REQUEST,
        });
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
      AppResponse.error(err);
    } finally {
      await queryRunner.release();
    }

    try {
      await this.sendMailToken(dto.email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
  }

  async dashboard(userId: string) {
    try {
      const user = await this.usersRepository.findWithWallets(userId);

      if (!user) {
        AppResponse.error({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }

      const { password, ...safeUser } = user;

      return {
        user: safeUser,
      };
    } catch (err) {
      err.location = `UsersService.${this.dashboard.name} method`;
      AppResponse.error(err);
    }
  }

  async sendMailToken(email: string) {
    try {
      // check if user exists
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user) {
        AppResponse.error({
          message: 'User with that email does not exist',
          status: HttpStatus.NOT_FOUND,
        });
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
    } catch (err) {
      err.location = `UsersService.${this.sendMailToken.name} method`;
      AppResponse.error(err);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
