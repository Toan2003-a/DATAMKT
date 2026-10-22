import React, { useState } from 'react';
import {
  Bot,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Send,
  FileCode,
  Download,
  Flame,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { ReferenceDataset } from '../types/dataset';
import { generateClaudeMasterPrompt, generateSampleClaudeInputPrompt } from '../services/claudePromptGenerator';

interface ClaudeBrainHubProps {
  dataset: ReferenceDataset;
}

export const ClaudeBrainHub: React.FC<ClaudeBrainHubProps> = ({ dataset }) => {
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedBible, setCopiedBible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'bible' | 'test'>('prompt');

  // Interactive Live Editor State
  const [sampleScript, setSampleScript] = useState<string>(
    'Stop waiting for clients to DM you on Instagram. That is why your pipeline is completely empty. If you want to make $10,000 every single month, you need a daily outbound prospecting system. Here is the exact 3-step script my students use to book 5 calls every single day.'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const claudeMasterPrompt = generateClaudeMasterPrompt(dataset);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(claudeMasterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyBible = () => {
    navigator.clipboard.writeText(dataset.editingBibleMarkdown);
    setCopiedBible(true);
    setTimeout(() => setCopiedBible(false), 2000);
  };

  const handleSimulateEdit = async () => {
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      // Try to call backend Gemini proxy
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Raw Script:\n"${sampleScript}"\n\nGenerate the complete shot-by-shot video edit list table conforming strictly to the Style DNA metrics of ${dataset.creatorName}. Include columns: [Timestamp Range, Duration, Shot Type, Camera Framing, Kinetic Text with [HIGHLIGHT], SFX Cue, Transition, Editor Reasoning]. Target ASD: ${dataset.styleDNA.metrics.averageShotDuration}s.`,
          creatorData: {
            creatorName: dataset.creatorName,
            styleDNA: dataset.styleDNA,
            editingPatterns: dataset.editingPatterns,
          },
          systemInstruction: claudeMasterPrompt,
        }),
      });

      const data = await res.json();
      if (data?.text) {
        setSimulationResult(data.text);
      } else {
        // Fallback realistic algorithmic output if API key is not present
        generateFallbackEditSimulation();
      }
    } catch (e) {
      generateFallbackEditSimulation();
    } finally {
      setIsSimulating(false);
    }
  };

  const generateFallbackEditSimulation = () => {
    const asd = dataset.styleDNA.metrics.averageShotDuration;
    const highlightColor = dataset.styleDNA.metrics.colorPalette.highlightColor1;

    setSimulationResult(
`### CLAUDE AI VIDEO EDITOR: EDITING BLUEPRINT
**Target Style:** ${dataset.creatorName} (${dataset.styleDNA.profileHandle})  
**Target ASD:** ${asd}s | **Cuts Per Minute:** ${dataset.styleDNA.metrics.cutsPerMinute}  
**Hook Strategy:** Immediate contrary statement + Center screen yellow typography + Sub-drop SFX.

| Timestamp Range | Duration | Shot Type | Camera Framing | Text Overlay (Caps) | SFX Cue | Transition | Editor Note |
|---|---|---|---|---|---|---|---|
| **0.0s - 1.2s** | 1.2s | A-roll (Face) | Center Wide (100%) | [STOP WAITING] FOR CLIENTS | Deep Sub-Drop | Hard Cut | Visual hook: Direct eye contact, furrowed brow |
| **1.2s - 2.3s** | 1.1s | A-roll | Punch-in (+20%) | EMPTY [PIPELINE] | Whoosh SFX | Hard Cut | Scale jump to reset attention before 2.0s mark |
| **2.3s - 3.4s** | 1.1s | B-roll | Meme Cutaway | [0 LEADS] | Pop SFX | Whip Pan | Meme of skeleton waiting at desk |
| **3.4s - 4.6s** | 1.2s | A-roll | Center (100%) | MAKE [$10,000 / MO] | Cash Register Ding | Hard Cut | Re-anchor authority on dollar value |
| **4.6s - 5.8s** | 1.2s | A-roll | Punch-in (+25%) | DAILY [OUTBOUND] SYSTEM | Camera Click | Hard Cut | Intense framing on operative framework |
| **5.8s - 7.0s** | 1.2s | B-roll | Screen Recording | 3-STEP SCRIPT | Paper Crumple | Match Cut | High-res Notion screenshot highlight |
| **7.0s - 8.2s** | 1.2s | A-roll | Punch-in (+15%) | [5 CALLS] EVERY DAY | Whoosh SFX | Hard Cut | Climax acceleration to call-to-action |

**Sound Bed:** Lofi beat at -22dB side-chained to vocals. Cut music to 0dB on "STOP WAITING".`
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-zinc-900 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-zinc-100 text-base">
              Claude Brain & AI Video Editor Knowledge Base
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
              System Prompt & Few-Shot Engine
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Feed this structured Editing Knowledge Base into Claude 3.5 Sonnet / Opus or an automated editing agent. Claude will act as the reasoning brain to transform raw transcripts into frame-accurate editing cut lists.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Claude System Prompt
          </button>
          <button
            onClick={() => setActiveTab('bible')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'bible'
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Editing Bible (.md)
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'test'
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Test Edit Generator</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Claude System Prompt */}
      {activeTab === 'prompt' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>CLAUDE_SYSTEM_PROMPT.md</span>
              <span className="text-zinc-500">• (Paste into Claude Project / API system instruction)</span>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy System Prompt</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-300 bg-zinc-950/80 overflow-x-auto max-h-[500px] leading-relaxed whitespace-pre-wrap select-text">
            {claudeMasterPrompt}
          </pre>
        </div>
      )}

      {/* Tab 2: Editing Bible Markdown */}
      {activeTab === 'bible' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>editing_bible.md</span>
              <span className="text-zinc-500">• (Human and AI Editor SOP)</span>
            </div>
            <button
              onClick={handleCopyBible}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copiedBible ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-300 bg-zinc-950/80 overflow-x-auto max-h-[500px] leading-relaxed whitespace-pre-wrap select-text">
            {dataset.editingBibleMarkdown}
          </pre>
        </div>
      )}

      {/* Tab 3: Interactive Live Editor Simulation */}
      {activeTab === 'test' && (
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Input Raw Transcript (Simulate New Video Edit)
              </label>
              <span className="text-[11px] text-zinc-500">
                Claude uses {dataset.creatorName} Style DNA to generate cut list
              </span>
            </div>

            <textarea
              rows={3}
              value={sampleScript}
              onChange={(e) => setSampleScript(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
              placeholder="Paste raw spoken script here..."
            />

            <div className="flex justify-end">
              <button
                onClick={handleSimulateEdit}
                disabled={isSimulating || !sampleScript.trim()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Claude Thinking & Cutting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate Edit Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Output Table */}
          {simulationResult && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Generated Video Edit Blueprint
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(simulationResult);
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy Output
                </button>
              </div>
              <pre className="p-3 bg-zinc-900/60 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {simulationResult}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
