import { MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Yacht } from "./types";

export function YachtCard({ y }: { y: Yacht }) {
  return (
    <Link
      to={`/yat-kiralama/${y.id}`}
      className="overflow-hidden rounded-xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl block hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          src={y.image}
          alt={y.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold truncate" title={y.title}>
            {y.title}
          </h3>
          <span className="shrink-0 text-sm font-semibold">
            {y.price} {y.currency || "€"}
          </span>
        </div>
        <div className="mt-1 text-xs text-slate-500 flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {y.capacity} kişi
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {y.marina || y.location}
          </span>
        </div>
      </div>
    </Link>
  );
}
