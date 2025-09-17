const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
let cache = null;

async function fetchTCMB() {
  try {
    const res = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml");
    if (!res.ok) return null;
    const txt = await res.text();
    const codes = ["USD", "EUR", "GBP", "RUB"];
    const map = {};
    for (const c of codes) {
      const re = new RegExp(
        `<Currency[^>]*Kod=\\"${c}\\"[\\s\\S]*?<ForexSelling>(.*?)<\\/ForexSelling>`,
        "i",
      );
      const m = txt.match(re);
      if (m && m[1]) {
        const val = parseFloat(m[1].replace(/,/g, "."));
        map[c] = isNaN(val) ? null : val;
      } else {
        map[c] = null;
      }
    }
    const dateMatch = txt.match(/<Tarih=("|')(.*?)\1/);
    const date = dateMatch ? dateMatch[2] : null;
    return { map, date };
  } catch (e) {
    return null;
  }
}

export const exchangeHandler = async (req, res) => {
  try {
    const now = Date.now();
    if (cache && now - cache.ts < CACHE_TTL) {
      return res.json(cache.data);
    }

    const symbols = ["USD", "TRY", "GBP", "RUB"].join(",");
    const base = "EUR";

    const tcmb = await fetchTCMB();

    const latestRes = await fetch(
      `https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`,
    );
    if (!latestRes.ok) {
      return res.status(502).json({ error: "Failed to fetch latest rates" });
    }
    const latest = await latestRes.json();

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    const s = start.toISOString().slice(0, 10);
    const e = end.toISOString().slice(0, 10);
    const tsRes = await fetch(
      `https://api.exchangerate.host/timeseries?start_date=${s}&end_date=${e}&base=EUR&symbols=${symbols}`,
    );
    let history = null;
    if (tsRes.ok) {
      const ts = await tsRes.json();
      const obj = {};
      const dates = Object.keys(ts.rates || {}).sort();
      dates.forEach((date) => {
        const day = ts.rates[date];
        Object.entries(day).forEach(([k, v]) => {
          if (!obj[k]) obj[k] = [];
          obj[k].push(Number(v));
        });
      });
      history = obj;
    }

    const tcmbSelling = {};
    for (const k of ["USD", "EUR", "GBP", "RUB"]) {
      if (tcmb && tcmb.map && tcmb.map[k]) {
        tcmbSelling[k] = tcmb.map[k];
      } else if (latest && latest.rates) {
        const eurToK = Number(latest.rates[k]) || null;
        const eurToTRY = Number(latest.rates["TRY"]) || null;
        if (eurToK && eurToTRY) {
          tcmbSelling[k] = eurToTRY / eurToK;
        } else {
          tcmbSelling[k] = null;
        }
      } else {
        tcmbSelling[k] = null;
      }
    }

    const payload = {
      rates: latest.rates || null,
      history,
      date: latest.date || new Date().toISOString().slice(0, 10),
      tcmb: tcmbSelling,
      tcmb_date: tcmb?.date || null,
    };
    cache = { ts: now, data: payload };
    return res.json(payload);
  } catch (e) {
    return res.status(500).json({ error: "exchange_error" });
  }
};
