import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { donationService } from '../features/donations/donationService';

export function useDonations(filters = {}) {
  return useQuery({
    queryKey: ['donations', filters],
    queryFn: () => donationService.list(filters),
  });
}

export function useDonation(id) {
  return useQuery({
    queryKey: ['donation', id],
    queryFn: () => donationService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: donationService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Donation created successfully');
    },
    onError: (err) => toast.error(err.message || 'Failed to create donation'),
  });
}

export function useUpdateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => donationService.update(id, patch),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      qc.invalidateQueries({ queryKey: ['donation', id] });
      toast.success('Donation updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update donation'),
  });
}

export function useDeleteDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: donationService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Donation deleted');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete donation'),
  });
}

export function useAcceptDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ngoId }) => donationService.accept(id, ngoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Donation accepted');
    },
    onError: (err) => toast.error(err.message || 'Failed to accept donation'),
  });
}

export function useUpdateDonationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => donationService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update status'),
  });
}
