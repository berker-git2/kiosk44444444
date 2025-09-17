import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export type PreReservationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function PreReservationModal({
  open,
  onOpenChange,
  onConfirm,
}: PreReservationModalProps) {
  const [pre1, setPre1] = React.useState(false);
  const [pre2, setPre2] = React.useState(false);
  const [pre3, setPre3] = React.useState(false);

  const ready = pre1 && pre2 && pre3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ön Rezervasyon Onayı</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3 text-sm">
          <label className="flex items-start gap-2">
            <Checkbox
              checked={pre1}
              onCheckedChange={(v) => setPre1(Boolean(v))}
            />
            <span>
              Hizmet Sözleşmesi ve İptal/Değişiklik Şartları'nı okudum, kabul
              ediyorum.
            </span>
          </label>

          <label className="flex items-start gap-2">
            <Checkbox
              checked={pre2}
              onCheckedChange={(v) => setPre2(Boolean(v))}
            />
            <span>
              Ticari Elektronik İleti Aydınlatma Metni'ni okudum, onay
              veriyorum.
            </span>
          </label>

          <label className="flex items-start gap-2">
            <Checkbox
              checked={pre3}
              onCheckedChange={(v) => setPre3(Boolean(v))}
            />
            <span>
              KVKK Aydınlatma Metni'ni okudum ve kişisel verilerimin işlenmesini
              kabul ediyorum.
            </span>
          </label>

          <div className="flex justify-end pt-2">
            <button
              disabled={!ready}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="rounded-md bg-brand text-white px-4 py-2 font-semibold disabled:opacity-50"
            >
              Rezervasyonu Yap
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
