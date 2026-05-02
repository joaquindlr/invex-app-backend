import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../infra/persistence/product.repository';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';

@Injectable()
export class GetProductsUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
  ) {}

  async execute(
    userId: string,
    businessId: string,
    page: number,
    limit: number,
    categoryId?: string,
  ) {
    const membership = await this.memberRepo.findOne({
      where: { userId, businessId },
    });

    if (!membership) {
      throw new ForbiddenException(
        'No tienes permiso para ver los productos de esta empresa',
      );
    }

    const skip = (page - 1) * limit;

    const { products, total } = await this.productRepo.findAllByBusiness(
      businessId,
      skip,
      limit,
      categoryId,
    );

    return {
      data: products,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }
}
