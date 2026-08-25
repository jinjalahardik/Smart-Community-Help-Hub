import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { useDonations, useAcceptDonation } from '../../hooks/useDonations';
import { useAuth } from '../../context/AuthContext';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { formatDate } from '../../utils/format';
import { PATHS } from '../../routes/paths';

const PAGE_SIZE = 8;

export default function IncomingDonations() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { data: donations = [], isLoading } = useDonations({ search, category });
  const acceptMutation = useAcceptDonation();

  const totalPages = Math.max(1, Math.ceil(donations.length / PAGE_SIZE));
  const paged = donations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: 'title', header: 'Donation', render: (d) => <Link to={PATHS.NGO.DONATION_DETAILS(d.id)} className="font-medium hover:text-teal-600">{d.title}</Link> },
    { key: 'category', header: 'Category', render: (d) => DONATION_CATEGORY_LABELS[d.category] },
    { key: 'donorName', header: 'Donor' },
    { key: 'city', header: 'City' },
    { key: 'createdAt', header: 'Posted', render: (d) => formatDate(d.createdAt) },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
    {
      key: 'actions', header: '', render: (d) => d.status === 'pending' && (
        <Button size="sm" onClick={() => acceptMutation.mutate({ id: d.id, ngoId: user.orgId })} loading={acceptMutation.isPending}>Accept</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Incoming Donations" description="Review and accept donations from donors near you" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search donations..." className="sm:w-72" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))} containerClassName="sm:w-48" />
      </FilterBar>
      <DataTable columns={columns} data={paged} loading={isLoading} emptyMessage="No donations found" />
      <div className="mt-5"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
    </div>
  );
}
