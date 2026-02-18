import type { Socket } from 'socket.io';
import type { Request } from 'express';
import type { Dict } from '@workspace/shared';
import { ACCESS_TOKEN_COOKIE } from '@/constants/cookies.constant';

const extractTokenFromHeaders = (
  headers: Dict<string | string[]>,
): string | undefined => {
  if (typeof headers.authorization !== 'string') return undefined;

  const [type, token] = headers.authorization.split(' ');

  return type === 'Bearer' ? token : undefined;
};

const extractTokenFromCookies = (cookies: Dict<string>): string | undefined => {
  return cookies[ACCESS_TOKEN_COOKIE];
};

const extractTokenFromHandshakeAuth = (
  auth: Dict<string>,
): string | undefined => {
  return auth.token;
};

const extractTokenFromCookieString = (
  cookieString: string | undefined,
): string | undefined => {
  if (!cookieString) return undefined;

  const cookies = cookieString.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return extractTokenFromCookies(cookies);
};

export const extractTokenFromHttpRequest = (
  request: Request,
): string | undefined => {
  const headerToken = extractTokenFromHeaders(request.headers);
  const cookieToken = extractTokenFromCookies(request.cookies);

  return headerToken ?? cookieToken;
};

export const extractTokenFromWebSocket = (
  socket: Socket,
): string | undefined => {
  const headerToken = extractTokenFromHeaders(socket.handshake.headers);
  const authToken = extractTokenFromHandshakeAuth(socket.handshake.auth);
  const cookieToken = extractTokenFromCookieString(
    socket.handshake.headers.cookie,
  );

  return headerToken ?? authToken ?? cookieToken;
};
