import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { FieldType } from 'src/enums/fieldType';


@Entity()
@Index(['inventory', 'type'])
@Index(['inventory', 'order'])
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 191 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column({ default: false })
  showInTable: boolean;

  @Column({ type: 'int', unsigned: true, default: 0 })
  order: number;

  @ManyToOne(() => Inventory, (inv) => inv.fields, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  inventory: Inventory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn() version: number;
}
