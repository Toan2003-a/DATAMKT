import React from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Video, FileText, Cpu, Database } from 'lucide-react';

interface PipelineProgressModalProps {
  isOpen: boolean;
  stage: number;
  stageName: string;
  detail: string;
  creatorName: string;
}

export const PipelineProgressModal: React.FC<PipelineProgressModalProps> = ({
  isOpen,
  stage,
  stageName,
  detail,
  creatorName,
}) => {
  if (!isOpen) return null;

  const stages = [
    { num: 1, title: 'Profile Resolver', desc: 'Connecting to TikTok API & resolving creator metadata' },
    { num: 2, title: 'Video Harvester', desc: 'Harvesting video streams, stats & metrics into /videos/' },
    { num: 3, title: 'Whisper Transcriber', desc: 'Extracting word-level timestamps & pauses into /transcripts/' },
    { num: 4, title: 'Computer Vision & Cut Detector', desc: 'Detecting A/B roll, punch-in framing & typography into /analysis/' },
    { num: 5, title: 'Style DNA Synthesizer', desc: 'Computing ASD, CPM, transition lexicon into style_dna.json' },
    { num: 6, title: 'Knowledge Base Compiler', desc: 'Building editing_bible.md, reports & Claude system prompt' },
  ];

  const progressPercent = Math.min(100, Math.round((stage / 6) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <RotateCcw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-sm sm:text-base">
                Building Reference Dataset for {creatorName}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Stage {stage} of 6 • {progressPercent}% Completed
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 transition-all duration-300"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-400">
            <span>{stageName}</span>
            <span className="text-pink-400 font-bold">{detail}</span>
          </div>
        </div>

        {/* Stage List */}
        <div className="space-y-2.5">
          {stages.map((s) => {
            const isDone = stage > s.num;
            const isCurrent = stage === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-pink-950/20 border-pink-500/40 text-pink-200'
                    : isDone
                    ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400'
                    : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                        ? 'bg-pink-500 text-white animate-pulse'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isDone ? '✓' : s.num}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{s.title}</div>
                    <div className="text-[10px] text-zinc-500">{s.desc}</div>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-mono font-medium text-pink-400 animate-pulse">
                    Processing...
                  </span>
                )}
                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
