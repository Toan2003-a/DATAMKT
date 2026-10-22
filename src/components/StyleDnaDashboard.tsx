import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  Layers,
  Type,
  Volume2,
  Eye,
  Scissors,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Share2,
  Palette,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { StyleDNA, ReferenceDataset } from '../types/dataset';

interface StyleDnaDashboardProps {
  dataset: ReferenceDataset;
  onExploreTimeline?: () => void;
  onOpenClaudePrompt?: () => void;
}

export const StyleDnaDashboard: React.FC<StyleDnaDashboardProps> = ({
  dataset,
  onExploreTimeline,
  onOpenClaudePrompt,
}) => {
  const { styleDNA } = dataset;
  const m = styleDNA.metrics;
  const a = styleDNA.answersToQuestions;
  const [activeCategory, setActiveCategory] = useState<'all' | 'pacing' | 'framing' | 'text' | 'audio' | 'story'>(
    'all'
  );

  const questionsList = [
    {
      id: 'pacing',
      q: '1. Creator này edit nhanh hay chậm?',
      ans: a.pacingSpeed,
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      category: 'pacing',
    },
    {
      id: 'asd',
      q: '2. Average shot duration (ASD) bao nhiêu?',
      ans: a.averageShotDuration,
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
      category: 'pacing',
    },
    {
      id: 'ab_ratio',
      q: '3. A-roll/B-roll ratio như thế nào?',
      ans: a.aRollBRollRatio,
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      category: 'framing',
    },
    {
      id: 'broll_trigger',
      q: '4. B-roll xuất hiện khi nào?',
      ans: a.bRollTriggerTiming,
      icon: <Eye className="w-4 h-4 text-sky-400" />,
      category: 'framing',
    },
    {
      id: 'broll_types',
      q: '5. Họ dùng loại B-roll nào?',
      ans: a.bRollTypesUsed,
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      category: 'framing',
    },
    {
      id: 'face_hold',
      q: '6. Khi nào họ giữ khuôn mặt?',
      ans: a.faceRetentionStrategy,
      icon: <Eye className="w-4 h-4 text-rose-400" />,
      category: 'framing',
    },
    {
      id: 'punch_in',
      q: '7. Khi nào họ punch-in?',
      ans: a.punchInLogic,
      icon: <Scissors className="w-4 h-4 text-pink-400" />,
      category: 'framing',
    },
    {
      id: 'text_density',
      q: '8. Text xuất hiện với mật độ bao nhiêu?',
      ans: a.textDensityDescription,
      icon: <Type className="w-4 h-4 text-yellow-400" />,
      category: 'text',
    },
    {
      id: 'typography',
      q: '9. Typography có đặc điểm gì?',
      ans: a.typographySignature,
      icon: <Type className="w-4 h-4 text-yellow-300" />,
      category: 'text',
    },
    {
      id: 'transition',
      q: '10. Transition language là gì?',
      ans: a.transitionLanguage,
      icon: <Scissors className="w-4 h-4 text-cyan-400" />,
      category: 'pacing',
    },
    {
      id: 'sfx_role',
      q: '11. SFX được dùng ở đâu?',
      ans: a.sfxRoleAndPlacement,
      icon: <Volume2 className="w-4 h-4 text-orange-400" />,
      category: 'audio',
    },
    {
      id: 'music_role',
      q: '12. Music đóng vai trò gì?',
      ans: a.musicRoleDescription,
      icon: <Volume2 className="w-4 h-4 text-rose-400" />,
      category: 'audio',
    },
    {
      id: 'color_grading',
      q: '13. Color grading như thế nào?',
      ans: a.colorGradingAesthetic,
      icon: <Palette className="w-4 h-4 text-pink-400" />,
      category: 'framing',
    },
    {
      id: 'effect_density',
      q: '14. Effect density bao nhiêu?',
      ans: a.effectDensity,
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      category: 'pacing',
    },
    {
      id: 'frequent_fx',
      q: '15. Những effect nào thường xuyên được sử dụng?',
      ans: a.frequentEffects,
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      category: 'pacing',
    },
    {
      id: 'rare_fx',
      q: '16. Những effect nào họ gần như không sử dụng (Anti-patterns)?',
      ans: a.rareOrForbiddenEffects,
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
      category: 'pacing',
    },
    {
      id: 'hook_build',
      q: '17. Hook được xây dựng như thế nào?',
      ans: a.hookStructure,
      icon: <Flame className="w-4 h-4 text-amber-500" />,
      category: 'story',
    },
    {
      id: 'climax_ending',
      q: '18. Climax & Ending được xử lý như thế nào?',
      ans: `${a.climaxHandling} | ${a.endingCharacteristics}`,
      icon: <Zap className="w-4 h-4 text-indigo-400" />,
      category: 'story',
    },
  ];

  const filteredQuestions =
    activeCategory === 'all'
      ? questionsList
      : questionsList.filter((item) => item.category === activeCategory);

  const packagesList = Object.values(dataset.videoPackages || {});
  const allVerified = packagesList.every((p) => p.verification?.canProceedToLearning);

  return (
    <div className="space-y-6">
      {/* Source Verification Gate Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono shadow-xl ${
        allVerified
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
          : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
      }`}>
        <div className="flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider text-zinc-100">
              SOURCE VERIFICATION GATE:
            </span>{' '}
            <span>
              {allVerified
                ? `100% of underlying videos (${packagesList.length}/${packagesList.length}) passed all verification gates. Style DNA is verified and traceable.`
                : 'Unverified sources detected. Style learning is locked until verification passes.'}
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 shrink-0">
          PROTECTED CORE ACTIVE
        </span>
      </div>

      {/* Top Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* ASD */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Avg Shot Duration</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono tracking-tight">
            {m.averageShotDuration}s
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Pacing signature</p>
        </div>

        {/* CPM */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Cuts / Minute</span>
            <Scissors className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-yellow-400 font-mono tracking-tight">
            {m.cutsPerMinute}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Cut density</p>
        </div>

        {/* A-Roll / B-Roll */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>A/B Roll Ratio</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-400 font-mono tracking-tight">
            {m.aRollPercentage}%<span className="text-zinc-500 text-sm">/{m.bRollPercentage}%</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Talking vs Cutaway</p>
        </div>

        {/* Text Density */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Text Density</span>
            <Type className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-pink-400 font-mono tracking-tight">
            {m.textDensityPercentage}%
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Captions coverage</p>
        </div>

        {/* SFX Density */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>SFX Frequency</span>
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-400 font-mono tracking-tight">
            {m.sfxDensityPerMin}<span className="text-xs text-zinc-500">/m</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Audio events</p>
        </div>

        {/* Hook Cut */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-xl shadow-lg relative overflow-hidden group">
          <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>First Cut Trigger</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-400 font-mono tracking-tight">
            {styleDNA.hookFormula.firstCutTimestamp}s
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">0-3s hook threshold</p>
        </div>
      </div>

      {/* Visual Style Palette & Typography Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Typography Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-semibold text-zinc-200 uppercase flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-yellow-400" /> Typography Signature
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
              {m.typography.maxWordsPerFrame} words / frame max
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-zinc-400">Font: <strong className="text-zinc-100">{m.typography.family}</strong></div>
            <div className="text-zinc-400">Weight & Case: <strong className="text-zinc-100">{m.typography.weight}, {m.typography.case}</strong></div>
            <div className="text-zinc-400">Animation: <span className="text-zinc-300">{m.typography.animationStyle}</span></div>
          </div>
          {/* Sample Kinetic Badge */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg text-center font-black text-base tracking-wider">
            <span className="text-white">STOP </span>
            <span className="text-yellow-400 px-1 rounded bg-yellow-400/20 underline decoration-yellow-400">
              MAKING
            </span>
            <span className="text-white"> THIS</span>
          </div>
        </div>

        {/* Color Palette Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-semibold text-zinc-200 uppercase flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" /> Color DNA & Lighting
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
              Grading
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
              <div className="w-5 h-5 mx-auto rounded-full bg-white shadow-sm border border-zinc-600 mb-1" />
              <div className="text-[10px] text-zinc-400">Primary Text</div>
              <div className="text-[10px] font-mono text-zinc-200">#FFFFFF</div>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
              <div className="w-5 h-5 mx-auto rounded-full bg-[#FFE600] shadow-sm mb-1" />
              <div className="text-[10px] text-zinc-400">Highlight 1</div>
              <div className="text-[10px] font-mono text-zinc-200">#FFE600</div>
            </div>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-center">
              <div className="w-5 h-5 mx-auto rounded-full bg-[#00FF66] shadow-sm mb-1" />
              <div className="text-[10px] text-zinc-400">Highlight 2</div>
              <div className="text-[10px] font-mono text-zinc-200">#00FF66</div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 italic">
            "{m.colorPalette.backgroundAesthetic}"
          </p>
        </div>

        {/* Transition & SFX Rule */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-semibold text-zinc-200 uppercase flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Audio & Transition Lexicon
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
              {m.transitions.dominant}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="text-zinc-400">
              Music Bed: <span className="text-zinc-200">{m.musicRole}</span>
            </div>
            <div className="text-zinc-400">
              Face Hold Limit: <strong className="text-amber-300">{m.faceRetentionRule}</strong>
            </div>
            <div className="text-zinc-400">
              Punch-In Trigger: <span className="text-zinc-200">{m.punchInFrequency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 18 Essential Questions Answered (User Request Core) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              The 18 Essential Editing Questions Answered
            </h3>
            <p className="text-xs text-zinc-400">
              Direct quantitative answers reverse-engineered from {styleDNA.totalVideosAnalyzed} sampled videos
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-pink-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All (18)
            </button>
            <button
              onClick={() => setActiveCategory('pacing')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'pacing'
                  ? 'bg-pink-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pacing & Cuts
            </button>
            <button
              onClick={() => setActiveCategory('framing')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'framing'
                  ? 'bg-pink-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Framing & A/B Roll
            </button>
            <button
              onClick={() => setActiveCategory('text')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'text'
                  ? 'bg-pink-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Typography
            </button>
            <button
              onClick={() => setActiveCategory('audio')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'audio'
                  ? 'bg-pink-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Audio & SFX
            </button>
            <button
              onClick={() => setActiveCategory('story')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'story'
                  ? 'bg-pink-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hook & Climax
            </button>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredQuestions.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-3.5 space-y-2 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-pink-300 transition-colors">
                    {item.q}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    {item.ans}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anti-Patterns & Golden Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Golden Rules */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase border-b border-zinc-800 pb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Golden Editing Rules (Always Follow)</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Punch in (+15-25% scale) every 2.0 to 2.8s or whenever emphatic verbs are spoken.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Synchronize whoosh or pop SFX within 1 frame of every visual element entry.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Display maximum 2-3 words per kinetic text card, highlighting the key word.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Execute first visual interruption (zoom or cutaway) within first 1.5 seconds.</span>
            </li>
          </ul>
        </div>

        {/* Anti-Patterns */}
        <div className="bg-zinc-950 border border-rose-900/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase border-b border-zinc-800 pb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Strict Anti-Patterns (What this creator NEVER does)</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {m.antiPatterns.map((anti, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">✕</span>
                <span>{anti.replace(/NEVER\s+/i, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
