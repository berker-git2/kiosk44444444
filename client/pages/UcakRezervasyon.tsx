import { useEffect, useState } from "react";

export default function UcakRezervasyon() {
  const [res, setRes] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("reservation");
      if (raw) setRes(JSON.parse(raw));
    } catch {}
  }, []);

  if (!res) {
    return (
      <section className="py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Rezervasyon bulunamadı</h2>
          <p className="mt-3 text-slate-500">
            Önce ödeme yapmanız veya rezervasyon oluşturmanız gerekiyor.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center">
          <div className="text-sm text-slate-500">Rezervasyon Onayı</div>
          <div className="mt-4">
            <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-r from-brand to-indigo-600 text-white text-2xl font-extrabold shadow-xl">
              {res.code}
            </div>
          </div>
          <h3 className="mt-4 text-2xl font-bold">
            Rezervasyonunuz Oluşturuldu
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Rezervasyon numaranızı kaydedin ve e-postanızı kontrol edin.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <div className="text-xs text-slate-400">Yolcu(lar)</div>
              <div className="font-medium mt-1">
                {(res.passengers || [])
                  .map((p: any) => `${p.firstName} ${p.lastName}`)
                  .join(", ") || "Bilgi yok"}
              </div>

              <div className="text-xs text-slate-400 mt-4">İletişim</div>
              <div className="mt-1">
                {res.contact?.phone || "-"} • {res.contact?.email || "-"}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Uçuş Bilgileri</div>
              <div className="mt-1">
                {res.outbound ? (
                  <div>
                    <div className="font-medium">
                      Gidiş: {res.outbound.from} → {res.outbound.to}
                    </div>
                    <div className="text-sm text-slate-500">
                      {res.outbound.depart} — {res.outbound.arrive} •{" "}
                      {res.outbound.seller}
                    </div>
                  </div>
                ) : null}
                {res.inbound ? (
                  <div className="mt-2">
                    <div className="font-medium">
                      Dönüş: {res.inbound.from} → {res.inbound.to}
                    </div>
                    <div className="text-sm text-slate-500">
                      {res.inbound.depart} — {res.inbound.arrive} •{" "}
                      {res.inbound.seller}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="text-xs text-slate-400 mt-4">Tutar</div>
              <div className="font-semibold mt-1">
                {res.amount} {res.currency}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              target="_blank"
              rel="noreferrer"
              href={`mailto:${res.contact?.email || ""}?subject=Rezervasyon%20${res.code}&body=Rezervasyon%20Numarası:%20${res.code}`}
              className="text-sm underline"
            >
              Rezervasyon e-postası gönder
            </a>
            <button className="ml-2 rounded-md bg-brand text-white px-4 py-2">
              Rezervasyonu PDF olarak indir
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
