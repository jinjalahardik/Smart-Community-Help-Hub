import { useState } from 'react';
import { FileText, Check, X } from 'lucide-react';
import { PageHeader, FilterBar } from '../ui/PageHeader';
import Select from '../ui/Select';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import EmptyState from '../ui/EmptyState';
import StatusTimeline from '../ui/StatusTimeline';
import { Spinner } from '../ui/Skeleton';
import { formatDate } from '../../utils/format';

export default function OrgApprovalList({ title, description, orgs, isLoading, statusFilter, onStatusFilterChange, onApprove, onReject, approving, rejecting }) {
  const [rejectTarget, setRejectTarget] = useState(null);
  const [detailsTarget, setDetailsTarget] = useState(null);
  const [reason, setReason] = useState('');

  return (
    <div>
      <PageHeader title={title} description={description} />
      <FilterBar className="mb-5">
        <Select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} placeholder="All statuses" options={[{ value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]} containerClassName="sm:w-48" />
      </FilterBar>

      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : orgs.length === 0 ? (
        <EmptyState title="No organizations found" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {orgs.map((org) => (
            <Card key={org.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display font-semibold">{org.name}</p>
                  <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{org.city} • Submitted {formatDate(org.createdAt)}</p>
                </div>
                <StatusBadge status={org.verificationStatus} />
              </div>
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">{org.contactPerson} • {org.phone}</p>
              <button onClick={() => setDetailsTarget(org)} className="text-xs text-teal-600 hover:underline mt-2 inline-flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> View documents & details
              </button>
              {org.verificationStatus === 'pending' && (
                <div className="flex gap-2.5 mt-4">
                  <Button size="sm" icon={Check} onClick={() => onApprove(org)} loading={approving}>Approve</Button>
                  <Button size="sm" variant="danger" icon={X} onClick={() => setRejectTarget(org)}>Reject</Button>
                </div>
              )}
              {org.verificationStatus === 'rejected' && org.rejectionReason && (
                <p className="text-xs text-coral-600 mt-3">Reason: {org.rejectionReason}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!detailsTarget} onClose={() => setDetailsTarget(null)} title={detailsTarget?.name} size="lg">
        {detailsTarget && (
          <div className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><span className="text-ink-light/65">Contact Person</span><p className="font-medium">{detailsTarget.contactPerson}</p></div>
              <div><span className="text-ink-light/65">Email</span><p className="font-medium">{detailsTarget.email}</p></div>
              <div><span className="text-ink-light/65">Phone</span><p className="font-medium">{detailsTarget.phone}</p></div>
              <div><span className="text-ink-light/65">Address</span><p className="font-medium">{detailsTarget.address}</p></div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2">Submitted Documents</p>
              <div className="space-y-2">
                {(detailsTarget.documents || []).map((doc) => (
                  <div key={doc} className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-900/20">
                    <FileText className="w-4 h-4 text-teal-600" /> {doc}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2">Status History</p>
              <StatusTimeline steps={['pending', 'approved']} currentIndex={detailsTarget.verificationStatus === 'approved' ? 1 : 0} history={detailsTarget.statusHistory} />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject organization?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={rejecting} onClick={() => { onReject(rejectTarget, reason); setRejectTarget(null); setReason(''); }}>Reject</Button>
          </>
        }
      >
        <Textarea label="Rejection Reason" placeholder="Explain why this organization is being rejected..." value={reason} onChange={(e) => setReason(e.target.value)} required />
      </Modal>
    </div>
  );
}
