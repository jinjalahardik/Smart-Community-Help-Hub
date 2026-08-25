import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Droplet, Pill, FileWarning, ArrowRight, AlertTriangle, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard, Card } from '../../components/ui/Card';
import ChartCard from '../../components/charts/ChartCard';
import EmptyState from '../../components/ui/EmptyState';
import { PriorityBadge, StatusBadge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../hooks/useInventory';
import { useRequirements } from '../../hooks/useHospital';
import { PATHS } from '../../routes/paths';
import { formatDate } from '../../utils/format';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const orgId = user.orgId;
  const { data: inventory = [] } = useInventory({ ownerId: orgId, ownerType: 'hospital' });
  const { data: requirements = [] } = useRequirements(orgId, { status: 'active' });

  const bloodStock = inventory.filter((i) => i.category === 'blood');
  const medicineStock = inventory.filter((i) => i.category === 'medicine');
  const criticalShortages = inventory.filter((i) => i.quantity <= i.lowStockThreshold);
  const expiringMedicine = medicineStock.filter((i) => i.expiryDate && new Date(i.expiryDate) - Date.now() < 14 * 86400000);

  const bloodByGroup = bloodStock.map((i) => ({
    group: i.itemName.replace(' Blood', ''),
    units: i.quantity,
    low: i.quantity <= i.lowStockThreshold,
  }));

  return (
    <div>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} description="Blood bank and medicine inventory overview" />

      {(criticalShortages.length > 0 || expiringMedicine.length > 0) && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800 px-4 py-3 mb-6 text-sm text-coral-700 dark:text-coral-300">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse-soft" />
          {criticalShortages.length} critical shortage{criticalShortages.length !== 1 ? 's' : ''}, {expiringMedicine.length} medicine item{expiringMedicine.length !== 1 ? 's' : ''} expiring soon.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Blood Inventory" value={bloodStock.reduce((s, i) => s + i.quantity, 0)} icon={Droplet} accent="coral" />
        <StatCard label="Medicine Stock Items" value={medicineStock.length} icon={Pill} accent="teal" />
        <StatCard label="Active Requirements" value={requirements.length} icon={FileWarning} accent="amber" />
        <StatCard label="Critical Shortages" value={criticalShortages.length} icon={AlertTriangle} accent="coral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Blood Inventory by Group" subtitle="Current units available per blood group" className="lg:col-span-2">
          <ResponsiveContainer>
            <BarChart data={bloodByGroup}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="group" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Bar dataKey="units" radius={[6, 6, 0, 0]}>
                {bloodByGroup.map((entry, i) => <Cell key={i} fill={entry.low ? '#F43F5E' : '#0F766E'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-5">
          <p className="font-display font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Shortages</p>
          {criticalShortages.length === 0 ? (
            <EmptyState title="No shortages" description="All stock levels are healthy." className="py-6" />
          ) : (
            <div className="space-y-2.5">
              {criticalShortages.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-coral-50 dark:bg-coral-900/20">
                  <span>{i.itemName}</span>
                  <span className="text-xs text-coral-700 dark:text-coral-300 font-medium">{i.quantity} {i.unit} left</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-5">
          <p className="font-display font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Medicine Expiry Warnings</p>
          {expiringMedicine.length === 0 ? (
            <EmptyState title="No medicines expiring soon" className="py-6" />
          ) : (
            <div className="space-y-2.5">
              {expiringMedicine.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <span>{i.itemName}</span>
                  <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">Expires {formatDate(i.expiryDate)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold">Active Requirements</p>
            <Link to={PATHS.HOSPITAL.REQUIREMENTS} className="text-sm text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {requirements.length === 0 ? <EmptyState title="No active requirements" className="py-6" /> : (
            <div className="space-y-2.5">
              {requirements.slice(0, 4).map((r) => (
                <div key={r.id} className="p-3 rounded-xl border border-teal-100 dark:border-teal-900/50">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <PriorityBadge level={r.urgency} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{formatDate(r.createdAt)}</p>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
