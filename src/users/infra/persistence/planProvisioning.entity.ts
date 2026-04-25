import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('plan_provisioning')
export class PlanProvisioningEntity {
  @PrimaryColumn()
  email: string;

  @Column({ default: 1 })
  maxAllowedBusinesses: number;

  @Column({ default: false })
  isClaimed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
