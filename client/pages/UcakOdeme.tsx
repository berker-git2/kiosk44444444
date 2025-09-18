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

              <div className="grid lg:grid-cols-[1fr_320px] gap-4">
                {/* Left: animated card preview + form */}
                <div>
                  <div id="card-preview" className="relative w-full max-w-md mx-auto mb-4 perspective-1000">
                    <div id="card-inner" className="relative w-full h-44 rounded-xl text-white bg-gradient-to-r from-brand to-indigo-600 p-4 transform transition-transform duration-500 will-change-transform">
                      {/* Front */}
                      <div id="card-front" className="absolute inset-0">
                        <div className="flex justify-between items-center mb-6">
                          <div className="text-sm font-semibold">On Flight</div>
                          <div className="text-xs">VISA</div>
                        </div>
                        <div className="text-xl font-mono tracking-widest" id="cc-preview-number">•••• •••• •��•• ••••</div>
                        <div className="flex justify-between items-end mt-6 text-sm">
                          <div>
                            <div className="text-xs text-slate-200">Kart Sahibi</div>
                            <div id="cc-preview-name" className="font-medium">AD SOYAD</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-200">AA/YY</div>
                            <div id="cc-preview-expiry" className="font-medium">--/--</div>
                          </div>
                        </div>
                      </div>
                      {/* Back (CVC) - simplified, shown on focus */}
                      <div id="card-back" className="absolute inset-0 hidden bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 text-black">
                        <div className="bg-black/60 h-10 rounded mb-4" />
                        <div className="flex justify-end">
                          <div className="bg-white rounded px-3 py-1" id="cc-preview-cvc">•••</div>
                        </div>
                      </div>
                    </div>
                  </div>

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
