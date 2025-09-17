import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoomModal, { type Room } from "@/components/hotel/RoomModal";

const heroSlides = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487730116645-74489c95b41b?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
];

const rooms: (Room & { img: string })[] = [
  {
    name: "Standart Oda",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    description: "Şehir manzaralı, konforlu yatak ve modern banyo.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521783988139-893ce1e2eebf?q=80&w=1200&auto=format&fit=crop",
    ],
    features: ["Çift/İkiz Yatak", "Klima", "Minibar", "Smart TV"],
  },
  {
    name: "Deniz Manzaralı",
    img: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop",
    description: "Akdeniz manzarası, balkon ve geniş iç mekan.",
    images: [
      "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
    ],
    features: ["Balkon", "Kahve Makinesi", "Hızlı Wi‑Fi"],
  },
  {
    name: "Aile Odası",
    img: "https://images.unsplash.com/photo-1521783988139-893ce1e2eebf?q=80&w=1200&auto=format&fit=crop",
    description: "Çocuklu aileler için iki odalı geniş çözüm.",
    images: [
      "https://images.unsplash.com/photo-1521783988139-893ce1e2eebf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=1200&auto=format&fit=crop",
    ],
    features: ["İki Yatak Odası", "Bebek Yatağı Opsiyonu"],
  },
  {
    name: "Deluxe Oda",
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    description: "Geniş yaşam alanı ve lüks donanım.",
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop",
    ],
    features: ["Kanepe", "Yağmur Duş", "Premium Buklet"],
  },
  {
    name: "Suite",
    img: "https://images.unsplash.com/photo-1499696010180-025ef0c6e1dc?q=80&w=1200&auto=format&fit=crop",
    description: "Ayrı oturma odası ve geniş balkon.",
    images: [
      "https://images.unsplash.com/photo-1499696010180-025ef0c6e1dc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    ],
    features: ["Oturma Alanı", "Balkon", "Deniz Manzarası"],
  },
  {
    name: "Ekonomik Oda",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    description: "Bütçe dostu, kompakt çözüm.",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop",
    ],
    features: ["Konforlu Yatak", "Sessiz Oda"],
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499696010180-025ef0c6e1dc?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501117716987-c8e7ecb49ace?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=1200&auto=format&fit=crop",
];

export default function Videolar() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [roomOpen, setRoomOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="h-[70vh] md:h-[80vh] relative">
        <Carousel className="h-full">
          <CarouselPrevious />
          <CarouselNext />
          <CarouselContent className="h-full">
            {heroSlides.map((src, i) => (
              <CarouselItem key={i} className="h-full">
                <div className="h-full w-full">
                  <img
                    src={src}
                    alt="hero"
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-5xl text-white px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">
            On Hotel Antalya
          </h1>
          <p className="max-w-xl mt-2 drop-shadow text-sm md:text-base">
            Akdeniz’in en güzel koylarına komşu, şehir merkezinde konforlu bir
            kaçamak.
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-24 shape-about gallery-fixed">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Hakkımızda</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              On Hotel, misafirlerine modern konforu ve sıcak bir atmosferi bir
              arada sunar. Denize sıfır konumu, zengin kahvaltısı ve güler yüzlü
              hizmetiyle unutulmaz bir tatil deneyimi sağlar.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop"
            alt="about"
            className="rounded-lg w-full h-64 md:h-80 object-cover"
          />
        </div>
      </section>

      {/* Rooms with background + overlay */}
      <section id="rooms" className="relative py-16 md:py-24">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${rooms[0].img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="max-w-6xl mx-auto px-6 text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Oda Tipleri</h2>
          <div className="mt-6 relative">
            <Carousel>
              <CarouselPrevious />
              <CarouselNext />
              <CarouselContent>
                {rooms.map((r) => (
                  <CarouselItem
                    key={r.name}
                    className="basis-full md:basis-1/3"
                  >
                    <Card
                      className="bg-white/90 text-foreground hover:shadow-lg transition"
                      onClick={() => {
                        setActiveRoom(r);
                        setRoomOpen(true);
                      }}
                    >
                      <CardContent className="p-0">
                        <img
                          src={r.img}
                          alt={r.name}
                          className="w-full h-48 md:h-56 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <div className="font-semibold">{r.name}</div>
                          <p className="text-sm text-slate-600 mt-1">
                            {r.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Gallery with fixed modern bg */}
      <section id="gallery" className="py-16 md:py-24 gallery-fixed">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold">Galeri</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <img
                key={i}
                src={g}
                alt="galeri"
                className="w-full h-40 md:h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact with shape */}
      <section id="contact" className="py-16 md:py-24 shape-contact">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">İletişim</h2>
            <form
              className="mt-6 grid grid-cols-1 gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mesajınız alındı. Teşekkürler!");
                setForm({ name: "", email: "", message: "" });
              }}
            >
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Ad Soyad"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="E‑posta"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <textarea
                className="rounded-md border px-3 py-2 text-sm min-h-[120px]"
                placeholder="Mesajınız"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
              <Button type="submit" className="w-full md:w-auto">
                Gönder
              </Button>
            </form>
          </div>
          <div>
            <div className="rounded-lg overflow-hidden h-64 md:h-full min-h-[320px]">
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                src="https://www.google.com/maps?q=On%20Hotel%20Antalya&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-3 text-sm text-slate-600">
              Adres: Konyaaltı, Antalya • Telefon: +90 242 323 90 00
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-20 grid place-items-center text-sm text-slate-600 border-t">
        Coprigyt 2025 Türkiye Tourbox
      </footer>

      <RoomModal open={roomOpen} onOpenChange={setRoomOpen} room={activeRoom} />
    </div>
  );
}
