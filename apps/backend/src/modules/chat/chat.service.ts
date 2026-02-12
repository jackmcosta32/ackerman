import { Repository } from 'typeorm';
import { AiService } from '@/modules/ai/ai.service';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { UsersService } from '@/modules/users/users.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatParticipant } from './entities/chat-participant.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class ChatService {
  constructor(
    private readonly aiService: AiService,
    private readonly userService: UsersService,

    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(ChatParticipant)
    private readonly chatParticipantRepository: Repository<ChatParticipant>,
  ) {}

  async createChatRoom(createChatRoomDto: CreateChatRoomDto) {
    const chatRoom = ChatRoom.fromDto(createChatRoomDto);

    await this.chatRoomRepository.save(chatRoom);

    return chatRoom;
  }

  async joinChatRoom(userId: string, chatRoomId: string) {
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: chatRoomId,
    });

    if (!chatRoom) {
      throw new UnprocessableEntityException('Chat room not found');
    }

    const existingChatParticipant =
      await this.chatParticipantRepository.findOneBy({
        user: { id: userId },
        chatRoom: { id: chatRoomId },
      });

    if (existingChatParticipant) return;

    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const newChatParticipant = ChatParticipant.fromDto(user, chatRoom);

    await this.chatParticipantRepository.save(newChatParticipant);
  }

  async leaveChatRoom(userId: string, chatRoomId: string) {
    const chatRoomExists = await this.chatRoomRepository.existsBy({
      id: chatRoomId,
    });

    if (!chatRoomExists) {
      throw new UnprocessableEntityException('Chat room not found');
    }

    const existingChatParticipant =
      await this.chatParticipantRepository.findOneBy({
        user: { id: userId },
        chatRoom: { id: chatRoomId },
      });

    if (!existingChatParticipant) return;

    await this.chatParticipantRepository.remove(existingChatParticipant);
  }

  async sendMessageFromUser(
    userId: string,
    chatRoomId: string,
    message: CreateChatMessageDto,
  ) {
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: chatRoomId,
    });

    if (!chatRoom) {
      throw new UnprocessableEntityException('Chat room not found');
    }

    const sender = await this.chatParticipantRepository.findOneBy({
      user: { id: userId },
      chatRoom: { id: chatRoomId },
    });

    if (!sender) {
      throw new UnprocessableEntityException('Sender not found');
    }

    const chatMessage = ChatMessage.fromDto(message, sender, chatRoom);

    await this.chatMessageRepository.save(chatMessage);

    return chatMessage;
  }

  async sendResponseFromAI(chatRoomId: string, message: CreateChatMessageDto) {
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: chatRoomId,
    });

    if (!chatRoom) {
      throw new UnprocessableEntityException('Chat room not found');
    }

    const aiResponse = await this.aiService.generate({
      prompt: message.content,
    });

    // const chatMessage = ChatMessage.fromDto(
    //   {
    //     content: aiResponse.response,
    //   },
    //   null,
    //   chatRoom,
    // );

    // await this.chatMessageRepository.save(chatMessage);

    return aiResponse;
  }
}
