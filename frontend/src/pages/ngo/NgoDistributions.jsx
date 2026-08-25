import { PageHeader } from '../../components/ui/PageHeader';
import Tabs from '../../components/ui/Tabs';
import DataTable from '../../components/ui/DataTable';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { useNgoDistributions } from '../../hooks/useNgo';
import { useState } from 'react';

export default function NgoDistributions() {
  const { user } = useAuth();
  const [tab, setTab] = useState('donations');
  const { data, isLoading } = useNgoDistributions(user.orgId);
  const donations = data?.donations || [];
  const requests = data?.requests || [];

  const donationColumns = [
    { key: 'title', header: 'Donation' },
    { key: 'category', header: 'Category', render: (d) => DONATION_CATEGORY_LABELS[d.category] },
    { key: 'donorName', header: 'Donor' },
    { key: 'completedAt', header: 'Completed', render: (d) => formatDate(d.completedAt) },
  ];

  const requestColumns = [
    { key: 'title', header: 'Request' },
    { key: 'requesterName', header: 'Requester' },
    { key: 'city', header: 'City' },
    { key: 'fulfilledAt', header: 'Fulfilled', render: (r) => formatDate(r.fulfilledAt) },
  ];

  return (
    <div>
      <PageHeader title="Distribution History" description="Completed donations and fulfilled emergency requests" />
      <Tabs tabs={[{ label: 'Donations', value: 'donations', count: donations.length }, { label: 'Requests', value: 'requests', count: requests.length }]} active={tab} onChange={setTab} className="mb-5" />
      {tab === 'donations' ? (
        <DataTable columns={donationColumns} data={donations} loading={isLoading} emptyMessage="No completed donations yet" />
      ) : (
        <DataTable columns={requestColumns} data={requests} loading={isLoading} emptyMessage="No fulfilled requests yet" />
      )}
    </div>
  );
}
