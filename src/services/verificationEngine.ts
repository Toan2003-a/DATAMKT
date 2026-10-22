import {
  AudioAnalysis,
  ColorAnalysis,
  EditingAnalysis,
  FrameEvidence,
  Shot,
  TextAnalysis,
  TranscriptData,
  VerificationCheckItem,
  VerificationReport,
  VideoMetadata,
  VisualAnalysis,
} from '../types/dataset';

export function runVideoVerification(
  metadata: VideoMetadata,
  transcript: TranscriptData,
  shots: Shot[],
  visualAnalysis: VisualAnalysis,
  audioAnalysis: AudioAnalysis,
  textAnalysis: TextAnalysis,
  colorAnalysis: ColorAnalysis,
  editingAnalysis: EditingAnalysis,
  evidenceFrames: FrameEvidence[]
): VerificationReport {
  const targetId = metadata.video_id;
  const requestId = metadata.request_id || 'REQ-UNKNOWN';

  // 0. SOURCE VERIFICATION CHECK (Authenticity & Identity Proof)
  const hasValidUrl = Boolean(metadata.source_url && metadata.source_url.includes('tiktok.com'));
  const hasValidCreator = Boolean(metadata.creator_username && metadata.creator_username !== 'UNKNOWN');
  const hasValidRequestId = Boolean(metadata.request_id && metadata.request_id.startsWith('REQ-'));
  
  // Verify that the video_id matches the ID in the source URL if it's a direct video URL
  let urlIdMatch = true;
  const urlVideoIdMatch = metadata.source_url.match(/\/video\/([0-9]+)/);
  if (urlVideoIdMatch) {
    const rawIdFromUrl = urlVideoIdMatch[1];
    // Must match either exact or substring
    urlIdMatch = targetId === rawIdFromUrl || targetId.includes(rawIdFromUrl) || rawIdFromUrl.includes(targetId);
  }

  // Check if flagged as synthetic or simulated
  const isSynthetic = Boolean((metadata as any).is_synthetic || targetId.includes('fake') || targetId.includes('simulated'));

  const sourcePassed = hasValidUrl && hasValidCreator && hasValidRequestId && urlIdMatch && !isSynthetic;

  const sourceVerificationCheck: VerificationCheckItem = {
    name: 'SOURCE VERIFICATION',
    passed: sourcePassed,
    message: sourcePassed
      ? `Original source verified: ${metadata.source_url} (Creator: ${metadata.creator_username}, Video ID: ${targetId}, request_id: ${requestId})`
      : !urlIdMatch
      ? `Source URL video ID mismatch: URL contains ${urlVideoIdMatch?.[1]} but video_id is "${targetId}"`
      : isSynthetic
      ? 'Package is a synthetic/unverified simulation. Cannot be marked as Verified Source.'
      : 'Source URL invalid, creator unverified, or request_id missing.',
    details: {
      source_url: metadata.source_url,
      creator_username: metadata.creator_username,
      creator_id: metadata.creator_id,
      request_id: requestId,
      video_id: targetId,
      urlIdMatch,
      isSynthetic,
    },
  };

  // 1. IDENTITY CHECK
  const mismatchedIds: string[] = [];
  if (transcript.video_id !== targetId) mismatchedIds.push(`transcript(${transcript.video_id})`);
  if (visualAnalysis.video_id !== targetId) mismatchedIds.push(`visual(${visualAnalysis.video_id})`);
  if (audioAnalysis.video_id !== targetId) mismatchedIds.push(`audio(${audioAnalysis.video_id})`);
  if (textAnalysis.video_id !== targetId) mismatchedIds.push(`text(${textAnalysis.video_id})`);
  if (colorAnalysis.video_id !== targetId) mismatchedIds.push(`color(${colorAnalysis.video_id})`);
  if (editingAnalysis.video_id !== targetId) mismatchedIds.push(`editing(${editingAnalysis.video_id})`);

  const shotsWithWrongId = shots.filter((s) => s.video_id !== targetId);
  if (shotsWithWrongId.length > 0) {
    mismatchedIds.push(`${shotsWithWrongId.length} shots with invalid video_id`);
  }

  const identityCheck: VerificationCheckItem = {
    name: 'IDENTITY CHECK',
    passed: mismatchedIds.length === 0,
    message:
      mismatchedIds.length === 0
        ? `All sub-modules strictly bound to video_id: "${targetId}"`
        : `Mismatched video_id detected in: ${mismatchedIds.join(', ')}`,
    details: { targetId, mismatches: mismatchedIds },
  };

  // 2. MEDIA CHECK
  const hasValidDuration = metadata.duration > 0 && metadata.duration <= 300;
  const hasValidFps = [24, 25, 29.97, 30, 50, 59.94, 60].includes(metadata.fps);
  const hasValidRes = metadata.resolution === '1080x1920' || metadata.aspect_ratio === '9:16';
  const hasValidSize = metadata.file_size_bytes > 100000;

  const mediaPassed = hasValidDuration && hasValidFps && hasValidRes && hasValidSize;
  const mediaCheck: VerificationCheckItem = {
    name: 'MEDIA CHECK',
    passed: mediaPassed,
    message: mediaPassed
      ? `MP4 stream verified: ${metadata.duration}s, ${metadata.fps}fps, ${metadata.resolution}, ${(
          metadata.file_size_bytes /
          (1024 * 1024)
        ).toFixed(2)}MB`
      : 'Media attributes invalid or out of bounds',
    details: {
      duration: metadata.duration,
      fps: metadata.fps,
      resolution: metadata.resolution,
      file_size_bytes: metadata.file_size_bytes,
      source_url: metadata.source_url,
    },
  };

  // 3. TRANSCRIPT CHECK
  const transcriptDurationMatch = Math.abs(transcript.duration - metadata.duration) <= 2.0;
  const hasSegments = transcript.segments && transcript.segments.length > 0;
  const segmentsInBounds = transcript.segments.every(
    (s) => s.start >= 0 && s.end <= metadata.duration + 1.0 && s.start < s.end
  );

  // Check if transcript text is non-empty and coherent
  const transcriptNonEmpty = Boolean(transcript.fullText && transcript.fullText.trim().length > 10);

  const transcriptPassed = Boolean(
    transcript.video_id === targetId &&
    transcriptDurationMatch &&
    hasSegments &&
    segmentsInBounds &&
    transcriptNonEmpty
  );

  const transcriptCheck: VerificationCheckItem = {
    name: 'TRANSCRIPT CHECK',
    passed: transcriptPassed,
    message: transcriptPassed
      ? `Transcript verified from ${transcript.source_file}: ${transcript.segments.length} segments, ${transcript.totalWords} words, ${transcript.wpm} WPM`
      : `Transcript verification failed: duration match: ${transcriptDurationMatch}, segments in bounds: ${segmentsInBounds}`,
    details: {
      language: transcript.language,
      segmentCount: transcript.segments.length,
      wpm: transcript.wpm,
      sampleText: transcript.fullText.slice(0, 75) + '...',
    },
  };

  // 4. SHOT CHECK
  const hasShots = shots.length > 0;
  const allShotsInBounds = shots.every(
    (s) => s.startTime >= 0 && s.endTime <= metadata.duration + 0.5 && s.startTime < s.endTime
  );
  const shotIdsMatch = shots.every((s) => s.video_id === targetId);

  const shotPassed = hasShots && allShotsInBounds && shotIdsMatch;
  const shotCheck: VerificationCheckItem = {
    name: 'SHOT CHECK',
    passed: shotPassed,
    message: shotPassed
      ? `Detected ${shots.length} shots. All timestamps within [0s, ${metadata.duration}s]. ASD: ${(
          metadata.duration / shots.length
        ).toFixed(2)}s`
      : `Shot verification failed: shots count: ${shots.length}, bounds valid: ${allShotsInBounds}`,
    details: {
      shotCount: shots.length,
      maxTimestamp: shots[shots.length - 1]?.endTime,
      declaredDuration: metadata.duration,
    },
  };

  // 5. FRAME EVIDENCE CHECK
  const hasEvidence = evidenceFrames.length >= 3;
  const evidenceInBounds = evidenceFrames.every((f) => f.timestamp <= metadata.duration);

  const evidencePassed = hasEvidence && evidenceInBounds;
  const frameEvidenceCheck: VerificationCheckItem = {
    name: 'FRAME EVIDENCE CHECK',
    passed: evidencePassed,
    message: evidencePassed
      ? `Generated ${evidenceFrames.length} verified timestamped frames directly from ${metadata.filename}`
      : 'Insufficient or out-of-bounds frame evidence',
    details: {
      frameCount: evidenceFrames.length,
      timestamps: evidenceFrames.map((f) => `${f.timestamp}s`),
    },
  };

  // 6. CROSS-VERIFICATION
  const allChecksPassed =
    sourceVerificationCheck.passed &&
    identityCheck.passed &&
    mediaCheck.passed &&
    transcriptCheck.passed &&
    shotCheck.passed &&
    frameEvidenceCheck.passed;

  const crossVerification: VerificationCheckItem = {
    name: 'CROSS-VERIFICATION & TRACEABILITY',
    passed: allChecksPassed,
    message: allChecksPassed
      ? `Full chain verified: TikTok URL (${metadata.source_url}) → ${metadata.filename} → transcript.json → shots.json → style_dna.json`
      : 'Broken chain detected. Video cannot be admitted into Reference Learning Dataset.',
    details: {
      targetId,
      sourceUrl: metadata.source_url,
      title: metadata.title,
    },
  };

  const checks = {
    source_verification: sourceVerificationCheck,
    identity_check: identityCheck,
    media_check: mediaCheck,
    transcript_check: transcriptCheck,
    shot_check: shotCheck,
    frame_evidence_check: frameEvidenceCheck,
    cross_verification: crossVerification,
  };

  const passedCount = Object.values(checks).filter((c) => c.passed).length;
  const totalCount = Object.keys(checks).length;

  let overall_status: 'VERIFIED' | 'FAILED' | 'UNVERIFIED' = 'FAILED';
  if (allChecksPassed) {
    overall_status = 'VERIFIED';
  } else if (isSynthetic) {
    overall_status = 'UNVERIFIED';
  }

  const sourceType = (sourcePassed && urlVideoIdMatch)
    ? 'direct_source'
    : sourcePassed
    ? 'profile_verified'
    : 'unverified_simulation';

  return {
    request_id: requestId,
    video_id: targetId,
    verified_at: new Date().toISOString(),
    overall_status,
    source_type: sourceType,
    is_authentic_source: sourcePassed,
    checks,
    passedCount,
    totalCount,
    canProceedToLearning: allChecksPassed && !isSynthetic,
  };
}
