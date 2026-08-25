import toast from 'react-hot-toast';
import { Download, FileText } from 'lucide-react';
import Button from '../ui/Button';

export default function ExportButtons({ filename = 'report' }) {
  const exportCsv = () => {
    const csv = 'Category,Value\nDemo,1\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV export downloaded (demo data)');
  };

  const exportPdf = () => {
    toast.success('PDF export generated (demo)');
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" icon={Download} onClick={exportCsv}>Export CSV</Button>
      <Button variant="outline" size="sm" icon={FileText} onClick={exportPdf}>Export PDF</Button>
    </div>
  );
}
