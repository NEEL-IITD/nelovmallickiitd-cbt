#!/usr/bin/env node
/**
 * Reusable YouTube Lectures Sync Script
 * Channel: UCVyHQJik6Gz4QZJBvviY7Hg
 * Platform: NelovMallickIITD CBT Platform
 * Curated by: Nelov Mallick (IIT Delhi)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CHANNEL_ID = 'UCVyHQJik6Gz4QZJBvviY7Hg';
const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;
const PLAYLISTS_URL = `${CHANNEL_URL}/playlists`;

console.log(`[Lectures Sync] Starting sync for YouTube Channel: ${CHANNEL_ID}`);
console.log(`[Lectures Sync] Fetching public playlists from: ${PLAYLISTS_URL}`);

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9'
};

async function fetchHtml(url) {
  const resp = await fetch(url, { headers });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching ${url}`);
  return await resp.text();
}

function extractYtInitialData(html) {
  const m = html.match(/var ytInitialData = ({.*?});<\/script>/) || html.match(/ytInitialData\s*=\s*({.*?});/);
  if (!m) return null;
  return JSON.parse(m[1]);
}

function cleanTitle(raw) {
  return raw.replace(/^[🔥⚡*•\s]+/, '').replace(/[*]+/g, '').trim();
}

function detectSubject(title) {
  const lower = title.toLowerCase();
  const chemKeywords = ['aldehyde', 'ketone', 'carboxylic', 'alcohol', 'phenol', 'ether', 'haloalkane', 
                       'haloarene', 'hydrocarbon', 'organic', 'isomerism', 'ionic', 'thermodynamics',
                       'chemical', 'intermediate', 'carbocation', 'electrochemistry', 'bonding'];
  const physKeywords = ['physics', 'mechanic', 'kinematics', 'rotation', 'electrodynamics', 'optics', 'magnetism', 'gravitation'];
  const mathKeywords = ['math', 'calculus', 'algebra', 'coordinate', 'conic', 'matrix', 'vector', 'geometry'];
  
  if (chemKeywords.some(k => lower.includes(k))) return 'Chemistry';
  if (physKeywords.some(k => lower.includes(k))) return 'Physics';
  if (mathKeywords.some(k => lower.includes(k))) return 'Mathematics';
  return 'General';
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
}

async function main() {
  try {
    const channelHtml = await fetchHtml(PLAYLISTS_URL);
    const channelData = extractYtInitialData(channelHtml);
    if (!channelData) {
      console.error('[Lectures Sync] Could not parse ytInitialData from channel playlists page.');
      process.exit(1);
    }

    // Find playlist candidates
    const rawPlaylists = [];
    function search(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (obj.playlistRenderer) rawPlaylists.push(obj.playlistRenderer);
      if (obj.lockupViewModel) rawPlaylists.push(obj.lockupViewModel);
      if (obj.gridPlaylistRenderer) rawPlaylists.push(obj.gridPlaylistRenderer);
      for (const key of Object.keys(obj)) search(obj[key]);
    }
    search(channelData);

    const seenIds = new Set();
    const playlists = [];
    for (const p of rawPlaylists) {
      let pid = p.playlistId || p.contentId;
      let title = '';
      if (p.title) {
        title = typeof p.title === 'string' ? p.title : (p.title.simpleText || (p.title.runs && p.title.runs[0]?.text) || '');
      } else if (p.metadata?.lockupMetadataViewModel?.title?.content) {
        title = p.metadata.lockupMetadataViewModel.title.content;
      }
      if (pid && title && !seenIds.has(pid)) {
        seenIds.add(pid);
        playlists.push({ playlistId: pid, title });
      }
    }

    console.log(`[Lectures Sync] Found ${playlists.length} unique public playlists on channel.`);

    const chapters = [];
    for (let i = 0; i < playlists.length; i++) {
      const { playlistId, title } = playlists[i];
      const cleanName = cleanTitle(title);
      const subject = detectSubject(cleanName);
      const slug = slugify(cleanName);
      const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

      console.log(`[Lectures Sync] [${i + 1}/${playlists.length}] Syncing: "${cleanName}" (${playlistId})`);

      try {
        const plHtml = await fetchHtml(playlistUrl);
        const plData = extractYtInitialData(plHtml);
        const videos = [];

        if (plData) {
          try {
            const contents = plData.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
            for (let cIdx = 0; cIdx < contents.length; cIdx++) {
              const lvm = contents[cIdx].lockupViewModel;
              if (!lvm) continue;
              const contentId = lvm.contentId;
              const vTitle = lvm.metadata?.lockupMetadataViewModel?.title?.content;
              let duration = 'Video';
              const overlays = lvm.contentImage?.thumbnailViewModel?.overlays || [];
              for (const o of overlays) {
                const badges = o.thumbnailBottomOverlayViewModel?.badges || [];
                for (const b of badges) {
                  if (b.thumbnailBadgeViewModel?.text) duration = b.thumbnailBadgeViewModel.text;
                }
              }
              if (contentId && vTitle) {
                videos.push({
                  lectureNumber: `Lecture ${String(cIdx + 1).padStart(2, '0')}`,
                  lectureIndex: cIdx + 1,
                  title: vTitle,
                  videoId: contentId,
                  youtubeUrl: `https://www.youtube.com/watch?v=${contentId}&list=${playlistId}`,
                  embedUrl: `https://www.youtube-nocookie.com/embed/${contentId}`,
                  thumbnailUrl: `https://i.ytimg.com/vi/${contentId}/hqdefault.jpg`,
                  duration
                });
              }
            }
          } catch (e) {
            console.warn(`  Warning parsing lockupViewModel: ${e.message}`);
          }
        }

        const thumb = videos[0]?.thumbnailUrl || `https://i.ytimg.com/vi/placeholder/hqdefault.jpg`;
        chapters.push({
          id: playlistId,
          slug,
          chapterName: cleanName,
          subject,
          description: `Comprehensive video lectures and practice problems for ${cleanName}.`,
          playlistId,
          playlistUrl,
          thumbnailUrl: thumb,
          lectureCount: videos.length,
          lectures: videos
        });

        // Polite delay
        await new Promise(r => setTimeout(r, 250));
      } catch (err) {
        console.error(`  Error syncing playlist ${playlistId}: ${err.message}`);
      }
    }

    // Write output runtime and index files
    const jsRuntimeCode = `// Auto-generated YouTube Lectures Catalog for NelovMallickIITD Platform\n// Channel ID: ${CHANNEL_ID}\n// Curated by Nelov Mallick (IIT Delhi)\n\nwindow.YOUTUBE_CHANNEL_ID = "${CHANNEL_ID}";\nwindow.YOUTUBE_CHANNEL_URL = "${CHANNEL_URL}";\n\nwindow.allChapters = ${JSON.stringify(chapters, null, 2)};\n\nwindow.getChapterBySlug = function(slug) {\n  return (window.allChapters || []).find(function(ch) { return ch.slug === slug; });\n};\n\nwindow.getChaptersBySubject = function(subject) {\n  if (!subject || subject === 'All') return window.allChapters || [];\n  return (window.allChapters || []).filter(function(ch) {\n    return ch.subject.toLowerCase() === subject.toLowerCase();\n  });\n};\n`;

    fs.writeFileSync(path.join(rootDir, 'data', 'lecturesIndex.js'), jsRuntimeCode, 'utf8');
    fs.writeFileSync(path.join(rootDir, 'public', 'data', 'lecturesIndex.js'), jsRuntimeCode, 'utf8');

    console.log(`[Lectures Sync] Successfully synced ${chapters.length} chapters and saved to data/lecturesIndex.js & public/data/lecturesIndex.js`);
  } catch (err) {
    console.error(`[Lectures Sync] Sync failed: ${err.message}`);
    process.exit(1);
  }
}

main();
