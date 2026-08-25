import FeedbackPage from '../../features/feedback/FeedbackPage';
import { PATHS } from '../../routes/paths';

export default function VolunteerFeedback() {
  return <FeedbackPage breadcrumbHome={PATHS.VOLUNTEER.DASHBOARD} />;
}
