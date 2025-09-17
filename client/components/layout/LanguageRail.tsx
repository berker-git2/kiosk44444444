import React, { useState } from "react";

const langs = [
  { code: "tr", label: "Türkçe", country: "tr" },
  { code: "en", label: "English", country: "gb" },
  { code: "de", label: "Deutsch", country: "de" },
  { code: "ru", label: "Русский", country: "ru" },
  { code: "nl", label: "Nederlands", country: "nl" },
  { code: "ir", label: "فارسی", country: "ir" },
];

export function LanguageRail() {
  const [active, setActive] = useState("tr");

  return (
    <div className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-40">
      <div className="rounded-full bg-emerald-500 text-white px-3 py-2 text-xs shadow-lg hover:brightness-110 transition">
        WhatsApp
      </div>
      <div className="flex flex-col gap-2 glass rounded-full p-2">
        {langs.map((l) => (
          <button
            key={l.code}
            aria-label={l.label}
            onClick={() => setActive(l.code)}
            className={`h-9 w-9 grid place-items-center rounded-full text-base overflow-hidden transition ${
              active === l.code
                ? "bg-brand text-white shadow"
                : "bg-white/70 dark:bg-white/10"
            }`}
          >
            <img
              src={`https://flagcdn.com/w40/${l.country}.png`}
              alt={l.label}
              className="w-6 h-6 rounded-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
