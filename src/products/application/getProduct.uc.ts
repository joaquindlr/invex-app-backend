import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../infra/persistence/product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import { Repository } from 'typeorm';
import { BusinessRepository } from 'src/businesses/infra/persistence/business.repository';

@Injectable()
export class GetProductUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
    private readonly businessRepo: BusinessRepository,
  ) {}

  async execute(productId: string, userId: string) {
    console.log('ProductId: ', productId);
    const product = await this.productRepo.findById(productId);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const hasAccess = await this.memberRepo.count({
      where: {
        userId: userId,
        businessId: product.businessId,
      },
    });

    if (hasAccess === 0) {
      throw new ForbiddenException('No tienes permiso para ver este producto');
    }

    return product;
  }
}
