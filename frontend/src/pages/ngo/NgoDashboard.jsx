import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HeartHandshake, Siren, Boxes, Users, ArrowRight, AlertTriangle, UserCheck, Truck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard, Card } from '../../components/ui/Card';
import { PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ChartCard from '../../components/charts/ChartCard';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useDonations, useAcceptDonation } from '../../hooks/useDonations';
import { useRequests } from '../../hooks/useRequests';
import { useInventory } from '../../hooks/useInventory';
import { useTasks } from '../../hooks/useTasks';
import { PATHS } from '../../routes/paths';
import { formatDate, timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';

const MONTHLY_IMPACT = [
  { month: 'Feb', deliveries: 22 }, { month: 'Mar', deliveries: 31 }, { month: 'Apr', deliveries: 28 },
  { month: 'May', deliveries: 40 }, { month: 'Jun', deliveries: 52 }, { month: 'Jul', deliveries: 46 },
];

export default function NgoDashboard() {
  const { user } = useAuth();
  const orgId = user.orgId;
  const { data: donations = [] } = useDonations({ status: 'pending' });
  const { data: requests = [] } = useRequests({ status: 'pending' });
  const { data: inventory = [] } = useInventory({ ownerId: orgId, ownerType: 'ngo' });
  const { data: tasks = [] } = useTasks({ ngoId: orgId });
  const acceptMutation = useAcceptDonation();

  const lowStock = inventory.filter((i) => i.quantity <= i.lowStockThreshold);
  const expiring = inventory.filter((i) => i.expiryDate && new Date(i.expiryDate) - Date.now() < 7 * 86400000);
  const pendingTasks = tasks.filter((t) => t.status === 'available');
  const assignedTasks = tasks.filter((t) => t.assignedVolunteerId);
  const completedTasks = tasks.filter((t) => t.status === 'completed').slice(0, 4);

  return (
    <div>
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}`} description="Here's what's happening at your organization today" />

      {(lowStock.length > 0 || expiring.length > 0) && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 mb-6 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {lowStock.length} item{lowStock.length !== 1 ? 's' : ''} low on stock, {expiring.length} expiring within 7 days.
          <Link to={PATHS.NGO.INVENTORY} className="ml-auto font-medium hover:underline shrink-0">Review inventory</Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Available Donations" value={donations.length} icon={HeartHandshake} accent="teal" />
        <StatCard label="Active Emergency Requests" value={requests.length} icon={Siren} accent="coral" />
        <StatCard label="Inventory Items" value={inventory.length} icon={Boxes} accent="amber" />
        <StatCard label="Pending Tasks" value={pendingTasks.length} icon={Users} accent="teal" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Monthly Impact" subtitle="Deliveries completed over the last 6 months" className="lg:col-span-2">
          <ResponsiveContainer>
            <BarChart data={MONTHLY_IMPACT}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E" strokeOpacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#0F766E" />
              <YAxis tick={{ fontSize: 12 }} stroke="#0F766E" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #D8F3EE', fontSize: 13 }} />
              <Bar dataKey="deliveries" fill="#0F766E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-5">
          <p className="font-display font-semibold mb-3 flex items-center gap-2"><Boxes className="w-4 h-4 text-teal-600" /> Inventory Health</p>
          {lowStock.length === 0 ? (
            <EmptyState title="Stock levels healthy" className="py-6" />
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 4).map((i) => {
                const pct = Math.min(100, Math.round((i.quantity / (i.lowStockThreshold * 2)) * 100));
                return (
                  <div key={i.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium truncate">{i.itemName}</span>
                      <span className="text-amber-600">{i.quantity} {i.unit}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-teal-100 dark:bg-teal-900/60 overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-500', pct < 40 ? 'bg-coral-500' : 'bg-amber-500')} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold">Incoming Donations</p>
            <Link to={PATHS.NGO.DONATIONS} className="text-sm text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {donations.length === 0 ? <EmptyState title="No pending donations" className="py-6" /> : (
            <div className="space-y-2.5">
              {donations.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.title}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{d.donorName} • {formatDate(d.createdAt)}</p>
                  </div>
                  <Button size="sm" onClick={() => acceptMutation.mutate({ id: d.id, ngoId: orgId })} loading={acceptMutation.isPending}>Accept</Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <p className="font-display font-semibold mb-3 flex items-center gap-2"><UserCheck className="w-4 h-4 text-teal-600" /> Volunteer Assignment</p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/30">
              <p className="text-xl font-display font-bold text-teal-700 dark:text-teal-300">{assignedTasks.length}</p>
              <p className="text-[11px] text-ink-light/65 mt-0.5">Assigned</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <p className="text-xl font-display font-bold text-amber-700 dark:text-amber-300">{pendingTasks.length}</p>
              <p className="text-[11px] text-ink-light/65 mt-0.5">Unassigned</p>
            </div>
          </div>
          <Link to={PATHS.NGO.TASKS} className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-3">Manage tasks <ArrowRight className="w-3.5 h-3.5" /></Link>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold">Active Emergency Requests</p>
            <Link to={PATHS.NGO.REQUESTS} className="text-sm text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {requests.length === 0 ? <EmptyState title="No pending requests" className="py-6" /> : (
            <div className="space-y-2.5">
              {requests.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{r.requesterName} • {formatDate(r.createdAt)}</p>
                  </div>
                  <PriorityBadge level={r.urgency} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <p className="font-display font-semibold mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-teal-600" /> Distribution Activity</p>
          {completedTasks.length === 0 ? (
            <EmptyState title="No distributions yet" className="py-6" />
          ) : (
            <ol className="relative">
              {completedTasks.map((t, i) => (
                <li key={t.id} className="relative pl-7 pb-4 last:pb-0">
                  {i < completedTasks.length - 1 && <span className="absolute left-[7px] top-4 w-px h-[calc(100%-0.5rem)] bg-teal-100 dark:bg-teal-900/60" aria-hidden="true" />}
                  <span className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-teal-600 ring-4 ring-teal-50 dark:ring-teal-900/40" aria-hidden="true" />
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-ink-light/45">{timeAgo(t.createdAt)}</p>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}
