import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../hooks/useRequests';
import { timeAgo } from '../../utils/format';
import { REQUEST_CATEGORY_LABELS } from '../../constants/categories';
import { MapPin, Users } from 'lucide-react';

export default function NearbyRequests() {
  const { user } = useAuth();
  const { data: requests = [], isLoading } = useRequests({ city: user.city });
  const nearby = requests.filter((r) => !['fulfilled', 'closed', 'rejected'].includes(r.status));

  return (
    <div>
      <PageHeader title="Nearby Requests" description={`Emergency requests currently open near ${user.city}`} breadcrumb={[{ label: 'Dashboard', href: '/donor/dashboard' }, { label: 'Nearby Requests' }]} />

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
      ) : nearby.length === 0 ? (
        <EmptyState title="No open requests nearby" description="Check back later — new emergency requests appear here in real time." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {nearby.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <PriorityBadge level={r.urgency} />
                <StatusBadge status={r.status} />
              </div>
              <p className="font-display font-semibold text-sm">{r.title}</p>
              <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-1 line-clamp-2">{r.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-ink-light/65 dark:text-ink-dark/65">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.city}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {r.affectedPeople} affected</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-teal-100 dark:border-teal-900/50">
                <span className="text-xs text-teal-600 font-medium">{REQUEST_CATEGORY_LABELS[r.category]}</span>
                <span className="text-xs text-ink-light/40">{timeAgo(r.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
