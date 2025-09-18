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
    // dynamically load jQuery and attach simple UI handlers for animations and formatting
    const script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    script.async = true;
    script.onload = () => {
      const $ = (window as any).jQuery;
      if (!$) return;

      function formatCardNumber(v: string) {
        return v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
      }

      function isExpiryValid(v: string) {
        const parts = v.split("/").map((p) => p.trim());
        if (parts.length !== 2) return false;
        const mm = parseInt(parts[0], 10);
        const yy = parseInt(parts[1], 10);
        if (isNaN(mm) || isNaN(yy)) return false;
        if (mm < 1 || mm > 12) return false;
        const year = 2000 + yy;
        const now = new Date();
        const expiry = new Date(year, mm - 1, 1);
        return expiry >= new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // typing and formatting
      $(document).on("input", "#card-number", function (this: any) {
        const raw = $(this).val() as string;
        const formatted = formatCardNumber(raw);
        $(this).val(formatted);
        $("#cc-preview-number").text(formatted || "•••• •••• •••• ••••");
        $("#card-number-error").hide();

        // visual state
        const rawDigits = (formatted || "").replace(/\s+/g, "");
        if (rawDigits.length >= 13 && luhnCheck(rawDigits)) {
          $("#card-inner").removeClass("card-invalid").addClass("card-valid pulse");
          setTimeout(() => $("#card-inner").removeClass("pulse"), 900);
        } else if (rawDigits.length > 0) {
          $("#card-inner").removeClass("card-valid").addClass("card-invalid");
        } else {
          $("#card-inner").removeClass("card-valid card-invalid");
        }
      });

      $(document).on("blur", "#card-number", function (this: any) {
        const raw = ($(this).val() as string).replace(/\s+/g, "");
        if (raw.length < 13 || !luhnCheck(raw)) $("#card-number-error").show();
        else $("#card-number-error").hide();
      });

      $(document).on("input", "#card-name", function (this: any) {
        $("#cc-preview-name").text(((this.value as string) || "AD SOYAD").toUpperCase());
      });

      $(document).on("input", "#card-expiry", function (this: any) {
        $("#cc-preview-expiry").text((this.value as string) || "--/--");
        // small validity pulse
        if (isExpiryValid(this.value as string)) {
          $("#card-inner").addClass("pulse");
          setTimeout(() => $("#card-inner").removeClass("pulse"), 700);
        }
      });

      $(document).on("focus", "#card-cvc", function () {
        $("#card-front").hide();
        $("#card-back").removeClass("hidden");
        $("#cc-preview-cvc").text(($("#card-cvc").val() as string) || "•••");
        $("#card-inner").addClass("tilt");
      });
      $(document).on("blur", "#card-cvc", function () {
        $("#card-back").addClass("hidden");
        $("#card-front").show();
        $("#card-inner").removeClass("tilt");
      });
      $(document).on("input", "#card-cvc", function (this: any) {
        $("#cc-preview-cvc").text((this.value as string) || "•••");
      });

      // tilt on mouse move inside preview
      $(document).on("mousemove", "#card-preview", function (e: any) {
        const rect = (this as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (-y / rect.height) * 10; // rotateX
        const ry = (x / rect.width) * 12; // rotateY
        $("#card-inner").css("transform", `rotateX(${rx}deg) rotateY(${ry}deg)`);
      });
      $(document).on("mouseleave", "#card-preview", function () {
        $("#card-inner").css("transform", "rotateX(0deg) rotateY(0deg)");
      });
    };
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
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
                  <div id="card-preview" className="relative w-full max-w-md mx-auto mb-4 perspective-1000">
                    <div id="card-inner" className="relative w-full h-44 rounded-xl text-white bg-gradient-to-r from-brand to-indigo-600 p-4 transform transition-transform duration-500 will-change-transform">
                      {/* Front */}
                      <div id="card-front" className="absolute inset-0">
                        <div className="flex justify-between items-center mb-6">
                          <div className="text-sm font-semibold">On Flight</div>
                          <div className="text-xs">VISA</div>
                        </div>
                        <div className="text-xl font-mono tracking-widest" id="cc-preview-number">•••• •••• •••• ••••</div>
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
