import React from 'react';
import '@/styles/global.styles.css';
import ReactDOM from 'react-dom/client';
import { router } from '@/configs/routing.config';
import { RouterProvider } from 'react-router/dom';
import { Toaster } from '@/features/shared/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
