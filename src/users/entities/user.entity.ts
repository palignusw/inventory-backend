import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique,
  Index,
} from 'typeorm';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Access } from 'src/access/entities/access.entity';
import { Role } from 'src/enums/role';
import { AuthProvider } from 'src/enums/provider';

@Entity()
@Unique(['provider', 'providerId'])
@Index(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string | null;

  @Column({ type: 'enum', enum: AuthProvider, nullable: true })
  provider: AuthProvider | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerId: string | null;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Inventory, (inv) => inv.createdBy)
  inventories: Inventory[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Access, (access) => access.user)
  access: Access[];
}
