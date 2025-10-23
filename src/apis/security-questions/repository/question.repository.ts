import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { SecurityQuestions } from '../entity/question.entity';

@Injectable()
export class QuestionRepository extends Repository<SecurityQuestions> {
  constructor(private readonly dataSource: DataSource) {
    super(SecurityQuestions, dataSource.createEntityManager());
  }

  async createQuestion(
    data: Partial<SecurityQuestions>,
  ): Promise<SecurityQuestions> {
    const newUser = this.create({
      ...data,
    });

    return await this.save(newUser);
  }

  async findQuestion(userId: string): Promise<SecurityQuestions | null> {
    return await this.findOne({
      where: { id: userId },
    });
  }

  async updateQuestion(
    userId: string,
    data: Partial<SecurityQuestions>,
  ): Promise<SecurityQuestions | null> {
    await this.update({ userId }, data);
    return await this.findOne({ where: { userId } });
  }
}
