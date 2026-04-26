import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductRepository } from '../infra/persistence/product.repository';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVariantDto } from '../infra/web/variant.dto';
import { ProductVariantEntity } from '../infra/persistence/productVariant.entity';
import { StockMovementEntity } from 'src/movements/infra/persistence/stockMovement.entity';
import { MovementType } from 'src/movements/domain/movementType.enum';

@Injectable()
export class AddVariantUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(userId: string, productId: string, dto: CreateVariantDto) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const membership = await this.memberRepo.findOne({
      where: { userId, businessId: product.businessId },
    });

    if (!membership) {
      throw new ForbiddenException(
        'No tienes permiso para agregar variantes a este producto',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const variantData = {
        ...dto,
        businessId: product.businessId,
        productId: product.id,
        stock: dto.stock ?? 0,
      };

      const variant = queryRunner.manager.create(
        ProductVariantEntity,
        variantData,
      );
      const savedVariant = await queryRunner.manager.save(variant);

      if (savedVariant.stock > 0) {
        const movement = queryRunner.manager.create(StockMovementEntity, {
          variantId: savedVariant.id,
          type: MovementType.IN_INITIAL,
          quantity: savedVariant.stock,
          snapshot_stock: savedVariant.stock,
          notes: 'Stock inicial por creación de variante',
          createdBy: userId,
        });

        await queryRunner.manager.save(movement);
      }

      await queryRunner.commitTransaction();
      return savedVariant;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      if (err?.code === '23505') {
        throw new BadRequestException(
          'El SKU ingresado ya está en uso por otra variante en esta empresa.',
        );
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
