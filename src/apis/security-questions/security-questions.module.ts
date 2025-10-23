import { Module } from '@nestjs/common';
import { SecurityQuestionsService } from './security-questions.service';
import { SecurityQuestionsController } from './security-questions.controller';
import { QuestionRepository } from './repository/question.repository';
import { UsersRepository } from '../users/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { SecurityQuestions } from './entity/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SecurityQuestions])],
  controllers: [SecurityQuestionsController],
  providers: [SecurityQuestionsService, QuestionRepository, UsersRepository],
})
export class SecurityQuestionsModule {}
