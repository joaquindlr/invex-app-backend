import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/infra/persistence/user.entity';
import { BusinessEntity } from './business.entity';
import { BusinessRole } from '../../domain/businessRole.enum';

@Entity('business_members')
export class BusinessMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- RELACIÓN CON USUARIO ---
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.memberships)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // --- RELACIÓN CON EMPRESA ---
  @Column({ name: 'business_id' })
  businessId: string;

  @ManyToOne(() => BusinessEntity, (business) => business.members)
  @JoinColumn({ name: 'business_id' })
  business: BusinessEntity;

  // --- EL ROL ---
  @Column({
    type: 'enum',
    enum: BusinessRole,
    default: BusinessRole.WORKER,
  })
  role: BusinessRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
