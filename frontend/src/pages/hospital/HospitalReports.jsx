import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/Card';
import ChartCard from '../../components/charts/ChartCard';
import ExportButtons from '../../components/shared/ExportButtons';
import { Droplet, Pill, FileWarning, HandHeart } from 'lucide-react';

const BLOOD_GROUP_DATA = [
  { group: 'O+', units: 12 }, { group: 'O-', units: 3 }, { group: 'A+', units: 8 },
  { group: 'A-', units: 4 }, { group: 'B+', units: 6 }, { group: 'AB+', units: 5 },
];

export default function HospitalReports() {
  return (
    <div>
      <PageHeader title="Reports & Analytics" description="Blood and medicine supply trends for your hospital" actions={<ExportButtons filename="hospital-report" />} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Blood Units Available" value="38" icon={Droplet} accent="coral" />
        <StatCard label="Medicine Items" value="12" icon={Pill} accent="teal" />
        <StatCard label="Active Requirements" value="4" icon={FileWarning} accent="amber" />
        <StatCard label="Donations Received" value="61" icon={HandHeart} accent="teal" />
      </div>

      <ChartCard title="Blood Group Availability" subtitle="Current units by blood group">
        <ResponsiveContainer>
          <BarChart data={BLOOD_GROUP_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
            <XAxis dataKey="group" tick={{ fontSize: 12 }} stroke="#0F766E" />
            <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
            <Bar dataKey="units" fill="#FB7185" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
