import { useState } from 'react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { useRequests } from '../../hooks/useRequests';
import { REQUEST_CATEGORY_LABELS } from '../../constants/categories';
import { formatDate } from '../../utils/format';

export default function AdminRequests() {
  const [search, setSearch] = useState('');
  const [urgency, setUrgency] = useState('');
  const { data: requests = [], isLoading } = useRequests({ search, urgency });

  const columns = [
    { key: 'title', header: 'Request' },
    { key: 'category', header: 'Category', render: (r) => REQUEST_CATEGORY_LABELS[r.category] },
    { key: 'requesterName', header: 'Requester' },
    { key: 'urgency', header: 'Urgency', render: (r) => <PriorityBadge level={r.urgency} /> },
    { key: 'priorityScore', header: 'Score' },
    { key: 'createdAt', header: 'Raised', render: (r) => formatDate(r.createdAt) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Emergency Request Management" description="Platform-wide view of all emergency requests" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search requests..." className="sm:w-72" />
        <Select value={urgency} onChange={(e) => setUrgency(e.target.value)} placeholder="All urgency levels" options={['critical', 'high', 'medium', 'low'].map((u) => ({ value: u, label: u }))} containerClassName="sm:w-44" />
      </FilterBar>
      <DataTable columns={columns} data={requests} loading={isLoading} emptyMessage="No requests found" />
    </div>
  );
}
