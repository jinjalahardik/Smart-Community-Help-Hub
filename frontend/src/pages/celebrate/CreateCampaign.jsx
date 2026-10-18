import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, ArrowRight, ArrowLeft, Globe, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { Switch } from '../../components/ui/Toggle';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import Stepper from '../../features/celebrations/Stepper';
import { useVerifiedNgos, useCreateCampaign } from '../../hooks/useCelebrations';
import {
  CELEBRATION_OCCASIONS, CELEBRATION_CAUSES, CELEBRATION_THEMES,
  CELEBRATION_AMOUNT_MIN, celebrationOccasionLabel, celebrationCauseById,
} from '../../constants/celebrations';
import { formatNumber } from '../../utils/format';
import { PATHS } from '../../routes/paths';

const STEPS = ['Occasion & story', 'NGO, cause & goal', 'Review'];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.prefill || {};

  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState(prefill.occasion || '');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [cause, setCause] = useState(prefill.cause || '');
  const [ngoId, setNgoId] = useState(prefill.ngoId || '');
  const [goalAmount, setGoalAmount] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [theme, setTheme] = useState('celebrate');

  const ngos = useVerifiedNgos();
  const create = useCreateCampaign();
  const goal = Number(goalAmount || 0);
  const ngo = ngos.data?.find((n) => n.id === ngoId);
  const selectedCause = celebrationCauseById(cause);

  const canProceed = {
    1: !!eventType && !!eventTitle.trim(),
    2: !!cause && !!ngoId && goal >= CELEBRATION_AMOUNT_MIN,
    3: true,
  }[step];

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleCreate = async () => {
    const payload = {
      eventType,
      eventTitle: eventTitle.trim(),
      eventDate: eventDate || null,
      description: description.trim(),
      cause,
      ngoId,
      goalAmount: goal,
      isPublic,
      theme,
    };
    try {
      const campaign = await create.mutateAsync(payload);
      navigate(PATHS.CELEBRATE.CAMPAIGN(campaign.slug));
    } catch {
      /* toast shown by hook */
    }
  };

  return (
    <div>
      <PageHeader
        title="Create a Celebration Campaign"
        description="Turn an occasion into a shared act of giving"
        breadcrumb={[{ label: 'Dashboard', href: PATHS.DASHBOARD }, { label: 'Celebrate & Give', href: PATHS.CELEBRATE.INDEX }, { label: 'Create Campaign' }]}
      />

      <div className="max-w-3xl mx-auto">
        <Stepper steps={STEPS} current={step} onStepClick={(idx) => idx < 3 && setStep(idx)} />

        <Card className="mt-8 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {step === 1 && (
                <>
                  <div>
                    <h2 className="text-lg font-display font-semibold">What are you celebrating?</h2>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CELEBRATION_OCCASIONS.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setEventType(o.value)}
                          className={
                            eventType === o.value
                              ? 'rounded-xl border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/30 p-3 text-left'
                              : 'rounded-xl border border-teal-100 dark:border-teal-900/60 p-3 text-left hover:border-teal-400'
                          }
                        >
                          <p className="font-semibold text-sm">{o.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input label="Campaign title" required placeholder={`e.g. ${celebrationOccasionLabel(eventType || 'Birthday')} gift drive`} value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Event date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                    <Input label="Goal amount (₹)" required type="number" min={CELEBRATION_AMOUNT_MIN} placeholder="e.g. 25000" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
                  </div>
                  <Textarea label="Your story" rows={3} placeholder="Why are you celebrating this way? What will the funds do?" value={description} onChange={(e) => setDescription(e.target.value)} />
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <h2 className="text-lg font-display font-semibold">Cause</h2>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {CELEBRATION_CAUSES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setCause(c.value)}
                          className={
                            cause === c.value
                              ? 'rounded-xl border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/30 p-3 text-left'
                              : 'rounded-xl border border-teal-100 dark:border-teal-900/60 p-3 text-left hover:border-teal-400'
                          }
                        >
                          <p className="font-semibold text-sm">{c.label}</p>
                          <p className="mt-1 text-xs text-ink-light/55 dark:text-ink-dark/55">{c.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-display font-semibold">Verified NGO to receive the funds</h2>
                    {ngos.isLoading ? (
                      <p className="mt-3 text-sm text-ink-light/50">Loading verified NGOs…</p>
                    ) : ngos.data?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ngos.data.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => setNgoId(n.id)}
                            className={
                              ngoId === n.id
                                ? 'rounded-full border-2 border-teal-600 bg-teal-50 dark:bg-teal-900/30 px-4 py-2 text-sm font-medium'
                                : 'rounded-full border border-teal-100 dark:border-teal-900/60 px-4 py-2 text-sm font-medium hover:border-teal-400'
                            }
                          >
                            {n.name} <span className="text-xs text-ink-light/50 dark:text-ink-dark/50">· {n.city}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-coral-600">No verified NGOs available right now.</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Campaign theme</p>
                      <div className="flex flex-wrap gap-2">
                        {CELEBRATION_THEMES.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setTheme(t.value)}
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} ${theme === t.value ? 'ring-2 ring-teal-600 ring-offset-2 dark:ring-offset-surface-card' : 'opacity-70 hover:opacity-100'}`}
                            aria-label={t.label}
                            title={t.label}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-teal-100 dark:border-teal-900/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        {isPublic ? <Globe className="w-4 h-4 text-teal-600" /> : <Lock className="w-4 h-4 text-ink-light/50" />}
                        <div>
                          <p className="text-sm font-medium">Public campaign</p>
                          <p className="text-xs text-ink-light/60 dark:text-ink-dark/60">{isPublic ? 'Anyone with the link can view & give' : 'Only you can view and donate'}</p>
                        </div>
                      </div>
                      <Switch checked={isPublic} onChange={setIsPublic} />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-lg font-display font-semibold">Review & launch</h2>
                  <div className="mt-4 space-y-3">
                    <SummaryRow label="Occasion" value={celebrationOccasionLabel(eventType)} />
                    <SummaryRow label="Title" value={eventTitle.trim()} accent />
                    <SummaryRow label="Cause" value={selectedCause?.label || cause} />
                    <SummaryRow label="NGO" value={ngo?.name} sub={ngo?.city} />
                    <SummaryRow label="Goal" value={`₹${formatNumber(goal)}`} />
                    <SummaryRow label="Visibility" value={isPublic ? 'Public' : 'Private'} />
                    {eventDate && <SummaryRow label="Event date" value={eventDate} />}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1} icon={ArrowLeft}>Back</Button>
            <Button onClick={step === 3 ? handleCreate : () => setStep((s) => s + 1)} loading={create.isPending} disabled={!canProceed} icon={step === 3 ? PartyPopper : ArrowRight} iconPosition="right">
              {step === 3 ? 'Launch campaign' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, sub, accent }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-teal-100 dark:border-teal-900/60 px-4 py-3">
      <span className="text-sm text-ink-light/60 dark:text-ink-dark/60">{label}</span>
      <span className="text-right">
        <span className={accent ? 'text-sm font-bold text-teal-700 dark:text-teal-300' : 'text-sm font-semibold'}>{value}</span>
        {sub && <span className="block text-xs text-ink-light/50 dark:text-ink-dark/50">{sub}</span>}
      </span>
    </div>
  );
}