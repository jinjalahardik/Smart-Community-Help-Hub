import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { useRequirements } from '../../hooks/useHospital';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';
import { PATHS } from '../../routes/paths';
import { useState } from 'react';

export default function ActiveRequirements() {
  const { user } = useAuth();
  const [type, setType] = useState('');
  const { data: requirements = [], isLoading } = useRequirements(user.orgId, { type });

  const columns = [
    { key: 'title', header: 'Requirement', render: (r) => <Link to={PATHS.HOSPITAL.REQUIREMENT_DETAILS(r.id)} className="font-medium hover:text-teal-600">{r.title}</Link> },
    { key: 'type', header: 'Type', render: (r) => r.type === 'blood' ? r.bloodGroup : r.medicineName },
    { key: 'quantity', header: 'Quantity', render: (r) => `${r.quantity} ${r.unit}` },
    { key: 'urgency', header: 'Urgency', render: (r) => <PriorityBadge level={r.urgency} /> },
    { key: 'neededBy', header: 'Needed By', render: (r) => formatDate(r.neededBy) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Active Requirements" description="Blood and medicine requirements published by your hospital" actions={<Link to={PATHS.HOSPITAL.REQUIREMENT_CREATE}><Button icon={Plus}>New Requirement</Button></Link>} />
      <FilterBar className="mb-5">
        <Select value={type} onChange={(e) => setType(e.target.value)} placeholder="All types" options={[{ value: 'blood', label: 'Blood' }, { value: 'medicine', label: 'Medicine' }]} containerClassName="sm:w-48" />
      </FilterBar>
      <DataTable columns={columns} data={requirements} loading={isLoading} emptyMessage="No requirements published yet" />
    </div>
  );
}
