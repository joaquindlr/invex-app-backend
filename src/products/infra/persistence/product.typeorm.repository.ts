import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { IProductRepository } from '../../domain/product.repository.interface';
import { Product } from '../../domain/product';
import { ProductEntity } from './product.entity';
import { ProductVariantEntity } from './productVariant.entity';
import { ProductMapper } from './product.mapper';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly variantRepo: Repository<ProductVariantEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findByIdWithVariants(productId: string, businessId: string): Promise<Product | null> {
    const productEntity = await this.productRepo.findOne({
      where: { id: productId, businessId },
      relations: ['variants'],
    });

    if (!productEntity) return null;

    return ProductMapper.toDomain(productEntity);
  }

  async softDelete(productId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Borrado lógico en cascada: Variantes -> Producto
      await queryRunner.manager.softDelete(ProductVariantEntity, { productId });
      await queryRunner.manager.softDelete(ProductEntity, productId);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
