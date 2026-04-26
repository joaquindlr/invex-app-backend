import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantEntity } from '../infra/persistence/productVariant.entity';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import { StockMovementEntity } from 'src/movements/infra/persistence/stockMovement.entity';
import { MovementType } from 'src/movements/domain/movementType.enum';

@Injectable()
export class DeleteVariantUseCase {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
  ) {}

  async execute(userId: string, variantId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const variant = await queryRunner.manager.findOne(ProductVariantEntity, {
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
          'No tienes permiso para eliminar esta variante',
        );
      }

      if (variant.stock > 0) {
        const movement = queryRunner.manager.create(StockMovementEntity, {
          variantId: variant.id,
          type: MovementType.OUT_ADJUSTMENT,
          quantity: variant.stock,
          snapshot_stock: 0,
          notes: 'Salida por eliminación de variante',
          createdBy: userId,
        });

        await queryRunner.manager.save(movement);
      }

      await queryRunner.manager.softRemove(variant);

      await queryRunner.commitTransaction();
      return variant;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
