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
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { AuthService } from '@/modules/auth/auth.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { ConnectToChatRoomDto } from './dto/connect-to-chat-room.dto';
import { CHAT_EVENT } from '@workspace/shared/constants/chat.constant';
import type { AuthenticatedSocket } from '@/modules/auth/interfaces/auth.interface';
import { extractTokenFromWebSocket } from '@/modules/auth/strategies/jwt/jwt.utils';
import { DisconnectFromChatRoomDto } from './dto/disconnect-from-chat-room.dto';

@UseGuards(AuthGuard)
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
      const token = extractTokenFromWebSocket(socket);

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

  @SubscribeMessage(CHAT_EVENT.CONNECT_TO_ROOM)
  async handleConnectToRoom(
    @MessageBody() connectToChatRoomDto: ConnectToChatRoomDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(
      `Socket ${socket.id} joined room ${connectToChatRoomDto.chatRoomId}`,
    );

    await this.chatService.joinChatRoom(
      socket.data.user.id,
      connectToChatRoomDto.chatRoomId,
    );

    await socket.join(connectToChatRoomDto.chatRoomId);
  }

  @SubscribeMessage(CHAT_EVENT.DISCONNECT_FROM_ROOM)
  async handleDisconnectFromRoom(
    @MessageBody() disconnectFromChatRoomDto: DisconnectFromChatRoomDto,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(
      `Socket ${socket.id} left room ${disconnectFromChatRoomDto.chatRoomId}`,
    );

    await socket.leave(disconnectFromChatRoomDto.chatRoomId);
  }

  @SubscribeMessage(CHAT_EVENT.SEND_MESSAGE)
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

    this.server
      .to(sendChatMessageDto.chatRoomId)
      .emit(CHAT_EVENT.NEW_MESSAGE, message);
  }
}
