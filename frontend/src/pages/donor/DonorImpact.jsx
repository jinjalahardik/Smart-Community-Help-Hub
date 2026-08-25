import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/Card';
import ChartCard from '../../components/charts/ChartCard';
import { Award, Users, HandHeart, Repeat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../hooks/useDonations';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';

const COLORS = ['#0F766E', '#F59E0B', '#FB7185', '#4FB8A6'];

export default function DonorImpact() {
  const { user } = useAuth();
  const { data: donations = [] } = useDonations({ donorId: user.id });
  const completed = donations.filter((d) => d.status === 'completed');
  const peopleHelped = completed.reduce((sum, d) => sum + (d.peopleServed || d.unitsAvailable || 1), 0);

  const categoryData = Object.entries(DONATION_CATEGORY_LABELS).map(([key, label]) => ({
    name: label,
    value: donations.filter((d) => d.category === key).length,
  })).filter((c) => c.value > 0);

  const monthlyData = [
    { month: 'Feb', donations: 1 }, { month: 'Mar', donations: 2 }, { month: 'Apr', donations: 1 },
    { month: 'May', donations: 3 }, { month: 'Jun', donations: 2 }, { month: 'Jul', donations: donations.length },
  ];

  return (
    <div>
      <PageHeader title="Impact History" description="See the difference your donations have made" breadcrumb={[{ label: 'Dashboard', href: '/donor/dashboard' }, { label: 'Impact History' }]} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Donations" value={donations.length} icon={HandHeart} accent="teal" />
        <StatCard label="People Helped" value={peopleHelped} icon={Users} accent="coral" />
        <StatCard label="Completed" value={completed.length} icon={Award} accent="amber" />
        <StatCard label="Repeat Months Active" value={6} icon={Repeat} accent="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Donations Over Time">
          <ResponsiveContainer>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #D8F3EE', fontSize: 13 }} />
              <Bar dataKey="donations" fill="#0F766E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Donations by Category">
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-ink-light/65">No donations yet</div>
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #D8F3EE', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
