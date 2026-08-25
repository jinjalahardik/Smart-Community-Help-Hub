import { PageHeader } from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { useAuditLogs } from '../../hooks/useAdmin';
import { formatDateTime } from '../../utils/format';

export default function AdminAuditLogs() {
  const { data: logs = [], isLoading } = useAuditLogs();

  const columns = [
    { key: 'actorName', header: 'Actor' },
    { key: 'action', header: 'Action' },
    { key: 'target', header: 'Target' },
    { key: 'createdAt', header: 'Timestamp', render: (l) => formatDateTime(l.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" description="Full history of administrative actions on the platform" />
      <DataTable columns={columns} data={logs} loading={isLoading} emptyMessage="No audit log entries yet" />
    </div>
  );
}
