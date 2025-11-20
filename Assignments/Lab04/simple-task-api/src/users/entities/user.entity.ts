   import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
   import { Task } from '../../tasks/entities/task.entity';
   import * as bcrypt from 'bcryptjs';

   @Entity()
   export class User {
     @PrimaryGeneratedColumn()
     id: number;

     @Column({ unique: true, nullable: false })
     username: string;

     @Column({ nullable: false })
     password: string; // Will be hashed

     @OneToMany(() => Task, task => task.user)
     tasks: Task[];

     async validatePassword(plainPassword: string): Promise<boolean> {
       return bcrypt.compare(plainPassword, this.password);
     }
   }