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

function demoDistance(id) {
  const n = (id?.split('-')[1] || '0');
  return (2 + (Number(n) % 9) * 0.7).toFixed(1);
}

function MiniStepper({ status }) {
  const current = STAGE_INDEX[status] ?? 0;
  return (
    <div className="flex items-center gap-1.5" aria-label={`Task stage: ${MINI_STAGES[current]}`}>
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
    <div className="space-y-8">
      <PageHeader
        title={`Hi ${user.name.split(' ')[0]}, ready to help?`}
        description="Here is your real-time community task radar, deliveries, and impact recognition."
      />

      {/* KPI Stats Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Available Tasks" value={available.length} icon={Radar} accent="amber" />
        <StatCard label="In Progress" value={active.length} icon={ListChecks} accent="teal" />
        <StatCard label="Completed Tasks" value={completed.length} icon={CheckCircle2} accent="cyan" trend={completed.length > 0 ? 8 : undefined} trendLabel="vs last week" />
        <StatCard label="Impact Hours" value={impactHours} icon={Clock} accent="coral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <p className="font-display font-bold text-base text-ink-light dark:text-ink-dark">Priority Tasks Nearby</p>
            <Link to={PATHS.VOLUNTEER.TASKS} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {available.length === 0 ? (
            <EmptyState title="No tasks available right now" className="py-8" />
          ) : (
            <div className="space-y-3">
              {available.slice(0, 4).map((t) => (
                <Link
                  key={t.id}
                  to={PATHS.VOLUNTEER.TASK_DETAILS(t.id)}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-teal-100/60 dark:border-teal-900/40 hover:bg-teal-50/60 dark:hover:bg-teal-900/20 transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink-light dark:text-ink-dark truncate">{t.title}</p>
                    <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-teal-700 dark:text-teal-300 font-semibold">
                        <MapPin className="w-3.5 h-3.5" /> {demoDistance(t.id)} km away
                      </span>
                      <span className="truncate">{t.pickupLocation} → {t.deliveryLocation}</span>
                    </p>
                  </div>
                  <PriorityBadge level={t.priority} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="font-display font-bold text-sm text-ink-light dark:text-ink-dark mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Recognition Badges
            </p>
            <div className="grid grid-cols-3 gap-3">
              {['First Task', '10 Deliveries', 'Community Hero'].map((badge, i) => (
                <div
                  key={badge}
                  className={cn(
                    'text-center p-3 rounded-2xl border transition-all duration-200',
                    i < (completed.length > 0 ? 2 : 1)
                      ? 'bg-amber-500/10 border-amber-300/40 dark:border-amber-500/30'
                      : 'bg-teal-50/30 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30 opacity-40'
                  )}
                >
                  <Award className="w-5 h-5 mx-auto text-amber-500" />
                  <p className="text-[10px] font-bold text-ink-light dark:text-ink-dark mt-1.5">{badge}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-light/60 dark:text-ink-dark/60 font-body">Impact Hours</p>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300">{impactHours} / {nextMilestone}h</span>
            </div>
            <div className="h-2 rounded-full bg-teal-100 dark:bg-teal-900/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(45,212,191,0.6)]" style={{ width: `${milestoneProgress}%` }} />
            </div>
            <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-2 font-medium">
              {nextMilestone - impactHours > 0 ? `${nextMilestone - impactHours}h to your next milestone badge` : 'Milestone reached!'}
            </p>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <p className="font-display font-bold text-base text-ink-light dark:text-ink-dark mb-4">My Active Tasks</p>
        {active.length === 0 ? (
          <EmptyState
            title="No active tasks"
            description="Accept a task from nearby requests to coordinate community support."
            action={
              <Link to={PATHS.VOLUNTEER.TASKS}>
                <Button size="sm">Browse Tasks</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {active.map((t) => (
              <Link
                key={t.id}
                to={PATHS.VOLUNTEER.TASK_DETAILS(t.id)}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-teal-100/60 dark:border-teal-900/40 hover:bg-teal-50/60 dark:hover:bg-teal-900/20 transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-bold text-ink-light dark:text-ink-dark">{t.title}</p>
                  <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-0.5">{timeAgo(t.createdAt)}</p>
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
