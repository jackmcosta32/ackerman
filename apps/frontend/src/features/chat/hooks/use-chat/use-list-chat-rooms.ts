import {
  findAllChatRoomsForUser,
  type FindAllChatRoomsForUserParams,
  type FindAllChatRoomsForUserResult,
} from '@/features/chat/services/find-all-chat-rooms-for-user.service';

import type { PaginatedResponse } from '@workspace/shared';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useAuthQuery } from '@/features/authentication/hooks/use-auth-query';

export const FIND_ALL_CHAT_ROOMS_FOR_USER_QUERY_KEY = [
  'findAllChatRoomsForUser',
];

type FindAllChatRoomsForUserResponse =
  PaginatedResponse<FindAllChatRoomsForUserResult>;

export const useListChatRooms = (
  params?: FindAllChatRoomsForUserParams,
  options?: UseQueryOptions<FindAllChatRoomsForUserResponse, Error>,
) => {
  return useAuthQuery({
    queryKey: [
      ...FIND_ALL_CHAT_ROOMS_FOR_USER_QUERY_KEY,
      params?.page ?? 0,
      params?.limit ?? 10,
    ],
    queryFn: () => findAllChatRoomsForUser(params),
    ...options,
  });
};
