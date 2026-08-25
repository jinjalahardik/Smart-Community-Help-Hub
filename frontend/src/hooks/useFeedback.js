import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { feedbackService } from '../features/feedback/feedbackService';

export function useFeedbackList(filters = {}) {
  return useQuery({ queryKey: ['feedback', filters], queryFn: () => feedbackService.list(filters) });
}

export function useCreateFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: feedbackService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Thanks for your feedback!');
    },
    onError: (err) => toast.error(err.message || 'Failed to submit feedback'),
  });
}

export function useUpdateFeedbackStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => feedbackService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Feedback status updated');
    },
  });
}
