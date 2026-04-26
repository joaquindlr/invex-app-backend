import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from '../infra/persistence/productVariant.entity';
import { UpdateVariantDto } from '../infra/web/variant.dto';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';

@Injectable()
export class UpdateVariantUseCase {
  constructor(
    @InjectRepository(ProductVariantEntity)
    private readonly variantRepo: Repository<ProductVariantEntity>,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
  ) {}

  async execute(userId: string, variantId: string, updates: UpdateVariantDto) {
    const variant = await this.variantRepo.findOne({
      where: { id: variantId },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException('Variante no encontrada');
    }

    const membership = await this.memberRepo.findOne({
      where: { userId, businessId: variant.product.businessId },
    });

    if (!membership) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta variante',
      );
    }

    const updatedVariant = await this.variantRepo.save({
      ...variant,
      ...updates,
    });

    return updatedVariant;
  }
}
