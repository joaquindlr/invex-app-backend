import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { MovementType } from '../../domain/movementType.enum';
import { ProductVariantEntity } from '../../../products/infra/persistence/productVariant.entity';

@Entity('stock_movements')
export class StockMovementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'variant_id' })
  variantId: string;

  @ManyToOne(() => ProductVariantEntity)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariantEntity;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column('int')
  quantity: number;

  @Column('int')
  snapshot_stock: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;
}
