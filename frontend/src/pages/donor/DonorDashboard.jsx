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
  if (status === 'cancelled') return <span className="text-xs text-rose-500 font-bold">Cancelled</span>;
  const current = STAGE_INDEX[status] ?? 0;
  return (
    <div className="flex items-center gap-1.5" aria-label={`Donation stage: ${MINI_STAGES[current]}`}>
      {MINI_STAGES.map((label, i) => (
        <span key={label} className="flex items-center gap-1">
          <span
            title={label}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              i <= current ? 'bg-teal-500 shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'bg-teal-100 dark:bg-teal-900/60'
            )}
          />
          {i < MINI_STAGES.length - 1 && (
            <span className={cn('w-2.5 h-0.5 rounded-full', i < current ? 'bg-teal-500' : 'bg-teal-100 dark:bg-teal-900/60')} />
          )}
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
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        description="Monitor your donations, community impact metrics, and volunteer delivery schedules."
        actions={
          <Link to={PATHS.DONOR.CREATE}>
            <Button icon={PackagePlus} className="shadow-[0_0_20px_rgba(45,212,191,0.35)]">
              New Donation
            </Button>
          </Link>
        }
      />

      {/* KPI Stats Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Donations" value={donations.length} icon={HandHeart} accent="teal" trend={donations.length > 0 ? 15 : undefined} trendLabel="from last month" />
        <StatCard label="Active Giving" value={active.length} icon={Package} accent="amber" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} accent="cyan" />
        <StatCard label="People Reached" value={peopleHelped} icon={Users} accent="coral" trend={peopleHelped > 0 ? 22 : undefined} trendLabel="from last month" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Donation Impact" subtitle="Verified people helped across months" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={IMPACT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.12} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#829A94' }} stroke="#0F766E" strokeOpacity={0.2} />
              <YAxis tick={{ fontSize: 12, fill: '#829A94' }} stroke="#0F766E" strokeOpacity={0.2} />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  backgroundColor: 'rgba(8, 26, 23, 0.95)',
                  color: '#F8FAFC',
                  fontSize: 13,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                }}
              />
              <Line
                type="monotone"
                dataKey="people"
                stroke="#14B8A6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#14B8A6', strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 7, fill: '#2DD4BF', stroke: '#0F766E' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Notifications Widget */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <p className="font-display font-bold text-base text-ink-light dark:text-ink-dark mb-3">Live Updates</p>
            <div className="divide-y divide-teal-100/80 dark:divide-teal-900/50 -mx-6">
              {notifications.slice(0, 4).map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
              {notifications.length === 0 && <EmptyState title="No notifications yet" className="py-8" />}
            </div>
          </div>
          <Link to={PATHS.NOTIFICATIONS} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline pt-3 text-center inline-block">
            View all notifications →
          </Link>
        </Card>
      </div>

      {/* Secondary Row: Recent Donations & Milestones */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <p className="font-display font-bold text-base text-ink-light dark:text-ink-dark">Recent Donations</p>
            <Link to={PATHS.DONOR.DONATIONS} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {donations.length === 0 ? (
            <EmptyState
              title="No donations yet"
              description="Start your first donation to help someone in need in your community."
              action={
                <Link to={PATHS.DONOR.CREATE}>
                  <Button size="sm">Create Donation</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {donations.slice(0, 5).map((d) => (
                <Link
                  key={d.id}
                  to={PATHS.DONOR.DETAILS(d.id)}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-teal-100/60 dark:border-teal-900/40 hover:bg-teal-50/60 dark:hover:bg-teal-900/20 transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink-light dark:text-ink-dark truncate">{d.title}</p>
                    <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-0.5">
                      {DONATION_CATEGORY_LABELS[d.category] || 'General'} • {formatDate(d.createdAt)}
                    </p>
                  </div>
                  <MiniStepper status={d.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="font-display font-bold text-sm text-ink-light dark:text-ink-dark mb-4 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Upcoming Pickups
            </p>
            {upcomingPickups.length === 0 ? (
              <EmptyState title="No upcoming pickups" className="py-4" />
            ) : (
              <div className="space-y-3">
                {upcomingPickups.slice(0, 3).map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-900/20 text-sm">
                    <p className="font-bold text-ink-light dark:text-ink-dark truncate">{d.title}</p>
                    <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-0.5">
                      {formatDate(d.preferredPickupDate, 'dd MMM, hh:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <p className="font-display font-bold text-sm text-ink-light dark:text-ink-dark mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Giving Milestones
            </p>
            <div className="grid grid-cols-2 gap-3">
              {MILESTONES.map((m) => {
                const reached = m.byPeople ? peopleHelped >= m.threshold : donations.length >= m.threshold;
                return (
                  <div
                    key={m.label}
                    className={cn(
                      'text-center p-3 rounded-2xl border transition-all duration-200',
                      reached
                        ? 'bg-amber-500/10 border-amber-300/40 dark:border-amber-500/30'
                        : 'bg-teal-50/30 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30 opacity-40'
                    )}
                  >
                    <m.icon className="w-5 h-5 mx-auto text-amber-500" />
                    <p className="text-xs font-bold text-ink-light dark:text-ink-dark mt-1.5">{m.label}</p>
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
