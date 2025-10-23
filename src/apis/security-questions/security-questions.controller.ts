import { Controller } from '@nestjs/common';
import { SecurityQuestionsService } from './security-questions.service';

@Controller('security-questions')
export class SecurityQuestionsController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) {}
}
