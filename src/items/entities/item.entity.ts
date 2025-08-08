import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from 'src/likes/entities/like.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  customId: string; 

  @Column('json')
  fieldValues: Record<string, any>; 

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Inventory, (inventory) => inventory.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  inventory: Inventory;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => Like, (like) => like.item)
  likes: Like[];
}
