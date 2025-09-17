import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";

export default function Gallery({
  images,
  videoUrl,
}: {
  images: string[];
  videoUrl?: string;
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <img
          src={images[active]}
          alt="Tur görseli"
          className="h-full w-full object-cover"
        />
        {videoUrl && (
          <Dialog>
            <DialogTrigger asChild>
              <button
                aria-label="Videoyu aç"
                className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-white backdrop-blur hover:bg-black/70"
              >
                <Play className="h-4 w-4" /> Video
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
              <DialogHeader>
                <DialogTitle className="sr-only">Video</DialogTitle>
              </DialogHeader>
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  title="Tour video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex md:flex-col gap-2 overflow-auto max-h-[420px]">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative aspect-[4/3] w-28 md:w-full overflow-hidden rounded-lg border ${active === i ? "ring-2 ring-brand" : ""}`}
          >
            <img
              src={src}
              alt="Küçük resim"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
