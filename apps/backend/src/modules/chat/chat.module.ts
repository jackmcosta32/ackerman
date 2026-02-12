import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '@/modules/ai/ai.module';
import { ChatController } from './chat.controller';
import { ChatRoom } from './entities/chat-room.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatParticipant } from './entities/chat-participant.entity';

@Module({
  imports: [
    AiModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([ChatRoom, ChatMessage, ChatParticipant]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway, ChatService],
})
export class ChatModule {}
