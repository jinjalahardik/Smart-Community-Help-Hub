import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../features/chat/chatService';

export function useChats(userId) {
  return useQuery({
    queryKey: ['chats', userId],
    queryFn: () => chatService.listChats(userId),
    enabled: !!userId,
    refetchInterval: 15000,
  });
}

export function useMessages(chatId) {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => chatService.getMessages(chatId),
    enabled: !!chatId,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, senderId, text }) => chatService.sendMessage(chatId, senderId, text),
    onSuccess: (_, { chatId }) => {
      qc.invalidateQueries({ queryKey: ['messages', chatId] });
      qc.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}

export function useMarkChatRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, userId }) => chatService.markChatRead(chatId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chats'] }),
  });
}
