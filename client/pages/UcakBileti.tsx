import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AirportCombobox from "@/components/flights/AirportCombobox";
import PassengerSelector from "@/components/flights/PassengerSelector";
import FlightCard, { type FlightOffer } from "@/components/flights/FlightCard";
import FlightFilters, {
  type Filters,
} from "@/components/flights/FlightFilters";
import PackageModal from "@/components/flights/PackageModal";
import SummarySidebar from "@/components/flights/SummarySidebar";
import { useToast } from "@/hooks/use-toast";
import { useBooking, type TripType } from "@/components/flights/BookingContext";
import { useNavigate } from "react-router-dom";

function seededRandom(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++)
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return (h >>> 0) / 4294967295;
  };
}

const AIRLINES = ["AJet", "Pegasus", "Turkish Airlines", "SunExpress"] as const;

function generateFlights(
  from: string,
  to: string,
  date: string,
  paxTotal: number,
  nonstopOnly: boolean,
): FlightOffer[] {
  const rnd = seededRandom(`${from}|${to}|${date}`);
  const offers: FlightOffer[] = [];
  const baseTimes = ["05:45", "08:30", "10:15", "13:00", "16:20", "20:10"];

  for (let i = 0; i < baseTimes.length; i++) {
    const dep = baseTimes[i];
    const durMins = 60 + Math.floor(rnd() * 120);
    const hh = String(
      Math.floor(
        (parseInt(dep.slice(0, 2)) * 60 + parseInt(dep.slice(3)) + durMins) /
          60,
      ) % 24,
    ).padStart(2, "0");
    const mm = String((parseInt(dep.slice(3)) + durMins) % 60).padStart(2, "0");
    const arr = `${hh}:${mm}`;
    const airline = AIRLINES[Math.floor(rnd() * AIRLINES.length)];
    const basePrice = 100 + Math.floor(rnd() * 700);
    const markup = 0.85 + rnd() * 0.6;
    const price = Math.round(basePrice * markup * Math.max(1, paxTotal));
    const seats = 1 + Math.floor(rnd() * 6);

    offers.push({
      flightId: `${date}-${dep}-${i}`,
      depart: dep,
      arrive: arr,
      duration: `${Math.floor(durMins / 60)}h ${durMins % 60}m`,
      from,
      to,
      seller: airline,
      price,
      currency: "EUR",
      seats,
    });
  }

  return offers;
}

