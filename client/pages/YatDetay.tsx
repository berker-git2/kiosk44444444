import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { yachts } from "@/components/yat/data";
import type { Yacht } from "@/components/yat/types";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  MapPin,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/use-toast";

export default function YatDetay() {
  const { id } = useParams();
  const nav = useNavigate();
  const yacht: Yacht | undefined = useMemo(
    () => yachts.find((y) => y.id === id),
    [id],
  );

  const [active, setActive] = useState(0);
  const [rentalType, setRentalType] = useState<"daily" | "hourly">("daily");
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  if (!yacht) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <Button variant="ghost" onClick={() => nav(-1)} className="mb-4">
          <ChevronLeft className="h-4 w-4" /> Geri
        </Button>
        <p>Tekne bulunamadı.</p>
      </div>
    );
  }

  const onReserve = () => {
    if (rentalType === "daily" && !date?.from) {
      toast({ title: "Lütfen tarih seçiniz" });
      return;
    }
    toast({
      title: "Ön rezervasyon oluşturuldu",
      description: `${yacht.title} • ${rentalType === "daily" ? "Günlük" : "Saatlik"} • ${guests} kişi`,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-6 md:py-10">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" onClick={() => nav(-1)}>
          <ChevronLeft className="h-4 w-4" /> Geri
        </Button>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <MapPin className="h-4 w-4" /> {yacht.marina || yacht.location}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <div className="overflow-hidden rounded-xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                src={(yacht.images && yacht.images[active]) || yacht.image}
                alt={yacht.title}
                className="h-full w-full object-cover"
              />
            </div>
            {yacht.images && yacht.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-2">
                {yacht.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`overflow-hidden rounded-md border ${active === i ? "ring-2 ring-brand" : ""}`}
                  >
                    <img
                      src={img}
                      alt={`${yacht.title} ${i + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold">{yacht.title}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {yacht.description}
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {yacht.specs?.length && (
                <Spec label="Uzunluk" value={yacht.specs.length} />
              )}
              {yacht.specs?.width && (
                <Spec label="Genişlik" value={yacht.specs.width} />
              )}
              {typeof yacht.specs?.cabins === "number" && (
                <Spec label="Kabin" value={`${yacht.specs?.cabins}`} />
              )}
              {typeof yacht.specs?.wc === "number" && (
                <Spec label="WC" value={`${yacht.specs?.wc}`} />
              )}
              {yacht.specs?.buildYear && (
                <Spec label="Yapım Yılı" value={`${yacht.specs.buildYear}`} />
              )}
              {yacht.specs?.speed && (
                <Spec label="Hız" value={yacht.specs.speed} />
              )}
              {typeof yacht.specs?.crew === "number" && (
                <Spec label="Mürettebat" value={`${yacht.specs.crew}`} />
              )}
              <Spec label="Kapasite" value={`${yacht.capacity} kişi`} />
            </div>

            {yacht.amenities && yacht.amenities.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Özellikler</h2>
                <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                  {yacht.amenities.map((a) => (
                    <li
                      key={a}
                      className="rounded-md border px-3 py-2 bg-white/70 dark:bg-white/5"
                    >
                      {amenityLabel(a)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {yacht.coords && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Konum</h2>
                <iframe
                  title="map"
                  className="mt-2 h-64 w-full rounded-xl border"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${yacht.coords.lng - 0.02}%2C${yacht.coords.lat - 0.02}%2C${yacht.coords.lng + 0.02}%2C${yacht.coords.lat + 0.02}&layer=mapnik&marker=${yacht.coords.lat}%2C${yacht.coords.lng}`}
                />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="sticky top-4 rounded-xl border bg-white/80 dark:bg-white/5 backdrop-blur-xl p-4 md:p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {yacht.price} {yacht.currency || "€"}
                </div>
                <div className="text-xs text-slate-500">
                  {rentalType === "daily" ? "/ gün" : "/ saat"}
                </div>
              </div>
              <ToggleGroup
                type="single"
                value={rentalType}
                onValueChange={(v) => v && setRentalType(v as any)}
              >
                <ToggleGroupItem
                  value="daily"
                  className="data-[state=on]:bg-accent"
                >
                  Günlük
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="hourly"
                  className="data-[state=on]:bg-accent"
                >
                  Saatlik
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Bölge</label>
                <Select defaultValue={yacht.location}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={yacht.location}>
                      {yacht.location}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {rentalType === "daily" && (
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    Tarih
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium">
                  Kişi Sayısı
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                  <Input
                    type="number"
                    min={1}
                    value={guests}
                    onChange={(e) =>
                      setGuests(Math.max(1, Number(e.target.value)))
                    }
                    className="pl-9"
                  />
                </div>
              </div>

              <Button className="w-full" onClick={onReserve}>
                Rezervasyon Talebi Gönder
              </Button>
              <p className="text-xs text-slate-500">
                Talebiniz bize iletilir ve en kısa sürede dönüş yapılır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-md border bg-white/70 dark:bg-white/5 p-3 text-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function amenityLabel(id: string) {
  switch (id) {
    case "wc":
      return "WC";
    case "wifi":
      return "Wi‑Fi";
    case "kitchen":
      return "Mutfak";
    case "sound":
      return "Ses Sistemi";
    case "captain":
      return "Kaptan";
    case "discount":
      return "İndirim";
    default:
      return id;
  }
}
