const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractYoutubeId(url) {
  if (!url) return null;

  const match = url.match(YOUTUBE_REGEX);

  return match ? match[1] : null;
}

export function toEmbedUrl(url) {
  const videoId = extractYoutubeId(url);

  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
}

export function isValidYoutubeUrl(url) {
  return extractYoutubeId(url) !== null;
}
