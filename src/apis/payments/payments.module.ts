import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './repository/payments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { User } from '../users/entity/user.entity';
import { UsersRepository } from '../users/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository, UsersRepository],
})
export class PaymentsModule {}
