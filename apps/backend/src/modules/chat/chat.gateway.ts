import {
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '@/modules/auth/auth.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import type { AuthenticatedSocket } from '@/interfaces/auth.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: AuthenticatedSocket) {
    console.log(`Client connected: ${socket.id}`);

    try {
      const token = socket.handshake.auth.token as string;

      if (!token) {
        console.log(`No token provided for socket ${socket.id}`);
        socket.disconnect();
        return;
      }

      const user = await this.authService.validateToken(token);

      socket.data.user = user;
    } catch (error) {
      console.log(`Authentication failed for socket ${socket.id}:`, error);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() sendChatMessageDto: SendChatMessageDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('Message received:', sendChatMessageDto);

    const message = await this.chatService.sendMessageFromUser(
      socket.data.user.id,
      sendChatMessageDto.chatRoomId,
      sendChatMessageDto,
    );

    this.server.to(sendChatMessageDto.chatRoomId).emit('new_message', message);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    await this.chatService.joinChatRoom(socket.data.user.id, roomId);

    await socket.join(roomId);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(`Socket ${socket.id} left room ${roomId}`);

    await this.chatService.leaveChatRoom(socket.data.user.id, roomId);

    await socket.leave(roomId);
  }
}
