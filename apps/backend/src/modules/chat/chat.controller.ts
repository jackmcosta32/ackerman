import { ChatService } from './chat.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('room')
  async createRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    const chatRoom = await this.chatService.createChatRoom(createChatRoomDto);

    return chatRoom;
  }
}
