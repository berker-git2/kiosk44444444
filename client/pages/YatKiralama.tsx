import { useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Ship,
  Search,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/use-toast";
import {
  FilterSidebar,
  type FilterValue,
} from "@/components/yat/FilterSidebar";
import { YachtCard } from "@/components/yat/YachtCard";
import { yachts } from "@/components/yat/data";

const bgImage =
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2560&auto=format&fit=crop";

const LOCATIONS = [
  "Antalya",
  "Kemer",
  "Kaş / Kalkan",
  "Bodrum",
  "Göcek",
  "Fethiye",
  "Marmaris",
];

export default function YatKiralama() {
  const [location, setLocation] = useState("Antalya");
  const [rentalType, setRentalType] = useState<"daily" | "hourly">("daily");
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState<FilterValue>({
    types: [],
    price: [50, 500],
    location: "tum",
    capacity: 1,
    features: [],
  });

  const onSearch = () => {
    if (rentalType === "daily" && !date?.from) {
      toast({ title: "Lütfen başlangıç tarihi seçin." });
      return;
    }
    const summary = [
      `Bölge: ${location}`,
      `Süre: ${rentalType === "daily" ? "Günlük" : "Saatlik"}`,
      `Kişi: ${guests}`,
      rentalType === "daily" && date?.from
        ? `Tarih: ${format(date.from, "dd.MM.yyyy")}${date.to ? " - " + format(date.to, "dd.MM.yyyy") : ""}`
        : null,
    ]
      .filter(Boolean)
      .join(" • ");

    toast({ title: "Arama hazır", description: summary });
    setShowResults(true);
    queueMicrotask(() =>
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    );
  };

  const filteredYachts = useMemo(() => {
    return yachts.filter((y) => {
      const capOk = y.capacity >= (filters.capacity || 1);
      const locOk =
        filters.location === "tum" ||
        y.location.toLowerCase().includes(filters.location);
      const priceOk =
        y.price >= filters.price[0] && y.price <= filters.price[1];
      return capOk && locOk && priceOk;
    });
  }, [filters]);

  return (
    <section className="relative min-h-[calc(100vh-0px)] overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/50" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10 md:py-16">
        <div className="text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Yat Kiralama
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Akdeniz'in en güzel koylarında lüks ve konforlu bir mavi yolculuk.
            İhtiyacınıza uygun yatı kolayca bulun ve rezervasyon yapın.
          </p>
        </div>

        <div className="mt-8 md:mt-10">
          <div className="glass rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl">
            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-4 md:gap-3">
                <div className="flex items-center justify-between">
                  <div className="hidden md:flex items-center gap-2 text-white/90">
                    <Ship className="h-5 w-5" />
                    <span className="text-sm">Arama seçenekleri</span>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={rentalType}
                    onValueChange={(v) =>
                      v && setRentalType(v as "daily" | "hourly")
                    }
                    className="ml-auto"
                  >
                    <ToggleGroupItem
                      value="daily"
                      aria-label="Günlük"
                      className="text-white/90 data-[state=on]:bg-white/20 data-[state=on]:text-white border border-white/20"
                    >
                      Günlük
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="hourly"
                      aria-label="Saatlik"
                      className="text-white/90 data-[state=on]:bg-white/20 data-[state=on]:text-white border border-white/20"
                    >
                      Saatlik
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-white/80">
                      Bölge
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        list="locations"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Bölge yazın (örn. Antalya)"
                        className="pl-9 bg-white/90 text-slate-900 shadow-sm"
                      />
                      <datalist id="locations">
                        {LOCATIONS.map((l) => (
                          <option value={l} key={l} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {rentalType === "daily" && (
                    <div className="col-span-1 md:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-white/80">
                        Tarih
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white/90 text-left font-normal text-slate-900 shadow-sm"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                            {date?.from ? (
                              date.to ? (
                                <span>
                                  {format(date.from, "dd.MM.yyyy")} -{" "}
                                  {format(date.to, "dd.MM.yyyy")}
                                </span>
                              ) : (
                                <span>{format(date.from, "dd.MM.yyyy")}</span>
                              )
                            ) : (
                              <span>Tarih seçiniz</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="col-span-1">
                    <label className="mb-1 block text-xs font-medium text-white/80">
                      Kişi Sayısı
                    </label>
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(e) =>
                          setGuests(Math.max(1, Number(e.target.value)))
                        }
                        className="pl-9 bg-white/90 text-slate-900 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                  <Button
                    onClick={onSearch}
                    className="bg-brand text-white hover:bg-brand/90 h-11 px-6 w-full md:w-auto"
                  >
                    <Search className="h-4 w-4" />
                    Ara
                  </Button>
                  <div className="text-white/70 text-xs md:text-sm">
                    Güvenli rezervasyon • Ekstra talepler için 7/24 destek •
                    Şeffaf fiyatlandırma
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResults && (
        <div
          ref={resultsRef}
          className="relative z-10 bg-white/60 dark:bg-black/30 backdrop-blur-xl py-10"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Sonuçlar</h2>
              <Select defaultValue="featured" onValueChange={() => {}}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Öne Çıkanlar</SelectItem>
                  <SelectItem value="price-asc">Fiyat Artan</SelectItem>
                  <SelectItem value="price-desc">Fiyat Azalan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6">
              <FilterSidebar value={filters} onChange={setFilters} />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredYachts.map((y) => (
                  <YachtCard key={y.id} y={y} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
