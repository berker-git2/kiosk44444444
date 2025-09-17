import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, CreditCard } from "lucide-react";

export type PaymentOptionsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (method: "card" | "pre") => void;
};

export default function PaymentOptionsModal({
  open,
  onOpenChange,
  onSelect,
}: PaymentOptionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ödeme Yöntemini Seçin</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 mt-4">
          <button
            onClick={() => {
              onSelect("card");
              onOpenChange(false);
            }}
            className="flex items-center gap-3 rounded-lg border p-4 hover:shadow"
          >
            <div className="p-2 rounded-md bg-slate-100">
              <CreditCard className="h-6 w-6 text-slate-700" />
            </div>
            <div className="text-left">
              <div className="font-medium">Kredi Kartı ile Ödeme</div>
              <div className="text-xs text-slate-600">
                Hemen kredi kartı ile ödeme yapın.
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onSelect("pre");
              onOpenChange(false);
            }}
            className="flex items-center gap-3 rounded-lg border p-4 hover:shadow"
          >
            <div className="p-2 rounded-md bg-slate-100">
              <ShieldCheck className="h-6 w-6 text-slate-700" />
            </div>
            <div className="text-left">
              <div className="font-medium">Ön Rezervasyon</div>
              <div className="text-xs text-slate-600">
                Sözleşme ve KVKK onayından sonra ön rezervasyon oluşturun.
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
