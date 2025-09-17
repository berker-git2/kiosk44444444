import React, { useMemo } from "react";
import { Check, X } from "lucide-react";

export type CreditCardInputProps = {
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  onChange: (fields: Partial<Record<string, string>>) => void;
};

function formatCardNumber(v: string) {
  const digits = v.replace(/[^0-9]/g, "");
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function detectBrand(num: string) {
  const d = num.replace(/\D/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  if (/^6(?:011|5)/.test(d)) return "discover";
  return "unknown";
}

function luhnCheck(num: string) {
  const digits = num.replace(/\D/g, "");
  let sum = 0;
  let toggle = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (toggle) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    toggle = !toggle;
  }
  return digits.length > 0 && sum % 10 === 0;
}

function BrandLogo({ brand }: { brand: string }) {
  const common = "w-10 h-6";
  switch (brand) {
    case "visa":
      return (
        <svg
          className={common}
          viewBox="0 0 36 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect width="36" height="24" rx="4" fill="#1a1f71" />
          <path d="M8 16l2-8h2l-2 8H8z" fill="#fff" opacity="0.9" />
          <path d="M14 8h2l1 8h-2l-1-8z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case "mastercard":
      return (
        <svg
          className={common}
          viewBox="0 0 36 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect width="36" height="24" rx="4" fill="#fff" />
          <circle cx="14" cy="12" r="6" fill="#eb001b" />
          <circle cx="22" cy="12" r="6" fill="#f79f1b" />
        </svg>
      );
    case "amex":
      return (
        <svg
          className={common}
          viewBox="0 0 36 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect width="36" height="24" rx="4" fill="#2e77bb" />
          <text x="6" y="16" fill="#fff" fontSize="9" fontWeight="700">
            AMEX
          </text>
        </svg>
      );
    case "discover":
      return (
        <svg
          className={common}
          viewBox="0 0 36 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect width="36" height="24" rx="4" fill="#fff" />
          <text x="6" y="15" fill="#ff6f00" fontSize="8" fontWeight="700">
            discover
          </text>
        </svg>
      );
    default:
      return <div className="w-10 h-6" />;
  }
}

export default function CreditCardInput({
  cardName,
  cardNumber,
  expMonth,
  expYear,
  cvv,
  onChange,
}: CreditCardInputProps) {
  const brand = useMemo(() => detectBrand(cardNumber), [cardNumber]);

  const numberDigits = cardNumber.replace(/\D/g, "");
  const numberValid = useMemo(
    () => luhnCheck(numberDigits) && numberDigits.length >= 13,
    [numberDigits],
  );

  const month = Number(expMonth || 0);
  const year = Number(expYear?.length === 2 ? `20${expYear}` : expYear || 0);
  const expValid = useMemo(() => {
    if (!month || !year) return false;
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const exp = new Date(year, month - 1, 1);
    exp.setMonth(exp.getMonth() + 1);
    return exp > now;
  }, [expMonth, expYear]);

  const cvvDigits = cvv.replace(/\D/g, "");
  const requiredCvvLen = brand === "amex" ? 4 : 3;
  const cvvValid = cvvDigits.length === requiredCvvLen;

  const nameValid = cardName.trim().length > 1;

  const allValid = numberValid && expValid && cvvValid && nameValid;

  function fieldClass(valid?: boolean) {
    if (valid === undefined) return "border";
    return valid ? "border-green-500" : "border-red-500";
  }

  return (
    <div>
      <div className="rounded-lg p-4 mb-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs opacity-75">Kart Sahibi</div>
            <div className="font-medium">{cardName || "---"}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-75">Son Kullanma</div>
            <div className="font-medium">
              {(expMonth || "MM") + "/" + (expYear ? expYear.slice(-2) : "YY")}
            </div>
          </div>
        </div>
        <div className="text-lg tracking-widest font-mono flex items-center justify-between">
          <div>{formatCardNumber(cardNumber) || "•••• •••• •••• ••••"}</div>
          <div className="flex items-center gap-2">
            <BrandLogo brand={brand} />
            <div className="text-xs uppercase tracking-wider opacity-90">
              {brand === "unknown" ? "" : brand}
            </div>
            {allValid ? (
              <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 transition-transform transform scale-100">
                <Check className="h-5 w-5 text-green-300 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
                <div className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block text-xs text-slate-600 mb-1">
            Kart ��zerindeki İsim
          </label>
          <input
            className={`w-full rounded-md px-3 py-2 text-sm border transition-colors duration-200 ease-in-out ${fieldClass(nameValid)}`}
            value={cardName}
            onChange={(e) => onChange({ cardName: e.target.value })}
          />
          {!nameValid && cardName.length > 0 && (
            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <X className="h-3 w-3" /> Lütfen kart üzerindeki ismi girin.
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-slate-600 mb-1">
            Kart Numarası
          </label>
          <input
            inputMode="numeric"
            maxLength={23}
            placeholder="1111 2222 3333 4444"
            className={`w-full rounded-md px-3 py-2 text-sm border transition-colors duration-200 ease-in-out ${fieldClass(numberDigits.length === 0 ? undefined : numberValid)}`}
            value={cardNumber}
            onChange={(e) =>
              onChange({ cardNumber: e.target.value.replace(/[^0-9 ]/g, "") })
            }
          />
          {numberDigits.length > 0 && (
            <div className="mt-1 text-xs flex items-center gap-2">
              {numberValid ? (
                <div className="text-green-600 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Kart numarası geçerli
                </div>
              ) : (
                <div className="text-red-600 flex items-center gap-1">
                  <X className="h-3 w-3" /> Geçersiz kart numarası
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">
            Son Kullanma Ay
          </label>
          <input
            inputMode="numeric"
            placeholder="MM"
            className={`w-full rounded-md px-3 py-2 text-sm border transition-colors duration-200 ease-in-out ${fieldClass(expMonth ? expValid : undefined)}`}
            value={expMonth}
            onChange={(e) =>
              onChange({ expMonth: e.target.value.replace(/[^0-9]/g, "") })
            }
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">Yıl</label>
          <input
            inputMode="numeric"
            placeholder="YYYY"
            className={`w-full rounded-md px-3 py-2 text-sm border transition-colors duration-200 ease-in-out ${fieldClass(expYear ? expValid : undefined)}`}
            value={expYear}
            onChange={(e) =>
              onChange({ expYear: e.target.value.replace(/[^0-9]/g, "") })
            }
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">CVV</label>
          <input
            inputMode="numeric"
            maxLength={4}
            className={`w-full rounded-md px-3 py-2 text-sm border transition-colors duration-200 ease-in-out ${fieldClass(cvv ? cvvValid : undefined)}`}
            value={cvv}
            onChange={(e) =>
              onChange({ cvv: e.target.value.replace(/[^0-9]/g, "") })
            }
          />
          <div className="text-xs text-slate-500 mt-1">
            CVV uzunluğu: {requiredCvvLen} hane
          </div>
        </div>
      </div>
    </div>
  );
}
