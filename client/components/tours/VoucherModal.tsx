import { useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Printer, Send, CheckCircle2 } from "lucide-react";
import type { Tour } from "./data";

function formatEUR(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export type VoucherModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour;
  date?: string;
  adults: number;
  children: number;
  babies: number;
  leadName: string;
  email?: string;
  departure: string;
  reservationCode: string;
  totalPrice: number;
};

export default function VoucherModal(props: VoucherModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const people = props.adults + props.children + props.babies;
  const dateStr = props.date
    ? new Date(props.date).toLocaleString("tr-TR")
    : "—";

  async function onSendEmail() {
    try {
      const to = props.email || "";
      const html = ref.current?.outerHTML || "";
      const res = await fetch("/api/voucher-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject: `Voucher ${props.reservationCode}`,
          html,
        }),
      });
      if (!res.ok) {
        alert("E-posta gönderilemedi. Lütfen ayarları kontrol edin.");
        return;
      }
      alert("Voucher e‑posta ile gönderildi.");
    } catch (e) {
      alert("E-posta gönderimi sırasında hata oluştu.");
    }
  }

  function onPrint() {
    if (!ref.current) return window.print();
    const win = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=800,height=900",
    );
    if (!win) return;
    win.document.write(
      `<!doctype html><meta charset='utf-8' /><title>Voucher ${props.reservationCode}</title>`,
    );
    win.document.write(
      "<style>body{font-family:Inter,system-ui,Arial,sans-serif;padding:24px} .row{display:flex;justify-content:space-between;margin:6px 0}</style>",
    );
    win.document.write(ref.current.outerHTML);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 text-green-600 p-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="!mb-0">
                  Rezervasyon Onaylandı
                </DialogTitle>
                <div className="text-sm text-slate-600">
                  Rezervasyon özeti ve işlemler
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Rezervasyon Kodu</div>
              <div className="font-mono font-semibold text-lg">
                {props.reservationCode}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
          >
            <Printer className="h-4 w-4" /> Yazdır
          </button>
          <button
            onClick={onSendEmail}
            className="inline-flex items-center gap-2 rounded-md bg-brand text-white px-3 py-1.5 text-sm"
          >
            <Send className="h-4 w-4" /> Voucher'ı mail ile gönder
          </button>
        </div>

        <div
          ref={ref}
          className="rounded-lg border p-4 bg-white text-slate-900"
        >
          <h3 className="font-semibold text-lg mb-2">{props.tour.title}</h3>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between">
              <dt className="text-slate-600">Rezervasyon Kodu</dt>
              <dd className="font-medium">{props.reservationCode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Tarih</dt>
              <dd className="font-medium">{dateStr}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Kişi Sayısı</dt>
              <dd className="font-medium">{people}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Rezervasyon Sahibi</dt>
              <dd className="font-medium">{props.leadName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Kalkış Yeri</dt>
              <dd className="font-medium">{props.departure}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Toplam</dt>
              <dd className="font-extrabold">{formatEUR(props.totalPrice)}</dd>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
