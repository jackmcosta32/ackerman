export enum ChatParticipantRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const CHAT_EVENT = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  NEW_MESSAGE: 'new_message',
  SEND_MESSAGE: 'send_message',
  CONNECT_TO_ROOM: 'connect_to_room',
  DISCONNECT_FROM_ROOM: 'disconnect_from_room',
};
