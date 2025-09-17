import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export type TransferModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Sample location options; in real life this can be fetched from server
const LOCATIONS = [
  "Antalya Havalimanı (AYT)",
  "Antalya Otogar",
  "ON HOTEL ANTALYA",
  "Lara Beach",
  "Konyaaltı Sahili",
  "Belek",
  "Side",
  "Kemer",
  "Alanya",
  "Manavgat",
];

function LocationCombobox({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => LOCATIONS, []);

  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-500">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full inline-flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-white/5",
              !value && "text-slate-400",
            )}
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" />
              {value || placeholder || "Seçiniz"}
            </span>
            <Search className="h-4 w-4 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput placeholder="Ara..." />
            <CommandList>
              <CommandEmpty>Kayıt bulunamadı</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={(val) => {
                      onChange(val);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand" />
                      {opt}
                    </span>
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

function PassengerSelector({
  adults,
  children,
  babies,
  onChange,
}: {
  adults: number;
  children: number;
  babies: number;
  onChange: (next: {
    adults: number;
    children: number;
    babies: number;
  }) => void;
}) {
  const total = adults + children + babies;
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-500">Yolcu</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full border rounded-md px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand" />
              {`Toplam ${total}`}
            </span>
            <span className="text-xs text-slate-500">
              Yetişkin {adults}, Çocuk {children}, Bebek {babies}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px]">
          {[
            { key: "adults", label: "Yetişkin", value: adults },
            { key: "children", label: "Çocuk", value: children },
            { key: "babies", label: "Bebek", value: babies },
          ].map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between py-2"
            >
              <div className="text-sm">{row.label}</div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const next = { adults, children, babies } as any;
                    const min = row.key === "adults" ? 1 : 0;
                    next[row.key] = Math.max(min, row.value - 1);
                    onChange(next);
                  }}
                >
                  -
                </Button>
                <Input
                  className="w-14 text-center"
                  type="number"
                  min={row.key === "adults" ? 1 : 0}
                  value={row.value}
                  onChange={(e) => {
                    const next = { adults, children, babies } as any;
                    const min = row.key === "adults" ? 1 : 0;
                    next[row.key] = Math.max(min, Number(e.target.value));
                    onChange(next);
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const next = { adults, children, babies } as any;
                    next[row.key] = row.value + 1;
                    onChange(next);
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function buildOsmEmbedUrl() {
  const bbox = [30.6, 36.8, 30.84, 36.98];
  const [left, bottom, right, top] = bbox;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik`;
}

type ResultsViewProps = {
  from: string;
  to: string;
  roundTrip: boolean;
  passengers: { adults: number; children: number; babies: number };
  onBack: () => void;
};

type DetailsData = {
  route: string;
  passengers: { adults: number; children: number; babies: number };
  roundTrip: boolean;
  vehicle?: { id: string; name: string; price: number } | null;
};

import ExtrasModal, {
  type ExtrasSelection,
} from "@/components/transfers/ExtrasModal";
import PaymentModal from "@/components/transfers/PaymentModal";
import TransferVoucherModal from "@/components/transfers/TransferVoucherModal";

function TransferDetailsDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: DetailsData;
}) {
  const [name, setName] = useState("");
  const [meetName, setMeetName] = useState("");
  const [flightCode, setFlightCode] = useState("");
  const [arrival, setArrival] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnPickup, setReturnPickup] = useState("");
  const [returnFlight, setReturnFlight] = useState("");
  const [others, setOthers] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const addOther = () => setOthers((arr) => [...arr, ""]);
  const updateOther = (i: number, v: string) =>
    setOthers((arr) => arr.map((x, idx) => (idx === i ? v : x)));

  const [extrasOpen, setExtrasOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [extras, setExtras] = useState<ExtrasSelection>([]);
  const extrasTotal = extras.reduce((s, r) => s + r.qty * r.priceEUR, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-5xl">
        <DialogHeader>
          <DialogTitle>2. Adım: Yolcu Bilgileri</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-slate-500">Güzergah</div>
                <div className="font-medium">{data.route}</div>
              </div>
              <div>
                <div className="text-slate-500">Araç</div>
                <div className="font-medium">
                  {data.vehicle?.name || "—"}{" "}
                  {data.vehicle?.price ? `· ${data.vehicle.price} TL` : ""}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Yolcu</div>
                <div className="font-medium">
                  Toplam{" "}
                  {data.passengers.adults +
                    data.passengers.children +
                    data.passengers.babies}{" "}
                  (Y {data.passengers.adults} / Ç {data.passengers.children} / B{" "}
                  {data.passengers.babies})
                </div>
              </div>
              <div>
                <div className="text-slate-500">Tip</div>
                <div className="font-medium">
                  {data.roundTrip ? "Gidiş-Dönüş" : "Tek Yön"}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Ad Soyad</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ad Soyad"
              />
            </div>
            <div>
              <Label>Karşılama İsmi</Label>
              <Input
                value={meetName}
                onChange={(e) => setMeetName(e.target.value)}
                placeholder="Pankartta yazsın"
              />
            </div>
            <div>
              <Label>Uçuş Kodu</Label>
              <Input
                value={flightCode}
                onChange={(e) => setFlightCode(e.target.value)}
                placeholder="TK1234"
              />
            </div>
            <div>
              <Label>Geliş Tarihi ve Saati</Label>
              <Input
                type="datetime-local"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
              />
            </div>
            {data.roundTrip && (
              <>
                <div>
                  <Label>Dönüş Tarihi</Label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Otel Alınış Saati</Label>
                  <Input
                    type="time"
                    value={returnPickup}
                    onChange={(e) => setReturnPickup(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Dönüş Uçuş Kodu</Label>
                  <Input
                    value={returnFlight}
                    onChange={(e) => setReturnFlight(e.target.value)}
                    placeholder="TK1235"
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Diğer Yolcular</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addOther}
              >
                + Ekle
              </Button>
            </div>
            <div className="space-y-2">
              {others.map((v, i) => (
                <Input
                  key={i}
                  value={v}
                  onChange={(e) => updateOther(i, e.target.value)}
                  placeholder={`Yolcu ${i + 2} Ad Soyad`}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>Şoföre Not</Label>
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Özel istekleriniz"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Vazgeç
            </Button>
            <Button onClick={() => setExtrasOpen(true)}>Devam</Button>
          </div>
        </div>
      </DialogContent>

      <ExtrasModal
        open={extrasOpen}
        onOpenChange={setExtrasOpen}
        onConfirm={(rows, total) => {
          setExtras(rows);
          setExtrasOpen(false);
          setPaymentOpen(true);
        }}
      />

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amountEUR={(data.vehicle?.price || 0) + extrasTotal}
        route={data.route}
        onCashConfirm={(code) => {
          setPaymentOpen(false);
          setVoucherCode(code);
          setVoucherOpen(true);
        }}
      />

      <TransferVoucherModal
        open={voucherOpen}
        onOpenChange={setVoucherOpen}
        data={
          voucherCode
            ? {
                code: voucherCode,
                name,
                meetName,
                passengers: data.passengers,
                route: data.route,
                roundTrip: data.roundTrip,
                arrivalDateTime: arrival,
                returnDate,
                returnPickup,
                flightGo: flightCode,
                flightReturn: returnFlight,
                note,
              }
            : null
        }
      />
    </Dialog>
  );
}

function ResultsView({
  from,
  to,
  roundTrip,
  passengers,
  onBack,
}: ResultsViewProps) {
  const [detailsOpen, setDetailsOpen] = useState<null | {
    id: string;
    name: string;
    price: number;
  }>(null);
  const vehicles = [
    {
      id: "vito",
      name: "Mercedes Standard Vito",
      pax: 6,
      luggage: 5,
      basePrice: 74,
    },
    {
      id: "vipvito",
      name: "Mercedes Vito VIP",
      pax: 6,
      luggage: 5,
      basePrice: 90,
    },
    {
      id: "sprinter",
      name: "Mercedes Sprinter",
      pax: 12,
      luggage: 10,
      basePrice: 110,
    },
  ];
  return (
    <div className="max-h-[75vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <aside className="lg:col-span-4 space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="h-56 w-full overflow-hidden rounded">
                <iframe
                  title="map"
                  className="w-full h-full"
                  src={buildOsmEmbedUrl()}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-sm space-y-2">
              <div className="font-semibold">Özet</div>
              <div>
                {from || "—"} → {to || "—"}
              </div>
              <div>{roundTrip ? "Gidiş + Dönüş" : "Tek Yön"}</div>
              <div>
                Yolcu: Toplam{" "}
                {passengers.adults + passengers.children + passengers.babies}{" "}
                (Yetişkin {passengers.adults}, Çocuk {passengers.children},
                Bebek {passengers.babies})
              </div>
            </CardContent>
          </Card>
        </aside>
        <section className="lg:col-span-8 space-y-4">
          {[
            {
              id: "vito",
              name: "Mercedes Standart Vito (1-6 Kişi)",
              pax: 6,
              luggage: 5,
              image: "/placeholder.svg",
              eur: 37,
              try: 1804,
              type: "Minibüs",
              trim: "Standart Vito (1-6 kişi)",
              features: ["Alkolsüz İçecekler"],
              notes: [
                "Araçta şoföre ödeme opsiyonu",
                "Koşulsuz iptal hakkı",
                "Şehir içi transfer için uygun",
                "Şehirler arası transfer için uygun",
              ],
            },
            {
              id: "vipvito",
              name: "Mercedes Vip Vito (1-6 Kişi)",
              pax: 6,
              luggage: 5,
              image: "/placeholder.svg",
              eur: 45,
              try: 2184,
              type: "Minibüs",
              trim: "Vip Vito (1-6 kişi)",
              features: [
                "Ücretsiz Wifi (İnternet)",
                "Ara Bölmeli",
                "Alkolsüz İçecekler",
                "İkramlıklar",
              ],
              notes: [
                "Araçta şoföre ödeme opsiyonu",
                "Koşulsuz iptal hakkı",
                "Şehir içi transfer için uygun",
                "Şehirler arası transfer için uygun",
              ],
            },
          ].map((v) => (
            <Card key={v.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-start">
                  <div className="md:col-span-3">
                    <img
                      alt={v.name}
                      src={v.image}
                      className="w-full h-28 object-contain bg-slate-50 rounded"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <div className="font-semibold">{v.name}</div>
                    <div className="mt-1 text-sm text-slate-600 flex flex-col">
                      <span>Max {v.pax} Yolcu</span>
                      <span>{v.type}</span>
                      <span>{v.trim}</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {v.features.map((f) => (
                        <div
                          key={f}
                          className="text-sm text-slate-700 flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm">
                        Hizmet Bilgileri
                      </Button>
                    </div>
                  </div>
                  <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start items-end md:items-end gap-3 w-full">
                    <div className="text-right md:text-right w-full">
                      <div className="text-slate-600 text-xs">
                        {roundTrip ? "Gidiş + Dönüş" : "Tek Yön"}
                      </div>
                      <div className="text-slate-400 text-xs">
                        Araç Toplam Ücreti
                      </div>
                      <div className="inline-flex items-center gap-2 rounded bg-amber-400 text-black px-3 py-1 font-semibold mt-1">
                        {v.eur} EUR{" "}
                        <span className="text-xs text-black/70">
                          ({v.try.toLocaleString("tr-TR")} TL)
                        </span>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        {v.notes.map((n) => (
                          <div key={n} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 bg-green-500 rounded-full" />
                            <span>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="md:w-full bg-red-700 hover:bg-red-800"
                      onClick={() =>
                        setDetailsOpen({ id: v.id, name: v.name, price: v.eur })
                      }
                    >
                      Bu Aracı Seç
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Yeni Arama
            </Button>
          </div>

          <TransferDetailsDialog
            open={Boolean(detailsOpen)}
            onOpenChange={(o) => !o && setDetailsOpen(null)}
            data={{
              route: `${from} → ${to}`,
              passengers,
              roundTrip,
              vehicle: detailsOpen || undefined,
            }}
          />
        </section>
      </div>
    </div>
  );
}

import { Textarea } from "@/components/ui/textarea";

export default function TransferModal({
  open,
  onOpenChange,
}: TransferModalProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const passengers = adults + children + babies;
  const [roundTrip, setRoundTrip] = useState(false);
  const [stdDateTime, setStdDateTime] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [passengerOpen, setPassengerOpen] = useState(false);

  // Tahsis tab fields
  const [pickup, setPickup] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [hourSlot, setHourSlot] = useState("00:00");

  const submit = () => {
    if (!from || !to) {
      toast({
        title: "Lütfen konum seçin",
        description: "Nereden ve Nereye alanları zorunludur.",
      });
      return;
    }
    setShowResults(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-6xl">
        <DialogHeader>
          <DialogTitle>Rezervasyon Formu</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="standart" className="w-full">
          <TabsList>
            <TabsTrigger value="standart">Standart</TabsTrigger>
            <TabsTrigger value="tahsis">Tahsis</TabsTrigger>
          </TabsList>
          <TabsContent value="standart">
            {!showResults ? (
              <div className="mt-4 space-y-4">
                <Card>
                  <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5">
                      <LocationCombobox
                        label="Nereden"
                        value={from}
                        onChange={setFrom}
                        placeholder="Başlangıç noktası"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <LocationCombobox
                        label="Nereye"
                        value={to}
                        onChange={setTo}
                        placeholder="Varış noktası"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Yolcu</Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                          onClick={() => setPassengerOpen(true)}
                        >
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" /> {passengers} Yolcu
                          </span>
                          <span className="text-xs text-slate-500">
                            Yetişkin {adults}, Çocuk {children}, Bebek {babies}
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <Label className="text-xs text-slate-500">
                        Tarih ve Saat
                      </Label>
                      <Input
                        type="datetime-local"
                        value={stdDateTime}
                        onChange={(e) => setStdDateTime(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3 flex items-center gap-3">
                      <Switch
                        id="roundtrip"
                        checked={roundTrip}
                        onCheckedChange={setRoundTrip}
                      />
                      <Label htmlFor="roundtrip">Gidiş-Dönüş</Label>
                    </div>
                    <div className="md:col-span-9 flex justify-end">
                      <Button className="px-8" onClick={submit}>
                        ARA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ResultsView
                from={from}
                to={to}
                roundTrip={roundTrip}
                passengers={{ adults, children, babies }}
                onBack={() => setShowResults(false)}
              />
            )}
          </TabsContent>
          <TabsContent value="tahsis">
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-500">Alış yeri</Label>
                  <Input
                    placeholder="Örn. Antalya"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">
                    Tarih ve Saat
                  </Label>
                  <Input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-slate-500">Saat Dilimi</Label>
                  <Select value={hourSlot} onValueChange={setHourSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Saat seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => {
                        const hh = String(i).padStart(2, "0");
                        return (
                          <SelectItem key={hh} value={`${hh}:00`}>
                            {hh}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <PassengerSelector
                    adults={adults}
                    children={children}
                    babies={babies}
                    onChange={({ adults: a, children: c, babies: b }) => {
                      setAdults(a);
                      setChildren(c);
                      setBabies(b);
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full"
                    onClick={() =>
                      toast({
                        title: "Tahsis talebi gönderildi",
                        description: `Alış: ${pickup} | Zaman: ${dateTime || hourSlot} | Yolcu: ${adults + children + babies} (Yetişkin ${adults}, Çocuk ${children}, Bebek ${babies})`,
                      })
                    }
                  >
                    ARA
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Yolcu modal */}
      <Dialog open={passengerOpen} onOpenChange={setPassengerOpen}>
        <DialogContent className="w-[80vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Yolcu Seçimi</DialogTitle>
          </DialogHeader>
          <PassengerSelector
            adults={adults}
            children={children}
            babies={babies}
            onChange={({ adults: a, children: c, babies: b }) => {
              setAdults(a);
              setChildren(c);
              setBabies(b);
            }}
          />
          <div className="flex justify-end">
            <Button onClick={() => setPassengerOpen(false)}>Tamam</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
