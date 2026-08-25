import FeedbackPage from '../../features/feedback/FeedbackPage';
import { PATHS } from '../../routes/paths';

export default function RequesterFeedback() {
  return <FeedbackPage breadcrumbHome={PATHS.REQUESTER.DASHBOARD} />;
}
