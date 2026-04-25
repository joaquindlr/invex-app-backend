import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovementRepository } from '../infra/persistence/movement.repository';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import { ProductVariantEntity } from 'src/products/infra/persistence/productVariant.entity';

@Injectable()
export class GetMovementsUseCase {
  constructor(
    private readonly movementRepo: MovementRepository,

    @InjectRepository(ProductVariantEntity)
    private readonly variantRepo: Repository<ProductVariantEntity>,

    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
  ) {}

  async execute(
    userId: string,
    variantId: string,
    page: number,
    limit: number,
  ) {
    const variant = await this.variantRepo.findOne({
      where: { id: variantId },
      relations: ['product'],
    });

    if (!variant) throw new NotFoundException('Variante no encontrada');

    const membership = await this.memberRepo.findOne({
      where: {
        userId,
        businessId: variant.product.businessId,
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        'No tienes permiso para ver el historial de este producto',
      );
    }

    const skip = (page - 1) * limit;

    const { data, total } = await this.movementRepo.findAllByVariant(
      variantId,
      skip,
      limit,
    );

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }
}
