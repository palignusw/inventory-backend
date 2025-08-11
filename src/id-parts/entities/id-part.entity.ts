import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';

export enum IdPartType {
  TEXT = 'text',
  GUID = 'guid',
  RANDOM6 = 'random6',
  RANDOM9 = 'random9',
  RANDOM20 = 'random20',
  RANDOM32 = 'random32',
  DATE = 'date',
  SEQUENCE = 'sequence',
}

@Entity()
@Index(['inventory', 'order'])
export class IdPart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inv) => inv.idParts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column({ type: 'enum', enum: IdPartType })
  type: IdPartType;

  @Column({ nullable: true })
  value: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;
}
