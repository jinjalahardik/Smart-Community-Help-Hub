import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/Card';
import ChartCard from '../../components/charts/ChartCard';
import ExportButtons from '../../components/shared/ExportButtons';
import Select from '../../components/ui/Select';
import { HeartHandshake, Siren, Users, Boxes } from 'lucide-react';

const CATEGORY_SPLIT = [
  { name: 'Food', value: 42 }, { name: 'Clothes', value: 26 }, { name: 'Medicine', value: 18 }, { name: 'Blood', value: 14 },
];
const COLORS = ['#0F766E', '#F59E0B', '#FB7185', '#4FB8A6'];
const TREND = [
  { month: 'Feb', value: 20 }, { month: 'Mar', value: 28 }, { month: 'Apr', value: 24 },
  { month: 'May', value: 35 }, { month: 'Jun', value: 44 }, { month: 'Jul', value: 39 },
];

export default function NgoReports() {
  const [range, setRange] = useState('30d');
  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Track your organization's impact over time" actions={<ExportButtons filename="ngo-report" />} />
      <FilterBar className="mb-5">
        <Select value={range} onChange={(e) => setRange(e.target.value)} options={[{ value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' }, { value: '90d', label: 'Last 90 days' }]} containerClassName="sm:w-56" />
      </FilterBar>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Donations Handled" value="186" icon={HeartHandshake} accent="teal" trend={12} trendLabel="vs last period" />
        <StatCard label="Requests Fulfilled" value="94" icon={Siren} accent="coral" trend={8} trendLabel="vs last period" />
        <StatCard label="Active Volunteers" value="23" icon={Users} accent="amber" trend={-3} trendLabel="vs last period" />
        <StatCard label="Inventory Items" value="9" icon={Boxes} accent="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Donation Category Split" subtitle="By volume this period">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={CATEGORY_SPLIT} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {CATEGORY_SPLIT.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Impact Trend" subtitle="Deliveries over time">
          <ResponsiveContainer>
            <LineChart data={TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Line type="monotone" dataKey="value" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
