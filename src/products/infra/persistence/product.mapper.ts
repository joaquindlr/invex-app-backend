import { Product } from '../../domain/product';
import { ProductVariant } from '../../domain/productVariant';
import { ProductEntity } from './product.entity';
import { ProductVariantEntity } from './productVariant.entity';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const variants = entity.variants
      ? entity.variants.map(
          (v) =>
            new ProductVariant(
              v.id,
              v.sku,
              Number(v.stock),
              Number(v.price),
              v.businessId,
              v.productId,
            ),
        )
      : [];

    return new Product(entity.id, entity.name, entity.businessId, variants);
  }
}
