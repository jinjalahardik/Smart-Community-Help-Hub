import { useState } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Switch, Checkbox } from '../../components/ui/Toggle';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { PATHS } from '../../routes/paths';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Availability() {
  const [available, setAvailable] = useState(true);
  const [days, setDays] = useState(['Saturday', 'Sunday']);
  const [radius, setRadius] = useState('10');
  const [saving, setSaving] = useState(false);

  const toggleDay = (day) => {
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success('Availability preferences saved');
  };

  return (
    <div>
      <PageHeader title="Availability Settings" description="Control when and where you receive task suggestions" breadcrumb={[{ label: 'Dashboard', href: PATHS.VOLUNTEER.DASHBOARD }, { label: 'Availability' }]} />

      <Card className="p-6 max-w-xl space-y-6">
        <Switch checked={available} onChange={setAvailable} label="Currently available for new tasks" />

        <div>
          <p className="text-sm font-medium mb-2">Available Days</p>
          <div className="grid grid-cols-2 gap-2">
            {DAYS.map((day) => (
              <Checkbox key={day} label={day} checked={days.includes(day)} onChange={() => toggleDay(day)} />
            ))}
          </div>
        </div>

        <Select
          label="Preferred task radius"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          options={[{ value: '5', label: 'Within 5 km' }, { value: '10', label: 'Within 10 km' }, { value: '20', label: 'Within 20 km' }, { value: '50', label: 'Within 50 km' }]}
        />

        <Button onClick={handleSave} loading={saving}>Save Preferences</Button>
      </Card>
    </div>
  );
}
