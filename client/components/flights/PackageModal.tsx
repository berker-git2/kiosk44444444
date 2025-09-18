import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type PackageType = "ekonomi" | "standart" | "esnek";

const PACKS: { key: PackageType; title: string; perks: string[] }[] = [
  {
    key: "ekonomi",
    title: "Ekonomi",
    perks: ["Kabin bagajı", "Ücretsiz check-in"],
  },
  {
    key: "standart",
    title: "Standart",
    perks: ["15kg bagaj", "Koltuk seçimi"],
  },
  {
    key: "esnek",
    title: "Esnek",
    perks: ["Ücretsiz değişiklik", "30kg bagaj", "Öncelikli biniş"],
  },
];

export default function PackageModal({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (p: PackageType) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paket Seçimi</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-3 gap-3">
          {PACKS.map((p) => (
            <div key={p.key} className="rounded-lg border p-4">
              <div className="font-semibold mb-2">{p.title}</div>
              <ul className="text-sm text-slate-600 space-y-1 mb-3">
                {p.perks.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
              <Button
                className="w-full bg-brand text-white"
                onClick={() => onSelect(p.key)}
              >
                Seç
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
