import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/Badge';
import { feedbackSchema } from '../../validators/miscSchemas';
import { useAuth } from '../../context/AuthContext';
import { useFeedbackList, useCreateFeedback } from '../../hooks/useFeedback';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';

export default function FeedbackPage({ breadcrumbHome }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const { data: feedback = [] } = useFeedbackList({ userId: user.id });
  const createFeedback = useCreateFeedback();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 5 },
  });

  const onSubmit = async (data) => {
    await createFeedback.mutateAsync({ ...data, rating, userId: user.id, userName: user.name, role: user.role });
    reset();
    setRating(5);
  };

  return (
    <div>
      <PageHeader title="Feedback" description="Share your experience with us" breadcrumb={[{ label: 'Dashboard', href: breadcrumbHome }, { label: 'Feedback' }]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 h-fit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star className={cn('w-6 h-6', n <= rating ? 'fill-amber-400 text-amber-400' : 'text-teal-100 dark:text-teal-900')} />
                  </button>
                ))}
              </div>
            </div>
            <Input label="Subject" required {...register('subject')} error={errors.subject?.message} />
            <Textarea label="Your Feedback" required rows={4} {...register('message')} error={errors.message?.message} />
            <Button type="submit" className="w-full" loading={isSubmitting}>Submit Feedback</Button>
          </form>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="font-display font-semibold mb-4">Your Past Feedback</p>
          {feedback.length === 0 ? (
            <EmptyState title="No feedback submitted yet" className="py-10" />
          ) : (
            <div className="space-y-3">
              {feedback.map((f) => (
                <div key={f.id} className="p-4 rounded-xl border border-teal-100 dark:border-teal-900/50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{f.subject}</p>
                    <StatusBadge status={f.status} />
                  </div>
                  <div className="flex gap-0.5 my-1.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className={cn('w-3.5 h-3.5', i < f.rating ? 'fill-amber-400 text-amber-400' : 'text-teal-100 dark:text-teal-900')} />)}
                  </div>
                  <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">{f.message}</p>
                  <p className="text-xs text-ink-light/40 dark:text-ink-dark/40 mt-2">{formatDate(f.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
