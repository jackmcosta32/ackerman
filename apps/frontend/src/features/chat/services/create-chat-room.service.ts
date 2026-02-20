import { httpApiClient } from '@/data/http/clients';

export interface CreateChatRoomParams {
  name: string;
  private?: boolean;
}

export interface CreateChatRoomResult {
  id: string;
  name: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createChatRoom = async (
  params: CreateChatRoomParams,
): Promise<CreateChatRoomResult> => {
  const response = await httpApiClient.request<CreateChatRoomResult>(
    '/chat/room',
    {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(params),
    },
  );

  return response.json();
};
