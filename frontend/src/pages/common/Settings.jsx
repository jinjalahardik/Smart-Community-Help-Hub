import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/Modal';
import ThemeSelector from '../../components/ui/ThemeSelector';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifPrefs, setNotifPrefs] = useState({ email: true, push: true, sms: false });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleResetDemo = async () => {
    storageService.clearAll();
    toast.success('Demo data reset. Reloading...');
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your preferences" breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />

      <div className="space-y-6 max-w-2xl">
        <Card className="p-6">
          <p className="font-display font-semibold mb-1">Appearance</p>
          <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mb-4">Choose Light, Dark, or match your system setting.</p>
          <ThemeSelector />
        </Card>

        <Card className="p-6">
          <p className="font-display font-semibold mb-4">Notification Preferences</p>
          <div className="space-y-3">
            <Switch checked={notifPrefs.email} onChange={(v) => setNotifPrefs((p) => ({ ...p, email: v }))} label="Email notifications" />
            <Switch checked={notifPrefs.push} onChange={(v) => setNotifPrefs((p) => ({ ...p, push: v }))} label="Push notifications" />
            <Switch checked={notifPrefs.sms} onChange={(v) => setNotifPrefs((p) => ({ ...p, sms: v }))} label="SMS notifications" />
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-display font-semibold mb-2">Demo Data</p>
          <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mb-4">Reset all locally stored demo data back to its original seeded state.</p>
          <Button variant="outline" onClick={handleResetDemo}>Reset Demo Data</Button>
        </Card>

        <Card className="p-6 border-coral-200 dark:border-coral-900/50">
          <p className="font-display font-semibold text-coral-600 mb-2">Account</p>
          <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mb-4">Log out of your Smart Community Help Hub account on this device.</p>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>Log Out</Button>
        </Card>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => { await logout(); navigate(PATHS.LOGIN); }}
        title="Log out?"
        description="You'll need to log in again to access your dashboard."
        confirmLabel="Log Out"
        variant="danger"
      />
    </div>
  );
}
