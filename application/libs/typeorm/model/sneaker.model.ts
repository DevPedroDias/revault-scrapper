import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { SearchModel } from './search.model';

@Entity('sneakers')
@Unique(['sku'])
export class SneakerModel {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column({ name: 'sku', type: 'text' })
  declare sku: string;

  @Column({ name: 'search_id', type: 'int' })
  declare searchId: number;

  @Column({ name: 'name', type: 'text' })
  declare name: string;

  @Column({ name: 'price', type: 'text' })
  declare price: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  declare description: string;

  @Column({ name: 'imageLinks', type: 'text', nullable: true })
  declare imageLinks: string;

  @Column({ name: 'releaseDate', type: 'text', nullable: true })
  declare releaseDate: string;

  @Column({ name: 'brand', type: 'text', nullable: true })
  declare brand: string;

  @Column({ name: 'silhouette', type: 'text', nullable: true })
  declare silhouette: string;

  @Column({ name: 'releasePrice', type: 'text', nullable: true })
  declare releasePrice: string;

  @Column({ name: 'color', type: 'text', nullable: true })
  declare color: string;

  @Column({ name: 'synced', type: 'int', default: 0 })
  declare synced: number;

  @ManyToOne(() => SearchModel, (search) => search.sneakers, { onDelete: 'CASCADE' })
  declare search: SearchModel;

  @CreateDateColumn({ name: 'created_at' })
  declare createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  declare updatedAt: Date;
}
