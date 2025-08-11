import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Index(['inventory', 'createdAt'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isEdited: boolean;

  @ManyToOne(() => Inventory, (inventory) => inventory.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'author_id' })
  author: User | null;
}
