import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../infra/persistence/product.repository';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import { UpdateProductDto } from '../infra/web/updateProduct.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
  ) {}

  async execute(userId: string, productId: string, updates: UpdateProductDto) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundException('Producto no encontrado');

    const membership = await this.memberRepo.findOne({
      where: { userId, businessId: product.businessId },
    });

    if (!membership) {
      throw new ForbiddenException(
        'No tienes permiso para editar este producto',
      );
    }

    return this.productRepo.update(productId, updates);
  }
}
