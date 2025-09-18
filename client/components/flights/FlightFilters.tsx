import { useState } from "react";

export interface Filters {
  nonstopOnly: boolean;
  time: "all" | "early" | "mid" | "late";
  airlines: Record<string, boolean>;
}

const DEFAULT_AIRLINES = ["AJet", "Pegasus", "Turkish Airlines", "SunExpress"];

export default function FlightFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
}) {
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(23);

  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="sticky top-20 space-y-4">
        <div className="rounded-lg border p-3">
          <div className="font-semibold mb-2">Filtre</div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={value.nonstopOnly}
              onChange={(e) =>
                onChange({ ...value, nonstopOnly: e.target.checked })
              }
            />
            Direkt uçuşlar
          </label>
          <div className="mt-3">
            <label className="text-xs text-slate-500">Saat</label>
            <select
              value={value.time}
              onChange={(e) =>
                onChange({ ...value, time: e.target.value as any })
              }
              className="w-full rounded border px-2 py-1 text-sm mt-1"
            >
              <option value="all">Tümü</option>
              <option value="early">00:00 - 06:00</option>
              <option value="mid">06:00 - 12:00</option>
              <option value="late">12:00+</option>
            </select>
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="font-semibold mb-2">Hava Yolları</div>
          <div className="space-y-2 text-sm">
            {DEFAULT_AIRLINES.map((a) => (
              <label key={a} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value.airlines[a]}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      airlines: { ...value.airlines, [a]: e.target.checked },
                    })
                  }
                />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="font-semibold mb-2">Saat Aralığı</div>
          <div className="text-xs text-slate-500">
            {minTime}:00 - {maxTime}:59
          </div>
          <input
            type="range"
            min={0}
            max={23}
            value={minTime}
            onChange={(e) => setMinTime(Number(e.target.value))}
            className="w-full"
          />
          <input
            type="range"
            min={0}
            max={23}
            value={maxTime}
            onChange={(e) => setMaxTime(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </aside>
  );
}
