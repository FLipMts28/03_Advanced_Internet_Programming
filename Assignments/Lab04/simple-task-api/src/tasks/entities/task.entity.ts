import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ nullable: false })
  @ApiProperty({ example: 'Complete assignment' })
  text: string;

  @Column({ default: 'todo' })
  @ApiProperty({ enum: ['todo', 'inprogress', 'done'], default: 'todo' })
  status: 'todo' | 'inprogress' | 'done';

  @ManyToOne(() => User, user => user.tasks)
  @ApiProperty({ type: () => User })
  user: User;
}