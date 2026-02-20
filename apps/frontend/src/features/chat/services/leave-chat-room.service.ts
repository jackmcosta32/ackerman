import { httpApiClient } from '@/data/http/clients';

export const leaveChatRoom = async (chatRoomId: string) => {
  await httpApiClient.request(`/chat/rooms/${chatRoomId}/leave`, {
    credentials: 'include',
  });
};
