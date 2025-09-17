import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Users,
  Calendar,
  Plane,
  MapPin,
  BadgeCheck,
} from "lucide-react";

export type TransferVoucherData = {
  code: string;
  name: string;
  meetName?: string;
  passengers: { adults: number; children: number; babies: number };
  route: string;
  roundTrip: boolean;
  arrivalDateTime?: string;
  returnDate?: string;
  returnPickup?: string;
  flightGo?: string;
  flightReturn?: string;
  note?: string;
};

export default function TransferVoucherModal({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: TransferVoucherData | null;
}) {
  const [email, setEmail] = useState("");

  async function sendMail() {
    if (!email || !data) return;
    const html = `
      <h2>Transfer Voucher</h2>
      <p><b>Kod:</b> ${data.code}</p>
      <p><b>Güzergah:</b> ${data.route} (${data.roundTrip ? "Gidiş + Dönüş" : "Tek Yön"})</p>
      <p><b>İsim:</b> ${data.name}</p>
      <p><b>Karşılama İsmi:</b> ${data.meetName || "-"}</p>
      <p><b>Kişiler:</b> Yetişkin ${data.passengers.adults}, Çocuk ${data.passengers.children}, Bebek ${data.passengers.babies}</p>
      <p><b>Geliş:</b> ${data.arrivalDateTime || "-"}</p>
      ${data.roundTrip ? `<p><b>Dönüş:</b> ${data.returnDate || "-"} ${data.returnPickup || ""}</p>` : ""}
      <p><b>Uçuş:</b> ${data.flightGo || "-"} ${data.flightReturn ? `(Dönüş: ${data.flightReturn})` : ""}</p>
      <p><b>Not:</b> ${data.note || "-"}</p>
    `;
    await fetch("/api/voucher-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: `Transfer Voucher ${data.code}`,
        html,
      }),
    });
  }

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Transfer Rezervasyon Özeti</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <BadgeCheck className="h-5 w-5" />
                <span className="text-xs">Onaylandı</span>
              </div>
              <div className="text-2xl font-extrabold tracking-wider">
                {data.code}
              </div>
              <div className="text-sm text-slate-600">
                {data.route} • {data.roundTrip ? "Gidiş + Dönüş" : "Tek Yön"}
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Yetişkin{" "}
                  {data.passengers.adults}, Çocuk {data.passengers.children},
                  Bebek {data.passengers.babies}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Geliş:{" "}
                  {data.arrivalDateTime || "-"}
                </div>
                {data.roundTrip && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Dönüş:{" "}
                    {data.returnDate || "-"} {data.returnPickup || ""}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4" /> Uçuş: {data.flightGo || "-"}{" "}
                  {data.flightReturn ? `(Dönüş: ${data.flightReturn})` : ""}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <Label>Yolcu</Label>
                <Input value={data.name} readOnly />
              </div>
              <div>
                <Label>Karşılama İsmi</Label>
                <Input value={data.meetName || "-"} readOnly />
              </div>
              <div>
                <Label>Şoföre Not</Label>
                <Textarea value={data.note || "-"} readOnly rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
          <div className="flex items-end gap-2">
            <div>
              <Label>E‑posta</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
              />
            </div>
            <Button onClick={sendMail}>Voucher Mail Gönder</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              Yazdır
            </Button>
            <Button onClick={() => onOpenChange(false)}>Kapat</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
