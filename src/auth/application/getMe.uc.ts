import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../users/domain/user.repository';
import { BusinessRepository } from 'src/businesses/infra/persistence/business.repository';

@Injectable()
export class GetMeUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly businessRepo: BusinessRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const businesses = await this.businessRepo.findByUserId(userId);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        maxAllowedBusinesses: user.maxAllowedBusinesses,
      },
      businesses: businesses.map((b) => ({
        id: b.id,
        name: b.name,
      })),
    };
  }
}
