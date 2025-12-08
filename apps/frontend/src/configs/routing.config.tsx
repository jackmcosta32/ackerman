import {
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
  type RouteObject,
} from 'react-router';

import * as PATHS from '@/constants/paths';
import { HomeScreen } from '@/views/home';
import { ChatScreen } from '@/features/chat/views/chat';
import { SignInScreen } from '@/features/authentication/views/sign-in';
import { SignUpScreen } from '@/features/authentication/views/sign-up';
import { AuthLayout } from '@/features/authentication/layouts/auth-layout';
import { AuthGuard } from '@/features/authentication/components/auth-guard';

const ROUTING_CONFIG: RouteObject[] = [
  {
    // Public routes
    element: (
      <>
        <ScrollRestoration />
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      </>
    ),
    children: [
      {
        path: PATHS.SIGN_IN_PATH,
        element: <SignInScreen />,
      },
      {
        path: PATHS.SIGN_UP_PATH,
        element: <SignUpScreen />,
      },
    ],
  },
  {
    // Protected routes
    element: (
      <AuthGuard>
        <ScrollRestoration />
        <Outlet />
      </AuthGuard>
    ),
    children: [
      {
        path: PATHS.HOME_PATH,
        element: <HomeScreen />,
      },
      {
        path: PATHS.CHAT_PATH,
        element: <ChatScreen />,
      },
    ],
  },
];

export const router = createBrowserRouter(ROUTING_CONFIG);
