import React from 'react';
import { Download, Sparkles, Database, Film, Bot, CheckCircle2 } from 'lucide-react';
import { ReferenceDataset } from '../types/dataset';
import { exportDatasetToZip, downloadBlob } from '../services/zipExporter';

interface NavbarProps {
  dataset: ReferenceDataset | null;
  isGenerating: boolean;
  onQuickPreset: (presetKey: string) => void;
  activePresetKey: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  dataset,
  isGenerating,
  onQuickPreset,
  activePresetKey,
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadZip = async () => {
    if (!dataset) return;
    try {
      setDownloading(true);
      const zipBlob = await exportDatasetToZip(dataset);
      downloadBlob(zipBlob, `ReferenceLibrary_${dataset.creatorName.replace(/\s+/g, '_')}.zip`);
    } catch (err) {
      console.error('Failed to export dataset zip:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-zinc-100 tracking-tight text-base sm:text-lg">
                TikTok Reference Dataset Builder
              </h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Claude Ready
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Reverse-engineer creator style DNA into structured knowledge for AI Video Editors
            </p>
          </div>
        </div>

        {/* Actions & Preset Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs text-zinc-300">
            <span className="px-2 text-zinc-500 font-medium">Quick Presets:</span>
            <button
              onClick={() => onQuickPreset('anh_sac_anh')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                activePresetKey === 'anh_sac_anh'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium'
                  : 'hover:text-white hover:bg-zinc-800'
              }`}
            >
              Anh Sắc Ánh (Verified)
            </button>
            <button
              onClick={() => onQuickPreset('alex_hormozi')}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                activePresetKey === 'alex_hormozi'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-medium'
                  : 'hover:text-white hover:bg-zinc-800'
              }`}
            >
              Hormozi (1.3s)
            </button>
          </div>

          {dataset && (
            <button
              onClick={handleDownloadZip}
              disabled={downloading || isGenerating}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-600/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Packaging ZIP...' : 'Export Dataset (.ZIP)'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
