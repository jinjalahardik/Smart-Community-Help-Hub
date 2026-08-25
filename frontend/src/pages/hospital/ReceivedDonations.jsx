import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import Tabs from '../../components/ui/Tabs';
import DataTable from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { useReceivedDonations } from '../../hooks/useHospital';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';

const DONOR_COORDINATION = [
  { name: 'Rohan Shah', bloodGroup: 'O+', city: 'Surat', lastDonation: '2026-03-20' },
  { name: 'Nisha Kapadia', bloodGroup: 'A+', city: 'Mumbai', lastDonation: '2026-05-02' },
  { name: 'Devansh Joshi', bloodGroup: 'B-', city: 'Pune', lastDonation: '2026-06-10' },
];

export default function ReceivedDonations() {
  const { user } = useAuth();
  const [tab, setTab] = useState('donations');
  const { data: donations = [], isLoading } = useReceivedDonations(user.orgId);

  const columns = [
    { key: 'title', header: 'Donation' },
    { key: 'donorName', header: 'Donor' },
    { key: 'bloodGroup', header: 'Blood Group' },
    { key: 'completedAt', header: 'Received', render: (d) => formatDate(d.completedAt) },
  ];

  return (
    <div>
      <PageHeader title="Received Donations" description="Blood donations received and donor coordination overview" />
      <Tabs tabs={[{ label: 'Received Donations', value: 'donations' }, { label: 'Donor Coordination', value: 'coordination' }]} active={tab} onChange={setTab} className="mb-5" />

      {tab === 'donations' ? (
        <DataTable columns={columns} data={donations} loading={isLoading} emptyMessage="No donations received yet" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DONOR_COORDINATION.length === 0 ? <EmptyState title="No coordinated donors" /> : DONOR_COORDINATION.map((d) => (
            <Card key={d.name} className="p-5 flex items-center gap-3.5">
              <Avatar name={d.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.name}</p>
                <p className="text-xs text-ink-light/65 dark:text-ink-dark/65">{d.city} • Last donated {formatDate(d.lastDonation)}</p>
              </div>
              <Badge tone="coral">{d.bloodGroup}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
