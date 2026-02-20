import {
  removeUserFromChatRoom,
  type RemoveUserFromChatRoomParams,
} from '@/features/chat/services/remove-user-from-chat-room.service';

import type { UseMutationOptions } from '@tanstack/react-query';
import { useAuthMutation } from '@/features/authentication/hooks/use-auth-mutation';

export type { RemoveUserFromChatRoomParams };

export const REMOVE_USER_FROM_CHAT_ROOM_MUTATION_KEY = [
  'removeUserFromChatRoom',
];

export const useRemoveUserFromChatRoom = (
  options?: UseMutationOptions<void, Error, RemoveUserFromChatRoomParams>,
) => {
  return useAuthMutation({
    mutationFn: removeUserFromChatRoom,
    mutationKey: REMOVE_USER_FROM_CHAT_ROOM_MUTATION_KEY,
    ...options,
  });
};
