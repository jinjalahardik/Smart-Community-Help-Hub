import { useState } from 'react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import { Card } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Skeleton';
import { useNgoVolunteers } from '../../hooks/useNgo';

export default function NgoVolunteers() {
  const [search, setSearch] = useState('');
  const { data: volunteers = [], isLoading } = useNgoVolunteers();

  const filtered = volunteers.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader title="Volunteer Management" description="Volunteers available to take on your organization's tasks" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search volunteers..." className="sm:w-72" />
      </FilterBar>

      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No volunteers found" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <Card key={v.id} className="p-5 flex items-center gap-3.5">
              <Avatar name={v.name} color={v.avatarColor} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{v.name}</p>
                <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{v.city}</p>
              </div>
              <Badge tone={v.status === 'active' ? 'teal' : 'gray'}>{v.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
