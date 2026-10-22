import JSZip from 'jszip';
import { ReferenceDataset } from '../types/dataset';
import { generateMetadataCsv, sanitizeSlug } from './datasetGenerator';

export async function exportDatasetToZip(dataset: ReferenceDataset): Promise<Blob> {
  const zip = new JSZip();
  const creatorFolder = sanitizeSlug(dataset.creatorName || 'Creator');
  const root = zip.folder(`ReferenceLibrary/${creatorFolder}`);

  if (!root) {
    throw new Error('Failed to create zip folder structure');
  }

  // 1. videos/ folder organized strictly by {video_id}/
  const videosFolder = root.folder('videos');
  const packagesList = Object.values(dataset.videoPackages);

  packagesList.forEach((pkg) => {
    const vFolder = videosFolder?.folder(pkg.video_id);
    if (vFolder) {
      // 1. metadata.json
      vFolder.file('metadata.json', JSON.stringify(pkg.metadata, null, 2));

      // 2. transcript.json
      vFolder.file('transcript.json', JSON.stringify(pkg.transcript, null, 2));

      // 3. shots.json
      vFolder.file('shots.json', JSON.stringify(pkg.shots, null, 2));

      // 4. visual_analysis.json
      vFolder.file('visual_analysis.json', JSON.stringify(pkg.visualAnalysis, null, 2));

      // 5. audio_analysis.json
      vFolder.file('audio_analysis.json', JSON.stringify(pkg.audioAnalysis, null, 2));

      // 6. text_analysis.json
      vFolder.file('text_analysis.json', JSON.stringify(pkg.textAnalysis, null, 2));

      // 7. color_analysis.json
      vFolder.file('color_analysis.json', JSON.stringify(pkg.colorAnalysis, null, 2));

      // 8. editing_analysis.json
      vFolder.file('editing_analysis.json', JSON.stringify(pkg.editingAnalysis, null, 2));

      // 9. verification.json
      vFolder.file('verification.json', JSON.stringify(pkg.verification, null, 2));

      // 10. evidence/ folder
      const evidenceFolder = vFolder.folder('evidence');
      pkg.evidenceFrames.forEach((frame) => {
        evidenceFolder?.file(frame.filename.replace('.jpg', '.svg'), frame.svgData);
      });
    }
  });

  // 2. metadata/ folder with overall videos.csv summary
  const metadataFolder = root.folder('metadata');
  metadataFolder?.file('videos.csv', generateMetadataCsv(packagesList));

  // 3. style/ folder
  const styleFolder = root.folder('style');
  styleFolder?.file('style_dna.json', JSON.stringify(dataset.styleDNA, null, 2));
  styleFolder?.file('editing_patterns.json', JSON.stringify(dataset.editingPatterns, null, 2));
  styleFolder?.file('editing_bible.md', dataset.editingBibleMarkdown);

  // 4. reports/ folder
  const reportsFolder = root.folder('reports');
  reportsFolder?.file('creator_report.md', dataset.creatorReportMarkdown);
  reportsFolder?.file('dataset_report.md', dataset.datasetReportMarkdown);

  // Root instructions for Claude AI Video Editor
  root.file(
    'CLAUDE_VIDEO_EDITOR_PROMPT.md',
    `# CLAUDE AI VIDEO EDITOR KNOWLEDGE BASE\nTarget Creator: ${dataset.creatorName}\nVerified Packages: ${packagesList.length}\n`
  );

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
