import { ProductVariant } from './productVariant';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly businessId: string,
    public readonly variants: ProductVariant[],
  ) {}

  /**
   * REGLA DE NEGOCIO: Un producto no puede ser eliminado si alguna
   * de sus variantes tiene mercadería valorizada (stock > 0).
   */
  public validateDeletion(): void {
    const hasActiveStock = this.variants.some((variant) => variant.hasStock());

    if (hasActiveStock) {
      throw new Error(
        'No se puede eliminar el producto porque tiene variantes con stock activo. Realice un ajuste de salida a 0 primero para auditar la pérdida.',
      );
    }
  }
}
