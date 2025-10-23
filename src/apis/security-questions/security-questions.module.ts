import { Module } from '@nestjs/common';
import { SecurityQuestionsService } from './security-questions.service';
import { SecurityQuestionsController } from './security-questions.controller';

@Module({
  controllers: [SecurityQuestionsController],
  providers: [SecurityQuestionsService],
})
export class SecurityQuestionsModule {}
