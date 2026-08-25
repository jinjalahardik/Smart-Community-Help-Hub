import { useState } from 'react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { useDonations } from '../../hooks/useDonations';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { formatDate } from '../../utils/format';

const PAGE_SIZE = 8;

export default function AdminDonations() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data: donations = [], isLoading } = useDonations({ search, category, status });

  const totalPages = Math.max(1, Math.ceil(donations.length / PAGE_SIZE));
  const paged = donations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: 'title', header: 'Donation' },
    { key: 'category', header: 'Category', render: (d) => DONATION_CATEGORY_LABELS[d.category] },
    { key: 'donorName', header: 'Donor' },
    { key: 'city', header: 'City' },
    { key: 'createdAt', header: 'Posted', render: (d) => formatDate(d.createdAt) },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Donation Management" description="Platform-wide view of all donations" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search donations..." className="sm:w-72" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))} containerClassName="sm:w-44" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder="All statuses" options={['pending', 'accepted', 'in_transit', 'completed', 'cancelled'].map((s) => ({ value: s, label: s }))} containerClassName="sm:w-44" />
      </FilterBar>
      <DataTable columns={columns} data={paged} loading={isLoading} emptyMessage="No donations found" />
      <div className="mt-5"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
    </div>
  );
}
