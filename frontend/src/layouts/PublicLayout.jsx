import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import PageTransition from '../components/shared/PageTransition';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to main content
      </a>
      <PublicNavbar />
      <main id="main-content" className="flex-1">
        <PageTransition />
      </main>
      <PublicFooter />
    </div>
  );
}
