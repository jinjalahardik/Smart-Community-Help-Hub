import { Link } from 'react-router-dom';
import { Siren, ClipboardList, CheckCircle2, Clock, ArrowRight, Building2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard, Card } from '../../components/ui/Card';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import NotificationItem from '../../components/shared/NotificationItem';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../hooks/useRequests';
import { useNotifications } from '../../hooks/useNotifications';
import { usePublicNgos } from '../../hooks/useNgo';
import { PATHS } from '../../routes/paths';
import { REQUEST_CATEGORY_LABELS } from '../../constants/categories';
import { timeAgo } from '../../utils/format';

const STATUS_DESCRIPTIONS = {
  pending: 'Waiting to be reviewed by a nearby NGO.',
  reviewing: 'An NGO is currently reviewing your request.',
  assigned: 'An NGO has been assigned and is preparing help.',
  in_progress: 'Help is on the way to you.',
  fulfilled: 'This request has been fully resolved.',
  closed: 'This request has been closed.',
  rejected: 'This request could not be fulfilled.',
};

export default function RequesterDashboard() {
  const { user } = useAuth();
  const { data: requests = [] } = useRequests({ requesterId: user.id });
  const { data: notifications = [] } = useNotifications(user.id);
  const { data: ngos = [] } = usePublicNgos();
  const ngoNameById = Object.fromEntries(ngos.map((n) => [n.id, n.name]));

  const active = requests.filter((r) => !['fulfilled', 'closed', 'rejected'].includes(r.status));
  const fulfilled = requests.filter((r) => r.status === 'fulfilled');
  const pending = requests.filter((r) => r.status === 'pending');
  const criticalActive = active.filter((r) => r.urgency === 'critical');

  return (
    <div>
      <PageHeader
        title={`Hello, ${user.name.split(' ')[0]}`}
        description="Track your community support requests"
        actions={<Link to={PATHS.REQUESTER.CREATE}><Button variant="coral" icon={Siren} className="shadow-glass">Raise Emergency Request</Button></Link>}
      />

      {criticalActive.length > 0 && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800 px-4 py-3 mb-6 text-sm text-coral-700 dark:text-coral-300">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse-soft" />
          You have {criticalActive.length} critical request{criticalActive.length > 1 ? 's' : ''} awaiting help. Our team prioritizes these first.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Requests" value={active.length} icon={ClipboardList} accent="teal" />
        <StatCard label="Fulfilled" value={fulfilled.length} icon={CheckCircle2} accent="teal" />
        <StatCard label="Pending" value={pending.length} icon={Clock} accent="amber" />
        <StatCard label="Total Raised" value={requests.length} icon={Siren} accent="coral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold">My Requests</p>
            <Link to={PATHS.REQUESTER.REQUESTS} className="text-sm text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {requests.length === 0 ? (
            <EmptyState title="No requests yet" description="Raise a request to get help from nearby NGOs." action={<Link to={PATHS.REQUESTER.CREATE}><Button size="sm" variant="coral">Raise Request</Button></Link>} />
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 5).map((r) => (
                <Link key={r.id} to={PATHS.REQUESTER.DETAILS(r.id)} className="block p-3 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{REQUEST_CATEGORY_LABELS[r.category]} • {timeAgo(r.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge level={r.urgency} />
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                  <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-1.5">{STATUS_DESCRIPTIONS[r.status]}</p>
                  {r.assignedNgoId && ngoNameById[r.assignedNgoId] && (
                    <p className="text-xs text-teal-600 mt-1 flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Assigned to {ngoNameById[r.assignedNgoId]}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <p className="font-display font-semibold mb-3">Recent Notifications</p>
          <div className="divide-y divide-teal-100 dark:divide-teal-900/50 -mx-5">
            {notifications.slice(0, 4).map((n) => <NotificationItem key={n.id} notification={n} />)}
            {notifications.length === 0 && <EmptyState title="No notifications yet" className="py-6" />}
          </div>
        </Card>
      </div>
    </div>
  );
}