export default function UcakBileti() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state, setState, totalPassengers } = useBooking();

  const [tripType, setTripType] = useState<TripType>(state.tripType);
  const [from, setFrom] = useState(state.from);
  const [to, setTo] = useState(state.to);
  const [departDate, setDepartDate] = useState(state.departDate || "");
  const [returnDate, setReturnDate] = useState(state.returnDate || "");
  const [passengers, setPassengers] = useState(state.passengers);
  const [nonstopOnly, setNonstopOnly] = useState(state.nonstopOnly);

  const [showResults, setShowResults] = useState(false);
  const [outbound, setOutbound] = useState<FlightOffer[]>([]);
  const [inbound, setInbound] = useState<FlightOffer[]>([]);

  const [filters, setFilters] = useState<Filters>({
    nonstopOnly: false,
    time: "all",
    airlines: {
      AJet: true,
      Pegasus: true,
      "Turkish Airlines": true,
      SunExpress: true,
    },
  });

  const [packOpen, setPackOpen] = useState(false);

  const filteredOutbound = useMemo(() => {
    return outbound.filter((o) => {
      if (!filters.airlines[o.seller]) return false;
      if (filters.time === "all") return true;
      const hour = Number(o.depart.split(":")[0]);
      if (filters.time === "early") return hour >= 0 && hour < 6;
      if (filters.time === "mid") return hour >= 6 && hour < 12;
      return hour >= 12;
    });
  }, [outbound, filters]);

  const filteredInbound = useMemo(() => {
    return inbound.filter((o) => {
      if (!filters.airlines[o.seller]) return false;
      if (filters.time === "all") return true;
      const hour = Number(o.depart.split(":")[0]);
      if (filters.time === "early") return hour >= 0 && hour < 6;
      if (filters.time === "mid") return hour >= 6 && hour < 12;
      return hour >= 12;
    });
  }, [inbound, filters]);

  function validate() {
    if (!from || !to) return "Lütfen kalkış ve varış seçin";
    if (!departDate) return "Gidiş tarihi seçin";
    if (tripType === "round" && !returnDate) return "Dönüş tarihi seçin";
    return null;
  }

  function onSearch() {
    const err = validate();
    if (err) {
      toast({ title: err });
      return;
    }
    setState({
      tripType,
      from,
      to,
      departDate,
      returnDate,
      passengers,
      nonstopOnly,
    });
    const pax =
      passengers.adult +
      passengers.student +
      passengers.child +
      passengers.infant +
      passengers.senior;
    const out = generateFlights(from, to, departDate, pax, nonstopOnly);
    setOutbound(out);
    if (tripType === "round" && returnDate) {
      const ret = generateFlights(to, from, returnDate, pax, nonstopOnly);
      setInbound(ret);
    } else {
      setInbound([]);
    }
    setShowResults(true);
  }

  function onSelectOffer(offer: FlightOffer, leg: "out" | "in") {
    if (leg === "out") setState({ selectedOutbound: { ...offer } });
    else setState({ selectedReturn: { ...offer } });

    if (
      tripType === "one" ||
      (tripType === "round" &&
        (leg === "in" || (leg === "out" && state.selectedReturn)))
    ) {
      setPackOpen(true);
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-0px)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8">
        <div className="flight-hero rounded-2xl overflow-hidden shadow-xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="logo-anim">
              <div className="h-11 w-11 rounded-full bg-white/20 grid place-items-center text-white font-bold">
                ✈️
              </div>
              <div>
                <div className="text-white text-lg font-extrabold">
                  On Flight
                </div>
                <div className="text-white/90 text-xs">
                  En iyi uçuş seçenekleri
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/90 dark:bg-white/5 p-4 -mt-2 relative z-30">
            <div className="flex gap-2 mb-3">
              {(
                [
                  { key: "one", label: "Tek Yön" },
                  { key: "round", label: "Gidiş - Dönüş" },
                  { key: "multi", label: "Çoklu Uçuş" },
                ] as { key: TripType; label: string }[]
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTripType(t.key)}
                  className={`text-sm px-3 py-1.5 rounded-full border ${tripType === t.key ? "bg-brand text-white border-brand" : "bg-white/70 dark:bg-white/10"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                <AirportCombobox
                  label="Nereden"
                  value={from}
                  onChange={setFrom}
                />
                <AirportCombobox label="Nereye" value={to} onChange={setTo} />
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Gidiş Tarihi
                  </label>
                  <input
                    type="date"
                    className="w-full h-10 rounded-md border px-3"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Dönüş Tarihi
                  </label>
                  <input
                    type="date"
                    className="w-full h-10 rounded-md border px-3 disabled:opacity-50"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={tripType !== "round"}
                  />
                </div>
                <PassengerSelector
                  label="Yolcu Sayısı"
                  value={passengers}
                  onChange={setPassengers}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={nonstopOnly}
                    onChange={(e) => setNonstopOnly(e.target.checked)}
                  />{" "}
                  Sadece aktarmasız uçuşlar
                </label>
                <Button
                  onClick={onSearch}
                  className="bg-brand text-white ml-2 px-6 py-3"
                >
                  Ucuz Bilet Bul
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResults && (
        <div className="w-full bg-transparent -mt-4 z-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-6">
            <div className="mt-6 grid md:grid-cols-[18rem_1fr] gap-6">
              <FlightFilters value={filters} onChange={setFilters} />

              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded border"
                      onClick={() => {
                        if (!departDate) return;
                        const d = new Date(departDate);
                        d.setDate(d.getDate() - 1);
                        setDepartDate(d.toISOString().slice(0, 10));
                      }}
                    >
                      <ChevronLeft />
                    </button>
                    <div className="text-sm font-semibold">{departDate}</div>
                    <button
                      className="p-2 rounded border"
                      onClick={() => {
                        if (!departDate) return;
                        const d = new Date(departDate);
                        d.setDate(d.getDate() + 1);
                        setDepartDate(d.toISOString().slice(0, 10));
                      }}
                    >
                      <ChevronRight />
                    </button>
                    <div className="ml-4 text-xs text-slate-500">
                      Günlük tahmini fiyatlar
                    </div>
                  </div>
                </div>

                {tripType === "round" ? (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <div className="font-semibold mb-2">Gidiş</div>
                      <div className="grid gap-3">
                        {filteredOutbound.map((o) => (
                          <FlightCard
                            key={`${o.flightId}-${o.seller}-${o.price}`}
                            offer={o}
                            onSelect={(sel) => onSelectOffer(sel, "out")}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">Dönüş</div>
                      <div className="grid gap-3">
                        {filteredInbound.map((o) => (
                          <FlightCard
                            key={`${o.flightId}-${o.seller}-${o.price}`}
                            offer={o}
                            onSelect={(sel) => onSelectOffer(sel, "in")}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filteredOutbound.map((o) => (
                      <FlightCard
                        key={`${o.flightId}-${o.seller}-${o.price}`}
                        offer={o}
                        onSelect={(sel) => onSelectOffer(sel, "out")}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <PackageModal
        open={packOpen}
        onOpenChange={setPackOpen}
        onSelect={(p) => {
          setState({ selectedPackage: p });
          navigate("/ucak-bileti/yolcu-bilgileri");
        }}
      />
    </section>
  );
}
