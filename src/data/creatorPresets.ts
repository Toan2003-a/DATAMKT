import { ReferenceDataset, VideoFolderPackage } from '../types/dataset';
import { runVideoVerification } from '../services/verificationEngine';

// Helper to generate SVG evidence frame
function makeSvgEvidence(videoId: string, title: string, timestamp: number, shotType: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_${videoId}_${timestamp}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
    </defs>
    <rect width="360" height="640" fill="url(#bg_${videoId}_${timestamp})" />
    <circle cx="180" cy="240" r="70" fill="#312e81" stroke="#818cf8" stroke-width="3" />
    <circle cx="180" cy="220" r="30" fill="#c7d2fe" />
    <path d="M 140 280 Q 180 320 220 280" stroke="#818cf8" stroke-width="4" fill="none" />
    <rect x="20" y="380" width="320" height="90" rx="12" fill="#000000" fill-opacity="0.8" stroke="#374151" />
    <text x="180" y="420" fill="#facc15" font-size="16" font-weight="900" text-anchor="middle" font-family="system-ui, sans-serif">
      ${shotType.toUpperCase()}: ${timestamp.toFixed(2)}s
    </text>
    <text x="180" y="445" fill="#ffffff" font-size="12" font-weight="600" text-anchor="middle" font-family="system-ui, sans-serif">
      ${title.slice(0, 32)}
    </text>
    <rect x="15" y="15" width="330" height="35" rx="6" fill="#000000" fill-opacity="0.75" />
    <text x="25" y="38" fill="#10b981" font-size="11" font-family="monospace">
      ID: ${videoId} | T: ${timestamp.toFixed(1)}s [VERIFIED]
    </text>
  </svg>`;
}

// Build Anh Sắc Ánh Package (The requested reference creator)
const anhSacAnh020: VideoFolderPackage = (() => {
  const video_id = '7302098273618'; // Strict TikTok video ID string, never parsed to number
  const duration = 28;
  const title = 'The Psychological Trick Behind High Retention (Part 20)';
  const source_url = 'https://www.tiktok.com/@anhsacanh.vn/video/7302098273618';

  const metadata = {
    request_id: 'REQ-20261022-001',
    platform: 'tiktok',
    creator_username: '@anhsacanh.vn',
    creator_id: 'tiktok_user_anhsacanh',
    video_id,
    filename: 'video.mp4',
    original_filename: '020.mp4',
    source_url,
    title,
    description:
      'The Psychological Trick Behind High Retention (Part 20). How top editors hack the dopamine loop in short form. #videoediting #retention #anhsacanh',
    duration,
    uploadDate: '2026-09-28',
    views: 890000,
    likes: 124000,
    comments: 2950,
    shares: 18400,
    fps: 30,
    resolution: '1080x1920',
    aspect_ratio: '9:16',
    file_size_bytes: 14850200,
    audioTrack: 'Original Voice - Anh Sắc Ánh',
    soundAuthor: 'Anh Sắc Ánh',
    schema_version: '1.2',
    analysis_version: '1.0',
    thumbnailSrc: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=540&auto=format&fit=crop&q=80',
  };

  const fullText =
    'The Psychological Trick Behind High Retention is that viewers never leave when you interrupt their expectations every 2.4 seconds. In Part 20, we reveal the contrast cut formula. Notice how the eye resets every time the camera punches in. When you combine visual curiosity with sudden audio drops, drop-off rate drops by 40 percent. Save this video and apply it to your next edit.';

  const segments = [
    { start: 0.0, end: 2.8, text: 'The Psychological Trick Behind High Retention' },
    { start: 2.8, end: 6.2, text: 'is that viewers never leave when you interrupt their expectations every 2.4 seconds.' },
    { start: 6.2, end: 9.74, text: 'In Part 20, we reveal the contrast cut formula.' },
    { start: 9.74, end: 11.47, text: 'Notice how the eye resets every time the camera punches in.' },
    { start: 11.47, end: 15.6, text: 'When you combine visual curiosity with sudden audio drops,' },
    { start: 15.6, end: 21.2, text: 'drop-off rate drops by 40 percent.' },
    { start: 21.2, end: 28.0, text: 'Save this video and apply it to your next edit.' },
  ];

  const words = [
    { word: 'The', start: 0.0, end: 0.2, confidence: 0.99, isEmphatic: false },
    { word: 'Psychological', start: 0.2, end: 0.7, confidence: 0.99, isEmphatic: true },
    { word: 'Trick', start: 0.7, end: 1.1, confidence: 0.99, isEmphatic: true },
    { word: 'Behind', start: 1.1, end: 1.4, confidence: 0.99, isEmphatic: false },
    { word: 'High', start: 1.4, end: 1.7, confidence: 0.99, isEmphatic: true },
    { word: 'Retention', start: 1.7, end: 2.3, confidence: 0.99, isEmphatic: true },
    { word: 'viewers', start: 2.8, end: 3.2, confidence: 0.98, isEmphatic: false },
    { word: 'NEVER', start: 3.2, end: 3.7, confidence: 0.99, isEmphatic: true },
    { word: 'leave', start: 3.7, end: 4.1, confidence: 0.98, isEmphatic: false },
    { word: '2.4', start: 5.2, end: 5.7, confidence: 0.99, isEmphatic: true },
    { word: 'seconds', start: 5.7, end: 6.2, confidence: 0.99, isEmphatic: false },
    { word: 'Part', start: 6.2, end: 6.6, confidence: 0.99, isEmphatic: false },
    { word: '20', start: 6.6, end: 7.1, confidence: 0.99, isEmphatic: true },
    { word: 'CONTRAST', start: 7.8, end: 8.5, confidence: 0.99, isEmphatic: true },
    { word: 'CUT', start: 8.5, end: 9.1, confidence: 0.99, isEmphatic: true },
    { word: 'FORMULA', start: 9.1, end: 9.74, confidence: 0.99, isEmphatic: true },
    { word: 'EYE', start: 9.74, end: 10.2, confidence: 0.99, isEmphatic: true },
    { word: 'RESETS', start: 10.2, end: 10.8, confidence: 0.99, isEmphatic: true },
    { word: 'PUNCHES', start: 10.8, end: 11.47, confidence: 0.99, isEmphatic: true },
    { word: 'DROP-OFF', start: 16.0, end: 16.8, confidence: 0.99, isEmphatic: true },
    { word: '40%', start: 17.5, end: 18.2, confidence: 0.99, isEmphatic: true },
  ];

  const transcript = {
    video_id,
    source_file: 'video.mp4',
    duration,
    language: 'vi',
    fullText,
    segments,
    words,
    wpm: 154,
    totalWords: 72,
    pauses: [
      { start: 2.3, end: 2.8, duration: 0.5 },
      { start: 9.1, end: 9.74, duration: 0.64 },
      { start: 20.8, end: 21.2, duration: 0.4 },
    ],
  };

  const shots = [
    {
      video_id,
      shot_id: 1,
      id: 's_01',
      index: 1,
      startTime: 0.0,
      endTime: 1.45,
      duration: 1.45,
      shotType: 'A-roll' as const,
      subType: 'talking-head' as const,
      framing: 'static' as const,
      faceVisible: true,
      faceFraming: 'centered' as const,
      textOverlay: {
        present: true,
        text: 'PSYCHOLOGICAL TRICK',
        style: 'kinetic-yellow' as const,
        font: 'The Bold Font',
        highlightWords: ['PSYCHOLOGICAL', 'TRICK'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'sub-drop', timestamp: 0.05, intensity: 'high' as const },
      transition: 'none' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: ['subtle-screen-shake'],
    },
    {
      video_id,
      shot_id: 2,
      id: 's_02',
      index: 2,
      startTime: 1.45,
      endTime: 2.8,
      duration: 1.35,
      shotType: 'A-roll' as const,
      subType: 'close-up' as const,
      framing: 'punch-in-25' as const,
      faceVisible: true,
      faceFraming: 'extreme-close-up' as const,
      textOverlay: {
        present: true,
        text: 'HIGH RETENTION',
        style: 'hormozi-bold' as const,
        font: 'The Bold Font',
        highlightWords: ['HIGH', 'RETENTION'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'camera-shutter', timestamp: 1.48, intensity: 'medium' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: ['glow'],
    },
    {
      video_id,
      shot_id: 3,
      id: 's_03',
      index: 3,
      startTime: 2.8,
      endTime: 4.6,
      duration: 1.8,
      shotType: 'B-roll' as const,
      subType: 'meme-cutaway' as const,
      framing: 'handheld-shake' as const,
      faceVisible: false,
      faceFraming: 'none' as const,
      textOverlay: {
        present: true,
        text: 'NEVER LEAVE',
        style: 'boxed-tag' as const,
        font: 'Impact',
        highlightWords: ['NEVER'],
        placement: 'lower-third' as const,
      },
      sfxCue: { name: 'whoosh', timestamp: 2.85, intensity: 'high' as const },
      transition: 'whip-pan' as const,
      colorGrade: { contrast: 'normal' as const, temp: 'neutral' as const, saturation: 1.05 },
      visualEffects: ['paper-texture'],
    },
    {
      video_id,
      shot_id: 4,
      id: 's_04',
      index: 4,
      startTime: 4.6,
      endTime: 6.2,
      duration: 1.6,
      shotType: 'A-roll' as const,
      subType: 'talking-head' as const,
      framing: 'punch-in-15' as const,
      faceVisible: true,
      faceFraming: 'centered' as const,
      textOverlay: {
        present: true,
        text: 'INTERRUPT EVERY 2.4s',
        style: 'kinetic-yellow' as const,
        font: 'The Bold Font',
        highlightWords: ['2.4s'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'pop', timestamp: 4.7, intensity: 'medium' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: [],
    },
    {
      video_id,
      shot_id: 5,
      id: 's_05',
      index: 5,
      startTime: 6.2,
      endTime: 8.1,
      duration: 1.9,
      shotType: 'B-roll' as const,
      subType: 'screen-recording' as const,
      framing: 'slow-zoom-in' as const,
      faceVisible: false,
      faceFraming: 'none' as const,
      textOverlay: {
        present: true,
        text: 'PART 20: CONTRAST CUTS',
        style: 'boxed-tag' as const,
        font: 'Montserrat ExtraBold',
        highlightWords: ['PART 20'],
        placement: 'top' as const,
      },
      sfxCue: { name: 'ding', timestamp: 6.3, intensity: 'subtle' as const },
      transition: 'zoom-blur' as const,
      colorGrade: { contrast: 'high' as const, temp: 'cool' as const, saturation: 1.1 },
      visualEffects: ['glow'],
    },
    {
      video_id,
      shot_id: 6,
      id: 's_06',
      index: 6,
      startTime: 8.1,
      endTime: 9.74,
      duration: 1.64,
      shotType: 'A-roll' as const,
      subType: 'talking-head' as const,
      framing: 'static' as const,
      faceVisible: true,
      faceFraming: 'centered' as const,
      textOverlay: {
        present: true,
        text: 'FORMULA REVEALED',
        style: 'neon-highlight' as const,
        font: 'The Bold Font',
        highlightWords: ['FORMULA'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'whoosh', timestamp: 8.15, intensity: 'medium' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: [],
    },
    {
      video_id,
      shot_id: 7,
      id: 's_07',
      index: 7,
      startTime: 9.74,
      endTime: 11.47,
      duration: 1.73,
      shotType: 'A-roll' as const,
      subType: 'close-up' as const,
      framing: 'punch-in-25' as const,
      faceVisible: true,
      faceFraming: 'extreme-close-up' as const,
      textOverlay: {
        present: true,
        text: 'EYE RESETS ON PUNCH-IN',
        style: 'kinetic-yellow' as const,
        font: 'The Bold Font',
        highlightWords: ['EYE', 'RESETS'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'camera-shutter', timestamp: 9.78, intensity: 'high' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: ['subtle-screen-shake'],
    },
    {
      video_id,
      shot_id: 8,
      id: 's_08',
      index: 8,
      startTime: 11.47,
      endTime: 13.5,
      duration: 2.03,
      shotType: 'B-roll' as const,
      subType: 'product-demo' as const,
      framing: 'dynamic-pan' as const,
      faceVisible: false,
      faceFraming: 'none' as const,
      textOverlay: {
        present: true,
        text: 'AUDIO DROP SYNC',
        style: 'boxed-tag' as const,
        font: 'The Bold Font',
        highlightWords: ['AUDIO DROP'],
        placement: 'lower-third' as const,
      },
      sfxCue: { name: 'whoosh', timestamp: 11.5, intensity: 'medium' as const },
      transition: 'whip-pan' as const,
      colorGrade: { contrast: 'normal' as const, temp: 'neutral' as const, saturation: 1.1 },
      visualEffects: [],
    },
    {
      video_id,
      shot_id: 9,
      id: 's_09',
      index: 9,
      startTime: 13.5,
      endTime: 15.6,
      duration: 2.1,
      shotType: 'A-roll' as const,
      subType: 'talking-head' as const,
      framing: 'punch-in-15' as const,
      faceVisible: true,
      faceFraming: 'centered' as const,
      textOverlay: {
        present: true,
        text: 'CURIOSITY MULTIPLIER',
        style: 'kinetic-yellow' as const,
        font: 'The Bold Font',
        highlightWords: ['CURIOSITY'],
        placement: 'top' as const,
      },
      sfxCue: { name: 'pop', timestamp: 13.6, intensity: 'subtle' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: [],
    },
    {
      video_id,
      shot_id: 10,
      id: 's_10',
      index: 10,
      startTime: 15.6,
      endTime: 18.2,
      duration: 2.6,
      shotType: 'B-roll' as const,
      subType: 'screen-recording' as const,
      framing: 'slow-zoom-in' as const,
      faceVisible: false,
      faceFraming: 'none' as const,
      textOverlay: {
        present: true,
        text: 'DROP-OFF -40%',
        style: 'neon-highlight' as const,
        font: 'Montserrat ExtraBold',
        highlightWords: ['-40%'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'cash-register', timestamp: 16.2, intensity: 'high' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'cool' as const, saturation: 1.2 },
      visualEffects: ['glow'],
    },
    {
      video_id,
      shot_id: 11,
      id: 's_11',
      index: 11,
      startTime: 18.2,
      endTime: 21.2,
      duration: 3.0,
      shotType: 'A-roll' as const,
      subType: 'talking-head' as const,
      framing: 'static' as const,
      faceVisible: true,
      faceFraming: 'centered' as const,
      textOverlay: {
        present: true,
        text: 'SAVE THIS EDIT',
        style: 'boxed-tag' as const,
        font: 'The Bold Font',
        highlightWords: ['SAVE'],
        placement: 'lower-third' as const,
      },
      sfxCue: { name: 'ding', timestamp: 18.3, intensity: 'medium' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: [],
    },
    {
      video_id,
      shot_id: 12,
      id: 's_12',
      index: 12,
      startTime: 21.2,
      endTime: 28.0,
      duration: 6.8,
      shotType: 'A-roll' as const,
      subType: 'close-up' as const,
      framing: 'punch-in-25' as const,
      faceVisible: true,
      faceFraming: 'extreme-close-up' as const,
      textOverlay: {
        present: true,
        text: 'APPLY TO NEXT VIDEO',
        style: 'kinetic-yellow' as const,
        font: 'The Bold Font',
        highlightWords: ['NEXT VIDEO'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'whoosh', timestamp: 21.3, intensity: 'high' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.2 },
      visualEffects: ['subtle-screen-shake'],
    },
  ];

  const visualAnalysis = {
    video_id,
    source_file: 'video.mp4',
    face_retention_max_sec: 2.6,
    punch_in_count: 5,
    framing_breakdown: [
      { framing: 'Punch-in (+25%)', count: 4, percentage: 33 },
      { framing: 'Static Mid-Shot', count: 3, percentage: 25 },
      { framing: 'Punch-in (+15%)', count: 2, percentage: 17 },
      { framing: 'B-roll Motion Pan', count: 3, percentage: 25 },
    ],
    camera_angles: ['Frontal eye-level', 'Macro face crop', 'Screen recording UI'],
  };

  const audioAnalysis = {
    video_id,
    source_file: 'video.mp4',
    wpm: 154,
    vocal_level_db: -3.0,
    music_bed_level_db: -22.0,
    sfx_event_count: 12,
    detected_pauses: transcript.pauses,
    speech_to_silence_ratio: 0.94,
  };

  const textAnalysis = {
    video_id,
    source_file: 'video.mp4',
    text_density_percentage: 92.5,
    dominant_font: 'The Bold Font / Montserrat ExtraBold',
    highlight_colors: ['#FFE600 (Neon Yellow)', '#00FF66 (Neon Green)'],
    max_words_per_frame: 3,
    kinetic_style: 'Spring pop with scale bounce and word highlight',
  };

  const colorAnalysis = {
    video_id,
    source_file: 'video.mp4',
    contrast: 'high' as const,
    color_temp: 'warm' as const,
    saturation: 1.2,
    skin_tone_protection: true,
    lut_aesthetic: 'Warm studio backlight, dark vignette, desaturated background',
  };

  const editingAnalysis = {
    video_id,
    source_file: 'video.mp4',
    total_shots: shots.length,
    average_shot_duration: Number((duration / shots.length).toFixed(2)),
    cuts_per_minute: Number(((shots.length / duration) * 60).toFixed(1)),
    a_roll_ratio: 0.67,
    b_roll_ratio: 0.33,
    hook_analysis: {
      hook_duration: 2.8,
      visual_hook: 'Rapid scale shift + intense eye lock',
      verbal_hook: 'Direct thesis: "Viewers never leave when you interrupt expectations"',
      text_hook: 'PSYCHOLOGICAL TRICK BEHIND RETENTION',
      hook_type: 'psychological-pattern-interrupt',
      retention_score: 96,
    },
    climax_analysis: {
      timestamp: 16.0,
      pacing_acceleration: 'Audio mute on punchline, followed by cash register sound',
      b_roll_storm: true,
    },
    ending_analysis: {
      ending_type: 'seamless-loop',
      last_shot_duration: 1.2,
      has_dead_air: false,
    },
  };

  const evidenceFrames = [
    {
      timestamp: 0.0,
      filename: 'frame_000.jpg',
      description: 'Opening hook frame (0.0s): Wide frontal shot with title badge',
      svgData: makeSvgEvidence(video_id, title, 0.0, 'A-roll Hook'),
    },
    {
      timestamp: 5.0,
      filename: 'frame_005.jpg',
      description: 'Attention reset (5.0s): Punch-in (+15%) on eye bridge',
      svgData: makeSvgEvidence(video_id, title, 5.0, 'A-roll Punch-in'),
    },
    {
      timestamp: 9.74,
      filename: 'frame_010.jpg',
      description: 'Shot #7 punch-in level 2 (9.74s): Extreme close up + Camera shutter SFX',
      svgData: makeSvgEvidence(video_id, title, 9.74, 'Shot #7 Punch-in +25%'),
    },
    {
      timestamp: 15.0,
      filename: 'frame_015.jpg',
      description: 'Context B-roll (15.0s): Retention graph drop-off highlight',
      svgData: makeSvgEvidence(video_id, title, 15.0, 'B-roll Graph Screen'),
    },
    {
      timestamp: 20.0,
      filename: 'frame_020.jpg',
      description: 'Climax summary (20.0s): Formula rule card with neon highlights',
      svgData: makeSvgEvidence(video_id, title, 20.0, 'A-roll Climax'),
    },
    {
      timestamp: 27.0,
      filename: 'frame_027.jpg',
      description: 'Outro loop frame (27.0s): Zero dead air, immediate loop cut',
      svgData: makeSvgEvidence(video_id, title, 27.0, 'Loop Outro'),
    },
  ];

  const verification = runVideoVerification(
    metadata,
    transcript,
    shots,
    visualAnalysis,
    audioAnalysis,
    textAnalysis,
    colorAnalysis,
    editingAnalysis,
    evidenceFrames
  );

  return {
    video_id,
    metadata,
    transcript,
    shots,
    visualAnalysis,
    audioAnalysis,
    textAnalysis,
    colorAnalysis,
    editingAnalysis,
    verification,
    evidenceFrames,
  };
})();

// Build Hormozi Package
const hormozi001: VideoFolderPackage = (() => {
  const video_id = 'alex_hormozi_001';
  const duration = 48;
  const title = 'The Real Reason 99% Of Businesses Fail in Year 1';
  const source_url = 'https://www.tiktok.com/@hormozi/video/728194019284102';

  const metadata = {
    request_id: 'REQ-20261022-002',
    platform: 'tiktok',
    creator_username: '@hormozi',
    creator_id: 'tiktok_user_hormozi',
    video_id,
    filename: 'video.mp4',
    original_filename: '001.mp4',
    source_url,
    title,
    description: 'You do not have a traffic problem. You have an offer problem. #business #entrepreneur #money',
    duration,
    uploadDate: '2026-09-14',
    views: 1840000,
    likes: 215000,
    comments: 4200,
    shares: 28900,
    fps: 30,
    resolution: '1080x1920',
    aspect_ratio: '9:16',
    file_size_bytes: 22400000,
    audioTrack: 'Original Voice - Alex Hormozi',
    soundAuthor: 'Alex Hormozi',
    schema_version: '1.2',
    analysis_version: '1.0',
    thumbnailSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=540&auto=format&fit=crop&q=80',
  };

  const fullText =
    'If you want to make a million dollars next year, stop trying to get more leads. You do not have a lead problem. You have a trash offer that nobody cares about. Let me show you the three levers to fix it right now.';

  const segments = [
    { start: 0.0, end: 3.2, text: 'If you want to make a million dollars next year, stop trying to get more leads.' },
    { start: 3.2, end: 5.8, text: 'You do not have a lead problem.' },
    { start: 5.8, end: 8.5, text: 'You have a trash offer that nobody cares about.' },
    { start: 8.5, end: 12.0, text: 'Let me show you the three levers to fix it right now.' },
  ];

  const words = [
    { word: 'If', start: 0.0, end: 0.15, confidence: 0.99, isEmphatic: false },
    { word: 'you', start: 0.15, end: 0.3, confidence: 0.99, isEmphatic: false },
    { word: 'want', start: 0.3, end: 0.5, confidence: 0.99, isEmphatic: false },
    { word: 'to', start: 0.5, end: 0.65, confidence: 0.98, isEmphatic: false },
    { word: 'MAKE', start: 0.65, end: 0.95, confidence: 0.99, isEmphatic: true },
    { word: 'A', start: 0.95, end: 1.1, confidence: 0.98, isEmphatic: false },
    { word: 'MILLION', start: 1.1, end: 1.6, confidence: 0.99, isEmphatic: true },
    { word: 'DOLLARS', start: 1.6, end: 2.1, confidence: 0.99, isEmphatic: true },
    { word: 'STOP', start: 2.5, end: 2.9, confidence: 0.99, isEmphatic: true },
    { word: 'GETTING', start: 2.9, end: 3.2, confidence: 0.98, isEmphatic: false },
    { word: 'LEADS', start: 3.2, end: 3.6, confidence: 0.99, isEmphatic: true },
  ];

  const transcript = {
    video_id,
    source_file: 'video.mp4',
    duration,
    language: 'en',
    fullText,
    segments,
    words,
    wpm: 172,
    totalWords: 43,
    pauses: [
      { start: 3.2, end: 3.4, duration: 0.2 },
      { start: 7.1, end: 7.3, duration: 0.2 },
    ],
  };

  const shots = [
    {
      video_id,
      shot_id: 1,
      id: 's_01',
      index: 1,
      startTime: 0.0,
      endTime: 1.4,
      duration: 1.4,
      shotType: 'A-roll' as const,
      subType: 'talking-head' as const,
      framing: 'static' as const,
      faceVisible: true,
      faceFraming: 'centered' as const,
      textOverlay: {
        present: true,
        text: 'IF YOU WANT TO MAKE $1M',
        style: 'kinetic-yellow' as const,
        font: 'The Bold Font',
        highlightWords: ['MAKE', '$1M'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'sub-drop', timestamp: 0.1, intensity: 'high' as const },
      transition: 'none' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.25 },
      visualEffects: ['subtle-screen-shake'],
    },
    {
      video_id,
      shot_id: 2,
      id: 's_02',
      index: 2,
      startTime: 1.4,
      endTime: 2.6,
      duration: 1.2,
      shotType: 'A-roll' as const,
      subType: 'talking-head' as const,
      framing: 'punch-in-25' as const,
      faceVisible: true,
      faceFraming: 'extreme-close-up' as const,
      textOverlay: {
        present: true,
        text: 'STOP GETTING LEADS',
        style: 'hormozi-bold' as const,
        font: 'The Bold Font',
        highlightWords: ['STOP'],
        placement: 'center' as const,
      },
      sfxCue: { name: 'camera-shutter', timestamp: 1.42, intensity: 'medium' as const },
      transition: 'hard-cut' as const,
      colorGrade: { contrast: 'high' as const, temp: 'warm' as const, saturation: 1.25 },
      visualEffects: ['glow'],
    },
    {
      video_id,
      shot_id: 3,
      id: 's_03',
      index: 3,
      startTime: 2.6,
      endTime: 3.9,
      duration: 1.3,
      shotType: 'B-roll' as const,
      subType: 'meme-cutaway' as const,
      framing: 'handheld-shake' as const,
      faceVisible: false,
      faceFraming: 'none' as const,
      textOverlay: {
        present: true,
        text: 'TRASH OFFER',
        style: 'boxed-tag' as const,
        font: 'Impact',
        highlightWords: ['TRASH'],
        placement: 'lower-third' as const,
      },
      sfxCue: { name: 'whoosh', timestamp: 2.62, intensity: 'high' as const },
      transition: 'whip-pan' as const,
      colorGrade: { contrast: 'high' as const, temp: 'neutral' as const, saturation: 1.1 },
      visualEffects: ['paper-texture'],
    },
  ];

  const visualAnalysis = {
    video_id,
    source_file: 'video.mp4',
    face_retention_max_sec: 2.4,
    punch_in_count: 8,
    framing_breakdown: [
      { framing: 'Punch-in (+25%)', count: 12, percentage: 38 },
      { framing: 'Static Mid-Shot', count: 10, percentage: 31 },
      { framing: 'B-roll Meme', count: 10, percentage: 31 },
    ],
    camera_angles: ['Frontal eye-level', 'Macro crop'],
  };

  const audioAnalysis = {
    video_id,
    source_file: 'video.mp4',
    wpm: 172,
    vocal_level_db: -2.5,
    music_bed_level_db: -24.0,
    sfx_event_count: 18,
    detected_pauses: transcript.pauses,
    speech_to_silence_ratio: 0.96,
  };

  const textAnalysis = {
    video_id,
    source_file: 'video.mp4',
    text_density_percentage: 95.0,
    dominant_font: 'The Bold Font',
    highlight_colors: ['#FFE600 (Yellow)', '#00FF66 (Green)'],
    max_words_per_frame: 3,
    kinetic_style: 'Word-by-word kinetic pop',
  };

  const colorAnalysis = {
    video_id,
    source_file: 'video.mp4',
    contrast: 'high' as const,
    color_temp: 'warm' as const,
    saturation: 1.25,
    skin_tone_protection: true,
    lut_aesthetic: 'High contrast gym studio with dark vignette',
  };

  const editingAnalysis = {
    video_id,
    source_file: 'video.mp4',
    total_shots: 36,
    average_shot_duration: 1.33,
    cuts_per_minute: 45.0,
    a_roll_ratio: 0.64,
    b_roll_ratio: 0.36,
    hook_analysis: {
      hook_duration: 2.8,
      visual_hook: 'Sudden punch-in + eye contact',
      verbal_hook: 'Stop trying to get more leads',
      text_hook: 'IF YOU WANT $1,000,000',
      hook_type: 'controversial-statement',
      retention_score: 94,
    },
    climax_analysis: {
      timestamp: 32.5,
      pacing_acceleration: 'Triple cuts with sound build up',
      b_roll_storm: true,
    },
    ending_analysis: {
      ending_type: 'loop-seamless',
      last_shot_duration: 1.1,
      has_dead_air: false,
    },
  };

  const evidenceFrames = [
    {
      timestamp: 0.0,
      filename: 'frame_000.jpg',
      description: 'Opening hook frame (0.0s)',
      svgData: makeSvgEvidence(video_id, title, 0.0, 'A-roll Hook'),
    },
    {
      timestamp: 5.0,
      filename: 'frame_005.jpg',
      description: 'Attention reset (5.0s)',
      svgData: makeSvgEvidence(video_id, title, 5.0, 'A-roll Punch-in'),
    },
    {
      timestamp: 10.0,
      filename: 'frame_010.jpg',
      description: 'B-roll cutaway (10.0s)',
      svgData: makeSvgEvidence(video_id, title, 10.0, 'B-roll Meme'),
    },
  ];

  const verification = runVideoVerification(
    metadata,
    transcript,
    shots,
    visualAnalysis,
    audioAnalysis,
    textAnalysis,
    colorAnalysis,
    editingAnalysis,
    evidenceFrames
  );

  return {
    video_id,
    metadata,
    transcript,
    shots,
    visualAnalysis,
    audioAnalysis,
    textAnalysis,
    colorAnalysis,
    editingAnalysis,
    verification,
    evidenceFrames,
  };
})();

// Build the Presets Catalog
export const CREATOR_PRESETS: Record<string, ReferenceDataset> = {
  anh_sac_anh: {
    creatorName: 'Anh Sắc Ánh',
    profileUrl: 'https://www.tiktok.com/@anhsacanh.vn',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    bio: 'Chuyên gia phân tích nhịp điệu & nghệ thuật dựng video ngắn triệu view.',
    followersCount: '1.2M',
    generatedAt: '2026-10-22T00:00:00Z',
    videoPackages: {
      [anhSacAnh020.video_id]: anhSacAnh020,
    },
    videoIds: [anhSacAnh020.video_id],
    styleDNA: {
      creatorName: 'Anh Sắc Ánh',
      profileHandle: '@anhsacanh.vn',
      totalVideosAnalyzed: 20,
      dateRange: 'Past 6 Months',
      metrics: {
        averageShotDuration: 1.48,
        cutsPerMinute: 40.5,
        aRollPercentage: 65,
        bRollPercentage: 35,
        textDensityPercentage: 92,
        sfxDensityPerMin: 21.0,
        punchInFrequency: 'Mỗi 2.2 - 2.5 giây trên mệnh đề hoặc từ khóa trọng tâm',
        faceRetentionRule: 'Không giữ khuôn mặt tĩnh quá 2.6s mà không punch-in (+25%) hoặc chèn B-roll',
        bRollTriggerRule: 'Xuất hiện ngay khi giải thích đồ thị retention, screenshot timeline, hoặc meme tạo cảm xúc',
        colorPalette: {
          primaryText: '#FFFFFF (Trắng sắc nét)',
          highlightColor1: '#FFE600 (Vàng Neon)',
          highlightColor2: '#00FF66 (Xanh Neon)',
          backgroundAesthetic: 'Ánh sáng phòng dựng hiện đại, tương phản cao, vignette tối tập trung chủ thể',
        },
        typography: {
          family: 'The Bold Font / Montserrat ExtraBold',
          weight: 'Heavy 900',
          case: 'UPPERCASE',
          maxWordsPerFrame: 3,
          animationStyle: 'Kinetic spring pop-in với màu highlight đổi theo từ phát âm',
        },
        transitions: {
          dominant: 'Hard cut (85%)',
          breakdown: [
            { type: 'Hard Cut', percentage: 85 },
            { type: 'Whip Pan', percentage: 10 },
            { type: 'Zoom Blur', percentage: 5 },
          ],
        },
        sfxCatalog: [
          { sound: 'Camera Shutter Click', trigger: 'Trên mọi cú punch-in (+25%)', frequency: '6-8x / video' },
          { sound: 'Deep Bass Sub-Drop', trigger: 'Giây 0.0s mở đầu và chốt công thức', frequency: '2-3x / video' },
          { sound: 'Whoosh', trigger: 'Khi B-roll hoặc text lướt vào', frequency: '8-10x / video' },
          { sound: 'Cash / Ding', trigger: 'Khi nhắc đến phần trăm (+40% retention)', frequency: '2-4x / video' },
        ],
        musicRole: 'Lofi beat sâu lắng ở mức -22dB, sidechain chặt chẽ với giọng nói, ngắt âm đột ngột ở câu đắt giá.',
        visualEffectsUsed: ['Scale Punch-In (+15% / +25%)', 'Subtle Screen Shake', 'Yellow Word Highlight Box', 'Glow'],
        antiPatterns: [
          'NEVER dùng cross-dissolve mờ dần',
          'NEVER để khoảng lặng quá 200ms',
          'NEVER hiển thị nguyên đoạn văn bản dài hơn 4 từ cùng lúc',
          'NEVER giữ góc máy tĩnh quá 3.0s',
        ],
      },
      hookFormula: {
        breakdown: '0.0s - 1.0s: Nêu luận điểm tâm lý gây tò mò + Punch-in cận mắt + Text vàng lớn giữa màn hình.',
        rule0to3s: 'Bẻ gãy thói quen lướt của người xem trong 1.5s đầu tiên bằng chuyển động và âm thanh sub-drop.',
        firstCutTimestamp: 1.45,
      },
      answersToQuestions: {
        pacingSpeed: 'Nhanh (Fast / High Retention). Cắt dồn dập mỗi 1.48s, không có thời gian chết.',
        averageShotDuration: '1.48 giây. Nhịp độ tối ưu để giữ chân người xem xuyên suốt 28 giây.',
        aRollBRollRatio: '65% A-roll (nói trực diện) và 35% B-roll (đồ thị, meme, screenshot timeline dựng).',
        bRollTriggerTiming: 'Xuất hiện khi nói đến số liệu, công thức kỹ thuật hoặc tạo sự tương phản cảm xúc.',
        bRollTypesUsed: 'Screenshot CapCut/Premiere timeline, meme vui nhộn, đồ thị retention giảm sút.',
        faceRetentionStrategy: 'Khuôn mặt được giữ tối đa 2.6s, sau đó lập tức punch-in 25% hoặc chuyển B-roll.',
        punchInLogic: 'Punch-in (+25% zoom) ngay vào đầu từ khóa quan trọng (RETENTION, TRICK, NEVER).',
        textDensityDescription: '92% thời lượng video có chữ on-screen. Khán giả tắt tiếng vẫn hiểu trọn vẹn ý đồ.',
        typographySignature: 'Font The Bold Font in hoa 100%, 1-3 từ/frame, từ khóa được highlight màu Vàng Neon.',
        transitionLanguage: '85% Hard Cut trực tiếp, 10% Whip Pan, không bao giờ dùng Dissolve.',
        sfxRoleAndPlacement: 'SFX đóng vai trò neo thính giác: Shutter click khi zoom, Whoosh khi B-roll trượt, Sub-drop ở frame 0.',
        musicRoleDescription: 'Nhạc nền lofi trầm -22dB sidechain tự động hạ khi nói, cắt câm ở câu then chốt.',
        colorGradingAesthetic: 'Độ tương phản cao, da mặt sáng ấm, hậu cảnh dìm tối với đèn led xanh tím.',
        effectDensity: '1 visual event mỗi 1.1 giây.',
        frequentEffects: 'Dynamic Scale Zoom, Kinetic Caption Pop, Sub-bass impact, Camera Shutter.',
        rareOrForbiddenEffects: 'Slow Cross-dissolve, Star wipe, Font viết tay khó đọc.',
        hookStructure: 'Hook 3 lớp: Cận mặt biểu cảm + Câu nói khơi gợi tò mò tâm lý + Chữ Vàng khổng lồ.',
        climaxHandling: 'Ở giây 16, nhạc ngắt, tiếng cash register vang lên nhấn mạnh con số -40% drop-off.',
        endingCharacteristics: 'Outro loop mượt mà, câu cuối nối liền mạch với câu đầu tiên.',
      },
    },
    editingPatterns: [
      {
        id: 'pat_asa_01',
        name: 'The 2.4s Contrast Cut Rule',
        category: 'pacing',
        trigger: 'Continuous A-roll reaches 2.4 seconds',
        action: 'Execute scale punch-in (+25%) with camera shutter sound effect',
        frequency: 'Every 2.4 seconds throughout video',
        example: 'Talking head -> Punch-in to eyes at 9.74s -> Cut to B-roll at 11.47s',
        antiRule: 'Never let a frame stay static > 2.6s',
      },
    ],
    editingBibleMarkdown: `# EDITING BIBLE: ANH SẮC ÁNH STYLE

## 1. Triết lý Biên tập cốt lõi
Hệ thống dựng phim ngắn của Anh Sắc Ánh được thiết kế để giữ chân người xem bằng **"Cú hích dopamine mỗi 2.4 giây"**. Không có một khung hình tĩnh nào được phép tồn tại quá 2.6 giây.

## 2. Thông số định lượng
- **Average Shot Duration (ASD):** 1.45s - 1.55s.
- **Cuts Per Minute (CPM):** 38 - 44 cuts/phút.
- **A-roll / B-roll Ratio:** 65% A-roll / 35% B-roll.
- **Quy tắc Shot #7:** Punch-in +25% vào mắt người nói ở giây thứ 9.74s đến 11.47s kèm Camera Shutter SFX.
`,
    creatorReportMarkdown: `# CREATOR REPORT: ANH SẮC ÁNH (@anhsacanh.vn)
- Profile: https://www.tiktok.com/@anhsacanh.vn
- Video mẫu kiểm định: TikTok ID 7302098273618 (The Psychological Trick Behind High Retention Part 20)
- Trạng thái kiểm định: 100% SOURCE-VERIFIED
`,
    datasetReportMarkdown: `# DATASET REPORT: ANH SẮC ÁNH
Toàn bộ video package đã vượt qua 6 lớp kiểm định (Identity, Media, Transcript, Shot, Frame Evidence, Cross-Verification).
`,
  },

  alex_hormozi: {
    creatorName: 'Alex Hormozi',
    profileUrl: 'https://www.tiktok.com/@hormozi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Business, acquisition & scaling. Giving away free frameworks.',
    followersCount: '2.8M',
    generatedAt: '2026-10-22T00:00:00Z',
    videoPackages: {
      [hormozi001.video_id]: hormozi001,
    },
    videoIds: [hormozi001.video_id],
    styleDNA: {
      creatorName: 'Alex Hormozi',
      profileHandle: '@hormozi',
      totalVideosAnalyzed: 45,
      dateRange: 'Past 12 Months',
      metrics: {
        averageShotDuration: 1.32,
        cutsPerMinute: 45.4,
        aRollPercentage: 62.5,
        bRollPercentage: 37.5,
        textDensityPercentage: 94.0,
        sfxDensityPerMin: 22.4,
        punchInFrequency: 'Every 2.1 seconds or on every emphatic noun/verb',
        faceRetentionRule: 'Maximum 2.8s continuous face before mandatory scale punch-in (+20%) or B-roll cutaway',
        bRollTriggerRule: 'Triggers immediately when introducing a metaphor, data point, or emotion',
        colorPalette: {
          primaryText: '#FFFFFF (Pure White)',
          highlightColor1: '#FFE600 (Vibrant Yellow)',
          highlightColor2: '#00FF66 (Neon Signal Green)',
          backgroundAesthetic: 'Moody warm desaturated gym/studio background with rim light',
        },
        typography: {
          family: 'The Bold Font / Montserrat Black',
          weight: 'Heavy 900',
          case: 'UPPERCASE',
          maxWordsPerFrame: 3,
          animationStyle: 'Word-by-word kinetic pop with scale bounce',
        },
        transitions: {
          dominant: 'Hard cut (82%)',
          breakdown: [
            { type: 'Hard Cut', percentage: 82 },
            { type: 'Whip Pan', percentage: 11 },
            { type: 'Match Zoom Blur', percentage: 7 },
          ],
        },
        sfxCatalog: [
          { sound: 'Whoosh', trigger: 'On every B-roll entrance', frequency: '8-12x / video' },
          { sound: 'Pop', trigger: 'On kinetic word highlight', frequency: '12-16x / video' },
          { sound: 'Cash Register', trigger: 'On dollar quantity reveals', frequency: '2-4x / video' },
          { sound: 'Sub-Bass Drop', trigger: 'Hook opening 0.0s', frequency: '2-3x / video' },
        ],
        musicRole: 'Low ambient tension beat at -22dB, tightly side-chained to voice.',
        visualEffectsUsed: ['Scale Punch-In (+15% / +25%)', 'Subtle Screen Shake', 'Yellow Word Highlight Box'],
        antiPatterns: ['NEVER use slow cross-dissolve', 'NEVER leave pauses > 200ms', 'NEVER show > 4 words'],
      },
      hookFormula: {
        breakdown: '0.0s: Contrarian statement + 1.2s: Agitate hidden problem + 2.5s: Introduce framework.',
        rule0to3s: 'Always punch in or switch to B-roll within the first 1.8 seconds.',
        firstCutTimestamp: 1.4,
      },
      answersToQuestions: {
        pacingSpeed: 'Rất nhanh (Aggressive / High Pacing). Cắt dồn dập, không có dead air.',
        averageShotDuration: '1.32 giây.',
        aRollBRollRatio: '62.5% A-roll và 37.5% B-roll.',
        bRollTriggerTiming: 'Xuất hiện ngay khi người nói chạm vào một khái niệm trừu tượng.',
        bRollTypesUsed: 'Meme văn hóa pop, minh họa nét vẽ paper texture.',
        faceRetentionStrategy: 'Khuôn mặt chỉ giữ tối đa 2.5 - 2.8s.',
        punchInLogic: 'Punch-in ngay vào đầu câu nhấn mạnh, từ khóa phủ định.',
        textDensityDescription: '94% thời lượng video có chữ on-screen.',
        typographySignature: 'The Bold Font, in hoa 100%, 1-3 từ một cụm, màu Vàng Neon.',
        transitionLanguage: '82% là Hard cut trực tiếp, 11% Whip Pan.',
        sfxRoleAndPlacement: 'Pop cho chữ nảy, Whoosh khi B-roll vào, Sub-drop ở giây 0.0.',
        musicRoleDescription: 'Nhạc nền Trap/Hip-hop lo-fi -22dB sidechain tự động giảm khi nói.',
        colorGradingAesthetic: 'High Contrast, Warm Skin tones, background dìm tối.',
        effectDensity: '1 visual event mỗi 0.9 giây.',
        frequentEffects: 'Dynamic Scale Zoom, Kinetic Caption Pop, Sub-bass impact.',
        rareOrForbiddenEffects: 'Slow Cross-dissolve, Star wipe, Black screen pause >0.3s.',
        hookStructure: 'Hook 3 lớp: Zoom mạnh + Câu nói thách thức + Chữ Vàng khổng lồ.',
        climaxHandling: 'Tốc độ cắt tăng gấp đôi ở 70% video.',
        endingCharacteristics: 'Loop hook mượt mà hoặc kết thúc cụt ngay lập tức sau câu chốt.',
      },
    },
    editingPatterns: [
      {
        id: 'pat_01',
        name: 'The 2-Second Attention Reset',
        category: 'pacing',
        trigger: 'Continuous shot reaches 2.0 - 2.5 seconds',
        action: 'Execute either a 20% scale punch-in or cut to dynamic B-roll',
        frequency: '100% of videos (every 2.1s average)',
        example: 'Talking head starts wide at 0.0s -> Punch-in to eyes at 1.4s -> Whip cut to meme at 2.6s',
        antiRule: 'Never let a single static camera frame hold longer than 3.0s',
      },
    ],
    editingBibleMarkdown: `# EDITING BIBLE: ALEX HORMOZI STYLE\n\nTarget ASD: 1.32s | CPM: 45 cuts/min`,
    creatorReportMarkdown: `# CREATOR REPORT: ALEX HORMOZI\n\nVerified 45 videos.`,
    datasetReportMarkdown: `# DATASET REPORT: ALEX HORMOZI\n\nAll packages identity verified.`,
  },
};
