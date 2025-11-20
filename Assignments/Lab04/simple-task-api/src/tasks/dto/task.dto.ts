   import { ApiProperty } from '@nestjs/swagger';

   export class CreateTaskDto {
     @ApiProperty({ example: 'Complete assignment' })
     text: string;

     @ApiProperty({ enum: ['todo', 'inprogress', 'done'], required: false })
     status?: 'todo' | 'inprogress' | 'done';
   }

   export class UpdateTaskDto {
     @ApiProperty({ example: 'Updated task', required: false })
     text?: string;

     @ApiProperty({ enum: ['todo', 'inprogress', 'done'], required: false })
     status?: 'todo' | 'inprogress' | 'done';
   }