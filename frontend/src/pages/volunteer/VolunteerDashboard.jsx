import { Link } from 'react-router-dom';
import { ListChecks, CheckCircle2, Clock, Radar, ArrowRight, Award, MapPin } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard, Card } from '../../components/ui/Card';
import { PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { PATHS } from '../../routes/paths';
import { TASK_STATUS } from '../../constants/categories';
import { timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';

const MINI_STAGES = ['Accepted', 'Pickup', 'In Transit', 'Delivered'];
const STAGE_INDEX = {
  accepted: 0,
  pickup_started: 1, picked_up: 1,
  delivery_started: 2,
  delivered: 3, completed: 3,
};

// Deterministic demo distance so the UI has something concrete to show
// without a real geolocation/mapping integration.
function demoDistance(id) {
  const n = (id?.split('-')[1] || '0');
  return (2 + (Number(n) % 9) * 0.7).toFixed(1);
}

function MiniStepper({ status }) {
  const current = STAGE_INDEX[status] ?? 0;
  return (
    <div className="flex items-center gap-1" aria-label={`Task stage: ${MINI_STAGES[current]}`}>
      {MINI_STAGES.map((label, i) => (
        <span key={label} className="flex items-center gap-1">
          <span
            title={label}
            className={cn('w-2 h-2 rounded-full transition-colors', i <= current ? 'bg-teal-600' : 'bg-teal-100 dark:bg-teal-900/60')}
          />
          {i < MINI_STAGES.length - 1 && <span className={cn('w-3 h-px', i < current ? 'bg-teal-600' : 'bg-teal-100 dark:bg-teal-900/60')} />}
        </span>
      ))}
    </div>
  );
}

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const { data: myTasks = [] } = useTasks({ volunteerId: user.id });
  const { data: available = [] } = useTasks({ available: true });

  const active = myTasks.filter((t) => t.status !== TASK_STATUS.COMPLETED);
  const completed = myTasks.filter((t) => t.status === TASK_STATUS.COMPLETED);
  const impactHours = completed.length * 2;
  const nextMilestone = 20;
  const milestoneProgress = Math.min(100, Math.round((impactHours / nextMilestone) * 100));

  return (
    <div>
      <PageHeader title={`Hi ${user.name.split(' ')[0]}, ready to help?`} description="Here's what's happening with your volunteer tasks" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Nearby Available Tasks" value={available.length} icon={Radar} accent="amber" />
        <StatCard label="Active Tasks" value={active.length} icon={ListChecks} accent="teal" />
        <StatCard label="Completed Tasks" value={completed.length} icon={CheckCircle2} accent="teal" trend={completed.length > 0 ? 8 : undefined} trendLabel="vs last week" />
        <StatCard label="Impact Hours" value={impactHours} icon={Clock} accent="coral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold">Priority Tasks Nearby</p>
            <Link to={PATHS.VOLUNTEER.TASKS} className="text-sm text-teal-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {available.length === 0 ? (
            <EmptyState title="No tasks available right now" className="py-8" />
          ) : (
            <div className="space-y-2.5">
              {available.slice(0, 4).map((t) => (
                <Link key={t.id} to={PATHS.VOLUNTEER.TASK_DETAILS(t.id)} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {demoDistance(t.id)} km away</span>
                      <span>{t.pickupLocation} → {t.deliveryLocation}</span>
                    </p>
                  </div>
                  <PriorityBadge level={t.priority} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="font-display font-semibold mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Achievement Badges</p>
            <div className="grid grid-cols-3 gap-3">
              {['First Task', '10 Deliveries', 'Community Hero'].map((badge, i) => (
                <div key={badge} className={`text-center p-3 rounded-xl ${i < (completed.length > 0 ? 2 : 1) ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-teal-50/50 dark:bg-teal-900/20 opacity-40'}`}>
                  <Award className="w-5 h-5 mx-auto text-amber-500" />
                  <p className="text-[10px] font-medium mt-1.5">{badge}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Impact Hour Progress</p>
              <span className="text-xs text-ink-light/65">{impactHours} / {nextMilestone}h</span>
            </div>
            <div className="h-2 rounded-full bg-teal-100 dark:bg-teal-900/60 overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full transition-all duration-500" style={{ width: `${milestoneProgress}%` }} />
            </div>
            <p className="text-xs text-ink-light/65 mt-2">{nextMilestone - impactHours > 0 ? `${nextMilestone - impactHours}h to your next badge` : 'Milestone reached!'}</p>
          </Card>
        </div>
      </div>

      <Card className="p-5 mt-6">
        <p className="font-display font-semibold mb-4">My Active Tasks</p>
        {active.length === 0 ? (
          <EmptyState title="No active tasks" description="Accept a task from nearby tasks to get started." action={<Link to={PATHS.VOLUNTEER.TASKS}><Button size="sm">Browse Tasks</Button></Link>} />
        ) : (
          <div className="space-y-2.5">
            {active.map((t) => (
              <Link key={t.id} to={PATHS.VOLUNTEER.TASK_DETAILS(t.id)} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-900/20">
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{timeAgo(t.createdAt)}</p>
                </div>
                <MiniStepper status={t.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
