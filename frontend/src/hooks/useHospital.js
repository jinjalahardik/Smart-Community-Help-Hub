import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { hospitalService } from '../features/hospital/hospitalService';

export function useHospitalProfile(orgId) {
  return useQuery({ queryKey: ['hospital-profile', orgId], queryFn: () => hospitalService.getProfile(orgId), enabled: !!orgId });
}

export function useUpdateHospitalProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, patch }) => hospitalService.updateProfile(orgId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hospital-profile'] });
      toast.success('Hospital profile updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update profile'),
  });
}

export function useRequirement(id) {
  return useQuery({ queryKey: ['requirement', id], queryFn: () => hospitalService.getRequirement(id), enabled: !!id });
}

export function useRequirements(hospitalId, filters = {}) {
  return useQuery({ queryKey: ['requirements', hospitalId, filters], queryFn: () => hospitalService.listRequirements(hospitalId, filters), enabled: !!hospitalId });
}

export function useCreateRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: hospitalService.createRequirement,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requirements'] });
      toast.success('Requirement published');
    },
    onError: (err) => toast.error(err.message || 'Failed to publish requirement'),
  });
}

export function useUpdateRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => hospitalService.updateRequirement(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requirements'] });
      toast.success('Requirement updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update requirement'),
  });
}

export function useReceivedDonations(hospitalId) {
  return useQuery({ queryKey: ['hospital-donations', hospitalId], queryFn: () => hospitalService.receivedDonations(hospitalId), enabled: !!hospitalId });
}
