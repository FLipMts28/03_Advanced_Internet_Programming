import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(AuthGuard('jwt')) // Protects all routes
@ApiBearerAuth('JWT-auth')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
  async findAll(@Req() req): Promise<Task[]> {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiResponse({ status: 200, description: 'Task found', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Task> {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created', type: Task })
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
    return this.tasksService.remove(id, req.user.id);
  }
}