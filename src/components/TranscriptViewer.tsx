import React, { useState } from 'react';
import { FileText, Clock, Volume2, Hash, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ReferenceDataset, VideoFolderPackage } from '../types/dataset';

interface TranscriptViewerProps {
  dataset: ReferenceDataset;
  selectedVideoId: string;
  onSelectVideoId: (id: string) => void;
  onSeek?: (seconds: number) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  dataset,
  selectedVideoId,
  onSelectVideoId,
  onSeek,
}) => {
  const currentPackage: VideoFolderPackage =
    dataset.videoPackages[selectedVideoId] ||
    dataset.videoPackages[dataset.videoIds[0]] ||
    Object.values(dataset.videoPackages)[0];

  const { transcript, metadata } = currentPackage;

  return (
    <div className="space-y-4">
      {/* Identity Selector Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-semibold text-zinc-200 uppercase">
            Transcript Video ID:
          </span>
          <select
            value={metadata.video_id}
            onChange={(e) => onSelectVideoId(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-100 focus:outline-none focus:border-yellow-500 font-mono"
          >
            {dataset.videoIds.map((id) => (
              <option key={id} value={id}>
                {id} ({dataset.videoPackages[id]?.metadata.title.slice(0, 35)}...)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
          {currentPackage.verification?.overall_status === 'VERIFIED' ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Source-Verified
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Simulation Reference
            </span>
          )}
          <span>•</span>
          <span>Words: <strong className="text-zinc-200">{transcript.totalWords}</strong></span>
          <span>•</span>
          <span>Tempo: <strong className="text-yellow-400">{transcript.wpm} WPM</strong></span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Full Spoken Transcript Card */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-semibold text-zinc-200 uppercase flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-yellow-400" /> Continuous Vocal Transcript
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Bound to {transcript.source_file}
            </span>
          </div>

          <p className="text-xs text-zinc-200 leading-relaxed font-sans bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
            "{transcript.fullText}"
          </p>

          {/* Pauses detected */}
          {transcript.pauses.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase font-mono">
                Detected Speech / Breath Pauses:
              </span>
              <div className="flex flex-wrap gap-2">
                {transcript.pauses.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                  >
                    {p.start}s - {p.end}s ({p.duration}s pause)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamped Segments Table */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5 font-mono">
              <Hash className="w-3.5 h-3.5 text-yellow-400" />
              Segments ({transcript.segments.length})
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Click time to seek
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-zinc-900">
            {transcript.segments.map((seg, idx) => (
              <div
                key={idx}
                className="p-2.5 hover:bg-zinc-900/60 transition-colors flex items-start gap-3 text-xs"
              >
                <button
                  onClick={() => onSeek?.(seg.start)}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-yellow-500 hover:text-black font-mono text-[10px] text-yellow-400 shrink-0 cursor-pointer"
                >
                  {seg.start.toFixed(2)}s
                </button>
                <div className="space-y-0.5">
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {seg.start}s → {seg.end}s
                  </div>
                  <p className="text-zinc-300 leading-snug font-sans">{seg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
