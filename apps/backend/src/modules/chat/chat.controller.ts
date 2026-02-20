import {
  Req,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Controller,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { FindAllChatRoomsDto } from './dto/find-all-chat-rooms.dto';
import type { AuthenticatedRequest } from '@/modules/auth/interfaces/auth.interface';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('room')
  async createChatRoom(
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
  async findAllChatRoomsForUser(
    @Req() req: AuthenticatedRequest,
    @Query() findAllChatRoomsDto: FindAllChatRoomsDto,
  ) {
    return this.chatService.findAllChatRoomsForUser(
      req.user.id,
      findAllChatRoomsDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('rooms/:roomId/leave')
  async leaveChatRoom(
    @Req() req: AuthenticatedRequest,
    @Param('roomId') chatRoomId: string,
  ) {
    return this.chatService.leaveChatRoom(req.user.id, chatRoomId);
  }

  @UseGuards(AuthGuard)
  @Get('rooms/:roomId/invite/:invitedUserId')
  async inviteUserToChatRoom(
    @Req() req: AuthenticatedRequest,
    @Param('roomId') chatRoomId: string,
    @Param('invitedUserId') invitedUserId: string,
  ) {
    return this.chatService.inviteUserToChatRoom(
      req.user.id,
      invitedUserId,
      chatRoomId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('rooms/:roomId/invite/:removedUserId')
  async removeUserFromChatRoom(
    @Req() req: AuthenticatedRequest,
    @Param('roomId') chatRoomId: string,
    @Param('removedUserId') removedUserId: string,
  ) {
    return this.chatService.removeUserFromChatRoom(
      req.user.id,
      removedUserId,
      chatRoomId,
    );
  }
}
