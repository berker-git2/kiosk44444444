import { useMemo, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CreditCard,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Users,
  User,
} from "lucide-react";
import VoucherModal from "./VoucherModal";
import PaymentOptionsModal from "./PaymentOptionsModal";
import CreditCardInput from "./CreditCardInput";
import CardPaymentModal from "./CardPaymentModal";
import PreReservationModal from "./PreReservationModal";
import type { Tour } from "./data";

function formatEUR(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export type ReservationModalProps = {
  tour: Tour;
  defaultDate?: string;
};

export default function ReservationModal({
  tour,
  defaultDate,
}: ReservationModalProps) {
  const [step, setStep] = useState<
    "select" | "details" | "payment" | "success"
  >("select");

  const [date, setDate] = useState<string>(defaultDate || "");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [departure, setDeparture] = useState("Antalya");
  const [gender, setGender] = useState("female");

  const totalPeople = adults + children + babies;
  const priceablePeople = adults + children; // bebek ücretsiz varsayalım
  const totalPrice = useMemo(
    () => priceablePeople * tour.priceEUR,
    [priceablePeople, tour.priceEUR],
  );

  // Payment states
  const [method, setMethod] = useState<"card" | "pre">("card");
  const [paymentOptionsOpen, setPaymentOptionsOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [preModalOpen, setPreModalOpen] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [pre1, setPre1] = useState(false);
  const [pre2, setPre2] = useState(false);
  const [pre3, setPre3] = useState(false);

  const [reservationCode, setReservationCode] = useState<string | null>(null);
  const [voucherOpen, setVoucherOpen] = useState(false);

  function genCode(len = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  return (
    <DialogContent className="max-w-5xl w-[95vw]">
      <DialogHeader>
        <DialogTitle>
          {step === "select" && "Rezervasyon"}
          {step === "details" && "Yolcu Bilgileri"}
          {step === "payment" && "Ödeme Bilgileri"}
          {step === "success" && "Rezervasyonunuz Onaylanmıştır"}
        </DialogTitle>
      </DialogHeader>

      {step === "select" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Tarih ve Saat
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Yetişkin
            </label>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) =>
                setAdults(Math.max(1, Number(e.target.value || 1)))
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Çocuk</label>
            <input
              type="number"
              min={0}
              value={children}
              onChange={(e) =>
                setChildren(Math.max(0, Number(e.target.value || 0)))
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Bebek</label>
            <input
              type="number"
              min={0}
              value={babies}
              onChange={(e) =>
                setBabies(Math.max(0, Number(e.target.value || 0)))
              }
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-3">
            <p className="text-sm font-medium mb-2">Ekstralar</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2">
                <Checkbox /> Öğle Yemeği
              </label>
              <label className="flex items-center gap-2">
                <Checkbox /> Fotoğraf/Video
              </label>
              <label className="flex items-center gap-2">
                <Checkbox /> Otel Transfer
              </label>
              <label className="flex items-center gap-2">
                <Checkbox /> Dal��ş Ekipmanı
              </label>
            </div>
          </div>

          <div className="md:col-span-3 flex items-center justify-between pt-2">
            <div className="text-sm text-slate-600">
              Toplam Kişi: <b>{totalPeople}</b> • Kişi başı:{" "}
              <b>{formatEUR(tour.priceEUR)}</b> • Tahmini Toplam:{" "}
              <b>{formatEUR(totalPrice)}</b>
            </div>
            <button
              className="rounded-md bg-brand text-white px-4 py-2 font-semibold"
              onClick={() => setStep("details")}
            >
              Rezervasyona Devam Et
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <div className="rounded-md border p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div>
                    Rezervasyon Tarihi:{" "}
                    <b>{date ? new Date(date).toLocaleString("tr-TR") : "—"}</b>
                  </div>
                  <div>
                    Kişiler: <b>{adults}</b> yetişkin, <b>{children}</b> çocuk,{" "}
                    <b>{babies}</b> bebek
                  </div>
                </div>
                <button
                  className="text-brand text-sm font-semibold underline underline-offset-2"
                  onClick={() => setStep("select")}
                >
                  Düzenle
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Ad*</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Soyad*
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Telefon Numarası*
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  E-posta Adresi*
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Oda Numarası
                </label>
                <input
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Kalkış Yeri
                </label>
                <Select value={departure} onValueChange={setDeparture}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Antalya">Antalya</SelectItem>
                    <SelectItem value="Kemer">Kemer</SelectItem>
                    <SelectItem value="Belek">Belek</SelectItem>
                    <SelectItem value="Side">Side</SelectItem>
                    <SelectItem value="Alanya">Alanya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">
                  Cinsiyet
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroup
                      value={gender}
                      onValueChange={setGender}
                      className="grid grid-flow-col gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="f" value="female" />
                        <label htmlFor="f">Kadın</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="m" value="male" />
                        <label htmlFor="m">Erkek</label>
                      </div>
                    </RadioGroup>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="rounded-md bg-brand text-white px-4 py-2 font-semibold"
                onClick={() => setPaymentOptionsOpen(true)}
              >
                Güvenli Ödeme İçin Devam Et
              </button>
              <PaymentOptionsModal
                open={paymentOptionsOpen}
                onOpenChange={setPaymentOptionsOpen}
                onSelect={(m) => {
                  setMethod(m);
                  setPaymentOptionsOpen(false);
                  if (m === "card") setCardModalOpen(true);
                  else setPreModalOpen(true);
                }}
              />
            </div>
          </div>

          <aside className="rounded-lg border p-4 bg-card/50">
            <h3 className="font-semibold mb-3">Tur Özeti</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Tur</dt>
                <dd className="font-medium text-right">{tour.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Kişi Sayısı</dt>
                <dd className="font-medium">{totalPeople}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Rezervasyon Sahibi</dt>
                <dd className="font-medium text-right">
                  {(firstName + " " + lastName).trim() || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Kalkış Yeri</dt>
                <dd className="font-medium">{departure}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">Kişi Başı</dt>
                <dd className="font-medium">{formatEUR(tour.priceEUR)}</dd>
              </div>
            </dl>
            <div className="border-t mt-3 pt-3 flex justify-between text-sm">
              <span className="font-semibold">Toplam</span>
              <span className="font-extrabold">{formatEUR(totalPrice)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Bebekler için ücret alınmaz.
            </p>
          </aside>
        </div>
      )}

      {step === "payment" && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <Tabs value={method} onValueChange={(v) => setMethod(v as any)}>
              <TabsList>
                <TabsTrigger value="card" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Kredi Kartı
                </TabsTrigger>
                <TabsTrigger value="pre" className="gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Ön Rezervasyon
                </TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="mt-4">
                <CreditCardInput
                  cardName={cardName}
                  cardNumber={cardNumber}
                  expMonth={expMonth}
                  expYear={expYear}
                  cvv={cvv}
                  onChange={(fields) => {
                    if (fields.cardName !== undefined)
                      setCardName(fields.cardName);
                    if (fields.cardNumber !== undefined)
                      setCardNumber(fields.cardNumber);
                    if (fields.expMonth !== undefined)
                      setExpMonth(fields.expMonth);
                    if (fields.expYear !== undefined)
                      setExpYear(fields.expYear);
                    if (fields.cvv !== undefined) setCvv(fields.cvv);
                  }}
                />
              </TabsContent>

              <TabsContent value="pre" className="mt-4">
                <div className="space-y-3 text-sm">
                  <label className="flex items-start gap-2">
                    <Checkbox
                      checked={pre1}
                      onCheckedChange={(v) => setPre1(Boolean(v))}
                    />
                    <span>
                      Hizmet Sözleşmesi ve İptal/Değişiklik Şartları'nı okudum,
                      kabul ediyorum.
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <Checkbox
                      checked={pre2}
                      onCheckedChange={(v) => setPre2(Boolean(v))}
                    />
                    <span>
                      Ticari Elektronik İleti Aydınlatma Metni'ni okudum, onay
                      veriyorum.
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <Checkbox
                      checked={pre3}
                      onCheckedChange={(v) => setPre3(Boolean(v))}
                    />
                    <span>
                      KVKK Aydınlatma Metni'ni okudum ve kişisel verilerimin
                      işlenmesini kabul ediyorum.
                    </span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <button
                className="rounded-md bg-brand text-white px-4 py-2 font-semibold disabled:opacity-50"
                disabled={method === "pre" ? !(pre1 && pre2 && pre3) : false}
                onClick={async () => {
                  if (method === "pre") {
                    const code = genCode();
                    setReservationCode(code);
                    setVoucherOpen(true);
                    setStep("success");
                    return;
                  }
                  const oid = reservationCode || genCode();
                  setReservationCode(oid);
                  const res = await fetch("/api/payments/vakif/init", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: totalPrice,
                      orderId: oid,
                      currency: "EUR",
                    }),
                  });
                  if (!res.ok) {
                    alert(
                      "Ödeme başlatılamadı. Lütfen daha sonra tekrar deneyin.",
                    );
                    return;
                  }
                  const data = (await res.json()) as {
                    gatewayUrl: string;
                    fields: Record<string, string>;
                  };
                  const form = document.createElement("form");
                  form.method = "POST";
                  form.action = data.gatewayUrl;
                  Object.entries(data.fields).forEach(([k, v]) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = k;
                    input.value = String(v);
                    form.appendChild(input);
                  });
                  document.body.appendChild(form);
                  form.submit();
                }}
              >
                Ödemeyi Tamamla
              </button>
            </div>
          </div>

          <aside className="rounded-lg border p-4 bg-card/50">
            <h3 className="font-semibold mb-3">Tur Özeti</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tarih
                </dt>
                <dd className="font-medium text-right">
                  {date ? new Date(date).toLocaleString("tr-TR") : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Kişi
                </dt>
                <dd className="font-medium">{totalPeople}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Rezervasyon Sahibi
                </dt>
                <dd className="font-medium text-right">
                  {(firstName + " " + lastName).trim() || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Kalkış
                </dt>
                <dd className="font-medium">{departure}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Kişi Başı
                </dt>
                <dd className="font-medium">{formatEUR(tour.priceEUR)}</dd>
              </div>
            </dl>
            <div className="border-t mt-3 pt-3 flex justify-between text-sm">
              <span className="font-semibold">Toplam</span>
              <span className="font-extrabold">{formatEUR(totalPrice)}</span>
            </div>
          </aside>
        </div>
      )}

      {step === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <div className="rounded-lg border p-6 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
                <p className="font-semibold">Rezervasyonunuz onaylanmıştır</p>
              </div>
              <p className="mt-2 text-sm">
                Rezervasyon kodunuz: <b>{reservationCode}</b>.
              </p>
              <div className="mt-3">
                <button
                  className="rounded-md bg-brand text-white px-3 py-2 text-sm font-semibold"
                  onClick={() => setVoucherOpen(true)}
                >
                  Voucher'ı Görüntüle
                </button>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Özet</h4>
              <ul className="text-sm space-y-1">
                <li className="flex justify-between">
                  <span className="text-slate-600">Tur</span>
                  <span className="font-medium">{tour.title}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Tarih</span>
                  <span className="font-medium">
                    {date ? new Date(date).toLocaleString("tr-TR") : "—"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Kişiler</span>
                  <span className="font-medium">
                    {adults} yetişkin, {children} çocuk, {babies} bebek
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Rezervasyon Sahibi</span>
                  <span className="font-medium">
                    {firstName} {lastName}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Kalkış</span>
                  <span className="font-medium">{departure}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Toplam</span>
                  <span className="font-extrabold">
                    {formatEUR(totalPrice)}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <aside className="rounded-lg border p-4 bg-card/50">
            <h3 className="font-semibold mb-3">Ödeme Yöntemi</h3>
            <p className="text-sm">
              {method === "card" ? "Kredi Kart��" : "Ön Rezervasyon"}
            </p>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Ödemeniz güvenli şekilde işlenmiştir.
            </p>
          </aside>
        </div>
      )}
      <VoucherModal
        open={voucherOpen}
        onOpenChange={setVoucherOpen}
        tour={tour}
        date={date}
        adults={adults}
        children={children}
        babies={babies}
        leadName={`${firstName} ${lastName}`.trim()}
        email={email}
        departure={departure}
        reservationCode={reservationCode || ""}
        totalPrice={totalPrice}
      />

      <CardPaymentModal
        open={cardModalOpen}
        onOpenChange={setCardModalOpen}
        tour={tour}
        amount={totalPrice}
        orderId={reservationCode || genCode()}
        onSuccess={(oid) => {
          setReservationCode(oid);
          setVoucherOpen(true);
          setStep("success");
          setCardModalOpen(false);
        }}
      />

      <PreReservationModal
        open={preModalOpen}
        onOpenChange={setPreModalOpen}
        onConfirm={() => {
          const code = genCode();
          setReservationCode(code);
          setVoucherOpen(true);
          setStep("success");
        }}
      />
    </DialogContent>
  );
}
