import { Injectable } from '@nestjs/common';
import { BusinessRepository } from '../infra/persistence/business.repository';

@Injectable()
export class GetUserBusinessesUseCase {
  constructor(private readonly businessRepo: BusinessRepository) {}

  async execute(userId: string) {
    return this.businessRepo.findByUserId(userId);
  }
}
