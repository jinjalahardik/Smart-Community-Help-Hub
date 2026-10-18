import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PartyPopper, Share2, Pause, Play, Trash2, PenLine, Megaphone, Copy, Plus,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import Modal, { ConfirmationModal } from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCardGrid } from '../../components/ui/SkeletonCard';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  useMyCampaigns, useMyDonations, usePauseCampaign, useDeleteCampaign,
  useUpdateCampaign, useAddImpact,
} from '../../hooks/useCelebrations';
import {
  CELEBRATION_THEMES, celebrationOccasionLabel,
  celebrationCauseById,
} from '../../constants/celebrations';
import { formatNumber, formatDate, timeAgo } from '../../utils/format';
import { PATHS } from '../../routes/paths';
import toast from 'react-hot-toast';

export default function MyCampaigns() {
  const campaigns = useMyCampaigns();
  const myDonations = useMyDonations();
  const pause = usePauseCampaign();
  const remove = useDeleteCampaign();
  const update = useUpdateCampaign();
  const addImpact = useAddImpact();

  const [editTarget, setEditTarget] = useState(null);
  const [impactTarget, setImpactTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [impactText, setImpactText] = useState('');

  const openEdit = (c) => {
    setEditTarget(c);
    setEditForm({ eventTitle: c.eventTitle, eventDate: c.eventDate || '', description: c.description || '', goalAmount: String(c.goalAmount) });
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    await update.mutateAsync({ id: editTarget.id, patch: editForm });
    setEditTarget(null);
  };

  const postImpact = async () => {
    if (!impactTarget || !impactText.trim()) return;
    await addImpact.mutateAsync({ id: impactTarget.id, payload: { message: impactText.trim() } });
    setImpactText('');
    setImpactTarget(null);
  };

  const shareCampaign = async (c) => {
    const url = `${window.location.origin}${PATHS.CELEBRATE.CAMPAIGN(c.slug)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Campaign link copied — share it!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div>
      <PageHeader
        title="My Celebration Campaigns"
        description="Manage your campaigns and see your giving receipts"
        breadcrumb={[{ label: 'Dashboard', href: PATHS.DASHBOARD }, { label: 'Celebrate & Give', href: PATHS.CELEBRATE.INDEX }, { label: 'My Campaigns' }]}
        actions={<Link to={PATHS.CELEBRATE.CREATE}><Button icon={Plus}>New campaign</Button></Link>}
      />

      <div className="space-y-10">
        <div>
          <h2 className="font-display font-bold text-lg mb-4">Your campaigns</h2>
          {campaigns.isLoading ? (
            <SkeletonCardGrid count={3} />
          ) : campaigns.data?.length ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {campaigns.data.map((c) => {
                const theme = CELEBRATION_THEMES.find((t) => t.value === c.theme) || CELEBRATION_THEMES[0];
                const pct = c.goalAmount ? Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100)) : 0;
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <Card hover className="overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link to={PATHS.CELEBRATE.CAMPAIGN(c.slug)} className="text-base font-bold hover:text-teal-700 dark:hover:text-teal-300">
                              {c.eventTitle}
                            </Link>
                            <p className="mt-0.5 text-xs text-ink-light/55 dark:text-ink-dark/55">
                              {celebrationOccasionLabel(c.eventType)} · {celebrationCauseById(c.cause)?.label} · {c.ngoName}
                            </p>
                          </div>
<StatusBadge status={c.status} />
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-teal-700 dark:text-teal-300">₹{formatNumber(c.raisedAmount)}</span>
                            <span className="text-ink-light/55 dark:text-ink-dark/55">of ₹{formatNumber(c.goalAmount)}</span>
                          </div>
                          <div className="mt-1.5 h-2 rounded-full bg-teal-100 dark:bg-teal-900/60 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-ink-light/50 dark:text-ink-dark/50">{c.donationCount} gifts · {formatDate(c.createdAt, 'dd MMM yyyy')}</p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" icon={Share2} onClick={() => shareCampaign(c)}>Share</Button>
<Button size="sm" variant={c.status === 'active' ? 'subtle' : 'outline'} icon={c.status === 'active' ? Pause : Play} onClick={() => pause.mutateAsync({ id: c.id, paused: c.status === 'active' })}>
  {c.status === 'active' ? 'Pause' : 'Resume'}
</Button>
                          <Button size="sm" variant="ghost" icon={PenLine} onClick={() => openEdit(c)}>Edit</Button>
                          <Button size="sm" variant="ghost" icon={Megaphone} onClick={() => setImpactTarget(c)}>Update impact</Button>
                          <Button size="sm" variant="danger" icon={Trash2} onClick={() => setDeleteTarget(c)} className="ml-auto">Delete</Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={PartyPopper}
              title="No campaigns yet"
              description="Turn your next celebration into a campaign so friends and family can give."
              action={<Link to={PATHS.CELEBRATE.CREATE}><Button icon={Plus}>Create your first campaign</Button></Link>}
            />
          )}
        </div>

        <div>
          <h2 className="font-display font-bold text-lg mb-4">Your giving receipts</h2>
          {myDonations.isLoading ? (
            <SkeletonCardGrid count={1} />
          ) : myDonations.data?.length ? (
            <Card className="p-5 sm:p-6">
              <div className="divide-y divide-teal-100 dark:divide-teal-900/60">
                {myDonations.data.map((d) => (
                  <div key={d.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{celebrationOccasionLabel(d.occasion)} · {celebrationCauseById(d.cause)?.label || d.cause}</p>
                      <p className="text-xs text-ink-light/50 dark:text-ink-dark/50">{d.ngoName} · {timeAgo(d.createdAt)} · ref {d.paymentRef}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-teal-700 dark:text-teal-300">₹{formatNumber(d.amount)}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <EmptyState icon={Copy} title="No giving receipts yet" description="Quick Gives and campaign contributions will appear here." />
          )}
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit campaign"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={saveEdit} loading={update.isPending}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Campaign title" required value={editForm.eventTitle || ''} onChange={(e) => setEditForm((f) => ({ ...f, eventTitle: e.target.value }))} />
          <Input label="Event date" type="date" value={editForm.eventDate || ''} onChange={(e) => setEditForm((f) => ({ ...f, eventDate: e.target.value }))} />
          <Input
            label="Goal amount (₹)"
            type="number"
            min={10}
            value={editForm.goalAmount || ''}
            onChange={(e) => setEditForm((f) => ({ ...f, goalAmount: e.target.value }))}
          />
          <Textarea label="Story" rows={3} value={editForm.description || ''} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
      </Modal>

      {/* Impact update modal */}
      <Modal
        open={!!impactTarget}
        onClose={() => setImpactTarget(null)}
        title={`Add impact update · ${impactTarget?.eventTitle || ''}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setImpactTarget(null)}>Cancel</Button>
            <Button onClick={postImpact} loading={addImpact.isPending} icon={Megaphone}>Post update</Button>
          </>
        }
      >
        <Textarea
          rows={3}
          placeholder="e.g. We crossed ₹10,000 — enough for 40 meal kits. Thank you everyone!"
          value={impactText}
          onChange={(e) => setImpactText(e.target.value)}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmationModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { await remove.mutateAsync(deleteTarget.id); setDeleteTarget(null); } }}
        title="Delete this campaign?"
        description={`"${deleteTarget?.eventTitle}" will be removed permanently. Contributions already made remain recorded.`}
        confirmLabel="Delete campaign"
        variant="danger"
        loading={remove.isPending}
      />
    </div>
  );
}