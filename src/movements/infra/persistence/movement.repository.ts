import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovementEntity } from './stockMovement.entity';

@Injectable()
export class MovementRepository {
  constructor(
    @InjectRepository(StockMovementEntity)
    private readonly repo: Repository<StockMovementEntity>,
  ) {}

  async findAllByVariant(
    variantId: string,
    skip: number,
    limit: number,
  ): Promise<{ data: StockMovementEntity[]; total: number }> {
    const [data, total] = await this.repo.findAndCount({
      where: { variantId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
      relations: ['variant'],
    });

    return { data, total };
  }
}
