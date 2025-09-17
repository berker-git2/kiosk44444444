import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Yacht } from "./types";
import CreditCardInput from "@/components/tours/CreditCardInput";
import { CheckCircle2, Mail, Printer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export type AddonRow = { id: string; name: string; qty: number; price: number };
export type TransferRow = { id: string; label: string; price: number } | null;

export default function YatBookingModal({
  open,
  onOpenChange,
  yacht,
  rentalType,
  dayCount,
  hours,
  startHour,
  dateFrom,
  dateTo,
  hourlyDate,
  guests,
  embarkName,
  addons,
  transfer,
  totals,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  yacht: Yacht;
  rentalType: "daily" | "hourly";
  dayCount: number;
  hours: number;
  startHour?: string;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  hourlyDate?: Date | undefined;
  guests: number;
  embarkName?: string;
  addons: AddonRow[];
  transfer: TransferRow;
  totals: {
    base: number;
    addons: number;
    transfer: number;
    grand: number;
    prepay: number;
    payOnBoard: number;
  };
}) {
  const [mode, setMode] = useState<"pre" | "pay" | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  const [code, setCode] = useState<string | null>(null);
  const currency = yacht.currency || "€";

  function genCode(len = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  function resetAll() {
    setMode(null);
    setStep(1);
    setName("");
    setEmail("");
    setPhone("");
    setCardName("");
    setCardNumber("");
    setExpMonth("");
    setExpYear("");
    setCvv("");
    setCode(null);
  }

  const whenText = useMemo(() => {
    if (rentalType === "daily") {
      if (!dateFrom) return "Tarih seçilmedi";
      const from = dateFrom?.toLocaleDateString("tr-TR");
      const to = dateTo ? dateTo.toLocaleDateString("tr-TR") : undefined;
      return `${from}${to ? ` - ${to}` : ""} (${dayCount} gün)`;
    } else {
      const d = hourlyDate?.toLocaleDateString("tr-TR") || "—";
      return `${d} ${startHour || ""} (${hours} saat)`;
    }
  }, [rentalType, dateFrom, dateTo, dayCount, hourlyDate, startHour, hours]);

  async function sendEmailVoucher() {
    if (!email) {
      toast({ title: "E-posta adresi giriniz" });
      return;
    }
    const html = buildVoucherHtml();
    const res = await fetch("/api/voucher-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: `Yat Rezervasyonu ${code || '""'}`,
        html,
      }),
    });
    if (!res.ok) {
      toast({
        title: "E-posta gönderilemedi",
        description: "Sunucu e-posta ayarları yapılandırılmamış olabilir.",
      });
      return;
    }
    toast({ title: "Voucher e-posta ile gönderildi" });
  }

  function buildVoucherHtml() {
    return `
      <h2>Rezervasyonunuz Oluşturulmuştur</h2>
      <p>Kod: <b>${code || ""}</b></p>
      <p>Yat: <b>${yacht.title}</b></p>
      <p>Tarih/Saat: <b>${whenText}</b></p>
      <p>Kişi Sayısı: <b>${guests}</b></p>
      <p>İskele: <b>${embarkName || "—"}</b></p>
      <h3>Ek Hizmetler</h3>
      <ul>
        ${addons.length ? addons.map((a) => `<li>${a.name} × ${a.qty} = ${a.qty * a.price} ${currency}</li>`).join("") : "<li>—</li>"}
      </ul>
      <p>Transfer: <b>${transfer ? `${transfer.label} - ${transfer.price} ${currency}` : "—"}</b></p>
      <h3>Tutarlar</h3>
      <p>Ara Toplam: <b>${totals.base} ${currency}</b></p>
      <p>Ek Hizmetler: <b>${totals.addons} ${currency}</b></p>
      <p>Transfer: <b>${totals.transfer} ${currency}</b></p>
      <p>Toplam: <b>${totals.grand} ${currency}</b></p>
      <hr/>
      <p>İsim: ${name}</p>
      <p>E-posta: ${email}</p>
      <p>Telefon: ${phone}</p>
    `;
  }

  function Summary() {
    return (
      <aside className="rounded-lg border p-4 bg-card/50 text-sm">
        <h3 className="font-semibold mb-3">Özet</h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-600">Yat</span>
            <span className="font-medium">{yacht.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Tarih/Saat</span>
            <span className="font-medium">{whenText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Kişi</span>
            <span className="font-medium">{guests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">İskele</span>
            <span className="font-medium">{embarkName || "—"}</span>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="space-y-1">
          <div className="font-semibold mb-1">Ek Hizmetler</div>
          {addons.length ? (
            <ul className="space-y-1">
              {addons.map((a) => (
                <li key={a.id} className="flex justify-between">
                  <span>
                    {a.name} × {a.qty}
                  </span>
                  <span className="font-medium">
                    {a.qty * a.price} {currency}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-500">Seçilmedi</div>
          )}
          <div className="flex justify-between mt-2">
            <span className="text-slate-600">Transfer</span>
            <span className="font-medium">
              {transfer
                ? `${transfer.label} · ${transfer.price} ${currency}`
                : "—"}
            </span>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-600">Ara Toplam</span>
            <span className="font-medium">
              {totals.base} {currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Ek Hizmetler</span>
            <span className="font-medium">
              {totals.addons} {currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Transfer</span>
            <span className="font-medium">
              {totals.transfer} {currency}
            </span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2 mt-1">
            <span>Toplam</span>
            <span className="font-extrabold">
              {totals.grand} {currency}
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) resetAll();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-5xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>
            {mode === null && "Rezervasyon Türü"}
            {mode !== null && step === 2 && "2. Adım: Rezervasyon Formu"}
            {mode === "pay" && step === 3 && "3. Adım: Ödeme"}
            {mode !== null && step === 4 && "Voucher"}
          </DialogTitle>
        </DialogHeader>

        {mode === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="rounded-xl border p-5 text-left hover:shadow"
              onClick={() => {
                setMode("pre");
                setStep(2);
              }}
            >
              <div className="text-lg font-semibold">
                Ön Rezervasyon Talebi Oluştur
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Bilgilerinizi alın, talebinizi oluşturalım. Ödeme gerektirmez.
              </p>
            </button>
            <button
              className="rounded-xl border p-5 text-left hover:shadow"
              onClick={() => {
                setMode("pay");
                setStep(2);
              }}
            >
              <div className="text-lg font-semibold">Online Ön Ödeme</div>
              <p className="text-sm text-slate-600 mt-1">
                Bilgileri doldurun ve güvenli şekilde online ödeme yapın.
              </p>
            </button>
          </div>
        ) : step === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-3">
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
                  <Label>E-posta</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eposta@ornek.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Telefon</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xx xxx xx xx"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMode(null);
                    setStep(1);
                  }}
                >
                  Geri
                </Button>
                <Button
                  onClick={() => {
                    if (!name || !email || !phone) {
                      toast({ title: "Lütfen formu doldurunuz" });
                      return;
                    }
                    setStep(mode === "pre" ? 4 : 3);
                    if (mode === "pre") setCode(genCode());
                  }}
                >
                  Devam
                </Button>
              </div>
            </div>
            <Summary />
          </div>
        ) : mode === "pay" && step === 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-3">
              <CreditCardInput
                cardName={cardName}
                cardNumber={cardNumber}
                expMonth={expMonth}
                expYear={expYear}
                cvv={cvv}
                onChange={(f) => {
                  if (f.cardName !== undefined) setCardName(f.cardName);
                  if (f.cardNumber !== undefined) setCardNumber(f.cardNumber);
                  if (f.expMonth !== undefined) setExpMonth(f.expMonth);
                  if (f.expYear !== undefined) setExpYear(f.expYear);
                  if (f.cvv !== undefined) setCvv(f.cvv);
                }}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Geri
                </Button>
                <Button
                  onClick={() => {
                    const c = genCode();
                    setCode(c);
                    setStep(4);
                  }}
                >
                  Ödemeyi Tamamla
                </Button>
              </div>
            </div>
            <Summary />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                <div className="font-semibold">
                  Rezervasyonunuz Oluşturulmuştur
                </div>
              </div>
              <div className="mt-2 text-sm">
                Rezervasyon kodunuz: <b>{code}</b>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border p-4">
                <div className="font-semibold mb-2">Rezervasyon Sahibi</div>
                <div>
                  Ad Soyad: <b>{name}</b>
                </div>
                <div>
                  E-posta: <b>{email}</b>
                </div>
                <div>
                  Telefon: <b>{phone}</b>
                </div>
                <Separator className="my-3" />
                <div className="font-semibold mb-2">Tur Bilgileri</div>
                <div>
                  Yat: <b>{yacht.title}</b>
                </div>
                <div>
                  Tarih/Saat: <b>{whenText}</b>
                </div>
                <div>
                  Kişi Sayısı: <b>{guests}</b>
                </div>
                <div>
                  İskele: <b>{embarkName || "—"}</b>
                </div>
                <div>
                  Transfer:{" "}
                  <b>
                    {transfer
                      ? `${transfer.label} - ${transfer.price} ${currency}`
                      : "—"}
                  </b>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold mb-2">Ek Hizmetler</div>
                {addons.length ? (
                  <ul className="space-y-1">
                    {addons.map((a) => (
                      <li key={a.id} className="flex justify-between">
                        <span>
                          {a.name} × {a.qty}
                        </span>
                        <span className="font-medium">
                          {a.qty * a.price} {currency}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-500">Seçilmedi</div>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between">
                  <span className="text-slate-600">Toplam</span>
                  <span className="font-extrabold">
                    {totals.grand} {currency}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="gap-2"
              >
                <Printer className="h-4 w-4" /> Yazdır
              </Button>
              <Button onClick={sendEmailVoucher} className="gap-2">
                <Mail className="h-4 w-4" /> Voucher'ı e-postaya gönder
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
