export interface VideoMetadata {
  request_id: string; // e.g. "REQ-2026-001"
  platform: string; // "tiktok"
  creator_username: string; // "@anhsacanh.vn"
  creator_id: string; // "tiktok_user_anhsacanh"
  video_id: string; // e.g. "tiktok:7302098273618" or "anh_sac_anh_020"
  filename: string; // "video.mp4"
  original_filename: string; // "020.mp4"
  source_url: string; // exact TikTok video URL
  title: string;
  description: string;
  duration: number; // in seconds
  uploadDate: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  fps: number;
  resolution: string; // "1080x1920"
  aspect_ratio: string; // "9:16"
  file_size_bytes: number;
  audioTrack: string;
  soundAuthor: string;
  schema_version: string; // "1.2"
  analysis_version: string; // "1.0"
  thumbnailSrc?: string;
  simulatedVideoSrc?: string;
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  isEmphatic: boolean;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  words?: TranscriptWord[];
}

export interface TranscriptData {
  video_id: string; // Must match metadata.video_id
  source_file: string; // "video.mp4"
  duration: number;
  language: string; // "en" | "vi"
  fullText: string;
  segments: TranscriptSegment[];
  words: TranscriptWord[];
  wpm: number;
  totalWords: number;
  pauses: { start: number; end: number; duration: number }[];
}

export interface Shot {
  video_id: string; // Must match metadata.video_id
  shot_id: number;
  id: string;
  index: number;
  startTime: number;
  endTime: number;
  duration: number;
  shotType: 'A-roll' | 'B-roll';
  subType:
    | 'talking-head'
    | 'mid-shot'
    | 'close-up'
    | 'screen-recording'
    | 'b-roll-stock'
    | 'meme-cutaway'
    | 'product-demo'
    | 'action-shot'
    | 'reaction'
    | 'text-card';
  framing:
    | 'static'
    | 'punch-in-15'
    | 'punch-in-25'
    | 'slow-zoom-in'
    | 'dynamic-pan'
    | 'handheld-shake';
  faceVisible: boolean;
  faceFraming:
    | 'centered'
    | 'rule-of-thirds-left'
    | 'rule-of-thirds-right'
    | 'extreme-close-up'
    | 'none';
  textOverlay: {
    present: boolean;
    text?: string;
    style?:
      | 'hormozi-bold'
      | 'minimal-clean'
      | 'subtitles-only'
      | 'kinetic-yellow'
      | 'boxed-tag'
      | 'neon-highlight';
    font?: string;
    highlightWords?: string[];
    placement?: 'top' | 'center' | 'lower-third';
  };
  sfxCue?: {
    name: string;
    timestamp: number;
    intensity: 'subtle' | 'medium' | 'high';
  };
  transition:
    | 'hard-cut'
    | 'whip-pan'
    | 'zoom-blur'
    | 'match-cut'
    | 'glitch'
    | 'fade-black'
    | 'none';
  colorGrade: {
    contrast: 'normal' | 'high' | 'cinematic';
    temp: 'warm' | 'cool' | 'neutral';
    saturation: number;
  };
  visualEffects: string[];
  evidence_frame_ref?: string; // e.g. "frame_010.jpg"
  observation?: string; // e.g. "A-roll + punch-in (+25%)"
  reason?: string; // e.g. "Speaker emphasizes contrary statement"
}

export interface VisualAnalysis {
  video_id: string;
  source_file: string;
  face_retention_max_sec: number;
  punch_in_count: number;
  framing_breakdown: { framing: string; count: number; percentage: number }[];
  camera_angles: string[];
}

export interface AudioAnalysis {
  video_id: string;
  source_file: string;
  wpm: number;
  vocal_level_db: number;
  music_bed_level_db: number;
  sfx_event_count: number;
  detected_pauses: { start: number; end: number; duration: number }[];
  speech_to_silence_ratio: number;
}

export interface TextAnalysis {
  video_id: string;
  source_file: string;
  text_density_percentage: number;
  dominant_font: string;
  highlight_colors: string[];
  max_words_per_frame: number;
  kinetic_style: string;
}

export interface ColorAnalysis {
  video_id: string;
  source_file: string;
  contrast: 'normal' | 'high' | 'cinematic';
  color_temp: 'warm' | 'cool' | 'neutral';
  saturation: number;
  skin_tone_protection: boolean;
  lut_aesthetic: string;
}

export interface EditingAnalysis {
  video_id: string;
  source_file: string;
  total_shots: number;
  average_shot_duration: number; // ASD in seconds
  cuts_per_minute: number;
  a_roll_ratio: number;
  b_roll_ratio: number;
  hook_analysis: {
    hook_duration: number;
    visual_hook: string;
    verbal_hook: string;
    text_hook: string;
    hook_type: string;
    retention_score: number;
  };
  climax_analysis: {
    timestamp: number;
    pacing_acceleration: string;
    b_roll_storm: boolean;
  };
  ending_analysis: {
    ending_type: string;
    last_shot_duration: number;
    has_dead_air: boolean;
  };
}

