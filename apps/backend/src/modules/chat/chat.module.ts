import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  exports: [ChatGateway],
  providers: [ChatGateway],
})
export class ChatModule {}
