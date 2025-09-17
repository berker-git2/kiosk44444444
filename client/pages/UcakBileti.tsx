import { useMemo, useState } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const AIRLINES = [
  { id: "ajet", name: "AJet" },
  { id: "pegasus", name: "Pegasus" },
  { id: "turkish", name: "Turkish Airlines" },
  { id: "sunexpress", name: "SunExpress" },
];

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

function generateFlights(
  from: string,
  to: string,
  date: string,
  passengers: number,
) {
  const rnd = seededRandom(`${from}|${to}|${date}`);
  const offers: Array<any> = [];

  // create some base flight times
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

    // each flight may have 1-3 sellers with different prices
    const sellers = 1 + Math.floor(rnd() * 3);
    const basePrice = 100 + Math.floor(rnd() * 700); // base price EUR

    const flight = {
      id: `${date}-${dep}-${i}`,
      depart: dep,
      arrive: arr,
      duration: `${Math.floor(durMins / 60)}h ${durMins % 60}m`,
      from,
      to,
      carriers: [] as Array<{
        seller: string;
        price: number;
        currency: string;
        seats: number;
      }>,
    };

    for (let s = 0; s < sellers; s++) {
      const airline = AIRLINES[Math.floor(rnd() * AIRLINES.length)];
      const markup = 0.85 + rnd() * 0.6; // vary price
      const price = Math.round(basePrice * markup * passengers);
      const seats = 1 + Math.floor(rnd() * 6);
      flight.carriers.push({
        seller: airline.name,
        price,
        currency: "EUR",
        seats,
      });
    }

    offers.push(flight);
  }

  return offers;
}

export default function UcakBileti() {
  const [tripType, setTripType] = useState<"one" | "round">("round");
  const [from, setFrom] = useState("Istanbul (IST)");
  const [to, setTo] = useState("Izmir (ADB)");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<
    "all" | "early" | "mid" | "late"
  >("all");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "duration">(
    "price-asc",
  );

  const onSearch = () => {
    if (!from || !to || !departDate) {
      toast({ title: "Lütfen kalkış, varış ve tarih seçin" });
      return;
    }
    // generate mocked flight offers
    const offers = generateFlights(from, to, departDate, passengers);
    setResults(offers);
    setShowResults(true);
  };

  const flattenedOffers = useMemo(() => {
    // flatten carriers into single list with flight context
    const list: Array<any> = [];
    results.forEach((f) => {
      f.carriers.forEach((c: any) => {
        list.push({
          flightId: f.id,
          depart: f.depart,
          arrive: f.arrive,
          duration: f.duration,
          from: f.from,
          to: f.to,
          seller: c.seller,
          price: c.price,
          currency: c.currency,
          seats: c.seats,
        });
      });
    });
    // apply time filter
    const filtered = list.filter((it) => {
      if (timeFilter === "all") return true;
      const hour = Number(it.depart.split(":")[0]);
      if (timeFilter === "early") return hour >= 0 && hour < 6;
      if (timeFilter === "mid") return hour >= 6 && hour < 12;
      return hour >= 12;
    });

    // sort
    filtered.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      // duration: parse hours
      const da = a.duration.split("h")[0];
      const db = b.duration.split("h")[0];
      return Number(da) - Number(db);
    });

    return filtered;
  }, [results, timeFilter, sort]);

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
            <div className="hidden sm:flex items-center gap-4">
              <button className="text-white/90 text-sm underline">
                Giriş Yap
              </button>
              <button className="bg-white/20 text-white px-3 py-2 rounded">
                Profil
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white/90 dark:bg-white/5 p-4 -mt-2">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm mr-2">Gidiş</label>
                <input
                  type="radio"
                  name="trip"
                  checked={tripType === "one"}
                  onChange={() => setTripType("one")}
                />
                <label className="text-sm mx-2">Tek Yön</label>
                <input
                  type="radio"
                  name="trip"
                  checked={tripType === "round"}
                  onChange={() => setTripType("round")}
                />
                <label className="text-sm ml-2">Gidiş-Dönüş</label>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs text-slate-500">
                    Nereden
                  </label>
                  <Input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">Nereye</label>
                  <Input value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">
                    Gidiş Tarihi
                  </label>
                  <Input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">
                    Dönüş Tarihi
                  </label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={tripType === "one"}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500">
                    Yolcular
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={passengers}
                    onChange={(e) =>
                      setPassengers(Math.max(1, Number(e.target.value)))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center">
                <Button
                  onClick={onSearch}
                  className="bg-brand text-white ml-2 px-6 py-3"
                >
                  Uçuş Ara
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showResults && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded border"
                  onClick={() => {
                    // prev day
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
                  Tahmini fiyatlar gösterilmektedir.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs">Saat:</label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    <option value="all">Tümü</option>
                    <option value="early">00:00 - 06:00</option>
                    <option value="mid">06:00 - 12:00</option>
                    <option value="late">12:00+</option>
                  </select>
                </div>
                <Select onValueChange={(v) => setSort(v as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Fiyat Artan</SelectItem>
                    <SelectItem value="price-desc">Fiyat Azalan</SelectItem>
                    <SelectItem value="duration">Süre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {flattenedOffers.length === 0 ? (
                <div className="p-4 border rounded text-sm text-slate-500">
                  Uçuş bulunamadı.
                </div>
              ) : (
                flattenedOffers.map((o) => (
                  <div
                    key={`${o.flightId}-${o.seller}-${o.price}`}
                    className="rounded-lg border p-3 flex flex-col md:flex-row items-center md:items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-24 text-center">
                        <div className="font-semibold text-lg">{o.depart}</div>
                        <div className="text-xs text-slate-500">{o.from}</div>
                      </div>
                      <div className="hidden md:block border-l h-12" />
                      <div>
                        <div className="font-semibold">{o.seller}</div>
                        <div className="text-xs text-slate-500">
                          Varış: {o.arrive} • Süre: {o.duration}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Kişi Başı</div>
                        <div className="text-lg font-semibold">
                          {o.price} {o.currency}
                        </div>
                        <div className="text-xs text-slate-500">
                          {o.seats} koltuk
                        </div>
                      </div>
                      <div>
                        <Button className="bg-brand text-white">
                          Bilet Ara
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
