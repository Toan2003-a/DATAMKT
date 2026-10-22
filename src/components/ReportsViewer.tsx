import React, { useState } from 'react';
import { FileText, Copy, Check, BarChart3, Database } from 'lucide-react';
import { ReferenceDataset } from '../types/dataset';

interface ReportsViewerProps {
  dataset: ReferenceDataset;
}

export const ReportsViewer: React.FC<ReportsViewerProps> = ({ dataset }) => {
  const [activeReport, setActiveReport] = useState<'creator' | 'dataset'>('creator');
  const [copied, setCopied] = useState(false);

  const content =
    activeReport === 'creator'
      ? dataset.creatorReportMarkdown
      : dataset.datasetReportMarkdown;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Selector Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveReport('creator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeReport === 'creator'
                ? 'bg-pink-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>creator_report.md</span>
          </button>

          <button
            onClick={() => setActiveReport('dataset')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeReport === 'dataset'
                ? 'bg-pink-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>dataset_report.md</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Report Markdown</span>
            </>
          )}
        </button>
      </div>

      {/* Rendered Document */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <pre className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap select-text">
          {content}
        </pre>
      </div>
    </div>
  );
};
