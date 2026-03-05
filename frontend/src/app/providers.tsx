'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

import { Toaster } from "@/components/ui/sonner";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  // Inicialización de React Query asegurando que solo haya una instancia en CSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Forza una suscripción temprana al store para hidratación desde el localStorage si lo hubiera
  useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
