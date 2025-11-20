   import { Injectable, NotFoundException } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { Task } from './entities/task.entity';
   import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

   @Injectable()
   export class TasksService {
     constructor(
       @InjectRepository(Task)
       private taskRepository: Repository<Task>,
     ) {}

     async findAll(userId: number): Promise<Task[]> {
       return this.taskRepository.find({ where: { user: { id: userId } } });
     }

     async findOne(id: number, userId: number): Promise<Task> {
       const task = await this.taskRepository.findOne({ where: { id, user: { id: userId } } });
       if (!task) {
         throw new NotFoundException(`Task #${id} not found`);
       }
       return task;
     }

     async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
       const task = this.taskRepository.create({ ...createTaskDto, user: { id: userId } });
       return this.taskRepository.save(task);
     }

     async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
       await this.findOne(id, userId); // Validates existence and ownership
       await this.taskRepository.update(id, updateTaskDto);
       return this.findOne(id, userId);
     }

     async remove(id: number, userId: number): Promise<void> {
       const result = await this.taskRepository.delete({ id, user: { id: userId } });
       if (result.affected === 0) {
         throw new NotFoundException(`Task #${id} not found`);
       }
     }
   }