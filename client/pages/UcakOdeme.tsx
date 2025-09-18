import { FormEvent, useMemo, useRef, useState } from "react";
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

  async function onPay(e: FormEvent) {
    e.preventDefault();
    setError(null);
    // Attempt Vakıf 3D init. If credentials are missing, show a message.
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
              <form onSubmit={onPay} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Kart Üzerindeki İsim</label>
                    <Input required placeholder="AD SOYAD" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Kart Numarası</label>
                    <Input required placeholder="5549 34.. .. .." inputMode="numeric" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Son Kullanma (AA/YY)</label>
                    <Input required placeholder="12/28" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">CVC</label>
                    <Input required placeholder="123" inputMode="numeric" />
                  </div>
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
                <Button type="submit" className="bg-brand text-white">Ödemeye Git</Button>
              </form>
            </div>
            <form ref={formRef} />
          </div>

          <SummarySidebar />
        </div>
      </div>
    </section>
  );
}
