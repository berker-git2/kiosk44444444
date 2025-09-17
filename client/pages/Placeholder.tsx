import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const sampleVideo = "https://www.w3schools.com/html/mov_bbb.mp4";
const slides = ["/placeholder.svg", "/placeholder.svg"];

export default function Placeholder() {
  const { pathname } = useLocation();
  const title =
    pathname
      .replace(/\//g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Ana Sayfa";

  const [mode, setMode] = useState<"video" | "slider">("video");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (mode === "slider") {
      const id = setInterval(
        () => setIdx((i) => (i + 1) % slides.length),
        4000,
      );
      return () => clearInterval(id);
    }
  }, [mode]);

  return (
    <section className="min-h-[calc(100vh-0px)] relative overflow-hidden">
      {/* Hero media */}
      <div className="absolute inset-0">
        {mode === "video" ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src={sampleVideo}
          />
        ) : (
          <div className="w-full h-full">
            <img
              src={slides[idx]}
              className="w-full h-full object-cover"
              alt="slide"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            {title}
          </h1>
          <div className="ml-4">
            <button
              onClick={() =>
                setMode((m) => (m === "video" ? "slider" : "video"))
              }
              className="rounded-md bg-brand text-white px-3 py-1 text-sm"
            >
              {mode === "video" ? "Slider" : "Video"}
            </button>
          </div>
        </div>
        <p className="mt-4 text-slate-600 max-w-2xl">
          Bu sayfa talebiniz doğrultusunda özelleştirilebilir. Devam etmek için
          bize ne görmek istediğinizi söyleyin.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="rounded-md bg-brand text-white px-5 py-3 font-semibold"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </section>
  );
}
