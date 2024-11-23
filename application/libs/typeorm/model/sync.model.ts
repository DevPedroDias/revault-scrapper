import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserModel } from './user.model'; 
import { SyncStatus } from '../../../domain/entity/sync';

@Entity('syncs')
export class SyncModel {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({
    type: 'text',
    enum: SyncStatus,
    default: SyncStatus.started,
  })
  declare status: SyncStatus;

  @Column({ name: 'user_id', type: 'int' })
  declare userId: number;

  @Column({ name: 'quantity', type: 'int' })
  declare quantity: number;

  @ManyToOne(() => UserModel, (user) => user.syncs, { onDelete: 'CASCADE' })
  declare user: UserModel;

  @CreateDateColumn({ name: 'created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  declare updatedAt: Date;
}
