import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Field } from 'src/fields/entities/field.entity';
import { Item } from 'src/items/entities/item.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Access } from 'src/access/entities/access.entity';
import { IdPart } from 'src/id-parts/entities/id-part.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.inventories)
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => Field, (field) => field.inventory)
  fields: Field[];

  @OneToMany(() => Item, (item) => item.inventory)
  items: Item[];

  @OneToMany(() => Comment, (comment) => comment.inventory)
  comments: Comment[];

  @OneToMany(() => Access, (access) => access.inventory)
  access: Access[];

  @OneToMany(() => IdPart, (idPart) => idPart.inventory)
  idParts: IdPart[];
}
