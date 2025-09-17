import { Link } from "react-router-dom";

export default function Index() {
  return (
    <section className="min-h-[calc(100vh-0px)] relative overflow-hidden">
      <div className="absolute inset-0 hero-bg" />
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="inline-block rounded-full bg-brand/10 text-brand px-3 py-1 text-xs font-semibold tracking-wide">
              Antalya Tour & Hotel
            </p>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              ON HOTEL ANTALYA
            </h1>
            <p className="mt-4 text-slate-600 text-lg md:text-xl leading-relaxed">
              Akdeniz manzarası eşliğinde konfor, tur ve transfer hizmetleri.
              Modern, hızlı ve güvenli rezervasyon deneyimi.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/turlar"
                className="inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-3 text-sm font-semibold shadow hover:brightness-110 transition"
              >
                Turları Keşfet
              </Link>
              <Link
                to="/destek"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white/70 backdrop-blur px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-white"
              >
                Teklif Al
              </Link>
            </div>
          </div>

          {/* Feature cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Transferler",
                desc: "Havalimanı ve şehir içi konforlu transfer.",
                href: "/transferler",
              },
              {
                title: "Yat Kiralama",
                desc: "Mavi yolculuk için özel seçenekler.",
                href: "/yat-kiralama",
              },
              {
                title: "Bilet İşlemleri",
                desc: "Uçak ve otobüs bileti, en iyi fiyat.",
                href: "/ucak-bileti",
              },
            ].map((c) => (
              <Link
                key={c.title}
                to={c.href}
                className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-6 hover:shadow-xl transition"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/0 to-brand/10 opacity-0 group-hover:opacity-100 transition" />
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {c.desc}
                </p>
                <span className="mt-4 inline-block text-brand font-semibold">
                  İncele →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* decorative */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
    </section>
  );
}
