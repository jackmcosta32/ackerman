import {
  Entity,
  Index,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FeatureFlag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true })
  key: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ default: false })
  enabled: boolean;

  @Column({ type: 'int', default: 0 })
  rolloutPercentage: number;

  @Column('text', { array: true, default: '{}' })
  targetUserIds: string[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
