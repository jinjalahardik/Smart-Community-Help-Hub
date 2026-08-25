import { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function FileUpload({ label, hint, multiple = false, accept = '.pdf,.jpg,.jpeg,.png', onChange, required }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    const next = multiple ? [...files, ...arr] : arr;
    setFiles(next);
    onChange?.(next);
  };

  const removeFile = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <div>
      {label && <p className="block text-sm font-medium mb-1.5">{label} {required && <span className="text-coral-500">*</span>}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed border-teal-200 dark:border-teal-800 rounded-xl px-4 py-6 text-center cursor-pointer',
          'hover:border-teal-400 hover:bg-teal-50/40 dark:hover:bg-teal-900/20 transition-colors'
        )}
      >
        <UploadCloud className="w-6 h-6 text-teal-500 mx-auto mb-2" />
        <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">
          <span className="text-teal-600 font-medium">Click to upload</span> or drag and drop
        </p>
        {hint && <p className="text-xs text-ink-light/45 dark:text-ink-dark/45 mt-1">{hint}</p>}
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 px-3 py-2 text-sm">
              <span className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">{f.name}</span>
              </span>
              <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>
                <X className="w-4 h-4 text-ink-light/65 hover:text-coral-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
