import { FormEvent, useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SummarySidebar from "@/components/flights/SummarySidebar";
import { useBooking } from "@/components/flights/BookingContext";
import type { VakifInitRequest, VakifInitResponse } from "@shared/api";

export default function UcakOdeme() {
  const { state, totalAmount } = useBooking();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const orderId = useMemo(() => `ORD-${Date.now()}`, []);

  function luhnCheck(num: string) {
    const arr = num.replace(/\s+/g, "").split("").reverse().map((d) => parseInt(d, 10));
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      let val = arr[i];
      if (i % 2 === 1) {
        val *= 2;
        if (val > 9) val -= 9;
      }
      sum += val;
    }
    return sum % 10 === 0;
  }

  useEffect(() => {
    // Load jQuery then Card.js plugin (https://github.com/jessepollak/card)
    const jq = document.createElement("script");
    jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jq.async = true;

    jq.onload = () => {
      // load Card.js CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/card@2.5.0/dist/card.css";
      document.head.appendChild(link);

      // load Card.js script
      const c = document.createElement("script");
      c.src = "https://unpkg.com/card@2.5.0/dist/card.min.js";
      c.async = true;
      c.onload = () => {
        try {
          const Card = (window as any).Card;
          if (Card) {
            new Card({
              form: "#card-form",
              container: ".card-wrapper",
              formSelectors: {
                numberInput: "#card-number",
                expiryInput: "#card-expiry",
                cvcInput: "#card-cvc",
                nameInput: "#card-name",
              },
            });
          }
        } catch (e) {
          // ignore init errors
        }
      };
      document.body.appendChild(c);
    };

    document.body.appendChild(jq);

    return () => {
      // cleanup optional
    };
  }, []);

  async function onPay(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // basic client-side validation (name, card number Luhn, expiry, cvc)
    const nameEl = document.getElementById("card-name") as HTMLInputElement | null;
    const numEl = document.getElementById("card-number") as HTMLInputElement | null;
    const expEl = document.getElementById("card-expiry") as HTMLInputElement | null;
    const cvcEl = document.getElementById("card-cvc") as HTMLInputElement | null;

    const name = nameEl?.value || "";
    const numRaw = (numEl?.value || "").replace(/\s+/g, "");
    const exp = expEl?.value || "";
    const cvc = cvcEl?.value || "";

    if (!name) {
      setError("Kart üzerindeki isim gereklidir");
      return;
    }
    if (!numRaw || numRaw.length < 13 || !luhnCheck(numRaw)) {
      setError("Geçersiz kart numarası");
      return;
    }
    // expiry simple check MM/YY
    const expParts = exp.split("/");
    if (expParts.length !== 2) {
      setError("Son kullanma tarihi geçersiz");
      return;
    }
    const mm = parseInt(expParts[0], 10);
    const yy = parseInt(expParts[1], 10);
    if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) {
      setError("Son kullanma tarihi geçersiz");
      return;
    }
    const year = 2000 + yy;
    const now = new Date();
    const expiry = new Date(year, mm - 1, 1);
    if (expiry < new Date(now.getFullYear(), now.getMonth(), 1)) {
      setError("Kartın son kullanma tarihi geçmiş");
      return;
    }
    if (!/^[0-9]{3,4}$/.test(cvc)) {
      setError("CVC geçersiz");
      return;
    }

    // Proceed with Vakif init
    try {
      const payload: VakifInitRequest = {
        amount: totalAmount,
        orderId,
        currency: state.selectedOutbound?.currency || "EUR",
        description: `Flight ${state.selectedOutbound?.from}→${state.selectedOutbound?.to}`,
      };
      const res = await fetch("/api/payments/vakif/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Vakıf init failed");
      }
      const data = (await res.json()) as VakifInitResponse;
      // Build auto-posting form to 3D gateway
      const form = formRef.current;
      if (!form) return;
      form.action = data.gatewayUrl;
      form.method = "POST";
      // Clear form then append fields
      while (form.firstChild) form.removeChild(form.firstChild);
      Object.entries(data.fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });
      form.submit();
    } catch (err: any) {
      setError("Ödeme entegrasyonu yapılandırılmadı. Lütfen VakıfBank bilgilerini ekleyin.");
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-0px)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8">
        <div className="grid md:grid-cols-[1fr_20rem] gap-6">
          <div className="space-y-6">
            <div className="rounded-xl border p-4">
              <div className="font-semibold mb-3">Kart Bilgileri</div>

              <div className="grid lg:grid-cols-[1fr_320px] gap-4">
                {/* Left: animated card preview + form */}
                <div>
                  <div className="card-wrapper mb-4" />

                  <form id="card-form" onSubmit={onPay} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Kart Üzerindeki İsim</label>
                      <Input id="card-name" required placeholder="AD SOYAD" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Kart Numarası</label>
                      <Input id="card-number" required placeholder="5549 34.. .. .." inputMode="numeric" />
                      <div id="card-number-error" className="text-xs text-red-600 mt-1 hidden">Geçersiz kart numarası</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Son Kullanma (AA/YY)</label>
                        <Input id="card-expiry" required placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">CVC</label>
                        <Input id="card-cvc" required placeholder="123" inputMode="numeric" />
                      </div>
                    </div>

                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <Button type="submit" className="bg-brand text-white">Ödemeye Git</Button>
                  </form>
                </div>

                {/* Right column reserved for a compact summary */}
                <div className="hidden lg:block">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-slate-600">Kart bilgileri güvenli olarak iletilir.</div>
                    <div className="mt-3 text-sm">Toplam: <b>{totalAmount} {state.selectedOutbound?.currency || 'EUR'}</b></div>
                  </div>
                </div>
              </div>
            </div>
            <form ref={formRef} />
          </div>

          <SummarySidebar />
        </div>
      </div>
    </section>
  );
}
