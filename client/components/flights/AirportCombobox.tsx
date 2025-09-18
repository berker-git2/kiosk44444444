import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AIRPORTS, toLabel } from "./airports";
import { MapPin } from "lucide-react";

export default function AirportCombobox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AIRPORTS;
    return AIRPORTS.filter((a) =>
      [a.city, a.name, a.code].some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start h-10">
            <MapPin className="mr-2 opacity-60" />
            <span className="truncate">{value || "Lütfen seçiniz"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-80">
          <Command>
            <CommandInput
              placeholder="Şehir, havaalanı veya kod"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>Sonuç yok</CommandEmpty>
              <CommandGroup heading="Havalimanları">
                {list.map((a) => (
                  <CommandItem
                    key={a.code}
                    value={`${a.city} ${a.code}`}
                    onSelect={() => {
                      onChange(toLabel(a));
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{toLabel(a)}</span>
                      <span className="text-xs text-slate-500">{a.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
