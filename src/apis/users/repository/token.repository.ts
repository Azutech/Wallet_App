import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Token } from '../entity/token.entity';

@Injectable()
export class TokenRepository {
  private readonly repository: Repository<Token>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Token);
  }

  async createToken(data: Partial<Token>): Promise<Token> {
    const token = this.repository.create(data);
    return this.repository.save(token);
  }

  async findTokenByEmail(email: string): Promise<Token | null> {
    return this.repository.findOne({ where: { email } });
  }

  async deleteToken(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
