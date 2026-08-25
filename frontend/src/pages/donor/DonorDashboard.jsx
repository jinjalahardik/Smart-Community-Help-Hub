import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HandHeart, Package, CheckCircle2, Users, PackagePlus, ArrowRight, CalendarClock, Trophy } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard, Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ChartCard from '../../components/charts/ChartCard';
import EmptyState from '../../components/ui/EmptyState';
import NotificationItem from '../../components/shared/NotificationItem';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../hooks/useDonations';
import { useNotifications } from '../../hooks/useNotifications';
import { PATHS } from '../../routes/paths';
import { formatDate } from '../../utils/format';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { cn } from '../../utils/cn';

const IMPACT_DATA = [
  { month: 'Feb', people: 12 }, { month: 'Mar', people: 18 }, { month: 'Apr', people: 15 },
  { month: 'May', people: 24 }, { month: 'Jun', people: 30 }, { month: 'Jul', people: 40 },
];

const MINI_STAGES = ['Pending', 'Accepted', 'In Transit', 'Completed'];
const STAGE_INDEX = {
  pending: 0,
  accepted: 1, assigned: 1,
  in_transit: 2,
  delivered: 3, completed: 3,
};

const MILESTONES = [
  { icon: HandHeart, label: 'First Donation', threshold: 1 },
  { icon: Package, label: '5 Donations', threshold: 5 },
  { icon: Users, label: '25 People Helped', threshold: 25, byPeople: true },
  { icon: Trophy, label: 'Community Champion', threshold: 10 },
];

function MiniStepper({ status }) {
  if (status === 'cancelled') return <span className="text-xs text-coral-500 font-medium">Cancelled</span>;
  const current = STAGE_INDEX[status] ?? 0;
  return (
    <div className="flex items-center gap-1" aria-label={`Donation stage: ${MINI_STAGES[current]}`}>
      {MINI_STAGES.map((label, i) => (
        <span key={label} className="flex items-center gap-1">
          <span title={label} className={cn('w-2 h-2 rounded-full transition-colors', i <= current ? 'bg-teal-600' : 'bg-teal-100 dark:bg-teal-900/60')} />
          {i < MINI_STAGES.length - 1 && <span className={cn('w-3 h-px', i < current ? 'bg-teal-600' : 'bg-teal-100 dark:bg-teal-900/60')} />}
        </span>
      ))}
    </div>
  );
}

export default function DonorDashboard() {
  const { user } = useAuth();
  const { data: donations = [] } = useDonations({ donorId: user.id });
  const { data: notifications = [] } = useNotifications(user.id);

  const active = donations.filter((d) => !['completed', 'cancelled'].includes(d.status));
  const completed = donations.filter((d) => d.status === 'completed');
  const peopleHelped = completed.reduce((sum, d) => sum + (d.peopleServed || d.unitsAvailable || 1), 0);
  const upcomingPickups = donations
    .filter((d) => ['pending', 'accepted'].includes(d.status) && d.preferredPickupDate && new Date(d.preferredPickupDate) > new Date())
    .sort((a, b) => new Date(a.preferredPickupDate) - new Date(b.preferredPickupDate));

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        description="Here's an overview of your donation activity"
        actions={<Link to={PATHS.DONOR.CREATE}><Button icon={PackagePlus}>New Donation</Button></Link>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Donations" value={donations.length} icon={HandHeart} accent="teal" trend={donations.length > 0 ? 15 : undefined} trendLabel="from last month" />
        <StatCard label="Active Donations" value={active.length} icon={Package} accent="amber" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} accent="teal" />
        <StatCard label="People Helped" value={peopleHelped} icon={Users} accent="coral" trend={peopleHelped > 0 ? 22 : undefined} trendLabel="from last month" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Donation Impact" subtitle="People helped over the last 6 months" className="lg:col-span-2">
          <ResponsiveContainer>
            <LineChart data={IMPACT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #D8F3EE', fontSize: 13 }} />
              <Line type="monotone" dataKey="people" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-5">
          <p className="font-display font-semibold mb-3">Recent Notifications</p>
          <div className="divide-y divide-teal-100 dark:divide-teal-900/50 -mx-5">
            {notifications.slice(0, 4).map((n) => <NotificationItem key={n.id} notification={n} />)}
            {notifications.length === 0 && <EmptyState title="No notifications yet" className="py-6" />}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold">Recent Donations</p>
            <Link to={PATHS.DONOR.DONATIONS} className="text-sm text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {donations.length === 0 ? (
            <EmptyState title="No donations yet" description="Start your first donation to help someone in need." action={<Link to={PATHS.DONOR.CREATE}><Button size="sm">Create Donation</Button></Link>} />
          ) : (
            <div className="space-y-2.5">
              {donations.slice(0, 5).map((d) => (
                <Link key={d.id} to={PATHS.DONOR.DETAILS(d.id)} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{DONATION_CATEGORY_LABELS[d.category]} • {formatDate(d.createdAt)}</p>
                  </div>
                  <MiniStepper status={d.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="font-display font-semibold mb-3 flex items-center gap-2"><CalendarClock className="w-4 h-4 text-teal-600" /> Upcoming Pickups</p>
            {upcomingPickups.length === 0 ? (
              <EmptyState title="No upcoming pickups" className="py-4" />
            ) : (
              <div className="space-y-2.5">
                {upcomingPickups.slice(0, 3).map((d) => (
                  <div key={d.id} className="text-sm">
                    <p className="font-medium truncate">{d.title}</p>
                    <p className="text-xs text-ink-light/65">{formatDate(d.preferredPickupDate, 'dd MMM, hh:mm a')}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <p className="font-display font-semibold mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Impact Milestones</p>
            <div className="grid grid-cols-2 gap-2.5">
              {MILESTONES.map((m) => {
                const reached = m.byPeople ? peopleHelped >= m.threshold : donations.length >= m.threshold;
                return (
                  <div key={m.label} className={cn('text-center p-2.5 rounded-xl', reached ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-teal-50/50 dark:bg-teal-900/20 opacity-40')}>
                    <m.icon className="w-4 h-4 mx-auto text-amber-500" />
                    <p className="text-[10px] font-medium mt-1">{m.label}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
