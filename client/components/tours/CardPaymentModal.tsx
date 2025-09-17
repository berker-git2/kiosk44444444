import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import CreditCardInput from "./CreditCardInput";
import type { Tour } from "./data";

export type CardPaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour;
  amount: number;
  orderId: string;
  onSuccess?: (orderId: string) => void;
};

function luhnCheck(num: string) {
  const digits = num.replace(/\D/g, "");
  let sum = 0;
  let toggle = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (toggle) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    toggle = !toggle;
  }
  return sum % 10 === 0;
}

export default function CardPaymentModal({
  open,
  onOpenChange,
  tour,
  amount,
  orderId,
  onSuccess,
}: CardPaymentModalProps) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validate() {
    setError(null);
    const digits = cardNumber.replace(/\D/g, "");
    if (!cardName.trim()) return "Kart sahibi adı giriniz.";
    if (digits.length < 13) return "Kart numarası eksik.";
    if (!luhnCheck(digits)) return "Geçersiz kart numarası.";
    const m = Number(expMonth);
    let y = Number(expYear);
    if (expYear.length === 2) {
      y = 2000 + y;
    }
    if (!m || m < 1 || m > 12) return "Geçersiz son kullanma ayı.";
    if (!y || y < 2000) return "Geçersiz son kullanma yılı.";
    const now = new Date();
    const exp = new Date(y, m - 1, 1);
    // set to end of month
    exp.setMonth(exp.getMonth() + 1);
    if (exp <= now) return "Kart süresi dolmuş.";
    const cvvDigits = cvv.replace(/\D/g, "");
    const cvvLen = cardNumber.replace(/\D/g, "").length === 15 ? 4 : 3;
    if (cvvDigits.length !== cvvLen) return `CVV ${cvvLen} haneli olmalıdır.`;
    return null;
  }

  async function onPay() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    try {
      setLoading(true);
      // Simulate payment gateway flow (mock)
      await new Promise((r) => setTimeout(r, 900));
      // show success visual briefly
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 700));
      // Success
      if (onSuccess) onSuccess(orderId);
      setSuccess(false);
      onOpenChange(false);
    } catch (e) {
      setError("Ödeme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kredi Kartı ile Ödeme</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="text-sm text-slate-600 mb-2">Tur: {tour.title}</div>
          <div className="text-sm text-slate-600 mb-4">
            Tutar:{" "}
            {new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(amount)}
          </div>

          <CreditCardInput
            cardName={cardName}
            cardNumber={cardNumber}
            expMonth={expMonth}
            expYear={expYear}
            cvv={cvv}
            onChange={(fields) => {
              if (fields.cardName !== undefined) setCardName(fields.cardName);
              if (fields.cardNumber !== undefined)
                setCardNumber(fields.cardNumber);
              if (fields.expMonth !== undefined) setExpMonth(fields.expMonth);
              if (fields.expYear !== undefined) setExpYear(fields.expYear);
              if (fields.cvv !== undefined) setCvv(fields.cvv);
            }}
          />

          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md mb-3">
              <Check className="h-5 w-5" />
              <div>Ödeme başarılı. Rezervasyon hazırlanıyor...</div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={onPay}
              disabled={loading}
              className="rounded-md bg-brand text-white px-4 py-2 font-semibold disabled:opacity-50"
            >
              {loading ? "İşleniyor..." : "Ödemeyi Başlat"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
