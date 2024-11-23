import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SneakerModel } from './sneaker.model';
import { SearchStatus } from '../../../domain/entity/search';

@Entity('searchs')
export class SearchModel {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({
    type: 'text',
    enum: SearchStatus,
    default: SearchStatus.started,
  })
  declare status: SearchStatus;

  @Column({ name: 'input', type: 'text' })
  declare input: string;

  @Column({ name: 'search_quantity', type: 'int' })
  declare searchQuantity: number;

  @Column({ name: 'message', nullable: true, type: 'text' })
  declare message: string;

  @CreateDateColumn({ name: 'created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  declare updatedAt: Date;

  @OneToMany(() => SneakerModel, (sneaker) => sneaker.search, { cascade: true })
  declare sneakers: SneakerModel[];
}