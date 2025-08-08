import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';

@Entity()
export class IdPart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.idParts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  inventory: Inventory;

  @Column()
  type:
    | 'text'
    | 'guid'
    | 'random6'
    | 'random9'
    | 'random20'
    | 'random32'
    | 'date'
    | 'sequence';

  @Column({ nullable: true })
  value: string; 

  @Column({ default: 0 })
  order: number; 
}
