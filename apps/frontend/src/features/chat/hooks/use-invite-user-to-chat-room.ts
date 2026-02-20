import {
  inviteUserToChatRoom,
  type InviteUserToChatRoomParams,
} from '@/features/chat/services/invite-user-to-chat-room.service';

import type { UseMutationOptions } from '@tanstack/react-query';
import { useAuthMutation } from '@/features/authentication/hooks/use-auth-mutation';

export type { InviteUserToChatRoomParams };

export const INVITE_USER_TO_CHAT_ROOM_MUTATION_KEY = ['inviteUserToChatRoom'];

export const useInviteUserToChatRoom = (
  options?: UseMutationOptions<void, Error, InviteUserToChatRoomParams>,
) => {
  return useAuthMutation({
    mutationFn: inviteUserToChatRoom,
    mutationKey: INVITE_USER_TO_CHAT_ROOM_MUTATION_KEY,
    ...options,
  });
};
