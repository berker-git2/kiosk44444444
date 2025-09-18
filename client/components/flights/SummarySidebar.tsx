import { useBooking } from "./BookingContext";

export default function SummarySidebar() {
  const { state, totalAmount } = useBooking();
  return (
    <aside className="w-full md:w-80 shrink-0">
      <div className="sticky top-20 space-y-3">
        <div className="rounded-lg border p-4">
          <div className="font-semibold mb-2">Uçuş Bilgileri</div>
          {state.selectedOutbound && (
            <div className="text-sm mb-2">
              <div className="font-medium">Gidiş</div>
              <div>
                {state.selectedOutbound.from} → {state.selectedOutbound.to}
              </div>
              <div className="text-slate-500">
                {state.selectedOutbound.depart} -{" "}
                {state.selectedOutbound.arrive} •{" "}
                {state.selectedOutbound.seller}
              </div>
            </div>
          )}
          {state.tripType === "round" && state.selectedReturn && (
            <div className="text-sm">
              <div className="font-medium">Dönüş</div>
              <div>
                {state.selectedReturn.from} → {state.selectedReturn.to}
              </div>
              <div className="text-slate-500">
                {state.selectedReturn.depart} - {state.selectedReturn.arrive} •{" "}
                {state.selectedReturn.seller}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-lg border p-4">
          <div className="font-semibold mb-2">Bagaj Hakkı</div>
          <div className="text-sm text-slate-600">
            Ekonomi: 1x8kg kabin, Standart: +15kg, Esnek: +30kg
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="font-semibold mb-1">Toplam Tutar</div>
          <div className="text-lg font-semibold">
            {totalAmount} {state.selectedOutbound?.currency || "EUR"}
          </div>
        </div>
      </div>
    </aside>
  );
}
