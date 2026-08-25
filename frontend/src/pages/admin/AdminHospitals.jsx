import { useState } from 'react';
import OrgApprovalList from '../../components/shared/OrgApprovalList';
import { useAdminHospitals, useApproveOrg, useRejectOrg } from '../../hooks/useAdmin';

export default function AdminHospitals() {
  const [status, setStatus] = useState('pending');
  const { data: hospitals = [], isLoading } = useAdminHospitals({ status });
  const approveMutation = useApproveOrg();
  const rejectMutation = useRejectOrg();

  return (
    <OrgApprovalList
      title="Hospital Approvals"
      description="Review and verify hospital license documents"
      orgs={hospitals}
      isLoading={isLoading}
      statusFilter={status}
      onStatusFilterChange={setStatus}
      onApprove={(org) => approveMutation.mutate({ type: 'hospital', id: org.id })}
      onReject={(org, reason) => rejectMutation.mutate({ type: 'hospital', id: org.id, reason })}
      approving={approveMutation.isPending}
      rejecting={rejectMutation.isPending}
    />
  );
}
