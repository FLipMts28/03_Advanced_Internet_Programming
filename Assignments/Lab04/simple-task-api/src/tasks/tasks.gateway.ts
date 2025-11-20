import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';
import { use } from 'passport';

@WebSocketGateway({ cors: { origin: '*' } })
export class TasksGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private tasksService: TasksService) { }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(@MessageBody() createTaskDto: CreateTaskDto, @ConnectedSocket() client: Socket) {
    const userId = 1; // From validated token in prod
    const task = await this.tasksService.create(createTaskDto, userId);
    this.server.emit('taskCreated', task); // Broadcast to all
    client.emit('taskCreatedPersonal', task); // Personal response
    return task;
  }

  @SubscribeMessage('joinUserRoom')
  handleJoinRoom(@MessageBody('userId') userId: number, @ConnectedSocket() client: Socket) {
    client.join(`user_${userId}`);
    client.emit('joinedRoom', `Joined room for user ${userId}`);
  }
}