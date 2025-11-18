import {
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
  type RouteObject,
} from 'react-router';

import * as PATHS from '@/constants/paths';
import { HomeScreen } from '@/views/home';
import { SignInScreen } from '@/features/authentication/views/sign-in';
import { SignUpScreen } from '@/features/authentication/views/sign-up';
import { AuthGuard } from '@/features/authentication/components/auth-guard';

const ROUTING_CONFIG: RouteObject[] = [
  {
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    children: [
      // Public routes
      {
        path: PATHS.SIGN_IN_PATH,
        element: <SignInScreen />,
      },
      {
        path: PATHS.SIGN_UP_PATH,
        element: <SignUpScreen />,
      },
      // Protected routes
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          {
            path: PATHS.HOME_PATH,
            element: <HomeScreen />,
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(ROUTING_CONFIG);
