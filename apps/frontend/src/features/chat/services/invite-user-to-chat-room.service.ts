import { httpApiClient } from '@/data/http/clients';

export interface InviteUserToChatRoomParams {
  chatRoomId: string;
  invitedUserId: string;
}

export const inviteUserToChatRoom = async (
  params: InviteUserToChatRoomParams,
) => {
  const { chatRoomId, invitedUserId } = params;

  await httpApiClient.request(
    `/chat/rooms/${chatRoomId}/invite/${invitedUserId}`,
    {
      credentials: 'include',
    },
  );
};
