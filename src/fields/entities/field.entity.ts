import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  FILE = 'file',
}

@Entity()
@Index(['inventory', 'type']) // быстро считать поля по типу (для лимита 3)
@Index(['inventory', 'order']) // drag&drop порядок
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 191 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null; // tooltip

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column({ default: false })
  showInTable: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Inventory, (inv) => inv.fields, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  inventory: Inventory;
}
