import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'file';

  @Column({ default: false })
  showInTable: boolean;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  inventory: Inventory;
}
