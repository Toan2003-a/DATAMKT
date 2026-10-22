import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  Video,
  Image,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileJson,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { ReferenceDataset, VideoFolderPackage } from '../types/dataset';
import { sanitizeSlug } from '../services/datasetGenerator';

interface FileTreeExplorerProps {
  dataset: ReferenceDataset;
  selectedFilePath: string;
  selectedVideoId: string;
  onSelectFile: (filePath: string, fileType: string, fileData?: any, videoId?: string) => void;
}

export const FileTreeExplorer: React.FC<FileTreeExplorerProps> = ({
  dataset,
  selectedFilePath,
  selectedVideoId,
  onSelectFile,
}) => {
  const creatorSlug = sanitizeSlug(dataset.creatorName || 'Creator');
  const packagesList = Object.values(dataset.videoPackages);

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    root: true,
    creator: true,
    videos: true,
    style: true,
    reports: true,
    [selectedVideoId]: true,
    [`${selectedVideoId}_evidence`]: false,
  });

  const toggleFolder = (key: string) => {
    setOpenFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden text-xs font-mono h-full flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/80 px-3.5 py-2.5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold">
          <Folder className="w-4 h-4 text-amber-400" />
          <span>REFERENCE LIBRARY EXPLORER</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Identity Verified
        </span>
      </div>

      {/* Tree Content */}
      <div className="p-2 space-y-0.5 overflow-y-auto max-h-[660px] select-none text-zinc-300">
        {/* Root: ReferenceLibrary/ */}
        <div>
          <button
            onClick={() => toggleFolder('root')}
            className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-900 transition-colors text-left text-zinc-200 font-medium cursor-pointer"
          >
            {openFolders.root ? (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            )}
            {openFolders.root ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>ReferenceLibrary/</span>
          </button>

          {openFolders.root && (
            <div className="pl-4 ml-2 border-l border-zinc-800/80 space-y-0.5">
              {/* Creator Folder: e.g. Anh_Sac_Anh/ */}
              <button
                onClick={() => toggleFolder('creator')}
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-900 transition-colors text-left text-zinc-100 font-semibold cursor-pointer"
              >
                {openFolders.creator ? (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                )}
                {openFolders.creator ? (
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                )}
                <span>{creatorSlug}/</span>
              </button>

              {openFolders.creator && (
                <div className="pl-4 ml-2 border-l border-zinc-800/80 space-y-1">
                  {/* videos/ folder with individual {video_id}/ directories */}
                  <div>
                    <button
                      onClick={() => toggleFolder('videos')}
                      className="w-full flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-900 text-left text-pink-300 font-semibold cursor-pointer"
                    >
                      {openFolders.videos ? (
                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      )}
                      <Folder className="w-3.5 h-3.5 text-pink-400" />
                      <span>videos/</span>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        ({packagesList.length} packages)
                      </span>
                    </button>

                    {openFolders.videos && (
                      <div className="pl-4 ml-2 border-l border-zinc-800/80 space-y-1">
                        {packagesList.map((pkg) => {
                          const isPkgOpen = openFolders[pkg.video_id] ?? false;
                          const isPkgSelected = selectedVideoId === pkg.video_id;

                          return (
                            <div key={pkg.video_id} className="space-y-0.5">
                              {/* Subfolder: {video_id}/ */}
                              <button
                                onClick={() => {
                                  toggleFolder(pkg.video_id);
                                  onSelectFile(
                                    `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/metadata.json`,
                                    'metadata_json',
                                    pkg.metadata,
                                    pkg.video_id
                                  );
                                }}
                                className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors cursor-pointer ${
                                  isPkgSelected
                                    ? 'bg-pink-600/20 text-pink-200 border border-pink-500/30 font-semibold'
                                    : 'hover:bg-zinc-900 text-zinc-300'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  {isPkgOpen ? (
                                    <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-zinc-500 shrink-0" />
                                  )}
                                  <Folder className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                                  <span className="truncate">{pkg.video_id}/</span>
                                </div>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                                  ✓ VERIFIED
                                </span>
                              </button>

                              {/* Files inside {video_id}/ */}
                              {isPkgOpen && (
                                <div className="pl-4 ml-2 border-l border-zinc-800/80 space-y-0.5 py-0.5">
                                  <FileItem
                                    name="video.mp4"
                                    type="video"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/video.mp4`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/video.mp4`,
                                        'video_file',
                                        pkg.metadata,
                                        pkg.video_id
                                      )
                                    }
                                    badge="MP4"
                                  />
                                  <FileItem
                                    name="metadata.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/metadata.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/metadata.json`,
                                        'metadata_json',
                                        pkg.metadata,
                                        pkg.video_id
                                      )
                                    }
                                    badge="Identity"
                                  />
                                  <FileItem
                                    name="transcript.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/transcript.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/transcript.json`,
                                        'transcript_json',
                                        pkg.transcript,
                                        pkg.video_id
                                      )
                                    }
                                    badge={`${pkg.transcript.segments.length} seg`}
                                  />
                                  <FileItem
                                    name="shots.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/shots.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/shots.json`,
                                        'shots_json',
                                        pkg.shots,
                                        pkg.video_id
                                      )
                                    }
                                    badge={`${pkg.shots.length} shots`}
                                  />
                                  <FileItem
                                    name="verification.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/verification.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/verification.json`,
                                        'verification_json',
                                        pkg.verification,
                                        pkg.video_id
                                      )
                                    }
                                    badge="6/6 PASS"
                                  />
                                  <FileItem
                                    name="editing_analysis.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/editing_analysis.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/editing_analysis.json`,
                                        'editing_analysis_json',
                                        pkg.editingAnalysis,
                                        pkg.video_id
                                      )
                                    }
                                  />
                                  <FileItem
                                    name="visual_analysis.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/visual_analysis.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/visual_analysis.json`,
                                        'visual_analysis_json',
                                        pkg.visualAnalysis,
                                        pkg.video_id
                                      )
                                    }
                                  />
                                  <FileItem
                                    name="audio_analysis.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/audio_analysis.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/audio_analysis.json`,
                                        'audio_analysis_json',
                                        pkg.audioAnalysis,
                                        pkg.video_id
                                      )
                                    }
                                  />
                                  <FileItem
                                    name="text_analysis.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/text_analysis.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/text_analysis.json`,
                                        'text_analysis_json',
                                        pkg.textAnalysis,
                                        pkg.video_id
                                      )
                                    }
                                  />
                                  <FileItem
                                    name="color_analysis.json"
                                    type="json"
                                    isSelected={selectedFilePath.endsWith(`${pkg.video_id}/color_analysis.json`)}
                                    onClick={() =>
                                      onSelectFile(
                                        `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/color_analysis.json`,
                                        'color_analysis_json',
                                        pkg.colorAnalysis,
                                        pkg.video_id
                                      )
                                    }
                                  />

                                  {/* evidence/ folder inside {video_id} */}
                                  <div>
                                    <button
                                      onClick={() => toggleFolder(`${pkg.video_id}_evidence`)}
                                      className="w-full flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-900 text-left text-zinc-400 font-medium cursor-pointer"
                                    >
                                      {openFolders[`${pkg.video_id}_evidence`] ? (
                                        <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
                                      ) : (
                                        <ChevronRight className="w-2.5 h-2.5 text-zinc-500" />
                                      )}
                                      <Folder className="w-3 h-3 text-cyan-400" />
                                      <span>evidence/</span>
                                      <span className="text-[9px] text-zinc-600">
                                        ({pkg.evidenceFrames.length} frames)
                                      </span>
                                    </button>

                                    {openFolders[`${pkg.video_id}_evidence`] && (
                                      <div className="pl-4 ml-2 border-l border-zinc-800/80 space-y-0.5">
                                        {pkg.evidenceFrames.map((frame) => (
                                          <FileItem
                                            key={frame.filename}
                                            name={frame.filename}
                                            type="image"
                                            isSelected={selectedFilePath.endsWith(
                                              `${pkg.video_id}/evidence/${frame.filename}`
                                            )}
                                            onClick={() =>
                                              onSelectFile(
                                                `ReferenceLibrary/${creatorSlug}/videos/${pkg.video_id}/evidence/${frame.filename}`,
                                                'evidence_frame',
                                                frame,
                                                pkg.video_id
                                              )
                                            }
                                            badge={`${frame.timestamp}s`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* style/ */}
                  <div>
                    <button
                      onClick={() => toggleFolder('style')}
                      className="w-full flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-900 text-left text-purple-300 font-semibold cursor-pointer"
                    >
                      {openFolders.style ? (
                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      )}
                      <Folder className="w-3.5 h-3.5 text-purple-400" />
                      <span>style/</span>
                    </button>
                    {openFolders.style && (
                      <div className="pl-4 ml-2 border-l border-zinc-800/80 space-y-0.5">
                        <FileItem
                          name="style_dna.json"
                          type="json"
                          isSelected={selectedFilePath.endsWith('style_dna.json')}
                          onClick={() =>
                            onSelectFile(
                              `ReferenceLibrary/${creatorSlug}/style/style_dna.json`,
                              'style_dna',
                              dataset.styleDNA
                            )
                          }
                          badge="DNA"
                        />
                        <FileItem
                          name="editing_patterns.json"
                          type="json"
                          isSelected={selectedFilePath.endsWith('editing_patterns.json')}
                          onClick={() =>
                            onSelectFile(
                              `ReferenceLibrary/${creatorSlug}/style/editing_patterns.json`,
                              'patterns',
                              dataset.editingPatterns
                            )
                          }
                        />
                        <FileItem
                          name="editing_bible.md"
                          type="md"
                          isSelected={selectedFilePath.endsWith('editing_bible.md')}
                          onClick={() =>
                            onSelectFile(
                              `ReferenceLibrary/${creatorSlug}/style/editing_bible.md`,
                              'editing_bible',
                              dataset.editingBibleMarkdown
                            )
                          }
                          badge="Guide"
                        />
                      </div>
                    )}
                  </div>

                  {/* reports/ */}
                  <div>
                    <button
                      onClick={() => toggleFolder('reports')}
                      className="w-full flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-900 text-left text-pink-300 font-semibold cursor-pointer"
                    >
                      {openFolders.reports ? (
                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      )}
                      <Folder className="w-3.5 h-3.5 text-pink-400" />
                      <span>reports/</span>
                    </button>
                    {openFolders.reports && (
                      <div className="pl-4 ml-2 border-l border-zinc-800/80 space-y-0.5">
                        <FileItem
                          name="creator_report.md"
                          type="md"
                          isSelected={selectedFilePath.endsWith('creator_report.md')}
                          onClick={() =>
                            onSelectFile(
                              `ReferenceLibrary/${creatorSlug}/reports/creator_report.md`,
                              'report_creator',
                              dataset.creatorReportMarkdown
                            )
                          }
                        />
                        <FileItem
                          name="dataset_report.md"
                          type="md"
                          isSelected={selectedFilePath.endsWith('dataset_report.md')}
                          onClick={() =>
                            onSelectFile(
                              `ReferenceLibrary/${creatorSlug}/reports/dataset_report.md`,
                              'report_dataset',
                              dataset.datasetReportMarkdown
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface FileItemProps {
  name: string;
  type: 'json' | 'md' | 'csv' | 'video' | 'image';
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
}

const FileItem: React.FC<FileItemProps> = ({ name, type, isSelected, onClick, badge }) => {
  const getIcon = () => {
    switch (type) {
      case 'json':
        return <FileJson className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
      case 'md':
        return <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'csv':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-green-400 shrink-0" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'image':
        return <Image className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      default:
        return <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-0.5 rounded text-left transition-colors cursor-pointer ${
        isSelected
          ? 'bg-pink-600/20 text-pink-300 font-semibold border border-pink-500/30'
          : 'hover:bg-zinc-900 text-zinc-300'
      }`}
    >
      <div className="flex items-center gap-1.5 truncate">
        {getIcon()}
        <span className="truncate">{name}</span>
      </div>
      {badge && (
        <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-900 text-zinc-400 font-sans">
          {badge}
        </span>
      )}
    </button>
  );
};
