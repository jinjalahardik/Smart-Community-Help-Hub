import { useState } from 'react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useRequests, useAssignRequest } from '../../hooks/useRequests';
import { useAuth } from '../../context/AuthContext';
import { REQUEST_CATEGORY_LABELS } from '../../constants/categories';
import { formatDate } from '../../utils/format';

export default function NgoRequests() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [urgency, setUrgency] = useState('');
  const { data: requests = [], isLoading } = useRequests({ search, urgency });
  const assignMutation = useAssignRequest();

  const columns = [
    { key: 'title', header: 'Request', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'category', header: 'Category', render: (r) => REQUEST_CATEGORY_LABELS[r.category] },
    { key: 'urgency', header: 'Urgency', render: (r) => <PriorityBadge level={r.urgency} /> },
    { key: 'priorityScore', header: 'Priority Score' },
    { key: 'city', header: 'City' },
    { key: 'createdAt', header: 'Raised', render: (r) => formatDate(r.createdAt) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions', header: '', render: (r) => r.status === 'pending' && (
        <Button size="sm" onClick={() => assignMutation.mutate({ id: r.id, ngoId: user.orgId })} loading={assignMutation.isPending}>Assign to Us</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Emergency Requests" description="Requests are sorted by priority score, highest need first" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search requests..." className="sm:w-72" />
        <Select value={urgency} onChange={(e) => setUrgency(e.target.value)} placeholder="All urgency levels" options={[{ value: 'critical', label: 'Critical' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} containerClassName="sm:w-48" />
      </FilterBar>
      <DataTable columns={columns} data={requests} loading={isLoading} emptyMessage="No emergency requests found" />
    </div>
  );
}
