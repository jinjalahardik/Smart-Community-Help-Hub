import { useState } from 'react';
import { Eye, Ban, CheckCircle2, Trash2 } from 'lucide-react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import Avatar from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import IconButton from '../../components/ui/IconButton';
import Modal, { ConfirmationModal } from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useAdminUsers, useUpdateUserStatus, useDeleteUser } from '../../hooks/useAdmin';
import { ROLE_LABELS } from '../../constants/roles';
import { formatDate } from '../../utils/format';

const PAGE_SIZE = 8;
const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));
const statusOptions = [{ value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }, { value: 'suspended', label: 'Suspended' }];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const { data: users = [], isLoading } = useAdminUsers({ search, role, status });
  const statusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paged = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: 'name', header: 'User', render: (u) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={u.name} color={u.avatarColor} size="sm" />
        <div><p className="font-medium">{u.name}</p><p className="text-xs text-ink-light/65">{u.email}</p></div>
      </div>
    ) },
    { key: 'role', header: 'Role', render: (u) => <Badge tone="teal">{ROLE_LABELS[u.role]}</Badge> },
    { key: 'city', header: 'City' },
    { key: 'createdAt', header: 'Joined', render: (u) => formatDate(u.createdAt) },
    { key: 'status', header: 'Status', render: (u) => <Badge tone={u.status === 'active' ? 'teal' : u.status === 'suspended' ? 'coral' : 'amber'}>{u.status}</Badge> },
    {
      key: 'actions', header: '', render: (u) => (
        <div className="flex items-center gap-1">
          <IconButton icon={Eye} label="View details" size="sm" onClick={() => setViewUser(u)} />
          {u.status === 'suspended' ? (
            <IconButton icon={CheckCircle2} label="Activate" size="sm" onClick={() => statusMutation.mutate({ id: u.id, status: 'active' })} />
          ) : (
            <IconButton icon={Ban} label="Suspend" size="sm" onClick={() => statusMutation.mutate({ id: u.id, status: 'suspended' })} />
          )}
          <IconButton icon={Trash2} label="Delete" size="sm" onClick={() => setDeleteUser(u)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="User Management" description="Manage all platform users across every role" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." className="sm:w-72" />
        <Select value={role} onChange={(e) => setRole(e.target.value)} placeholder="All roles" options={roleOptions} containerClassName="sm:w-44" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} placeholder="All statuses" options={statusOptions} containerClassName="sm:w-44" />
      </FilterBar>
      <DataTable columns={columns} data={paged} loading={isLoading} emptyMessage="No users found" />
      <div className="mt-5"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>

      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details">
        {viewUser && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 mb-2"><Avatar name={viewUser.name} color={viewUser.avatarColor} /><p className="font-medium">{viewUser.name}</p></div>
            <div className="flex justify-between"><span className="text-ink-light/65">Email</span><span>{viewUser.email}</span></div>
            <div className="flex justify-between"><span className="text-ink-light/65">Phone</span><span>{viewUser.phone}</span></div>
            <div className="flex justify-between"><span className="text-ink-light/65">Role</span><span>{ROLE_LABELS[viewUser.role]}</span></div>
            <div className="flex justify-between"><span className="text-ink-light/65">City</span><span>{viewUser.city}</span></div>
            <div className="flex justify-between"><span className="text-ink-light/65">Joined</span><span>{formatDate(viewUser.createdAt)}</span></div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => { deleteMutation.mutate(deleteUser.id); setDeleteUser(null); }}
        title="Delete user account?"
        description={`This will permanently remove ${deleteUser?.name}'s account from the platform.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
