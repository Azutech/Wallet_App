import { Injectable, NotFoundException } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { QuestionRepository } from './repository/question.repository';
import { QuestionDto } from './dto/question.dto';
import { UsersRepository } from '../users/repository/user.repository';
import { trimObjectStrings } from 'src/common/utils/trim-object.util';

@Injectable()
export class SecurityQuestionsService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createQuestion(questionDto: QuestionDto) {
    const sanitizedDto = trimObjectStrings(questionDto);

    let { userId, question, answerHash } = sanitizedDto;

    const user = await this.usersRepository.findUser(userId);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    answerHash = hashSync(answerHash, genSaltSync());

    const securityQuestion = this.questionRepository.createQuestion({
      userId,
      question,
      answerHash,
    });

    return securityQuestion;
  }

  async verifySecurityAnswer(userId: string, answer: string) {
    const record = await this.questionRepository.findQuestion(userId);
    if (!record) throw new NotFoundException('Security question not found');

    return compareSync(answer, record.answerHash);
  }
}
