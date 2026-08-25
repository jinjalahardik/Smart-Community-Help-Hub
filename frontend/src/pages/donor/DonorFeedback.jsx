import FeedbackPage from '../../features/feedback/FeedbackPage';
import { PATHS } from '../../routes/paths';

export default function DonorFeedback() {
  return <FeedbackPage breadcrumbHome={PATHS.DONOR.DASHBOARD} />;
}
