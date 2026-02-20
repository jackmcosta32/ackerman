import { httpApiClient } from '@/data/http/clients';
import type { PaginatedResponse } from '@workspace/shared';

export interface FindAllChatRoomsForUserParams {
  page?: number;
  limit?: number;
}

export interface FindAllChatRoomsForUserResult {
  id: string;
  name: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  participantCount: number;
  unreadMessageCount: number;
  lastMessageAt: string | null;
}

export const findAllChatRoomsForUser = async (
  params?: FindAllChatRoomsForUserParams,
): Promise<PaginatedResponse<FindAllChatRoomsForUserResult>> => {
  const searchParams = new URLSearchParams();

  if (typeof params?.page === 'number') {
    searchParams.set('page', String(params.page));
  }

  if (typeof params?.limit === 'number') {
    searchParams.set('limit', String(params.limit));
  }

  const endpoint = searchParams.size
    ? `/chat/rooms?${searchParams.toString()}`
    : '/chat/rooms';

  const response = await httpApiClient.request<
    PaginatedResponse<FindAllChatRoomsForUserResult>
  >(endpoint, {
    credentials: 'include',
  });

  return response.json();
};
