import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, ArrowLeft } from 'lucide-react';
import { generateMetadataCsv } from '../services/datasetGenerator';

interface RawFileViewerProps {
  filePath: string;
  fileType: string;
  fileData: any;
  onClose?: () => void;
}

export const RawFileViewer: React.FC<RawFileViewerProps> = ({
  filePath,
  fileType,
  fileData,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const formatContent = (): string => {
    if (!fileData) return '// Empty file';
    if (typeof fileData === 'string') return fileData;
    if (fileType === 'metadata_csv') return generateMetadataCsv(fileData);
    try {
      return JSON.stringify(fileData, null, 2);
    } catch {
      return String(fileData);
    }
  };

  const textContent = formatContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = filePath.split('/').pop() || 'file.txt';
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Top Header */}
      <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 truncate">
          <FileCode className="w-4 h-4 text-pink-400 shrink-0" />
          <span className="font-semibold text-zinc-100 truncate">{filePath}</span>
        </div>

        <div className="flex items-center gap-2">
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
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 text-xs font-medium border border-pink-500/40 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Text Content */}
      <pre className="p-4 text-xs font-mono text-zinc-300 bg-zinc-950/80 overflow-auto flex-1 leading-relaxed whitespace-pre select-text">
        {textContent}
      </pre>
    </div>
  );
};
