import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementEntity } from './infra/persistence/stockMovement.entity';
import { MovementsController } from './infra/web/movements.controller';
import { CreateMovementUseCase } from './application/createMovement.uc';
import { BusinessMemberEntity } from 'src/businesses/infra/persistence/businessMember.entity';
import { MovementRepository } from './infra/persistence/movement.repository';
import { GetMovementsUseCase } from './application/getMovements.uc';
import { ProductVariantEntity } from 'src/products/infra/persistence/productVariant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMovementEntity,
      ProductVariantEntity,
      BusinessMemberEntity,
    ]),
  ],
  controllers: [MovementsController],
  providers: [MovementRepository, CreateMovementUseCase, GetMovementsUseCase],
})
export class MovementsModule {}
