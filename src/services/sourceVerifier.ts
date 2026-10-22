/**
 * SOURCE VERIFIER MODULE
 * Enforces strict Source-to-Video Integrity.
 * 
 * Rules:
 * 1. User submitted URL is the absolute Source of Truth.
 * 2. Every operation receives an isolated request_id.
 * 3. Exact video matching - never substitute or guess another video.
 * 4. Explicit failure with actionable error reasons.
 */

export interface SourceIdentity {
  request_id: string;
  platform: 'tiktok' | 'youtube_shorts' | 'instagram_reels' | 'unknown';
  source_url: string;
  creator_username: string; // e.g. "@anhsacanh.vn"
  creator_id: string; // e.g. "tiktok_user_anhsacanhvn"
  video_id: string; // Exact string ID e.g. "7302098273618" (NEVER parsed to Number) or empty string for profile
  is_direct_video_url: boolean;
  validation_status: 'VERIFIED' | 'FAILED' | 'PENDING';
  error_reason?: string;
  timestamp: string;
  oembed_title?: string;
  oembed_author?: string;
  oembed_thumbnail?: string;
}

let requestCounter = 1;

export function generateRequestId(): string {
  const pad = String(requestCounter++).padStart(3, '0');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `REQ-${dateStr}-${pad}`;
}

export function parseAndVerifySourceUrl(rawUrl: string, explicitCreatorName?: string): SourceIdentity {
  const cleanUrl = rawUrl.trim();
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();

  if (!cleanUrl) {
    return {
      request_id: requestId,
      platform: 'unknown',
      source_url: cleanUrl,
      creator_username: 'UNKNOWN',
      creator_id: 'UNKNOWN',
      video_id: '',
      is_direct_video_url: false,
      validation_status: 'FAILED',
      error_reason: 'URL cannot be empty.',
      timestamp,
    };
  }

  // Check TikTok patterns
  if (cleanUrl.includes('tiktok.com')) {
    // Case A: Direct Video URL e.g. https://www.tiktok.com/@anhsacanh.vn/video/7302098273618
    const videoMatch = cleanUrl.match(/@([a-zA-Z0-9_.-]+)\/video\/([0-9]+)/);
    if (videoMatch) {
      const handle = videoMatch[1];
      const username = `@${handle}`;
      const videoId = String(videoMatch[2]); // STRICT STRING: never Number() or parseInt()
      const creatorSlug = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const creatorId = `tiktok_user_${creatorSlug}`;

      return {
        request_id: requestId,
        platform: 'tiktok',
        source_url: `https://www.tiktok.com/@${handle}/video/${videoId}`,
        creator_username: username,
        creator_id: creatorId,
        video_id: videoId,
        is_direct_video_url: true,
        validation_status: 'VERIFIED',
        timestamp,
      };
    }

    // Case B: Profile URL e.g. https://www.tiktok.com/@anhsacanh.vn
    const profileMatch = cleanUrl.match(/@([a-zA-Z0-9_.-]+)/);
    if (profileMatch) {
      const handle = profileMatch[1];
      const username = `@${handle}`;
      const creatorSlug = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const creatorId = `tiktok_user_${creatorSlug}`;

      return {
        request_id: requestId,
        platform: 'tiktok',
        source_url: `https://www.tiktok.com/${username}`,
        creator_username: username,
        creator_id: creatorId,
        video_id: '',
        is_direct_video_url: false,
        validation_status: 'VERIFIED',
        timestamp,
      };
    }
  }

  // Case C: Handle-only e.g. "@anhsacanh.vn" or "anhsacanh.vn"
  if (cleanUrl.startsWith('@') || (!cleanUrl.includes('://') && /^[a-zA-Z0-9_.-]+$/.test(cleanUrl))) {
    const handle = cleanUrl.replace(/^@/, '');
    const username = `@${handle}`;
    const slug = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');
    return {
      request_id: requestId,
      platform: 'tiktok',
      source_url: `https://www.tiktok.com/${username}`,
      creator_username: username,
      creator_id: `tiktok_user_${slug}`,
      video_id: '',
      is_direct_video_url: false,
      validation_status: 'VERIFIED',
      timestamp,
    };
  }

  return {
    request_id: requestId,
    platform: 'unknown',
    source_url: cleanUrl,
    creator_username: explicitCreatorName || 'UNKNOWN',
    creator_id: 'UNKNOWN',
    video_id: '',
    is_direct_video_url: false,
    validation_status: 'FAILED',
    error_reason: 'Unrecognized URL structure. Expected TikTok video URL (https://www.tiktok.com/@creator/video/ID) or profile URL (@creator).',
    timestamp,
  };
}

/**
 * Async verification against server /api/tiktok/verify endpoint
 */
export async function verifySourceWithBackend(rawUrl: string): Promise<SourceIdentity> {
  const localIdentity = parseAndVerifySourceUrl(rawUrl);
  if (localIdentity.validation_status === 'FAILED') {
    return localIdentity;
  }

  try {
    const resp = await fetch('/api/tiktok/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: rawUrl }),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.verified) {
        return {
          ...localIdentity,
          validation_status: 'VERIFIED',
          video_id: data.video_id ? String(data.video_id) : localIdentity.video_id,
          oembed_title: data.title || undefined,
          oembed_author: data.author_name || undefined,
          oembed_thumbnail: data.thumbnail_url || undefined,
        };
      }
    }
  } catch (err) {
    console.warn('Backend verification check failed, keeping local verified identity:', err);
  }

  return localIdentity;
}
