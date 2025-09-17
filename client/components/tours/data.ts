export type Category = { id: string; name: string; image: string };
export type Tour = {
  id: string;
  title: string;
  categoryId: string;
  priceEUR: number;
  rating: number; // 0-5
  reviews: number;
  durationHours: number;
  description: string;
  image: string;
  videoUrl?: string;
};

export const categories: Category[] = [
  {
    id: "tekne",
    name: "Tekne Turları",
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "kanyon",
    name: "Kanyon",
    image:
      "https://images.unsplash.com/photo-1549877452-9c387954fbc5?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "koylar",
    name: "Koy & Plaj",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "doga",
    name: "Doğa Aktiviteleri",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "kultur",
    name: "Kültür",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop",
  },
];

export const tours: Tour[] = [
  {
    id: "kekova-tekne",
    title: "Kekova Batık Şehir Tekne Turu",
    categoryId: "tekne",
    priceEUR: 38,
    rating: 4.7,
    reviews: 126,
    durationHours: 8,
    description:
      "Kekova koylarında cam tabanlı tekneler ile batık şehir ve yüzme molaları.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/6lt2JfJdGSY",
  },
  {
    id: "manavgat-kanyon",
    title: "Manavgat Green Canyon Tekne Turu",
    categoryId: "kanyon",
    priceEUR: 32,
    rating: 4.5,
    reviews: 201,
    durationHours: 7,
    description:
      "Yeşil Kanyon'un eşsiz manzarasında sakin bir tekne turu ve yüzme molaları.",
    image:
      "https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "antalya-koylar",
    title: "Antalya Çıralı Koylar Turu",
    categoryId: "koylar",
    priceEUR: 35,
    rating: 4.6,
    reviews: 167,
    durationHours: 6,
    description:
      "Çıralı ve Olympos'un berrak koylarında gün boyu yüzme ve güneşlenme.",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4",
  },
  {
    id: "tazi-kanyonu",
    title: "Tazı Kanyonu ve Rafting",
    categoryId: "doga",
    priceEUR: 29,
    rating: 4.4,
    reviews: 312,
    durationHours: 9,
    description:
      "Köprülü Kanyon'da adrenalin dolu rafting ve Tazı Kanyonu fotoğraf molası.",
    image:
      "https://images.unsplash.com/photo-1530785602389-07594beb8b73?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pamukkale",
    title: "Pamukkale ve Hierapolis Günübirlik",
    categoryId: "kultur",
    priceEUR: 58,
    rating: 4.3,
    reviews: 98,
    durationHours: 12,
    description:
      "Pamukkale travertenleri ve antik Hierapolis'i rehber eşliğinde keşif.",
    image:
      "https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "kaputas",
    title: "Kaş - Kaputaş Plajı Tekne & Plaj",
    categoryId: "koylar",
    priceEUR: 41,
    rating: 4.8,
    reviews: 221,
    durationHours: 10,
    description:
      "Kaş ve Kaputaş çevresindeki turkuaz koylarda yüzme molaları ve plaj keyfi.",
    image:
      "https://images.unsplash.com/photo-1500375592092-34c1d0b4d6b8?q=80&w=1200&auto=format&fit=crop",
  },
];
