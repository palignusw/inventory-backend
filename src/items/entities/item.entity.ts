import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  VersionColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from 'src/likes/entities/like.entity';

@Entity()
@Unique(['inventory', 'customId'])
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 191 })
  customId: string;

  @Column({ type: 'json', nullable: true })
  fieldValues: Record<string, any> | null;

  @Column({ type: 'text', nullable: false })
  fieldValuesText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => Inventory, (inv) => inv.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User | null;

  @OneToMany(() => Like, (like) => like.item)
  likes: Like[];
}
