'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CustomerHealthDetails, CustomerNote } from '@/types/customer';
import { fetchCustomerHealthClient } from '@/lib/api/customers';

/**
 * Hook for fetching customer health details with React Query
 * Provides caching, background refetching, and optimistic updates
 */
export function useCustomerHealth(
  customerId: string,
  initialData?: CustomerHealthDetails
) {
  return useQuery({
    queryKey: ['customerHealth', customerId],
    queryFn: () => fetchCustomerHealthClient(customerId),
    initialData,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 60 * 1000, // Poll every minute for live updates
  });
}

/**
 * Hook for adding a note to a customer
 * Includes optimistic updates for instant UI feedback
 */
export function useAddCustomerNote(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      // In production, this would call the API
      const response = await fetch(`/api/customers/${customerId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      return response.json();
    },
    onMutate: async (content) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customerHealth', customerId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<CustomerHealthDetails>([
        'customerHealth',
        customerId,
      ]);

      // Optimistically update the cache
      if (previousData) {
        const optimisticNote: CustomerNote = {
          id: `temp-${Date.now()}`,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            id: 'current-user',
            name: 'You',
          },
        };

        queryClient.setQueryData<CustomerHealthDetails>(
          ['customerHealth', customerId],
          {
            ...previousData,
            notes: [optimisticNote, ...previousData.notes],
          }
        );
      }

      return { previousData };
    },
    onError: (err, content, context) => {
      // Roll back to the previous value on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ['customerHealth', customerId],
          context.previousData
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['customerHealth', customerId] });
    },
  });
}

/**
 * Prefetch customer health data
 * Useful for hover prefetching on table rows
 */
export function usePrefetchCustomerHealth() {
  const queryClient = useQueryClient();

  return (customerId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['customerHealth', customerId],
      queryFn: () => fetchCustomerHealthClient(customerId),
      staleTime: 30 * 1000,
    });
  };
}
