import {
  Req,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Controller,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { FindAllChatRoomsDto } from './dto/find-all-chat-rooms.dto';
import type { AuthenticatedRequest } from '@/interfaces/auth.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('room')
  async createRoom(
    @Req() req: AuthenticatedRequest,
    @Body() createChatRoomDto: CreateChatRoomDto,
  ) {
    const chatRoom = await this.chatService.createChatRoom(
      req.user.id,
      createChatRoomDto,
    );

    return chatRoom;
  }

  @UseGuards(AuthGuard)
  @Get('rooms')
  async findAllRoomsForUser(
    @Req() req: AuthenticatedRequest,
    @Query() findAllChatRoomsDto: FindAllChatRoomsDto,
  ) {
    return this.chatService.findAllChatRoomsForUser(
      req.user.id,
      findAllChatRoomsDto,
    );
  }
}
