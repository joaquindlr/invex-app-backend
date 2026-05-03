import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.model';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly db: Repository<UserEntity>,
  ) {}

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.passwordHash,
      entity.fullName,
      entity.createdAt,
      entity.maxAllowedBusinesses,
    );
  }

  async save(user: User): Promise<void> {
    const entity = this.db.create({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      fullName: user.fullName,
      maxAllowedBusinesses: user.maxAllowedBusinesses,
    });
    await this.db.save(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.db.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.db.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.db.find();
    return entities.map((e) => this.toDomain(e));
  }
}
