import { PlayCircle } from "lucide-react";
import { toEmbedUrl } from "../../../utils/youtube";

function VideoPlayer({ videoUrl }) {
  const embedUrl = toEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg bg-ink text-paper/60">
        <PlayCircle size={40} />
        <p className="text-sm">No video available for this lesson yet.</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        className="h-full w-full"
        src={embedUrl}
        title="Lesson video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default VideoPlayer;
