/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  ForbiddenException,
  BadRequestException, // 👈 Importante para denegar acceso
} from '@nestjs/common';
import { ProductRepository } from '../infra/persistence/product.repository';
import { CreateProductDto } from '../infra/web/createProduct.dto';
import { BusinessRepository } from 'src/businesses/infra/persistence/business.repository';
import { ProductVariantEntity } from '../infra/persistence/productVariant.entity';
import { DataSource } from 'typeorm';
import { StockMovementEntity } from 'src/movements/infra/persistence/stockMovement.entity';
import { MovementType } from 'src/movements/domain/movementType.enum';
import { ProductEntity } from '../infra/persistence/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly businessRepo: BusinessRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(userId: string, dto: CreateProductDto) {
    const userBusinesses = await this.businessRepo.findByUserId(userId);

    const hasPermission = userBusinesses.some((b) => b.id === dto.businessId);

    if (!hasPermission) {
      throw new ForbiddenException(
        'No tienes permisos para crear productos en esta empresa',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const variantsWithBusinessId = dto.variants.map((v) => ({
        ...v,
        businessId: dto.businessId, // 👈 Importante
      }));

      const newProduct = queryRunner.manager.create(ProductEntity, {
        ...dto,
        businessId: dto.businessId,
        variants: variantsWithBusinessId as unknown as ProductVariantEntity[],
      });

      const savedProduct = await queryRunner.manager.save(newProduct);

      for (const variant of savedProduct.variants) {
        if (variant.stock > 0) {
          const movement = queryRunner.manager.create(StockMovementEntity, {
            variantId: variant.id,
            type: MovementType.IN_INITIAL,
            quantity: variant.stock,
            snapshot_stock: variant.stock,
            notes: 'Carga inicial por creación de producto',
            createdBy: userId,
          });

          await queryRunner.manager.save(movement);
        }
      }

      await queryRunner.commitTransaction();

      return savedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === '23505') {
        throw new BadRequestException(
          'Ya existe un producto con ese SKU en esta empresa.',
        );
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
