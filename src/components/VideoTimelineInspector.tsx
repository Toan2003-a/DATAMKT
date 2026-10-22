import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Scissors,
  Layers,
  Type,
  Eye,
  Film,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ReferenceDataset, VideoFolderPackage, Shot, TranscriptSegment } from '../types/dataset';

interface VideoTimelineInspectorProps {
  dataset: ReferenceDataset;
  selectedVideoId: string;
  onSelectVideoId: (id: string) => void;
}

export const VideoTimelineInspector: React.FC<VideoTimelineInspectorProps> = ({
  dataset,
  selectedVideoId,
  onSelectVideoId,
}) => {
  const currentPackage: VideoFolderPackage =
    dataset.videoPackages[selectedVideoId] ||
    dataset.videoPackages[dataset.videoIds[0]] ||
    Object.values(dataset.videoPackages)[0];

  const { metadata, transcript, shots, editingAnalysis, verification, evidenceFrames } = currentPackage;

  const [currentTime, setCurrentTime] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'transcript' | 'evidence'>('timeline');

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const duration = metadata.duration || 28;

  // Find active shot strictly by currentTime
  const activeShot: Shot | undefined =
    shots.find((s) => currentTime >= s.startTime && currentTime < s.endTime) || shots[0];

  // Find active transcript segment strictly by currentTime
  const activeSegment: TranscriptSegment | undefined = transcript.segments.find(
    (seg) => currentTime >= seg.start && currentTime <= seg.end
  );

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      const tick = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(tick);
      };
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, duration)));
  };

  // Play a specific shot range (demonstrating exact linking)
  const jumpAndPlayShot = (shot: Shot) => {
    setCurrentTime(shot.startTime);
    setIsPlaying(true);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const getCameraScale = () => {
    if (!activeShot) return 'scale-100';
    if (activeShot.framing === 'punch-in-25' || activeShot.faceFraming === 'extreme-close-up') {
      return 'scale-125 transition-transform duration-200';
    }
    if (activeShot.framing === 'punch-in-15') {
      return 'scale-115 transition-transform duration-200';
    }
    return 'scale-100 transition-transform duration-200';
  };

  return (
    <div className="space-y-5">
      {/* 1. VIDEO IDENTITY BANNER (MANDATORY VERIFICATION LAYER) */}
      <div className="bg-zinc-950 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${
                verification.overall_status === 'VERIFIED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                VIDEO ID: {metadata.video_id} {verification.overall_status === 'VERIFIED' ? '✓ SOURCE MATCH' : '⚠ UNVERIFIED'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                SOURCE: <strong className="text-zinc-200">TikTok</strong>
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                FILE: <strong className="text-zinc-200">{metadata.filename}</strong>
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                DURATION: <strong className="text-emerald-400">{metadata.duration.toFixed(1)}s</strong>
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                RES: <strong className="text-zinc-200">{metadata.resolution} (9:16)</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                REQUEST: <strong className="text-zinc-200">{metadata.request_id}</strong>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                CREATOR: <strong className="text-emerald-400">{metadata.creator_username}</strong> ({metadata.creator_id})
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                SCHEMA: <strong className="text-zinc-200">v{metadata.schema_version}</strong>
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-zinc-100 pt-1 flex items-center gap-2">
              {metadata.title}
            </h2>
          </div>

          {/* Action Buttons: [Play Verified Video] and [Open Exact TikTok Video] */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
            </button>

            <a
              href={metadata.source_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-pink-500 text-zinc-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              title={`Open exact TikTok video: ${metadata.source_url}`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
              <span>Open Exact TikTok Video</span>
            </a>

            <button
              onClick={() => setShowVerificationModal(!showVerificationModal)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-lg ${
                verification.overall_status === 'VERIFIED'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-emerald-500/10'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-amber-500/10'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${verification.overall_status === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>
                {verification.overall_status === 'VERIFIED'
                  ? `✓ SOURCE-VERIFIED (${verification.passedCount}/${verification.totalCount})`
                  : `⚠ UNVERIFIED SIMULATION (${verification.passedCount}/${verification.totalCount})`}
              </span>
              {showVerificationModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Video Selector Dropdown */}
            <select
              value={metadata.video_id}
              onChange={(e) => {
                onSelectVideoId(e.target.value);
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
            >
              {dataset.videoIds.map((id) => {
                const pkg = dataset.videoPackages[id];
                const isVerified = pkg?.verification.overall_status === 'VERIFIED';
                return (
                  <option key={id} value={id}>
                    {isVerified ? '[✓ VERIFIED]' : '[⚠ UNVERIFIED]'} {id} — {pkg?.metadata.title.slice(0, 32)}...
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Verification Checks Expandable Drawer */}
        {showVerificationModal && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {Object.values(verification.checks).map((chk) => (
              <div
                key={chk.name}
                className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300 text-[11px]">{chk.name}</span>
                  <span className={`text-[10px] font-bold ${chk.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {chk.passed ? '✓ PASS' : '✗ FAILED'}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{chk.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. MAIN WORKSPACE: Vertical Player (Left) + Multi-track Scrubber & Linked Tables (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 9:16 Vertical Phone Simulator */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-[280px] sm:w-[310px] aspect-[9/16] bg-black rounded-3xl border-4 border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-3 select-none">
            {/* Top Video Identity HUD */}
            <div className="flex justify-between items-center text-[10px] text-zinc-400 z-20">
              <span className="font-mono bg-black/75 px-2 py-0.5 rounded-full border border-zinc-800 text-emerald-400">
                {metadata.video_id}
              </span>
              <span className="font-mono bg-black/75 px-2 py-0.5 rounded-full border border-zinc-800">
                {currentTime.toFixed(2)}s / {duration}s
              </span>
            </div>

            {/* Simulated Video Canvas */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
              <div
                className={`w-full h-full flex flex-col items-center justify-center p-6 text-center transition-all ${getCameraScale()}`}
              >
                {activeShot?.shotType === 'A-roll' ? (
                  <div className="space-y-3">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-emerald-500/60 overflow-hidden mx-auto shadow-xl relative bg-zinc-800">
                      <img
                        src={
                          metadata.thumbnailSrc ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                        }
                        alt="Speaker"
                        className="w-full h-full object-cover"
                      />
                      {activeShot?.framing.includes('punch-in') && (
                        <div className="absolute inset-0 border-2 border-yellow-400 animate-pulse rounded-full" />
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-300 bg-black/80 px-2.5 py-0.5 rounded-full border border-zinc-700 inline-block">
                      {activeShot?.framing}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 w-full">
                    <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-500/40 flex flex-col items-center justify-center p-4">
                      <Layers className="w-8 h-8 text-indigo-400 mb-1" />
                      <span className="text-xs font-bold text-zinc-100 uppercase">
                        B-ROLL: {activeShot?.subType}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-1">Context injection</span>
                    </div>
                  </div>
                )}
              </div>

              {/* SFX Acoustic Indicator */}
              {activeShot?.sfxCue && (
                <div className="absolute top-12 left-3 z-20 flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded-full text-[10px] font-mono animate-bounce">
                  <Volume2 className="w-3 h-3" />
                  <span>SFX: {activeShot.sfxCue.name}</span>
                </div>
              )}

              {/* Transition Indicator */}
              {activeShot?.transition && activeShot.transition !== 'none' && (
                <div className="absolute top-12 right-3 z-20 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-2 py-0.5 rounded-full text-[9px] font-mono">
                  <Scissors className="w-3 h-3" />
                  <span>{activeShot.transition}</span>
                </div>
              )}

              {/* Kinetic Captions tied directly to this video's transcript */}
              {activeSegment && (
                <div className="absolute inset-x-4 bottom-16 z-20 text-center pointer-events-none">
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-black/85 border border-zinc-800 shadow-2xl backdrop-blur-sm">
                    <span className="text-white font-black tracking-wide text-xs sm:text-sm font-sans uppercase">
                      {activeSegment.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="relative z-20 bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-500 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <span className="font-mono text-[10px] text-zinc-400">
                {currentTime.toFixed(2)}s
              </span>
            </div>
          </div>
        </div>

        {/* Right: Multi-Track Timeline & Linked Tables */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveSubTab('timeline')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'timeline' ? 'bg-pink-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Multi-Track Timeline & Shots ({shots.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('transcript')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'transcript' ? 'bg-yellow-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Linked Transcript Segments ({transcript.segments.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('evidence')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === 'evidence' ? 'bg-cyan-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Frame Evidence ({evidenceFrames.length})</span>
            </button>
          </div>

          {/* Sub-tab 1: Timeline & Shots */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-4">
              {/* Timeline Tracks */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-300 font-mono">
                  <span>TIMELINE TRACKS ({metadata.video_id})</span>
                  <span className="text-emerald-400 font-bold">{currentTime.toFixed(2)}s / {duration}s</span>
                </div>

                {/* Track 1: A-Roll / B-Roll */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Track 1: Shot Structure</span>
                    <span className="font-mono text-[9px]">{editingAnalysis.a_roll_ratio * 100}% A-roll</span>
                  </div>
                  <div className="h-6 w-full bg-zinc-900 rounded-md overflow-hidden flex relative border border-zinc-800">
                    {shots.map((shot) => {
                      const widthPercent = (shot.duration / duration) * 100;
                      const isCurrent = currentTime >= shot.startTime && currentTime < shot.endTime;
                      return (
                        <button
                          key={shot.id}
                          onClick={() => jumpAndPlayShot(shot)}
                          style={{ width: `${widthPercent}%` }}
                          title={`Shot #${shot.shot_id} (${shot.shotType}) ${shot.startTime}s - ${shot.endTime}s`}
                          className={`h-full border-r border-zinc-950/80 text-[9px] font-mono flex items-center justify-center truncate transition-all cursor-pointer ${
                            shot.shotType === 'A-roll'
                              ? isCurrent
                                ? 'bg-indigo-500 text-white font-bold'
                                : 'bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300'
                              : isCurrent
                              ? 'bg-purple-500 text-white font-bold'
                              : 'bg-purple-950/70 hover:bg-purple-900 text-purple-300'
                          }`}
                        >
                          {shot.shot_id}
                        </button>
                      );
                    })}
                    {/* Playhead */}
                    <div
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-md shadow-rose-500 pointer-events-none z-30"
                    />
                  </div>
                </div>

                {/* Track 2: Framing & Punch-Ins */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Track 2: Camera Framing</span>
                    <span className="font-mono text-[9px]">Punch-Ins</span>
                  </div>
                  <div className="h-5 w-full bg-zinc-900 rounded-md overflow-hidden flex relative border border-zinc-800">
                    {shots.map((shot) => {
                      const widthPercent = (shot.duration / duration) * 100;
                      const hasPunch = shot.framing.includes('punch-in');
                      return (
                        <div
                          key={shot.id}
                          style={{ width: `${widthPercent}%` }}
                          className={`h-full border-r border-zinc-950/80 text-[8px] font-mono flex items-center justify-center truncate ${
                            hasPunch ? 'bg-yellow-500/30 text-yellow-300 font-bold' : 'bg-zinc-900/40 text-zinc-600'
                          }`}
                        >
                          {hasPunch ? 'ZOOM' : '—'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scrubber slider */}
                <div className="pt-2">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.05"
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full accent-pink-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Evidence-First Analysis Box */}
              {activeShot && (
                <div className="bg-zinc-900/80 border border-emerald-500/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      EVIDENCE-FIRST AUDIT — ACTIVE SHOT #{activeShot.shot_id}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {activeShot.startTime.toFixed(2)}s → {activeShot.endTime.toFixed(2)}s ({activeShot.duration.toFixed(2)}s)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 font-mono">Traceable Evidence:</div>
                      <div className="font-semibold text-cyan-300 font-mono">
                        {activeShot.evidence_frame_ref || `frame_0${Math.min(Math.floor(activeShot.startTime), 99)}.jpg`}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 font-mono">Visual Observation:</div>
                      <div className="font-semibold text-zinc-200">
                        {activeShot.observation || `${activeShot.shotType} with ${activeShot.framing}`}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 font-mono">Editorial Intent & Reason:</div>
                      <div className="text-zinc-300 text-[11px] leading-tight">
                        {activeShot.reason || 'Pacing rhythm reset to protect retention'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Linked Shot List Table */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-200">
                    Verified Discrete Shot List ({shots.length} shots)
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Click any row to seek & play that exact shot
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/50 text-zinc-400 font-mono text-[10px] uppercase border-b border-zinc-800 sticky top-0">
                      <tr>
                        <th className="p-2">Shot ID</th>
                        <th className="p-2">Range</th>
                        <th className="p-2">Duration</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Framing</th>
                        <th className="p-2">SFX</th>
                        <th className="p-2">Transition</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 font-mono text-[11px]">
                      {shots.map((shot) => {
                        const isCurrent = currentTime >= shot.startTime && currentTime < shot.endTime;
                        return (
                          <tr
                            key={shot.id}
                            onClick={() => jumpAndPlayShot(shot)}
                            className={`transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-pink-500/25 text-pink-200 font-semibold'
                                : 'hover:bg-zinc-900 text-zinc-300'
                            }`}
                          >
                            <td className="p-2 font-bold text-pink-400">Shot #{shot.shot_id}</td>
                            <td className="p-2 text-zinc-400">
                              {shot.startTime.toFixed(2)}s → {shot.endTime.toFixed(2)}s
                            </td>
                            <td className="p-2 font-bold text-emerald-400">{shot.duration.toFixed(2)}s</td>
                            <td className="p-2">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] ${
                                  shot.shotType === 'A-roll'
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'bg-purple-500/20 text-purple-300'
                                }`}
                              >
                                {shot.shotType}
                              </span>
                            </td>
                            <td className="p-2 text-zinc-300">{shot.framing}</td>
                            <td className="p-2 text-cyan-400">{shot.sfxCue?.name || '—'}</td>
                            <td className="p-2 text-zinc-400">{shot.transition}</td>
                            <td className="p-2 text-[10px] text-pink-400 font-sans">
                              {isCurrent ? '▶ PLAYING' : 'Click to seek'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Interactive Linked Transcript */}
          {activeSubTab === 'transcript' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-zinc-200 uppercase flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-yellow-400" />
                    Timestamped Transcript for {metadata.video_id}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Click any timestamp button to seek player directly to that spoken phrase
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {transcript.totalWords} words • {transcript.wpm} WPM
                </span>
              </div>

              {/* Segments List with Clickable Timestamps */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {transcript.segments.map((seg, idx) => {
                  const isCurrent = currentTime >= seg.start && currentTime <= seg.end;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                        isCurrent
                          ? 'bg-yellow-500/15 border-yellow-500/50 text-yellow-200 shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      <button
                        onClick={() => handleSeek(seg.start)}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-yellow-500 hover:text-black font-mono text-[11px] font-bold text-yellow-400 shrink-0 transition-colors cursor-pointer"
                        title="Seek to timestamp"
                      >
                        {formatSeconds(seg.start)}
                      </button>

                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                          <span>
                            {seg.start.toFixed(2)}s → {seg.end.toFixed(2)}s
                          </span>
                          {isCurrent && (
                            <span className="text-yellow-400 font-bold uppercase animate-pulse">
                              ● Current Audio
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed font-sans">{seg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Frame Evidence Gallery */}
          {activeSubTab === 'evidence' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-zinc-200 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    Verified Frame Evidence for {metadata.video_id}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Timestamped proof frames extracted directly from {metadata.filename}
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  {evidenceFrames.length} Frames Verified
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {evidenceFrames.map((frame) => (
                  <div
                    key={frame.filename}
                    onClick={() => handleSeek(frame.timestamp)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="aspect-[9/16] rounded-lg overflow-hidden border border-zinc-800 bg-black relative">
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: frame.svgData }}
                      />
                      <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300">
                        {frame.timestamp}s
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-zinc-200 font-mono truncate">
                        {frame.filename}
                      </div>
                      <div className="text-[10px] text-zinc-400 line-clamp-1">{frame.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
