import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { tours } from "@/components/tours/data";
import Gallery from "@/components/tours/Gallery";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ReservationModal from "@/components/tours/ReservationModal";

export default function TurDetay() {
  const { id } = useParams();
  const tour = useMemo(() => tours.find((t) => t.id === id), [id]);

  const [date, setDate] = useState<string>("");
  const [comments, setComments] = useState<{ name: string; text: string }[]>(
    [],
  );

  if (!tour) return <div className="p-6">Tur bulunamadı.</div>;

  const images = [
    tour.image,
    tour.image + "&auto=compress",
    tour.image + "&sat=10",
  ].slice(0, 3);

  return (
    <section className="min-h-[calc(100vh-0px)] px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Left booking/info panel */}
        <aside className="glass rounded-xl p-4 md:p-5 border">
          <h3 className="font-semibold mb-3">Tur Detayları</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-slate-500">Tur Kodu</dt>
            <dd>ANT{tour.id.slice(0, 3).toUpperCase()}</dd>
            <dt className="text-slate-500">Çıkış Bölgesi</dt>
            <dd>Antalya</dd>
            <dt className="text-slate-500">Kalkış Saatleri</dt>
            <dd>08:30, 10:30</dd>
            <dt className="text-slate-500">Kapasite</dt>
            <dd>40 kişi</dd>
            <dt className="text-slate-500">Tur Takvimi</dt>
            <dd>Her gün</dd>
          </dl>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Tarih ve Saat
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-brand/10 to-transparent border border-brand/30">
            <p className="text-xs text-slate-600">Kişi başı</p>
            <p className="text-3xl font-extrabold">
              {tour.priceEUR} <span className="text-sm font-semibold">EUR</span>
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="mt-4 w-full rounded-md bg-brand text-white py-2.5 font-semibold hover:brightness-110">
                Rezervasyon Yap
              </button>
            </DialogTrigger>
            <ReservationModal tour={tour} defaultDate={date} />
          </Dialog>
        </aside>

        {/* Main content */}
        <div className="space-y-6">
          <Gallery images={images} videoUrl={tour.videoUrl} />

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{tour.title}</h1>
            <p className="mt-2 text-slate-700 max-w-3xl">
              {tour.description} Güzergah ve program hava durumuna bağlı olarak
              değişiklik gösterebilir.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Fiyata Dahil</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Giriş Ücretleri</li>
                  <li>Rehberlik</li>
                  <li>Sigorta</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Harice</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Alkollü / alkolsüz içecekler</li>
                  <li>Kişisel harcamalar</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Yorumlar</h2>
            <div className="mt-3 space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-slate-600">
                  Henüz yorum yok. İlk yorumu siz yazın.
                </p>
              )}
              {comments.map((c, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-sm text-slate-700 mt-1">{c.text}</p>
                </div>
              ))}
            </div>

            <form
              className="mt-4 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const formData = new FormData(form);
                const name = String(formData.get("name") || "Misafir");
                const text = String(formData.get("text") || "");
                if (text.trim()) setComments((arr) => [...arr, { name, text }]);
                form.reset();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  name="name"
                  placeholder="Adınız"
                  className="rounded-md border px-3 py-2 text-sm md:col-span-1"
                />
                <textarea
                  name="text"
                  required
                  placeholder="Yorumunuz"
                  className="rounded-md border px-3 py-2 text-sm md:col-span-3"
                />
              </div>
              <div className="flex justify-end">
                <button className="rounded-md bg-brand text-white px-4 py-2 text-sm font-semibold">
                  Yorumu Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
