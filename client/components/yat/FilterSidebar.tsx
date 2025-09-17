import { useMemo } from "react";
import {
  Anchor,
  AnchorIcon,
  BadgePercent,
  Gauge,
  Ship,
  Sailboat,
  Waves,
  Wind,
  ShowerHead,
  Wifi,
  Utensils,
  Info,
  MapPin,
  Users,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type FilterValue = {
  types: string[];
  price: [number, number];
  location: string;
  capacity: number;
  features: string[];
};

const typeDefs = [
  { id: "motor", label: "Motor", Icon: Ship },
  { id: "gulet", label: "Gulet", Icon: Anchor },
  { id: "sailing", label: "Yelkenli", Icon: Sailboat },
  { id: "catamaran", label: "Katamaran", Icon: Waves },
  { id: "mega", label: "Mega Yacht", Icon: Gauge },
];

const featureDefs = [
  { id: "wc", label: "WC", Icon: ShowerHead },
  { id: "wifi", label: "Wi‑Fi", Icon: Wifi },
  { id: "kitchen", label: "Mutfak", Icon: Utensils },
  { id: "sound", label: "Ses Sistemi", Icon: Wind },
  { id: "captain", label: "Kaptan", Icon: AnchorIcon },
  { id: "discount", label: "İndirim", Icon: BadgePercent },
];

export function FilterSidebar({
  value,
  onChange,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  const min = 50;
  const max = 1000;

  const toggle = (key: keyof FilterValue, id: string) => {
    const set = new Set(value[key] as string[]);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ ...value, [key]: Array.from(set) });
  };

  const displayPrice = useMemo(
    () => `${value.price[0]}€ - ${value.price[1]}€`,
    [value.price],
  );

  return (
    <aside className="sticky top-4 h-[calc(100vh-2rem)] overflow-auto rounded-xl border bg-white/70 dark:bg-white/5 backdrop-blur-xl p-4 space-y-5">
      <div>
        <h3 className="text-sm font-semibold">Tekne Tipi</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {typeDefs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => toggle("types", id)}
              className={
                (value.types.includes(id)
                  ? "bg-brand text-white"
                  : "bg-white/80 text-slate-700 hover:bg-white") +
                " border rounded-md px-3 py-2 text-sm flex items-center gap-2 transition"
              }
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Fiyat Aralığı</h3>
          <span className="text-xs text-slate-500">{displayPrice}</span>
        </div>
        <div className="mt-4 px-1">
          <Slider
            min={min}
            max={max}
            step={5}
            value={value.price}
            onValueChange={(v) =>
              onChange({ ...value, price: [v[0] as number, v[1] as number] })
            }
          />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>En Düşük {min}€</span>
            <span>En Yüksek {max}€</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Tekne Konumu</h3>
        <div className="mt-2">
          <Select
            value={value.location}
            onValueChange={(v) => onChange({ ...value, location: v })}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 opacity-60" />
                <SelectValue placeholder="Tümü" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tum">Tümü</SelectItem>
              <SelectItem value="antalya">Antalya</SelectItem>
              <SelectItem value="kemer">Kemer</SelectItem>
              <SelectItem value="kalkan">Kaş / Kalkan</SelectItem>
              <SelectItem value="bodrum">Bodrum</SelectItem>
              <SelectItem value="gocek">Göcek</SelectItem>
              <SelectItem value="fethiye">Fethiye</SelectItem>
              <SelectItem value="marmaris">Marmaris</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Kapasite</h3>
        <div className="mt-2 relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
          <Input
            type="number"
            min={1}
            value={value.capacity}
            onChange={(e) =>
              onChange({
                ...value,
                capacity: Math.max(1, Number(e.target.value)),
              })
            }
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Tekne Özellikleri</h3>
        <div className="mt-3 space-y-2">
          {featureDefs.map(({ id, label, Icon }) => (
            <label key={id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value.features.includes(id)}
                onChange={() => toggle("features", id)}
                className="accent-brand"
              />
              <Icon className="h-4 w-4 opacity-70" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500 flex items-center gap-2">
        <Info className="h-4 w-4" />
        Filtreleri sağdaki sonuçlardan bağımsız olarak düzenleyebilirsiniz.
      </div>
    </aside>
  );
}
