import { useState } from 'react';
import OrgApprovalList from '../../components/shared/OrgApprovalList';
import { useAdminNgos, useApproveOrg, useRejectOrg } from '../../hooks/useAdmin';

export default function AdminNgos() {
  const [status, setStatus] = useState('pending');
  const { data: ngos = [], isLoading } = useAdminNgos({ status });
  const approveMutation = useApproveOrg();
  const rejectMutation = useRejectOrg();

  return (
    <OrgApprovalList
      title="NGO Approvals"
      description="Review and verify NGO registration documents"
      orgs={ngos}
      isLoading={isLoading}
      statusFilter={status}
      onStatusFilterChange={setStatus}
      onApprove={(org) => approveMutation.mutate({ type: 'ngo', id: org.id })}
      onReject={(org, reason) => rejectMutation.mutate({ type: 'ngo', id: org.id, reason })}
      approving={approveMutation.isPending}
      rejecting={rejectMutation.isPending}
    />
  );
}
