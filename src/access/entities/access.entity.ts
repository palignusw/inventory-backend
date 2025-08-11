import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
  Index,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Unique(['inventory', 'user'])
@Index(['inventory'])
@Index(['user'])
export class Access {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inventory, (inv) => inv.access, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => User, (user) => user.access, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: true })
  canWrite: boolean;
}
