import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IProductRepository } from '../domain/product.repository.interface';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('I_PRODUCT_REPOSITORY')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string, businessId: string): Promise<{ message: string }> {
    // 1. Obtener producto por el puerto
    const product = await this.productRepository.findByIdWithVariants(productId, businessId);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // 2. Llamar al método del dominio para validar la regla de negocio
    try {
      product.validateDeletion();
    } catch (error) {
      // Capturamos el error de dominio y lo lanzamos como excepción de NestJS
      throw new BadRequestException(error.message);
    }

    // 3. Llamar al puerto para hacer soft delete (incluye cascada en la infraestructura)
    await this.productRepository.softDelete(productId);

    return { message: 'Producto eliminado correctamente' };
  }
}
