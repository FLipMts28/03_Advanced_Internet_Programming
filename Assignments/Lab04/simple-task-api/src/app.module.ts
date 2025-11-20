import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { Task } from './tasks/entities/task.entity';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'tasks.db',
      entities: [Task, User],
      synchronize: true, // Dev only: auto-creates/updates tables
      logging: true, // Logs queries for debugging
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }