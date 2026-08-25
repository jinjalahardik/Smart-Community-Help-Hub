import { useState } from 'react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useFeedbackList, useUpdateFeedbackStatus } from '../../hooks/useFeedback';
import { ROLE_LABELS } from '../../constants/roles';
import { formatDate } from '../../utils/format';

export default function AdminFeedback() {
  const [status, setStatus] = useState('');
  const { data: feedback = [], isLoading } = useFeedbackList({ status });
  const updateMutation = useUpdateFeedbackStatus();

  const columns = [
    { key: 'subject', header: 'Subject', render: (f) => <span className="font-medium">{f.subject}</span> },
    { key: 'userName', header: 'From', render: (f) => `${f.userName} (${ROLE_LABELS[f.role]})` },
    { key: 'rating', header: 'Rating', render: (f) => '★'.repeat(f.rating) },
    { key: 'createdAt', header: 'Submitted', render: (f) => formatDate(f.createdAt) },
    { key: 'status', header: 'Status', render: (f) => <Badge tone={f.status === 'reviewed' ? 'teal' : 'amber'}>{f.status}</Badge> },
    {
      key: 'actions', header: '', render: (f) => f.status === 'pending' && (
        <Button size="sm" onClick={() => updateMutation.mutate({ id: f.id, status: 'reviewed' })}>Mark Reviewed</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Feedback Management" description="Review feedback submitted across all roles" />
      <FilterBar className="mb-5">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder="All statuses" options={[{ value: 'pending', label: 'Pending' }, { value: 'reviewed', label: 'Reviewed' }]} containerClassName="sm:w-48" />
      </FilterBar>
      <DataTable columns={columns} data={feedback} loading={isLoading} emptyMessage="No feedback submitted yet" />
    </div>
  );
}
