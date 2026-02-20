import type { UseMutationOptions } from '@tanstack/react-query';
import { leaveChatRoom } from '@/features/chat/services/leave-chat-room.service';
import { useAuthMutation } from '@/features/authentication/hooks/use-auth-mutation';

export const LEAVE_CHAT_ROOM_MUTATION_KEY = ['leaveChatRoom'];

export const useLeaveChatRoom = (
  options?: UseMutationOptions<void, Error, string>,
) => {
  return useAuthMutation({
    mutationFn: leaveChatRoom,
    mutationKey: LEAVE_CHAT_ROOM_MUTATION_KEY,
    ...options,
  });
};
