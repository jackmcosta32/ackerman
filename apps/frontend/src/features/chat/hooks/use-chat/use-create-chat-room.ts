import type { UseMutationOptions } from '@tanstack/react-query';
import {
  createChatRoom,
  type CreateChatRoomParams,
  type CreateChatRoomResult,
} from '@/features/chat/services/create-chat-room.service';
import { useAuthMutation } from '@/features/authentication/hooks/use-auth-mutation';

export type { CreateChatRoomParams, CreateChatRoomResult };

export const CREATE_CHAT_ROOM_MUTATION_KEY = ['createChatRoom'];

export const useCreateChatRoom = (
  options?: UseMutationOptions<
    CreateChatRoomResult,
    Error,
    CreateChatRoomParams
  >,
) => {
  return useAuthMutation({
    mutationFn: createChatRoom,
    mutationKey: CREATE_CHAT_ROOM_MUTATION_KEY,
    ...options,
  });
};
