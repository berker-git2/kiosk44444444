import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SummarySidebar from "@/components/flights/SummarySidebar";
import { useBooking } from "@/components/flights/BookingContext";
import { useNavigate } from "react-router-dom";

export default function UcakYolcuBilgileri() {
  const { state, setState, totalPassengers } = useBooking();
  const navigate = useNavigate();

  const [contact, setContact] = useState(
    state.contact || { phone: "", email: "" },
  );

  const paxList = useMemo(() => {
    const count = Math.max(1, totalPassengers);
    const existing = state.pax || [];
    const arr = new Array(count).fill(0).map(
      (_, i) =>
        existing[i] || {
          firstName: "",
          lastName: "",
          dob: "",
          gender: "male" as const,
          nationality: "Türkiye",
          idNumber: "",
        },
    );
    return arr;
  }, [totalPassengers, state.pax]);

  const [pax, setPax] = useState(paxList);

  function onContinue() {
    if (!contact.phone || !contact.email)
      return alert("İletişim bilgilerini giriniz");
    if (pax.some((p) => !p.firstName || !p.lastName || !p.dob))
      return alert("Tüm yolcu bilgilerini doldurunuz");
    setState({ contact, pax });
    navigate("/ucak-bileti/odeme");
  }

  return (
    <section className="relative min-h-[calc(100vh-0px)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8">
        <div className="grid md:grid-cols-[1fr_20rem] gap-6">
          <div className="space-y-6">
            <div className="rounded-xl border p-4">
              <div className="font-semibold mb-3">İletişim Bilgileri</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Cep Telefonu
                  </label>
                  <Input
                    value={contact.phone}
                    onChange={(e) =>
                      setContact({ ...contact, phone: e.target.value })
                    }
                    placeholder="5xx xxx xx xx"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    E-posta
                  </label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    placeholder="ornek@eposta.com"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="font-semibold mb-3">Yolcu Bilgileri</div>
              <div className="space-y-4">
                {pax.map((p, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">
                      Yolcu {i + 1}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Ad
                        </label>
                        <Input
                          value={p.firstName}
                          onChange={(e) =>
                            setPax((arr) => {
                              const n = [...arr];
                              n[i] = { ...n[i], firstName: e.target.value };
                              return n;
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Soyad
                        </label>
                        <Input
                          value={p.lastName}
                          onChange={(e) =>
                            setPax((arr) => {
                              const n = [...arr];
                              n[i] = { ...n[i], lastName: e.target.value };
                              return n;
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Doğum Tarihi
                        </label>
                        <Input
                          type="date"
                          value={p.dob}
                          onChange={(e) =>
                            setPax((arr) => {
                              const n = [...arr];
                              n[i] = { ...n[i], dob: e.target.value };
                              return n;
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Cinsiyet
                        </label>
                        <Select
                          value={p.gender}
                          onValueChange={(v) =>
                            setPax((arr) => {
                              const n = [...arr];
                              n[i] = { ...n[i], gender: v as any };
                              return n;
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Erkek</SelectItem>
                            <SelectItem value="female">Kadın</SelectItem>
                            <SelectItem value="other">Diğer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Uyruk
                        </label>
                        <Input
                          value={p.nationality}
                          onChange={(e) =>
                            setPax((arr) => {
                              const n = [...arr];
                              n[i] = { ...n[i], nationality: e.target.value };
                              return n;
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          TC Kimlik No / Pasaport
                        </label>
                        <Input
                          value={p.idNumber}
                          onChange={(e) =>
                            setPax((arr) => {
                              const n = [...arr];
                              n[i] = { ...n[i], idNumber: e.target.value };
                              return n;
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-brand text-white" onClick={onContinue}>
                Ödemeye İlerle
              </Button>
            </div>
          </div>

          <SummarySidebar />
        </div>
      </div>
    </section>
  );
}
