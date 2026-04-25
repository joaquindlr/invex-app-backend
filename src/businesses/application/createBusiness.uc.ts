import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessRepository } from '../infra/persistence/business.repository';
import { UserEntity } from 'src/users/infra/persistence/user.entity';
import { BusinessMemberEntity } from '../infra/persistence/businessMember.entity';
import { BusinessRole } from '../domain/businessRole.enum';

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    private readonly businessRepo: BusinessRepository,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
  ) {}

  async execute(userId: string, name: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const currentBusinessesCount = await this.memberRepo.count({
      where: {
        userId: userId,
        role: BusinessRole.OWNER,
      },
    });

    if (currentBusinessesCount >= user.maxAllowedBusinesses) {
      throw new ForbiddenException(
        `Has alcanzado el límite de empresas de tu plan (${user.maxAllowedBusinesses}).`,
      );
    }

    return this.businessRepo.createBusinessWithOwner(name, userId);
  }
}
