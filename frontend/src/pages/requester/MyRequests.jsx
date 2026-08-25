import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Siren, Eye, Pencil, Trash2 } from 'lucide-react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/Modal';
import IconButton from '../../components/ui/IconButton';
import { useAuth } from '../../context/AuthContext';
import { useRequests, useDeleteRequest } from '../../hooks/useRequests';
import { PATHS } from '../../routes/paths';
import { formatDate } from '../../utils/format';
import { REQUEST_CATEGORY_LABELS } from '../../constants/categories';

export default function MyRequests() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { data: requests = [], isLoading } = useRequests({ requesterId: user.id, search, category });
  const deleteRequest = useDeleteRequest();

  const columns = [
    { key: 'title', header: 'Request', render: (r) => <Link to={PATHS.REQUESTER.DETAILS(r.id)} className="font-medium hover:text-teal-600">{r.title}</Link> },
    { key: 'category', header: 'Category', render: (r) => REQUEST_CATEGORY_LABELS[r.category] },
    { key: 'urgency', header: 'Urgency', render: (r) => <PriorityBadge level={r.urgency} /> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdAt', header: 'Raised', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', header: '', render: (r) => (
        <div className="flex items-center gap-1">
          <Link to={PATHS.REQUESTER.DETAILS(r.id)}><IconButton icon={Eye} label="View" size="sm" /></Link>
          <Link to={PATHS.REQUESTER.EDIT(r.id)}><IconButton icon={Pencil} label="Edit" size="sm" /></Link>
          <IconButton icon={Trash2} label="Delete" size="sm" onClick={() => setDeleteId(r.id)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Requests"
        breadcrumb={[{ label: 'Dashboard', href: PATHS.REQUESTER.DASHBOARD }, { label: 'Requests' }]}
        actions={<Link to={PATHS.REQUESTER.CREATE}><Button variant="coral" icon={Siren}>New Request</Button></Link>}
      />

      <FilterBar className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search requests..." className="sm:w-64" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={Object.entries(REQUEST_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))} containerClassName="sm:w-48" />
      </FilterBar>

      <DataTable columns={columns} data={requests} loading={isLoading} emptyMessage="No requests found" />

      <ConfirmationModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteRequest.mutate(deleteId); setDeleteId(null); }}
        title="Delete request?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteRequest.isPending}
      />
    </div>
  );
}
