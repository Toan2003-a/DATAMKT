import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Film,
  Bot,
  FileText,
  Clock,
  Download,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { ReferenceDataset, DatasetFilterOptions } from './types/dataset';
import { CREATOR_PRESETS } from './data/creatorPresets';
import { buildReferenceDataset } from './services/datasetGenerator';
import { Navbar } from './components/Navbar';
import { InputControlPanel } from './components/InputControlPanel';
import { FileTreeExplorer } from './components/FileTreeExplorer';
import { StyleDnaDashboard } from './components/StyleDnaDashboard';
import { VideoTimelineInspector } from './components/VideoTimelineInspector';
import { ClaudeBrainHub } from './components/ClaudeBrainHub';
import { TranscriptViewer } from './components/TranscriptViewer';
import { ReportsViewer } from './components/ReportsViewer';
import { RawFileViewer } from './components/RawFileViewer';
import { PipelineProgressModal } from './components/PipelineProgressModal';

export default function App() {
  // Current active dataset - Defaults to Anh Sắc Ánh (with verified video anh_sac_anh_020)
  const [dataset, setDataset] = useState<ReferenceDataset>(CREATOR_PRESETS.anh_sac_anh);
  const [activePresetKey, setActivePresetKey] = useState<string>('anh_sac_anh');

  // Currently inspected video ID
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    CREATOR_PRESETS.anh_sac_anh.videoIds[0] || 'anh_sac_anh_020'
  );

  // Pipeline execution state
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<number>(1);
  const [pipelineStageName, setPipelineStageName] = useState<string>('');
  const [pipelineDetail, setPipelineDetail] = useState<string>('');
  const [pendingCreatorName, setPendingCreatorName] = useState<string>('Anh Sắc Ánh');

  // Active view tab
  const [activeTab, setActiveTab] = useState<
    'style_dna' | 'timeline' | 'claude_hub' | 'transcripts' | 'reports' | 'raw_file'
  >('timeline');

  // Selected file for inspection in RawFileViewer
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    'ReferenceLibrary/anh_sac_anh/videos/anh_sac_anh_020/metadata.json'
  );
  const [selectedFileType, setSelectedFileType] = useState<string>('metadata_json');
  const [selectedFileData, setSelectedFileData] = useState<any>(
    CREATOR_PRESETS.anh_sac_anh.videoPackages['anh_sac_anh_020']?.metadata
  );

  // Switch to preset
  const handleSelectPreset = (presetKey: string) => {
    if (CREATOR_PRESETS[presetKey]) {
      const p = CREATOR_PRESETS[presetKey];
      setDataset(p);
      setActivePresetKey(presetKey);
      const firstId = p.videoIds[0];
      setSelectedVideoId(firstId);
      setSelectedFilePath(`ReferenceLibrary/${p.creatorName.toLowerCase().replace(/\s+/g, '_')}/videos/${firstId}/metadata.json`);
      setSelectedFileType('metadata_json');
      setSelectedFileData(p.videoPackages[firstId]?.metadata);
    }
  };

  // Run Dataset Builder pipeline
  const handleBuildDataset = async (options: DatasetFilterOptions) => {
    setIsBuilding(true);
    setPipelineStage(1);
    setPipelineStageName('Profile Resolver');
    setPipelineDetail(`Connecting to ${options.profileUrl}...`);
    setPendingCreatorName(options.creatorName || 'Creator');

    try {
      const generated = await buildReferenceDataset(options, (stage, name, detail) => {
        setPipelineStage(stage);
        setPipelineStageName(name);
        setPipelineDetail(detail);
      });

      setDataset(generated);
      setActivePresetKey('');
      const firstId = generated.videoIds[0];
      setSelectedVideoId(firstId);
      setSelectedFilePath(`ReferenceLibrary/${generated.creatorName.toLowerCase().replace(/\s+/g, '_')}/videos/${firstId}/metadata.json`);
      setSelectedFileType('metadata_json');
      setSelectedFileData(generated.videoPackages[firstId]?.metadata);
      setActiveTab('timeline');
    } catch (err) {
      console.error('Dataset pipeline error:', err);
    } finally {
      setIsBuilding(false);
    }
  };

  // When a file is clicked in the FileTreeExplorer
  const handleSelectFile = (
    filePath: string,
    fileType: string,
    fileData: any,
    videoId?: string
  ) => {
    setSelectedFilePath(filePath);
    setSelectedFileType(fileType);
    setSelectedFileData(fileData);

    if (videoId) {
      setSelectedVideoId(videoId);
    }

    // Contextual routing:
    if (fileType === 'style_dna' || fileType === 'patterns') {
      setActiveTab('style_dna');
    } else if (fileType === 'editing_bible') {
      setActiveTab('claude_hub');
    } else if (
      fileType === 'video_file' ||
      fileType === 'shots_json' ||
      fileType === 'verification_json' ||
      fileType === 'evidence_frame' ||
      fileType === 'editing_analysis_json'
    ) {
      setActiveTab('timeline');
    } else if (fileType === 'transcript_json') {
      setActiveTab('transcripts');
    } else if (fileType === 'report_creator' || fileType === 'report_dataset') {
      setActiveTab('reports');
    } else {
      setActiveTab('raw_file');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        dataset={dataset}
        isGenerating={isBuilding}
        onQuickPreset={handleSelectPreset}
        activePresetKey={activePresetKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Input Control Form */}
        <InputControlPanel
          onBuildDataset={handleBuildDataset}
          isBuilding={isBuilding}
          activeCreatorName={dataset?.creatorName}
        />

        {/* Dataset Workspace Header */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-zinc-700 overflow-hidden bg-zinc-800 shrink-0">
              <img
                src={dataset.avatarUrl}
                alt={dataset.creatorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-100">{dataset.creatorName}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-pink-400 border border-zinc-700">
                  {dataset.styleDNA.profileHandle}
                </span>
                {(() => {
                  const verified = dataset.videoIds.filter(
                    (id) => dataset.videoPackages[id]?.verification?.overall_status === 'VERIFIED'
                  ).length;
                  const unverified = dataset.videoIds.length - verified;
                  return (
                    <>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60">
                        <ShieldCheck className="w-3.5 h-3.5" /> {verified} Source-Verified
                      </span>
                      {unverified > 0 && (
                        <span className="text-xs text-amber-400 font-medium flex items-center gap-1 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60" title="Simulated reference items, excluded from Style DNA learning">
                          <AlertTriangle className="w-3.5 h-3.5" /> {unverified} Unverified (Simulated)
                        </span>
                      )}
                      {dataset.sourceIdentity?.video_id && (
                        <span className="text-xs text-zinc-300 font-mono bg-zinc-800/90 px-2 py-0.5 rounded border border-zinc-700 flex items-center gap-1">
                          <span className="text-zinc-500">Video ID:</span>
                          <span className="text-pink-400 font-bold">{dataset.sourceIdentity.video_id}</span>
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{dataset.bio}</p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 text-xs overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video & Identity Inspector ({dataset.videoIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('style_dna')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'style_dna'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Style DNA & 18 Answers</span>
            </button>

            <button
              onClick={() => setActiveTab('transcripts')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'transcripts'
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Linked Transcripts</span>
            </button>

            <button
              onClick={() => setActiveTab('claude_hub')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'claude_hub'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-300" />
              <span>Claude Brain Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('raw_file')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'raw_file'
                  ? 'bg-zinc-800 text-zinc-100 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Raw File</span>
            </button>
          </div>
        </div>

        {/* Dual-Pane Layout: Left File Tree Explorer + Right Dynamic Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: File Tree Explorer */}
          <div className="lg:col-span-4 sticky top-20">
            <FileTreeExplorer
              dataset={dataset}
              selectedFilePath={selectedFilePath}
              selectedVideoId={selectedVideoId}
              onSelectFile={handleSelectFile}
            />
          </div>

          {/* Right Column: Dynamic Workspace Content */}
          <div className="lg:col-span-8">
            {activeTab === 'timeline' && (
              <VideoTimelineInspector
                dataset={dataset}
                selectedVideoId={selectedVideoId}
                onSelectVideoId={(id) => setSelectedVideoId(id)}
              />
            )}

            {activeTab === 'style_dna' && (
              <StyleDnaDashboard
                dataset={dataset}
                onExploreTimeline={() => setActiveTab('timeline')}
                onOpenClaudePrompt={() => setActiveTab('claude_hub')}
              />
            )}

            {activeTab === 'transcripts' && (
              <TranscriptViewer
                dataset={dataset}
                selectedVideoId={selectedVideoId}
                onSelectVideoId={(id) => setSelectedVideoId(id)}
                onSeek={(sec) => {
                  setActiveTab('timeline');
                }}
              />
            )}

            {activeTab === 'claude_hub' && (
              <ClaudeBrainHub dataset={dataset} />
            )}

            {activeTab === 'reports' && (
              <ReportsViewer dataset={dataset} />
            )}

            {activeTab === 'raw_file' && (
              <RawFileViewer
                filePath={selectedFilePath}
                fileType={selectedFileType}
                fileData={selectedFileData}
              />
            )}
          </div>
        </div>
      </main>

      {/* Progress Modal */}
      <PipelineProgressModal
        isOpen={isBuilding}
        stage={pipelineStage}
        stageName={pipelineStageName}
        detail={pipelineDetail}
        creatorName={pendingCreatorName}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-4 mt-12 text-center text-xs text-zinc-500">
        <p>
          TikTok Reference Dataset Builder • Video Identity & Verification Layer Enforced.
        </p>
        <p className="mt-1 text-[11px] text-zinc-600">
          Every video package is 100% bound to its origin metadata, verified transcript, and timestamped frame evidence.
        </p>
      </footer>
    </div>
  );
}
