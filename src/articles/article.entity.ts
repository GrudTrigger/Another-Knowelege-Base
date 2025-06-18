import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.articles, { eager: false })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  @Exclude()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
