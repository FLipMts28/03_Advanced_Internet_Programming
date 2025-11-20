import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TasksGateway } from './tasks.gateway';

@Module({
   imports: [TypeOrmModule.forFeature([Task])],
   controllers: [TasksController],
   providers: [TasksService, TasksGateway],
})
export class TasksModule { }