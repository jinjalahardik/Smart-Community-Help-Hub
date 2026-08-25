import { Link } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  Users, HeartHandshake, Siren, PackageCheck, ShieldCheck, Building2, ArrowRight,
  Megaphone, BarChart3, UserCog, FileClock,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard, Card } from '../../components/ui/Card';
import ChartCard from '../../components/charts/ChartCard';
import { Badge } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { useAdminAnalytics, useAdminNgos, useAdminHospitals, useAuditLogs } from '../../hooks/useAdmin';
import { PATHS } from '../../routes/paths';
import { timeAgo } from '../../utils/format';

const DONATION_TREND = [
  { month: 'Feb', value: 180 }, { month: 'Mar', value: 220 }, { month: 'Apr', value: 205 },
  { month: 'May', value: 260 }, { month: 'Jun', value: 310 }, { month: 'Jul', value: 295 },
];
const CATEGORY_SPLIT = [
  { name: 'Food', value: 38 }, { name: 'Clothes', value: 24 }, { name: 'Medicine', value: 20 }, { name: 'Blood', value: 18 },
];
const COLORS = ['#0F766E', '#F59E0B', '#FB7185', '#4FB8A6'];

const QUICK_ACTIONS = [
  { label: 'Approve NGOs', icon: ShieldCheck, to: PATHS.ADMIN.NGOS },
  { label: 'Manage Users', icon: UserCog, to: PATHS.ADMIN.USERS },
  { label: 'Broadcast', icon: Megaphone, to: PATHS.ADMIN.NOTIFICATIONS },
  { label: 'View Reports', icon: BarChart3, to: PATHS.ADMIN.REPORTS },
  { label: 'Audit Logs', icon: FileClock, to: PATHS.ADMIN.AUDIT_LOGS },
];

export default function AdminDashboard() {
  const { data: stats } = useAdminAnalytics();
  const { data: pendingNgos = [] } = useAdminNgos({ status: 'pending' });
  const { data: pendingHospitals = [] } = useAdminHospitals({ status: 'pending' });
  const { data: logs = [] } = useAuditLogs();

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform-wide overview and activity" />

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.label} to={a.to} className="inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl bg-white dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 hover:border-teal-400 hover:shadow-card transition-all">
            <a.icon className="w-4 h-4 text-teal-600" /> {a.label}
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={stats?.totalUsers ?? '—'} icon={Users} accent="teal" trend={6} trendLabel="from last month" />
        <StatCard label="Total Donations" value={stats?.totalDonations ?? '—'} icon={HeartHandshake} accent="amber" trend={12} trendLabel="from last month" />
        <StatCard label="Active Emergency Requests" value={stats?.activeRequests ?? '—'} icon={Siren} accent="coral" />
        <StatCard label="Completed Deliveries" value={stats?.completedDeliveries ?? '—'} icon={PackageCheck} accent="teal" trend={9} trendLabel="from last month" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Donation Trends" subtitle="Platform-wide donations over 6 months" className="lg:col-span-2">
          <ResponsiveContainer>
            <LineChart data={DONATION_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Line type="monotone" dataKey="value" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Request Categories" subtitle="Distribution by type">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={CATEGORY_SPLIT} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {CATEGORY_SPLIT.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-600" /> Pending NGO Approvals</p>
            <span className="text-2xl font-display font-bold text-teal-600">{pendingNgos.length}</span>
          </div>
          {pendingNgos.length === 0 ? <EmptyState title="All caught up" className="py-6" /> : (
            <div className="space-y-2">
              {pendingNgos.slice(0, 4).map((n) => (
                <div key={n.id} className="flex items-center justify-between text-sm p-2.5 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                  <span className="truncate">{n.name}</span><Badge tone="amber">Pending</Badge>
                </div>
              ))}
            </div>
          )}
          <Link to={PATHS.ADMIN.NGOS} className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-3">Review all <ArrowRight className="w-3.5 h-3.5" /></Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-teal-600" /> Pending Hospital Approvals</p>
            <span className="text-2xl font-display font-bold text-teal-600">{pendingHospitals.length}</span>
          </div>
          {pendingHospitals.length === 0 ? <EmptyState title="All caught up" className="py-6" /> : (
            <div className="space-y-2">
              {pendingHospitals.slice(0, 4).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-sm p-2.5 rounded-lg hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                  <span className="truncate">{h.name}</span><Badge tone="amber">Pending</Badge>
                </div>
              ))}
            </div>
          )}
          <Link to={PATHS.ADMIN.HOSPITALS} className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-3">Review all <ArrowRight className="w-3.5 h-3.5" /></Link>
        </Card>

        <Card className="p-5">
          <p className="font-display font-semibold mb-4">Recent Platform Activity</p>
          {logs.length === 0 ? <EmptyState title="No activity yet" className="py-6" /> : (
            <ol className="relative">
              {logs.slice(0, 4).map((l, i) => (
                <li key={l.id} className="relative pl-7 pb-5 last:pb-0">
                  {i < Math.min(logs.length, 4) - 1 && (
                    <span className="absolute left-[7px] top-4 w-px h-[calc(100%-0.5rem)] bg-teal-100 dark:bg-teal-900/60" aria-hidden="true" />
                  )}
                  <span className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-teal-600 ring-4 ring-teal-50 dark:ring-teal-900/40" aria-hidden="true" />
                  <p className="text-sm"><span className="font-medium">{l.actorName}</span> {l.action.toLowerCase()}</p>
                  <p className="text-xs text-ink-light/45">{l.target} • {timeAgo(l.createdAt)}</p>
                </li>
              ))}
            </ol>
          )}
          <Link to={PATHS.ADMIN.AUDIT_LOGS} className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-1">Full audit log <ArrowRight className="w-3.5 h-3.5" /></Link>
        </Card>
      </div>
    </div>
  );
}
