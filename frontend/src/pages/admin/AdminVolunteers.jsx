import { useState } from 'react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import DataTable from '../../components/ui/DataTable';
import Avatar from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useAdminUsers } from '../../hooks/useAdmin';
import { useTasks } from '../../hooks/useTasks';
import { formatDate } from '../../utils/format';

export default function AdminVolunteers() {
  const [search, setSearch] = useState('');
  const { data: volunteers = [], isLoading } = useAdminUsers({ role: 'volunteer', search });
  const { data: tasks = [] } = useTasks();

  const columns = [
    { key: 'name', header: 'Volunteer', render: (v) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={v.name} color={v.avatarColor} size="sm" />
        <div><p className="font-medium">{v.name}</p><p className="text-xs text-ink-light/65">{v.email}</p></div>
      </div>
    ) },
    { key: 'city', header: 'City' },
    { key: 'tasksCompleted', header: 'Tasks Completed', render: (v) => tasks.filter((t) => t.assignedVolunteerId === v.id && t.status === 'completed').length },
    { key: 'status', header: 'Status', render: (v) => <Badge tone={v.status === 'active' ? 'teal' : 'gray'}>{v.status}</Badge> },
    { key: 'createdAt', header: 'Joined', render: (v) => formatDate(v.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="Volunteer Management" description="Overview of all volunteers on the platform" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search volunteers..." className="sm:w-72" />
      </FilterBar>
      <DataTable columns={columns} data={volunteers} loading={isLoading} emptyMessage="No volunteers found" />
    </div>
  );
}
