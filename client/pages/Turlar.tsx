import { useMemo, useState } from "react";
import FilterSidebar, { Filters } from "@/components/tours/FilterSidebar";
import Stories from "@/components/tours/Stories";
import TourCard from "@/components/tours/TourCard";
import { tours as data, categories } from "@/components/tours/data";
import { cn } from "@/lib/utils";

const sorts = [
  { key: "default", label: "Varsayılan" },
  { key: "price-asc", label: "Fiyata Göre Artan" },
  { key: "price-desc", label: "Fiyata Göre Azalan" },
] as const;

type SortKey = (typeof sorts)[number]["key"];

export default function Turlar() {
  const [sort, setSort] = useState<SortKey>("default");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: [],
    rating: 0,
    price: [0, 100],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const tours = useMemo(() => {
    const min = filters.price[0];
    const max = filters.price[1];
    const query = filters.search.trim().toLowerCase();

    let list = data.filter(
      (t) =>
        (activeCategory ? t.categoryId === activeCategory : true) &&
        (filters.categories.length
          ? filters.categories.includes(t.categoryId)
          : true) &&
        t.priceEUR >= min &&
        t.priceEUR <= max &&
        t.rating >= filters.rating &&
        (query
          ? t.title.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
          : true),
    );

    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.priceEUR - b.priceEUR);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.priceEUR - a.priceEUR);

    return list;
  }, [sort, filters, activeCategory]);

  const resetFilters = () =>
    setFilters({ search: "", categories: [], rating: 0, price: [0, 100] });

  return (
    <section className="min-h-[calc(100vh-0px)] px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* top */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Antalya Turları</h1>
            <p className="text-slate-600">Toplam {tours.length} sonuç</p>
          </div>
          <div className="md:hidden">
            <button
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filtreler
            </button>
          </div>
        </div>

        {/* stories */}
        <div className="mt-4 md:mt-6">
          <Stories
            active={activeCategory}
            onSelect={(id) => setActiveCategory(id)}
          />
        </div>

        {/* sort bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {sorts.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                sort === s.key
                  ? "bg-brand text-white border-transparent"
                  : "bg-white/80 hover:bg-white",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-6 items-start">
          {/* left filters */}
          <div className="hidden md:block">
            <FilterSidebar
              value={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </div>

          {/* list */}
          <div className="space-y-4">
            {tours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      </div>

      {/* mobile filters drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${mobileFiltersOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileFiltersOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileFiltersOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[86%] max-w-[360px] bg-white p-4 transition-transform ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <FilterSidebar
            value={filters}
            onChange={setFilters}
            onReset={() => setMobileFiltersOpen(false)}
          />
        </div>
      </div>
    </section>
  );
}
