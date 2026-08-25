import { ShieldCheck, ShieldX, ShieldAlert, FileText } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import StatusTimeline from '../ui/StatusTimeline';
import { PageSpinner } from '../ui/Skeleton';
import { ErrorState } from '../ui/ErrorState';
import { formatDateTime } from '../../utils/format';

const ICONS = { approved: ShieldCheck, rejected: ShieldX, pending: ShieldAlert };

export default function VerificationStatusView({ org, isLoading, error, onRetry }) {
  if (isLoading) return <PageSpinner />;
  if (error || !org) return <ErrorState title="Could not load verification status" onRetry={onRetry} />;

  const Icon = ICONS[org.verificationStatus] || ShieldAlert;

  return (
    <div>
      <PageHeader title="Verification Status" description="Track your organization's document verification progress" />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center">
              <Icon className="w-7 h-7 text-teal-600" />
            </div>
            <div>
              <p className="font-display font-semibold text-lg">{org.name}</p>
              <StatusBadge status={org.verificationStatus} />
            </div>
          </div>
          {org.verificationStatus === 'rejected' && org.rejectionReason && (
            <div className="rounded-xl bg-coral-50 dark:bg-coral-900/20 p-4 text-sm text-coral-700 dark:text-coral-300 mb-4">
              <strong>Rejection reason:</strong> {org.rejectionReason}
            </div>
          )}
          <p className="text-sm font-medium mb-3">Status History</p>
          <StatusTimeline
            steps={['pending', 'approved']}
            currentIndex={org.verificationStatus === 'approved' ? 1 : 0}
            history={org.statusHistory}
          />
        </Card>

        <Card className="p-6 h-fit">
          <p className="font-display font-semibold mb-3">Submitted Documents</p>
          <div className="space-y-2.5">
            {(org.documents || []).map((doc) => (
              <div key={doc} className="flex items-center gap-2.5 text-sm p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-900/20">
                <FileText className="w-4 h-4 text-teal-600" /> {doc}
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-light/45 dark:text-ink-dark/45 mt-4">Submitted on {formatDateTime(org.createdAt)}</p>
        </Card>
      </div>
    </div>
  );
}
