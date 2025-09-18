import { Button } from "@/components/ui/button";

export interface FlightOffer {
  flightId: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  seller: string;
  price: number;
  currency: string;
  seats: number;
}

export default function FlightCard({
  offer,
  onSelect,
}: {
  offer: FlightOffer;
  onSelect: (o: FlightOffer) => void;
}) {
  return (
    <div className="rounded-lg border p-3 flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="w-24 text-center">
          <div className="font-semibold text-lg">{offer.depart}</div>
          <div className="text-xs text-slate-500">{offer.from}</div>
        </div>
        <div className="hidden md:block border-l h-12" />
        <div>
          <div className="font-semibold">{offer.seller}</div>
          <div className="text-xs text-slate-500">
            Varış: {offer.arrive} • Süre: {offer.duration}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs text-slate-500">Toplam</div>
          <div className="text-lg font-semibold">
            {offer.price} {offer.currency}
          </div>
          <div className="text-xs text-slate-500">{offer.seats} koltuk</div>
        </div>
        <div>
          <Button
            className="bg-brand text-white"
            onClick={() => onSelect(offer)}
          >
            Seç
          </Button>
        </div>
      </div>
    </div>
  );
}
