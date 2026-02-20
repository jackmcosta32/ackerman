import type {
  FindAllChatRoomsDataResult,
  FindAllChatRoomsCountResult,
} from './chat.interface';

import {
  Injectable,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';
import { AiService } from '@/modules/ai/ai.service';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { UsersService } from '@/modules/users/users.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { FindAllChatRoomsDto } from './dto/find-all-chat-rooms.dto';
import { ChatParticipant } from './entities/chat-participant.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { ChatParticipantRole } from '@workspace/shared/constants/chat.constant';
import type { PaginatedResponse } from '@workspace/shared/models/paginated-response.model';
import { getPaginationMetadata } from '@/modules/shared/utils/pagination/get-pagination-metadata';

@Injectable()
export class ChatService {
  constructor(
    private readonly aiService: AiService,
    private readonly userService: UsersService,

    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    @InjectRepository(ChatParticipant)
    private readonly chatParticipantRepository: Repository<ChatParticipant>,
  ) {}

  async createChatRoom(userId: string, createChatRoomDto: CreateChatRoomDto) {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new UnprocessableEntityException(
        `Could not find user with id ${userId}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const chatRoom = ChatRoom.fromDto(user, createChatRoomDto);

      const chatParticipant = ChatParticipant.fromDto(user, chatRoom, {
        role: ChatParticipantRole.ADMIN,
      });

      await queryRunner.manager.save(chatRoom);
      await queryRunner.manager.save(chatParticipant);
      await queryRunner.commitTransaction();

      return chatRoom;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllChatRoomsForUser(
    userId: string,
    findAllChatRoomsDto: FindAllChatRoomsDto,
  ): Promise<PaginatedResponse<FindAllChatRoomsDataResult>> {
    const { page, limit } = findAllChatRoomsDto;

    const offset = page * limit;

    const chatRoomDataPromise = this.dataSource.query<
      FindAllChatRoomsDataResult[]
    >(
      `
        SELECT
          "chat_room"."id",
          "chat_room"."name",
          "chat_room"."private",
          "chat_room"."createdAt",
          "chat_room"."updatedAt",
          (
            SELECT COUNT(DISTINCT "cp"."id")
            FROM "chat_participant" "cp"
            WHERE "cp"."chatRoomId" = "chat_room"."id"
            AND "cp"."deletedAt" IS NULL
          )::int AS "participantCount",
          (
            SELECT COUNT(DISTINCT "cm"."id")
            FROM "chat_message" "cm"
            WHERE "cm"."chatRoomId" = "chat_room"."id"
            AND "cm"."deletedAt" IS NULL
          )::int AS "messageCount",
          (
            SELECT MAX("cm"."createdAt")
            FROM "chat_message" "cm"
            WHERE "cm"."chatRoomId" = "chat_room"."id"
            AND "cm"."deletedAt" IS NULL
          ) AS "lastMessageAt",
          (
            SELECT COUNT(DISTINCT "cm"."id")
            FROM "chat_message" "cm"
            LEFT JOIN "chat_message" "lrm"
              ON "user_participant"."lastReadMessageId" = "lrm"."id"
            WHERE "cm"."chatRoomId" = "chat_room"."id"
            AND "cm"."deletedAt" IS NULL
            AND "cm"."createdAt" > COALESCE("lrm"."createdAt", "chat_room"."createdAt")
          )::int AS "unreadMessageCount"
        FROM "chat_room"
        LEFT JOIN "chat_participant" AS "user_participant"
          ON "chat_room"."id" = "user_participant"."chatRoomId"
          AND "user_participant"."userId" = $3
          AND "user_participant"."deletedAt" IS NULL
        WHERE
          "chat_room"."deletedAt" IS NULL
          AND (
            "chat_room"."ownerId" = $3
            OR "user_participant"."id" IS NOT NULL
            OR "chat_room"."private" = false
          )
        ORDER BY
          "lastMessageAt" DESC NULLS LAST,
          "chat_room"."createdAt" DESC
        LIMIT $1
        OFFSET $2;
      `,
      [limit, offset, userId],
    );

    const chatRoomCountPromise = this.dataSource.query<
      FindAllChatRoomsCountResult[]
    >(
      `
        SELECT
          COUNT(DISTINCT "chat_room"."id")::int AS "count"
        FROM "chat_room"
        LEFT JOIN "chat_participant" AS "cp"
          ON "chat_room"."id" = "cp"."chatRoomId"
          AND "cp"."deletedAt" IS NULL
        WHERE
          "chat_room"."deletedAt" IS NULL
          AND (
            "chat_room"."ownerId" = $1
            OR "cp"."id" IS NOT NULL
            OR "chat_room"."private" = false
          );
      `,
      [userId],
    );

    const [chatRoomData, chatRoomCount] = await Promise.all([
      chatRoomDataPromise,
      chatRoomCountPromise,
    ]);

    const paginationMetadata = getPaginationMetadata({
      currentPage: page,
      pageSize: limit,
      totalRecords: chatRoomCount[0].count,
    });

    return {
      data: chatRoomData,
      pagination: paginationMetadata,
    };
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

    const newChatParticipant = ChatParticipant.fromDto(user, chatRoom, {
      role: ChatParticipantRole.USER,
    });

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

    await this.chatParticipantRepository.softRemove(existingChatParticipant);
  }

  async inviteUserToChatRoom(
    userId: string,
    invitedUserId: string,
    chatRoomId: string,
  ) {
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: chatRoomId,
    });

    if (!chatRoom) {
      throw new UnprocessableEntityException('Chat room not found');
    }

    const chatParticipant = await this.chatParticipantRepository.findOneBy({
      user: { id: userId },
      chatRoom: { id: chatRoomId },
    });

    if (chatParticipant?.role !== ChatParticipantRole.ADMIN) {
      throw new ForbiddenException('Could not invite user to chat room');
    }

    const existingInvitedParticipant =
      await this.chatParticipantRepository.findOneBy({
        user: { id: invitedUserId },
        chatRoom: { id: chatRoomId },
      });

    if (existingInvitedParticipant) return;

    const invitedUser = await this.userService.findOneById(invitedUserId);

    if (!invitedUser) {
      throw new UnprocessableEntityException('Invited user not found');
    }

    const invitedParticipant = ChatParticipant.fromDto(invitedUser, chatRoom, {
      role: ChatParticipantRole.USER,
    });

    await this.chatParticipantRepository.save(invitedParticipant);
  }

  async removeUserFromChatRoom(
    userId: string,
    removedUserId: string,
    chatRoomId: string,
  ) {
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: chatRoomId,
    });

    if (!chatRoom) {
      throw new UnprocessableEntityException('Chat room not found');
    }

    const chatParticipant = await this.chatParticipantRepository.findOneBy({
      user: { id: userId },
      chatRoom: { id: chatRoomId },
    });

    if (chatParticipant?.role !== ChatParticipantRole.ADMIN) {
      throw new ForbiddenException('Could not remove user from chat room');
    }

    const existingRemovedParticipant =
      await this.chatParticipantRepository.findOneBy({
        user: { id: removedUserId },
        chatRoom: { id: chatRoomId },
      });

    if (!existingRemovedParticipant) return;

    await this.chatParticipantRepository.softRemove(existingRemovedParticipant);
  }

  async sendMessageFromUser(
    userId: string,
    chatRoomId: string,
    createChatMessageDto: CreateChatMessageDto,
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

    const chatMessage = ChatMessage.fromDto(
      sender,
      chatRoom,
      createChatMessageDto,
    );

    await this.chatMessageRepository.save(chatMessage);

    return chatMessage;
  }

  async sendResponseFromAI(
    chatRoomId: string,
    createChatMessageDto: CreateChatMessageDto,
  ) {
    const chatRoom = await this.chatRoomRepository.findOneBy({
      id: chatRoomId,
    });

    if (!chatRoom) {
      throw new UnprocessableEntityException('Chat room not found');
    }

    const aiResponse = await this.aiService.generate({
      prompt: createChatMessageDto.content,
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
