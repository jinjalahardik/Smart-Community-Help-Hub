import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { taskService } from '../features/volunteer/taskService';

export function useTasks(filters = {}) {
  return useQuery({ queryKey: ['tasks', filters], queryFn: () => taskService.list(filters) });
}

export function useTask(id) {
  return useQuery({ queryKey: ['task', id], queryFn: () => taskService.getById(id), enabled: !!id });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created and published');
    },
    onError: (err) => toast.error(err.message || 'Failed to create task'),
  });
}

export function useAcceptTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, volunteerId }) => taskService.accept(id, volunteerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task accepted');
    },
    onError: (err) => toast.error(err.message || 'Failed to accept task'),
  });
}

export function useAdvanceTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.advanceStatus,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['task', id] });
      toast.success('Task status updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update task'),
  });
}

export function useDeclineTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.decline,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task declined');
    },
    onError: (err) => toast.error(err.message || 'Failed to decline task'),
  });
}
