import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MovementType } from '../domain/movementType.enum';
// 👇 CAMBIO: Importamos la entidad de variante
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import { StockMovementEntity } from '../infra/persistence/stockMovement.entity';
import { ProductVariantEntity } from 'src/products/infra/persistence/productVariant.entity';

@Injectable()
export class CreateMovementUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(
    userId: string,
    variantId: string,
    type: MovementType,
    quantity: number,
    notes?: string,
  ) {
    if (quantity <= 0)
      throw new BadRequestException('La cantidad debe ser mayor a 0');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const variant = await queryRunner.manager.findOne(ProductVariantEntity, {
        where: { id: variantId },
        relations: ['product'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!variant) throw new NotFoundException('Variante no encontrada');

      const membership = await queryRunner.manager.findOne(
        BusinessMemberEntity,
        {
          where: {
            userId,
            businessId: variant.product.businessId,
          },
        },
      );

      if (!membership)
        throw new ForbiddenException('No tienes permiso en esta empresa');

      let newStock = variant.stock;
      const isIncoming = type.startsWith('IN_');

      if (isIncoming) {
        newStock += quantity;
      } else {
        if (variant.stock < quantity) {
          throw new BadRequestException(
            `Stock insuficiente en esta variante. Tienes ${variant.stock}, intentas sacar ${quantity}`,
          );
        }
        newStock -= quantity;
      }

      variant.stock = newStock;
      await queryRunner.manager.save(variant);

      const movement = queryRunner.manager.create(StockMovementEntity, {
        variantId: variant.id, // 👈 Guardamos el ID de la variante
        type,
        quantity,
        snapshot_stock: newStock,
        notes,
        createdBy: userId,
      });

      await queryRunner.manager.save(movement);

      await queryRunner.commitTransaction();

      return movement;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
