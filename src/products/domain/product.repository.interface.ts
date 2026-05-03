import { Product } from './product';

export interface IProductRepository {
  findByIdWithVariants(productId: string, businessId: string): Promise<Product | null>;
  softDelete(productId: string): Promise<void>;
}
