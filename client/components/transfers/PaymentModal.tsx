import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PaymentModal({
  open,
  onOpenChange,
  amountEUR,
  route,
  onCashConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  amountEUR: number;
  route: string;
  onCashConfirm: (code: string) => void;
}) {
  const [tab, setTab] = useState<"cash" | "card">("cash");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const [email, setEmail] = useState("");

  function genCode(len = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++)
      out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  async function payByCard() {
    const oid = genCode();
    const res = await fetch("/api/payments/vakif/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountEUR,
        orderId: oid,
        currency: "EUR",
      }),
    });
    if (!res.ok) {
      alert("Ödeme başlatılamadı. Lütfen daha sonra tekrar deneyin.");
      return;
    }
    const data = (await res.json()) as {
      gatewayUrl: string;
      fields: Record<string, string>;
    };
    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.gatewayUrl;
    Object.entries(data.fields).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = String(v);
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  async function sendEmail(code: string) {
    if (!email) return;
    await fetch("/api/voucher-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: `Transfer Rezervasyonu ${code}`,
        html: `<p>Rezervasyon kodu: <b>${code}</b></p><p>Güzergah: ${route}</p><p>Tutar: ${amountEUR} EUR</p>`,
      }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ödeme</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="cash">Sürücüye Nakit</TabsTrigger>
            <TabsTrigger value="card">Kredi Kartı</TabsTrigger>
          </TabsList>
          <TabsContent value="cash" className="mt-4 space-y-3">
            <div className="text-sm">
              Tutar: <b>{amountEUR} EUR</b>
            </div>
            <div className="space-y-2 text-sm">
              <label className="flex items-start gap-2">
                <Checkbox
                  checked={a}
                  onCheckedChange={(v) => setA(Boolean(v))}
                />{" "}
                Hizmet sözleşmesi şartlarını onaylıyorum.
              </label>
              <label className="flex items-start gap-2">
                <Checkbox
                  checked={b}
                  onCheckedChange={(v) => setB(Boolean(v))}
                />{" "}
                KVKK metnini okudum, kabul ediyorum.
              </label>
              <label className="flex items-start gap-2">
                <Checkbox
                  checked={c}
                  onCheckedChange={(v) => setC(Boolean(v))}
                />{" "}
                Gizlilik sözleşmesini onaylıyorum.
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2">
                <Label>E-posta (voucher gönderimi için)</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@eposta.com"
                />
              </div>
              <Button
                disabled={!(a && b && c)}
                onClick={async () => {
                  const code = genCode();
                  onCashConfirm(code);
                  if (email) await sendEmail(code);
                  window.print();
                }}
              >
                Onayla ve Yazdır
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="card" className="mt-4 space-y-3">
            <div className="text-sm">
              Tutar: <b>{amountEUR} EUR</b>
            </div>
            <Button onClick={payByCard}>Güvenli Ödeme Sayfasına Git</Button>
            <p className="text-xs text-slate-500">
              Ödeme sayfası bankanın güvenli ortamında açılır.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
