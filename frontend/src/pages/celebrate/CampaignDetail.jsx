import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PartyPopper, Heart, Share2, Users, TrendingUp, CalendarDays, MapPin,
  UtensilsCrossed, Shirt, Pill, Droplet, ArrowLeft,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { SkeletonCardGrid } from '../../components/ui/SkeletonCard';
import DonateModal from '../../features/celebrations/DonateModal';
import {
  useCampaignBySlug, useCampaignImpact,
} from '../../hooks/useCelebrations';
import { useQueryClient } from '@tanstack/react-query';
import {
  CELEBRATION_THEMES, CELEBRATION_STATUS_LABELS, celebrationOccasionLabel,
  celebrationCauseById,
} from '../../constants/celebrations';
import { formatNumber, formatDate, timeAgo } from '../../utils/format';
import { PATHS } from '../../routes/paths';
import toast from 'react-hot-toast';

const CAUSE_ICONS = { food: UtensilsCrossed, clothes: Shirt, medicine: Pill, blood: Droplet };

export default function CampaignDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [donateOpen, setDonateOpen] = useState(false);

  const campaign = useCampaignBySlug(slug);
  const impact = useCampaignImpact(campaign.data?.id);

  if (campaign.isLoading) {
    return (
      <div className="container-app py-12">
        <SkeletonCardGrid count={2} />
      </div>
    );
  }
  if (campaign.isError || !campaign.data) {
    return (
      <div className="container-app py-24 text-center">
        <PartyPopper className="w-12 h-12 mx-auto text-teal-500/40" />
        <h1 className="mt-4 text-2xl font-display font-bold">This campaign isn't available</h1>
        <p className="mt-2 text-ink-light/60 dark:text-ink-dark/60">It may have been removed or set to private.</p>
        <Button className="mt-6" onClick={() => navigate('/')} icon={ArrowLeft}>Go home</Button>
      </div>
    );
  }

  const c = campaign.data;
  const cause = celebrationCauseById(c.cause);
  const CauseIcon = CAUSE_ICONS[c.cause] || Heart;
  const theme = CELEBRATION_THEMES.find((t) => t.value === c.theme) || CELEBRATION_THEMES[0];
  const pct = c.goalAmount ? Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100)) : 0;
  const accepting = c.status === 'active';

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => toast.success('Campaign link copied'), () => toast.error('Could not copy'));
  };

  const handleDonateSuccess = () => {
    setDonateOpen(false);
    toast.success('Thank you for your gift!');
    qc.invalidateQueries({ queryKey: ['celebrations'] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 to-transparent dark:from-teal-950/30">
      {/* Hero */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
        <div className="container-app relative py-14 sm:py-20">
          <Link to={PATHS.CELEBRATE.INDEX} className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Celebrate & Give
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold text-white">
                <CauseIcon className="w-3.5 h-3.5" /> {cause?.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold text-white">
                <PartyPopper className="w-3.5 h-3.5" /> {celebrationOccasionLabel(c.eventType)}
              </span>
              {c.status !== 'active' && (
                <span className="rounded-full bg-black/25 backdrop-blur px-3 py-1 text-xs font-semibold text-white">
                  {CELEBRATION_STATUS_LABELS[c.status]}
                </span>
              )}
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-3xl sm:text-5xl font-display font-extrabold text-white"
            >
              {c.eventTitle}
            </motion.h1>
            <p className="mt-3 text-sm text-white/90">
              Started by <span className="font-semibold">{c.ownerName}</span> for{' '}
              <span className="font-semibold">{c.ngoName}</span>
              {c.eventDate && <> · <CalendarDays className="inline w-3.5 h-3.5 -mt-0.5" /> {formatDate(c.eventDate, 'dd MMM yyyy')}</>}
            </p>

            <div className="mt-8 rounded-2xl bg-white/95 dark:bg-surface-card/95 p-5 sm:p-6 shadow-card-hover">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-3xl font-bold text-teal-700 dark:text-teal-300">₹{formatNumber(c.raisedAmount)}</p>
                  <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">raised of ₹{formatNumber(c.goalAmount)} goal · {c.donationCount} gift{c.donationCount === 1 ? '' : 's'}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" icon={Share2} onClick={copyLink}>Share</Button>
                  {accepting ? (
                    <Button onClick={() => setDonateOpen(true)} icon={Heart} className="shadow-[0_6px_20px_rgba(244,63,94,0.4)]">
                      Give a gift
                    </Button>
                  ) : (
                    <Button disabled>Donations paused</Button>
                  )}
                </div>
              </div>
              <div className="mt-5 h-3 rounded-full bg-teal-100 dark:bg-teal-900/60 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                />
              </div>
              <p className="mt-2 text-right text-xs font-medium text-teal-700 dark:text-teal-300">{pct}% funded</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-12 grid lg:grid-cols-3 gap-8">
        {/* Story + impact updates */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl">About this campaign</h2>
            <p className="mt-3 text-ink-light/70 dark:text-ink-dark/70 leading-relaxed whitespace-pre-line">
              {c.description || `No story yet — but ${c.ownerName} is celebrating with purpose, directing ${cause?.description?.toLowerCase() || 'support'} to ${c.ngoName}.`}
            </p>
          </Card>

          <div>
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Impact updates
            </h3>
            {c.impactUpdates?.length ? (
              <div className="mt-4 space-y-4">
                {c.impactUpdates.slice().reverse().map((u) => (
                  <Card key={u.id} className="p-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.authorName || u.authorRole || 'Owner'} color={u.avatarColor} />
                      <div>
                        <p className="text-sm font-semibold">{u.authorName || 'Organiser'}</p>
                        <p className="text-xs text-ink-light/50 dark:text-ink-dark/50">{timeAgo(u.createdAt)}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-ink-light/70 dark:text-ink-dark/70">{u.message}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-light/50 dark:text-ink-dark/50">No updates yet — the organisers will share progress here.</p>
            )}
          </div>
        </div>

        {/* Donor list */}
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Recent contributors
            </h3>
            {impact.data?.totalDonors > 0 && (
              <p className="mt-1 text-xs text-ink-light/55 dark:text-ink-dark/55">
                {impact.data.totalDonors} donor{impact.data.totalDonors === 1 ? '' : 's'} · avg ₹{formatNumber(impact.data.averageDonation)}
              </p>
            )}
            <div className="mt-4 space-y-3">
              {impact.data?.recentDonations?.length ? (
                impact.data.recentDonations.map((d, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={d.donorName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{d.donorName}</p>
                        <p className="text-xs text-ink-light/50 dark:text-ink-dark/50">{timeAgo(d.createdAt)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">₹{formatNumber(d.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-light/50 dark:text-ink-dark/50">Be the first to contribute!</p>
              )}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
              <div>
                <p className="font-display font-bold">Where the money goes</p>
                <p className="mt-1 text-sm text-ink-light/60 dark:text-ink-dark/60">
                  Gifts are directed to <span className="font-medium text-teal-700 dark:text-teal-300">{c.ngoName}</span> ({cause?.label}) — an admin-verified organisation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} campaign={c} onSuccess={handleDonateSuccess} />
    </div>
  );
}