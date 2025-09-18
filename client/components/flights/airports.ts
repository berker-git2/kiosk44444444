export type Airport = { code: string; city: string; name: string };

export const AIRPORTS: Airport[] = [
  { code: "AYT", city: "Antalya", name: "Antalya Havalimanı" },
  { code: "IST", city: "Istanbul", name: "İstanbul Havalimanı" },
  { code: "SAW", city: "Istanbul", name: "Sabiha Gökçen Havalimanı" },
  { code: "ADB", city: "Izmir", name: "Adnan Menderes Havalimanı" },
  { code: "ESB", city: "Ankara", name: "Esenboğa Havalimanı" },
  { code: "ASR", city: "Kayseri", name: "Erkilet Havalimanı" },
  { code: "GZP", city: "Alanya", name: "Gazipaşa Havalimanı" },
  { code: "BJV", city: "Bodrum", name: "Milas-Bodrum Havalimanı" },
  { code: "DLM", city: "Muğla", name: "Dalaman Havalimanı" },
  { code: "ADA", city: "Adana", name: "Şakirpaşa Havalimanı" },
];

export function toLabel(a: Airport) {
  return `${a.city} (${a.code})`;
}
