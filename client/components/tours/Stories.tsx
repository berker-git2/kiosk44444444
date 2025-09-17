import { categories, Category } from "./data";

export default function Stories({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  const items: (Category & { id: string | null })[] = [
    {
      id: null,
      name: "Tümü",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    },
    ...categories,
  ];

  return (
    <div className="flex items-center gap-5 overflow-x-auto pb-2 snap-x">
      {items.map((c) => (
        <button
          key={c.id ?? "all"}
          onClick={() => onSelect(c.id)}
          className={`snap-start group flex flex-col items-center gap-2 shrink-0`}
        >
          <span
            className={`h-16 w-16 rounded-full ring-2 ring-transparent transition overflow-hidden shadow ${
              active === c.id ? "ring-brand" : "ring-transparent"
            }`}
          >
            <img
              src={c.image}
              alt={c.name}
              className="h-full w-full object-cover"
            />
          </span>
          <span
            className={`text-xs font-medium ${active === c.id ? "text-brand" : "text-slate-600"}`}
          >
            {c.name}
          </span>
        </button>
      ))}
    </div>
  );
}
