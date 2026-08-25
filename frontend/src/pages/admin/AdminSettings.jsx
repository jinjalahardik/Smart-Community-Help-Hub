import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Toggle';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ThemeSelector from '../../components/ui/ThemeSelector';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    autoApproveVolunteers: true,
    requireOrgDocuments: true,
    maintenanceMode: false,
    supportEmail: 'support@helpconnect.demo',
  });

  const save = () => toast.success('Platform settings saved');

  return (
    <div>
      <PageHeader title="Platform Settings" description="Configure platform-wide behavior" />
      <div className="space-y-6 max-w-2xl">
        <Card className="p-6">
          <p className="font-display font-semibold mb-1">Appearance</p>
          <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mb-4">Choose Light, Dark, or match your system setting.</p>
          <ThemeSelector />
        </Card>

        <Card className="p-6">
          <p className="font-display font-semibold mb-4">Platform Rules</p>
          <div className="space-y-3.5">
            <Switch checked={settings.autoApproveVolunteers} onChange={(v) => setSettings((s) => ({ ...s, autoApproveVolunteers: v }))} label="Auto-approve volunteer registrations" />
            <Switch checked={settings.requireOrgDocuments} onChange={(v) => setSettings((s) => ({ ...s, requireOrgDocuments: v }))} label="Require documents for NGO/Hospital verification" />
            <Switch checked={settings.maintenanceMode} onChange={(v) => setSettings((s) => ({ ...s, maintenanceMode: v }))} label="Maintenance mode" />
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-display font-semibold mb-4">Support Contact</p>
          <Input label="Support Email" type="email" value={settings.supportEmail} onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))} />
        </Card>

        <Button onClick={save}>Save Settings</Button>
      </div>
    </div>
  );
}
