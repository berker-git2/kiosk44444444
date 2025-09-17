import { categories } from "./data";

export type Filters = {
  search: string;
  categories: string[];
  rating: number; // min
  price: [number, number];
};

export default function FilterSidebar({
  value,
  onChange,
  onReset,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
  onReset?: () => void;
}) {
  const update = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  const toggleCategory = (id: string) => {
    const set = new Set(value.categories);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    update({ categories: Array.from(set) });
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 glass rounded-xl p-4 md:p-5 border md:sticky md:top-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Filtreler</h3>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Sıfırla
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Ara
          </label>
          <input
            value={value.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Tur veya bölge ara"
            className="w-full rounded-md border border-slate-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <details open>
          <summary className="cursor-pointer select-none text-sm font-medium">
            Tür Kategorileri
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value.categories.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                  className="accent-brand"
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </details>

        <details open>
          <summary className="cursor-pointer select-none text-sm font-medium">
            Fiyat Aralığı (EUR)
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-500">Min</label>
              <input
                type="number"
                value={value.price[0]}
                onChange={(e) =>
                  update({ price: [Number(e.target.value), value.price[1]] })
                }
                className="w-full rounded-md border border-slate-200 bg-white/80 px-2 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500">Max</label>
              <input
                type="number"
                value={value.price[1]}
                onChange={(e) =>
                  update({ price: [value.price[0], Number(e.target.value)] })
                }
                className="w-full rounded-md border border-slate-200 bg-white/80 px-2 py-2 text-sm"
              />
            </div>
          </div>
        </details>

        <details>
          <summary className="cursor-pointer select-none text-sm font-medium">
            Puan
          </summary>
          <div className="mt-2 flex items-center gap-2 text-sm">
            {[0, 3, 4, 4.5].map((r) => (
              <label key={r} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rating"
                  className="accent-brand"
                  checked={value.rating === r}
                  onChange={() => update({ rating: r })}
                />
                <span>{r}+ </span>
              </label>
            ))}
          </div>
        </details>

        {onReset && (
          <button
            onClick={onReset}
            className="w-full mt-3 rounded-md bg-brand text-white py-2 text-sm font-semibold hover:brightness-110"
          >
            Filtreleri Uygula
          </button>
        )}
      </div>
    </aside>
  );
}
