import { Star } from "lucide-react";
import { Tour } from "./data";
import { Link } from "react-router-dom";

export default function TourCard({
  tour,
  onInspect,
}: {
  tour: Tour;
  onInspect?: (t: Tour) => void;
}) {
  return (
    <div className="group relative rounded-xl border border-white/30 bg-white/80 dark:bg-white/5 backdrop-blur-xl p-4 md:p-5 hover:shadow-xl transition">
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr_auto] gap-4">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
          <img
            src={tour.image}
            alt={tour.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-semibold mb-1">
            {tour.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {tour.rating}
            </span>
            <span>• {tour.reviews} değerlendirme</span>
            <span>• {tour.durationHours} saat</span>
          </div>
          <p className="mt-3 text-sm md:text-base text-slate-700/90 line-clamp-2">
            {tour.description}
          </p>
        </div>

        <div className="flex sm:flex-col justify-between items-end gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500">kişi başı</p>
            <p className="text-2xl font-extrabold tracking-tight">
              {tour.priceEUR} <span className="text-sm font-semibold">EUR</span>
            </p>
          </div>
          <Link
            to={`/turlar/${tour.id}`}
            className="rounded-md bg-brand text-white px-4 py-2 text-sm font-semibold hover:brightness-110"
          >
            Detayları İncele
          </Link>
        </div>
      </div>
    </div>
  );
}
