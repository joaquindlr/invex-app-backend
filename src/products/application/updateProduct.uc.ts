import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException, // 👈 1. Importamos BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductRepository } from '../infra/persistence/product.repository';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import {
  UpdateProductDto,
  UpdateVariantDto,
} from '../infra/web/updateProduct.dto';
import { ProductVariantEntity } from '../infra/persistence/productVariant.entity';
import { StockMovementEntity } from 'src/movements/infra/persistence/stockMovement.entity';
import { MovementType } from 'src/movements/domain/movementType.enum';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly productRepo: ProductRepository,
    @InjectRepository(BusinessMemberEntity)
    private readonly memberRepo: Repository<BusinessMemberEntity>,
    private readonly dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const variantsToSave = updates.variants?.map(
        (variant: UpdateVariantDto) => {
          const baseVariant = {
            ...variant,
            businessId: product.businessId,
          };

          if (variant.id) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { stock, ...rest } = baseVariant;
            return rest;
          } else {
            return baseVariant;
          }
        },
      );

      const productToSave = await this.productRepo.preload({
        id: productId,
        ...updates,
        variants: variantsToSave as unknown as ProductVariantEntity[],
      });

      if (!productToSave) throw new NotFoundException('Producto no encontrado');

      const savedProduct = await queryRunner.manager.save(productToSave);

      const newVariantsDto = updates.variants?.filter((v) => !v.id) || [];

      for (const newVarDto of newVariantsDto) {
        const createdVariant = savedProduct.variants.find(
          (v) => v.sku === newVarDto.sku,
        );

        if (createdVariant && createdVariant.stock > 0) {
          const movement = queryRunner.manager.create(StockMovementEntity, {
            variantId: createdVariant.id,
            type: MovementType.IN_INITIAL,
            quantity: createdVariant.stock,
            snapshot_stock: createdVariant.stock,
            notes: 'Stock inicial por creación de variante',
            createdBy: userId,
          });
          await queryRunner.manager.save(movement);
        }
      }

      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.code === '23505') {
        throw new BadRequestException(
          'El SKU ingresado ya está en uso por otro producto en esta empresa.',
        );
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
