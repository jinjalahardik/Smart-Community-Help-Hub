import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { PATHS } from '../../routes/paths';
import { formatDate } from '../../utils/format';

export default function TaskListPage({ title, mode, emptyMessage }) {
  const { user } = useAuth();
  const { data: allTasks = [], isLoading } = useTasks({ volunteerId: user.id });
  const tasks = mode === 'completed' ? allTasks.filter((t) => t.status === 'completed') : allTasks.filter((t) => t.status !== 'completed');

  const columns = [
    { key: 'title', header: 'Task', render: (t) => <Link to={PATHS.VOLUNTEER.TASK_DETAILS(t.id)} className="font-medium hover:text-teal-600">{t.title}</Link> },
    { key: 'pickupLocation', header: 'Pickup' },
    { key: 'deliveryLocation', header: 'Delivery' },
    { key: 'priority', header: 'Priority', render: (t) => <PriorityBadge level={t.priority} /> },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
    { key: 'createdAt', header: 'Date', render: (t) => formatDate(t.createdAt) },
  ];

  return (
    <div>
      <PageHeader title={title} breadcrumb={[{ label: 'Dashboard', href: PATHS.VOLUNTEER.DASHBOARD }, { label: title }]} />
      <DataTable columns={columns} data={tasks} loading={isLoading} emptyMessage={emptyMessage} />
    </div>
  );
}
