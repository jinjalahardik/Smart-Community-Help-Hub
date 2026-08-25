import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../features/admin/adminService';

export function useAdminUsers(filters = {}) {
  return useQuery({ queryKey: ['admin-users', filters], queryFn: () => adminService.listUsers(filters) });
}

export function useAdminNgos(filters = {}) {
  return useQuery({ queryKey: ['admin-ngos', filters], queryFn: () => adminService.listNgos(filters) });
}

export function useAdminHospitals(filters = {}) {
  return useQuery({ queryKey: ['admin-hospitals', filters], queryFn: () => adminService.listHospitals(filters) });
}

export function useAuditLogs() {
  return useQuery({ queryKey: ['audit-logs'], queryFn: adminService.auditLogs });
}

export function useAdminAnalytics() {
  return useQuery({ queryKey: ['admin-analytics'], queryFn: adminService.analytics });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => adminService.updateUserStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update user'),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete user'),
  });
}

export function useApproveOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id }) => adminService.approveOrg(type, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-ngos'] });
      qc.invalidateQueries({ queryKey: ['admin-hospitals'] });
      toast.success('Organization approved');
    },
    onError: (err) => toast.error(err.message || 'Failed to approve organization'),
  });
}

export function useRejectOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id, reason }) => adminService.rejectOrg(type, id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-ngos'] });
      qc.invalidateQueries({ queryKey: ['admin-hospitals'] });
      toast.success('Organization rejected');
    },
    onError: (err) => toast.error(err.message || 'Failed to reject organization'),
  });
}
