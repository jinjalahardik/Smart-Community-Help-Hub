import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ngoService } from '../features/ngo/ngoService';

export function useNgoProfile(orgId) {
  return useQuery({ queryKey: ['ngo-profile', orgId], queryFn: () => ngoService.getProfile(orgId), enabled: !!orgId });
}

export function useUpdateNgoProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, patch }) => ngoService.updateProfile(orgId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ngo-profile'] });
      toast.success('Organization profile updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update profile'),
  });
}

export function useNgoDistributions(ngoId) {
  return useQuery({ queryKey: ['ngo-distributions', ngoId], queryFn: () => ngoService.distributions(ngoId), enabled: !!ngoId });
}

export function useNgoVolunteers() {
  return useQuery({ queryKey: ['ngo-volunteers'], queryFn: ngoService.volunteers });
}
