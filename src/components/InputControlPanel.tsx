import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Video,
  FileSpreadsheet,
  Cpu,
} from 'lucide-react';
import { DatasetFilterOptions } from '../types/dataset';

interface InputControlPanelProps {
  onBuildDataset: (options: DatasetFilterOptions) => void;
  isBuilding: boolean;
  activeCreatorName?: string;
}

export const InputControlPanel: React.FC<InputControlPanelProps> = ({
  onBuildDataset,
  isBuilding,
  activeCreatorName,
}) => {
  const [profileUrl, setProfileUrl] = useState('https://www.tiktok.com/@anhsacanh.vn');
  const [creatorName, setCreatorName] = useState('Anh Sắc Ánh');
  const [numVideos, setNumVideos] = useState<number>(25);
  const [dateRange, setDateRange] = useState('Last 12 months');
  const [minDuration, setMinDuration] = useState<number>(15);
  const [maxDuration, setMaxDuration] = useState<number>(90);
  const [analyzeAuto, setAnalyzeAuto] = useState<boolean>(true);
  const [generateStyleDna, setGenerateStyleDna] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim()) return;

    onBuildDataset({
      profileUrl: profileUrl.trim(),
      creatorName: creatorName.trim() || undefined,
      numVideos,
      dateRange,
      minDuration,
      maxDuration,
      analyzeAutomatically: analyzeAuto,
      generateStyleDna,
    });
  };

  const setSampleCreator = (url: string, name: string) => {
    setProfileUrl(url);
    setCreatorName(name);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Terminal Title Mockup Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-5">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 font-semibold text-zinc-200">
            TIKTOK REFERENCE DATASET BUILDER
          </span>
        </div>
        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-pink-400" />
          <span>Claude Video Editor Pipeline v2.4</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TikTok Profile URL (Required) */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-xs font-semibold text-zinc-200 tracking-wide uppercase">
              TikTok Profile URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@creator or @creator"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
              <span>Quick fill:</span>
              <button
                type="button"
                onClick={() => setSampleCreator('https://www.tiktok.com/@anhsacanh.vn/video/7302098273618', 'Anh Sắc Ánh')}
                className="hover:text-emerald-400 underline decoration-zinc-600 underline-offset-2 transition-colors cursor-pointer font-mono"
              >
                Exact Video (7302098273618)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSampleCreator('https://www.tiktok.com/@anhsacanh.vn', 'Anh Sắc Ánh')}
                className="hover:text-emerald-400 underline decoration-zinc-600 underline-offset-2 transition-colors cursor-pointer"
              >
                @anhsacanh.vn (Profile)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSampleCreator('https://www.tiktok.com/@hormozi', 'Alex Hormozi')}
                className="hover:text-yellow-400 underline decoration-zinc-600 underline-offset-2 transition-colors cursor-pointer"
              >
                @hormozi
              </button>
            </div>
            {profileUrl.includes('/video/') && (
              <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>DIRECT VIDEO MODE: Exactly this 1 video will be verified & isolated. No filler packages.</span>
              </div>
            )}
          </div>

          {/* Creator Name (Optional) */}
          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-xs font-semibold text-zinc-200 tracking-wide uppercase">
              Creator Name <span className="text-zinc-500 font-normal">(Optional identifier)</span>
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g. Expert_A, Alex Hormozi"
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
            <p className="text-[11px] text-zinc-400 pt-1">
              Used for output folder name: <code className="text-zinc-300 font-mono">ReferenceLibrary/{creatorName || 'Creator_Name'}/</code>
            </p>
          </div>
        </div>

        {/* Video Count & Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Number of Videos */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 uppercase">
              <span>Number of Videos</span>
              <span className="text-pink-400 font-mono font-bold">{numVideos} videos</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={numVideos}
                onChange={(e) => setNumVideos(Number(e.target.value))}
                className="w-full accent-pink-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>5 min</span>
              <span>25 recommended</span>
              <span>100 max</span>
            </div>
          </div>

          {/* Date range */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-200 uppercase">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-pink-500 transition-all"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 3 months">Last 3 months</option>
              <option value="Last 12 months">Last 12 months</option>
              <option value="All time">All time (Evergreen sample)</option>
            </select>
          </div>

          {/* Analyze automatically */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-200 uppercase">
              Analyze Automatically
            </label>
            <div className="flex items-center gap-2 h-[34px]">
              <button
                type="button"
                onClick={() => setAnalyzeAuto(true)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  analyzeAuto
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setAnalyzeAuto(false)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  !analyzeAuto
                    ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                }`}
              >
                NO
              </button>
            </div>
          </div>

          {/* Generate Style DNA */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-200 uppercase">
              Generate Style DNA
            </label>
            <div className="flex items-center gap-2 h-[34px]">
              <button
                type="button"
                onClick={() => setGenerateStyleDna(true)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  generateStyleDna
                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setGenerateStyleDna(false)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  !generateStyleDna
                    ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                }`}
              >
                NO
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Duration Filters */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Duration Filters' : 'Fine-tune Duration Filter (Min / Max sec)'}</span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-3.5 bg-zinc-950/60 border border-zinc-800 rounded-xl">
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Minimum Duration</span>
                  <span className="font-mono text-zinc-400">{minDuration}s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={minDuration}
                  onChange={(e) => setMinDuration(Number(e.target.value))}
                  className="w-full accent-pink-500 bg-zinc-800 h-1.5 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-zinc-300 mb-1">
                  <span>Maximum Duration</span>
                  <span className="font-mono text-zinc-400">{maxDuration}s</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="180"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(Number(e.target.value))}
                  className="w-full accent-pink-500 bg-zinc-800 h-1.5 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Pipeline Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Extracts: <strong className="text-zinc-200">Videos, Thumbnails, Metadata, Transcripts, Shot Analysis, Style DNA & Editing Bible</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={isBuilding}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-pink-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isBuilding ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Harvesting & Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Build Reference Dataset</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
