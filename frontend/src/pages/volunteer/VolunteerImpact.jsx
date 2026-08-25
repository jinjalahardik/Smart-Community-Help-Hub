import { Award, Clock, Users, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard, Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { PATHS } from '../../routes/paths';

const BADGES = [
  { name: 'First Task', desc: 'Completed your first task', threshold: 1 },
  { name: '5 Deliveries', desc: 'Completed 5 tasks', threshold: 5 },
  { name: '10 Deliveries', desc: 'Completed 10 tasks', threshold: 10 },
  { name: 'Community Hero', desc: 'Completed 20 tasks', threshold: 20 },
  { name: 'Weekend Warrior', desc: 'Active on 5+ weekends', threshold: 3 },
  { name: 'Fast Responder', desc: 'Accepted 3 critical tasks', threshold: 2 },
];

export default function VolunteerImpact() {
  const { user } = useAuth();
  const { data: tasks = [] } = useTasks({ volunteerId: user.id });
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const impactHours = completed * 2;
  const peopleHelped = completed * 6;

  return (
    <div>
      <PageHeader title="Impact & Badges" description="Track how your volunteering adds up" breadcrumb={[{ label: 'Dashboard', href: PATHS.VOLUNTEER.DASHBOARD }, { label: 'Impact & Badges' }]} />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Impact Hours" value={impactHours} icon={Clock} accent="teal" />
        <StatCard label="Tasks Completed" value={completed} icon={CheckCircle2} accent="amber" />
        <StatCard label="People Helped" value={peopleHelped} icon={Users} accent="coral" />
      </div>

      <Card className="p-6">
        <p className="font-display font-semibold mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Achievement Badges</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((b) => {
            const earned = completed >= b.threshold;
            return (
              <div key={b.name} className={cn('p-4 rounded-xl border text-center', earned ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800' : 'border-teal-100 dark:border-teal-900/50 opacity-50')}>
                <Award className={cn('w-7 h-7 mx-auto mb-2', earned ? 'text-amber-500' : 'text-ink-light/30')} />
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-1">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
