import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackagePlus, Eye, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/Modal';
import IconButton from '../../components/ui/IconButton';
import { useAuth } from '../../context/AuthContext';
import { useDonations, useDeleteDonation } from '../../hooks/useDonations';
import { PATHS } from '../../routes/paths';
import { formatDate } from '../../utils/format';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';

export default function MyDonations() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { data: donations = [], isLoading } = useDonations({ donorId: user.id, search, category });
  const deleteDonation = useDeleteDonation();

  const columns = [
    { key: 'title', header: 'Donation', render: (d) => <Link to={PATHS.DONOR.DETAILS(d.id)} className="font-medium hover:text-teal-600">{d.title}</Link> },
    { key: 'category', header: 'Category', render: (d) => DONATION_CATEGORY_LABELS[d.category] },
    { key: 'quantity', header: 'Quantity', render: (d) => `${d.quantity} ${d.unit}` },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
    { key: 'createdAt', header: 'Created', render: (d) => formatDate(d.createdAt) },
    {
      key: 'actions', header: '', render: (d) => (
        <div className="flex items-center gap-1">
          <Link to={PATHS.DONOR.DETAILS(d.id)}><IconButton icon={Eye} label="View" size="sm" /></Link>
          <Link to={PATHS.DONOR.EDIT(d.id)}><IconButton icon={Pencil} label="Edit" size="sm" /></Link>
          <IconButton icon={Trash2} label="Delete" size="sm" onClick={() => setDeleteId(d.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Donations"
        breadcrumb={[{ label: 'Dashboard', href: PATHS.DONOR.DASHBOARD }, { label: 'Donations' }]}
        actions={<Link to={PATHS.DONOR.CREATE}><Button icon={PackagePlus}>New Donation</Button></Link>}
      />

      <FilterBar className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search donations..." className="sm:w-64" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))} containerClassName="sm:w-48" />
      </FilterBar>

      <DataTable columns={columns} data={donations} loading={isLoading} emptyMessage="No donations found" />

      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteDonation.mutate(deleteId); setDeleteId(null); }}
        title="Delete donation?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDonation.isPending}
      />
    </div>
  );
}
