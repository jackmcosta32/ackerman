import {
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import crypto from 'node:crypto';
import { Server, Socket } from 'socket.io';
import { ChatMessageDto } from './dto/chat.dto';
import type { ChatMessage } from './chat.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody() chatMessageDto: ChatMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('Message received:', chatMessageDto);

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: socket.id,
      roomId: chatMessageDto.roomId,
      content: chatMessageDto.content,
      timestamp: Date.now(),
    };

    // Broadcast message to all users in the same room
    this.server.to(chatMessageDto.roomId).emit('new_message', message);

    return message;
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    await socket.join(roomId);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(`Socket ${socket.id} left room ${roomId}`);
    await socket.leave(roomId);
  }
}
