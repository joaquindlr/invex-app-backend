import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessEntity } from './business.entity';
import { BusinessMemberEntity } from './businessMember.entity';
import { BusinessRole } from '../../domain/businessRole.enum';

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepo: Repository<BusinessEntity>,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
  ) {}

  async createBusinessWithOwner(
    name: string,
    userId: string,
  ): Promise<BusinessEntity> {
    const newBusiness = this.businessRepo.create({ name });
    const savedBusiness = await this.businessRepo.save(newBusiness);

    const newMember = this.memberRepo.create({
      userId: userId,
      businessId: savedBusiness.id,
      role: BusinessRole.OWNER,
    });

    await this.memberRepo.save(newMember);

    return savedBusiness;
  }

  async findByUserId(userId: string): Promise<BusinessEntity[]> {
    return this.businessRepo
      .createQueryBuilder('business')
      .innerJoin('business.members', 'member')
      .where('member.userId = :userId', { userId })
      .getMany();
  }
}
