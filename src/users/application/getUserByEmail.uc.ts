import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.model';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
