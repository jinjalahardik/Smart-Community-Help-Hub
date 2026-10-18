import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { celebrationService } from '../features/celebrations/celebrationService';

export function useVerifiedNgos() {
  return useQuery({
    queryKey: ['celebrations', 'ngos'],
    queryFn: () => celebrationService.listVerifiedNgos(),
  });
}

export function useMyCampaigns() {
  return useQuery({
    queryKey: ['celebrations', 'mine'],
    queryFn: () => celebrationService.listMine(),
  });
}

export function useCampaignBySlug(slug) {
  return useQuery({
    queryKey: ['celebrations', 'campaign', slug],
    queryFn: () => celebrationService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCampaignDonations(id) {
  return useQuery({
    queryKey: ['celebrations', id, 'donations'],
    queryFn: () => celebrationService.campaignDonations(id),
    enabled: !!id,
  });
}

export function useCampaignImpact(id) {
  return useQuery({
    queryKey: ['celebrations', id, 'impact'],
    queryFn: () => celebrationService.campaignImpact(id),
    enabled: !!id,
  });
}

export function useMyDonations() {
  return useQuery({
    queryKey: ['celebrations', 'my-donations'],
    queryFn: () => celebrationService.myDonations(),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: celebrationService.createCampaign,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['celebrations'] });
      toast.success('Campaign created! Share it to start collecting');
    },
    onError: (err) => toast.error(err.message || 'Failed to create campaign'),
  });
}

export function useQuickGive() {
  return useMutation({
    mutationFn: celebrationService.quickGive,
    onError: (err) => {
      const rawMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      const displayMsg =
        rawMsg && !rawMsg.includes('undefined')
          ? rawMsg
          : 'Payment gateway is temporarily unavailable. Please try again.';
      toast.error(displayMsg);
    },
  });
}

export function useDonateToCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => celebrationService.donateToCampaign(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['celebrations'] });
    },
    onError: (err) => {
      const rawMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      const displayMsg =
        rawMsg && !rawMsg.includes('undefined')
          ? rawMsg
          : 'Payment gateway is temporarily unavailable. Please try again.';
      toast.error(displayMsg);
    },
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => celebrationService.updateCampaign(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['celebrations'] });
      toast.success('Campaign updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update campaign'),
  });
}

export function usePauseCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paused }) => celebrationService.pauseCampaign(id, paused),
    onSuccess: (_, { paused }) => {
      qc.invalidateQueries({ queryKey: ['celebrations'] });
      toast.success(paused ? 'Campaign paused' : 'Campaign resumed');
    },
    onError: (err) => toast.error(err.message || 'Failed to update campaign'),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: celebrationService.deleteCampaign,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['celebrations'] });
      toast.success('Campaign deleted');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete campaign'),
  });
}

export function useAddImpact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => celebrationService.addImpact(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['celebrations'] });
      toast.success('Impact update posted');
    },
    onError: (err) => toast.error(err.message || 'Failed to post update'),
  });
}

// ---- Unified monetary flow ----

export function useMoneyDonation(id) {
  return useQuery({
    queryKey: ['donations', 'money', id],
    queryFn: () => celebrationService.getMoneyDonation(id),
    enabled: !!id,
    retry: false,
  });
}

export function useRequestReceiptOtp() {
  return useMutation({
    mutationFn: (email) => celebrationService.requestReceiptOtp(email),
    onError: (err) => toast.error(err.message || 'Could not send OTP'),
  });
}

export function useVerifyReceiptOtp() {
  return useMutation({
    mutationFn: ({ email, otp }) => celebrationService.verifyReceiptOtp(email, otp),
    onError: (err) => toast.error(err.message || 'Invalid OTP'),
  });
}

export function useClaimDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reference) => celebrationService.claimDonation(reference),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donations'] });
      toast.success('Receipt linked to your account');
    },
    onError: (err) => toast.error(err.message || 'Could not link receipt'),
  });
}

export function useMyMoneyDonations() {
  return useQuery({
    queryKey: ['donations', 'money', 'mine'],
    queryFn: () => celebrationService.myMoneyDonations(),
  });
}