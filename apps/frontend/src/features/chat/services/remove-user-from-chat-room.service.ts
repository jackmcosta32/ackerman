import { httpApiClient } from '@/data/http/clients';

export interface RemoveUserFromChatRoomParams {
  chatRoomId: string;
  removedUserId: string;
}

export const removeUserFromChatRoom = async (
  params: RemoveUserFromChatRoomParams,
) => {
  const { chatRoomId, removedUserId } = params;

  await httpApiClient.request(
    `/chat/rooms/${chatRoomId}/invite/${removedUserId}`,
    {
      credentials: 'include',
    },
  );
};