export interface VerificationCheckItem {
  name: string;
  passed: boolean;
  message: string;
  details?: Record<string, any>;
}

export interface VerificationReport {
  request_id: string;
  video_id: string;
  verified_at: string;
  overall_status: 'VERIFIED' | 'FAILED' | 'UNVERIFIED';
  source_type?: 'direct_source' | 'profile_verified' | 'unverified_simulation';
  is_authentic_source?: boolean;
  checks: {
    source_verification: VerificationCheckItem;
    identity_check: VerificationCheckItem;
    media_check: VerificationCheckItem;
    transcript_check: VerificationCheckItem;
    shot_check: VerificationCheckItem;
    frame_evidence_check: VerificationCheckItem;
    cross_verification: VerificationCheckItem;
  };
  passedCount: number;
  totalCount: number;
  canProceedToLearning: boolean;
}

export interface FrameEvidence {
  timestamp: number;
  filename: string; // e.g. "frame_000.jpg", "frame_005.jpg"
  description: string;
  svgData: string;
}

export interface VideoFolderPackage {
  video_id: string;
  metadata: VideoMetadata;
  transcript: TranscriptData;
  shots: Shot[];
  visualAnalysis: VisualAnalysis;
  audioAnalysis: AudioAnalysis;
  textAnalysis: TextAnalysis;
  colorAnalysis: ColorAnalysis;
  editingAnalysis: EditingAnalysis;
  verification: VerificationReport;
  evidenceFrames: FrameEvidence[];
}

export interface StyleDNA {
  creatorName: string;
  profileHandle: string;
  totalVideosAnalyzed: number;
  dateRange: string;
  metrics: {
    averageShotDuration: number;
    cutsPerMinute: number;
    aRollPercentage: number;
    bRollPercentage: number;
    textDensityPercentage: number;
    sfxDensityPerMin: number;
    punchInFrequency: string;
    faceRetentionRule: string;
    bRollTriggerRule: string;
    colorPalette: {
      primaryText: string;
      highlightColor1: string;
      highlightColor2: string;
      backgroundAesthetic: string;
    };
    typography: {
      family: string;
      weight: string;
      case: 'UPPERCASE' | 'Title Case' | 'Sentence case';
      maxWordsPerFrame: number;
      animationStyle: string;
    };
    transitions: {
      dominant: string;
      breakdown: { type: string; percentage: number }[];
    };
    sfxCatalog: {
      sound: string;
      trigger: string;
      frequency: string;
    }[];
    musicRole: string;
    visualEffectsUsed: string[];
    antiPatterns: string[];
  };
  hookFormula: {
    breakdown: string;
    rule0to3s: string;
    firstCutTimestamp: number;
  };
  answersToQuestions: {
    pacingSpeed: string;
    averageShotDuration: string;
    aRollBRollRatio: string;
    bRollTriggerTiming: string;
    bRollTypesUsed: string;
    faceRetentionStrategy: string;
    punchInLogic: string;
    textDensityDescription: string;
    typographySignature: string;
    transitionLanguage: string;
    sfxRoleAndPlacement: string;
    musicRoleDescription: string;
    colorGradingAesthetic: string;
    effectDensity: string;
    frequentEffects: string;
    rareOrForbiddenEffects: string;
    hookStructure: string;
    climaxHandling: string;
    endingCharacteristics: string;
  };
}

export interface EditingPattern {
  id: string;
  name: string;
  category: 'pacing' | 'framing' | 'text' | 'audio' | 'transition' | 'narrative';
  trigger: string;
  action: string;
  frequency: string;
  example: string;
  antiRule: string;
}

export interface ReferenceDataset {
  creatorName: string;
  profileUrl: string;
  avatarUrl?: string;
  bio?: string;
  followersCount?: string;
  generatedAt: string;
  // All video data is strictly organized by video_id
  videoPackages: Record<string, VideoFolderPackage>;
  // Ordered list of video_ids
  videoIds: string[];
  styleDNA: StyleDNA;
  editingPatterns: EditingPattern[];
  editingBibleMarkdown: string;
  creatorReportMarkdown: string;
  datasetReportMarkdown: string;
  sourceIdentity?: any;
  verifiedCount?: number;
  unverifiedCount?: number;
  inputType?: 'direct_video' | 'profile_feed';
}

export interface DatasetFilterOptions {
  profileUrl: string;
  creatorName?: string;
  numVideos: number;
  dateRange: string;
  minDuration?: number;
  maxDuration?: number;
  analyzeAutomatically: boolean;
  generateStyleDna: boolean;
}
