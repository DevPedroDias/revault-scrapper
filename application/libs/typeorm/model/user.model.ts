import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SyncModel } from './sync.model';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ name: 'name', type: 'text' })
  declare name: string;

  @Column({ name: 'email', type: 'text' })
  declare email: string;

  @Column({ name: 'api_key', type: 'text' })
  declare apiKey: string;

  @CreateDateColumn({ name: 'created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  declare updatedAt: Date;

  @OneToMany(() => SyncModel, (sync) => sync.user)
  declare syncs: SyncModel[];
}
