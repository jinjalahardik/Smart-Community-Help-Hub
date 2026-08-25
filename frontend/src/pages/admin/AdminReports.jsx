import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/Card';
import ChartCard from '../../components/charts/ChartCard';
import ExportButtons from '../../components/shared/ExportButtons';
import Select from '../../components/ui/Select';
import { Users, HeartHandshake, Siren, Building2 } from 'lucide-react';
import { useAdminAnalytics } from '../../hooks/useAdmin';

const USER_GROWTH = [
  { month: 'Feb', users: 4200 }, { month: 'Mar', users: 4800 }, { month: 'Apr', users: 5400 },
  { month: 'May', users: 6300 }, { month: 'Jun', users: 7400 }, { month: 'Jul', users: 8500 },
];
const CATEGORY_VOLUME = [
  { category: 'Food', count: 340 }, { category: 'Clothes', count: 210 }, { category: 'Medicine', count: 175 }, { category: 'Blood', count: 128 },
];

export default function AdminReports() {
  const [range, setRange] = useState('30d');
  const { data: stats } = useAdminAnalytics();

  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Platform-wide performance metrics" actions={<ExportButtons filename="admin-report" />} />
      <FilterBar className="mb-5">
        <Select value={range} onChange={(e) => setRange(e.target.value)} options={[{ value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' }, { value: '90d', label: 'Last 90 days' }]} containerClassName="sm:w-56" />
      </FilterBar>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={stats?.totalUsers ?? '—'} icon={Users} accent="teal" trend={14} trendLabel="growth" />
        <StatCard label="Total Donations" value={stats?.totalDonations ?? '—'} icon={HeartHandshake} accent="amber" trend={9} trendLabel="growth" />
        <StatCard label="Fulfilled Requests" value={stats?.completedDeliveries ?? '—'} icon={Siren} accent="coral" trend={11} trendLabel="growth" />
        <StatCard label="Verified Organizations" value="450+" icon={Building2} accent="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="User Growth" subtitle="Total registered users over time">
          <ResponsiveContainer>
            <AreaChart data={USER_GROWTH}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F766E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0F766E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Area type="monotone" dataKey="users" stroke="#0F766E" strokeWidth={2.5} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Donation Volume by Category" subtitle="Total donations this period">
          <ResponsiveContainer>
            <BarChart data={CATEGORY_VOLUME}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
