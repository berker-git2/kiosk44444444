import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Extra = { id: string; title: string; priceEUR: number };

const DEFAULT_EXTRAS: Extra[] = [
  { id: "babyseat", title: "Bebek Koltuğu", priceEUR: 5 },
  { id: "wifi", title: "Taşınabilir Wi‑Fi", priceEUR: 7 },
  { id: "flower", title: "Çiçek / Karşılama", priceEUR: 12 },
  { id: "water", title: "Su & İçecek Seti", priceEUR: 4 },
];

export type ExtrasSelection = { id: string; qty: number; priceEUR: number }[];

export default function ExtrasModal({
  open,
  onOpenChange,
  onConfirm,
  initial,
  extras = DEFAULT_EXTRAS,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (selection: ExtrasSelection, totalEUR: number) => void;
  initial?: ExtrasSelection;
  extras?: Extra[];
}) {
  const [rows, setRows] = useState<ExtrasSelection>(
    initial || extras.map((e) => ({ id: e.id, qty: 0, priceEUR: e.priceEUR })),
  );

  const total = useMemo(
    () => rows.reduce((sum, r) => sum + r.qty * r.priceEUR, 0),
    [rows],
  );

  function getTitle(id: string) {
    return extras.find((e) => e.id === id)?.title || id;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ekstralar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map((r, idx) => (
            <div
              key={r.id}
              className="rounded-md border p-3 flex items-center justify-between gap-3"
            >
              <div>
                <div className="font-medium">{getTitle(r.id)}</div>
                <div className="text-xs text-slate-500">
                  {r.priceEUR} EUR / adet
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setRows((arr) => {
                      const next = [...arr];
                      next[idx] = {
                        ...next[idx],
                        qty: Math.max(0, next[idx].qty - 1),
                      };
                      return next;
                    })
                  }
                >
                  -
                </Button>
                <Input
                  className="w-16 text-center"
                  type="number"
                  min={0}
                  value={r.qty}
                  onChange={(e) =>
                    setRows((arr) => {
                      const next = [...arr];
                      next[idx] = {
                        ...next[idx],
                        qty: Math.max(0, Number(e.target.value || 0)),
                      };
                      return next;
                    })
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setRows((arr) => {
                      const next = [...arr];
                      next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
                      return next;
                    })
                  }
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">
            Toplam Ekstra: <b>{total} EUR</b>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button onClick={() => onConfirm(rows, total)}>Onayla</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
