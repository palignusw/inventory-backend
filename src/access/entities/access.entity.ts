import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Unique(['inventory', 'user'])
export class Access {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.access, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  inventory: Inventory;

  @ManyToOne(() => User, (user) => user.access, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ default: true })
  canWrite: boolean;
}
