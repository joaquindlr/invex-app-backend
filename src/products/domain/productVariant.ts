export class ProductVariant {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly stock: number,
    public readonly price: number,
    public readonly businessId: string,
    public readonly productId: string,
  ) {}

  public hasStock(): boolean {
    return this.stock > 0;
  }
}
