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
    @MessageBody() payload: { roomId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('Message received:', payload);

    // Broadcast message to all users in the same room
    this.server.to(payload.roomId).emit('new_message', {
      senderId: socket.id,
      message: payload.message,
      timestamp: Date.now(),
    });
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  }
}
