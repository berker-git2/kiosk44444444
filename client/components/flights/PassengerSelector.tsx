import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { PassengerCounts } from "./BookingContext";

function Row({
  label,
  value,
  onChange,
  min = 0,
  max = 9,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-sm">{label}</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`${label} azalt`}
        >
          -
        </Button>
        <div className="w-6 text-center">{value}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`${label} arttır`}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export default function PassengerSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PassengerCounts;
  onChange: (v: PassengerCounts) => void;
}) {
  const [open, setOpen] = useState(false);

  const summary = useMemo(() => {
    const total =
      value.adult + value.student + value.child + value.infant + value.senior;
    return `${total} Yolcu`;
  }, [value]);

  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start h-10">
            <Users className="mr-2 opacity-60" />
            <span>{summary}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <Row
              label="Yetişkin"
              value={value.adult}
              onChange={(v) => onChange({ ...value, adult: v })}
              min={1}
            />
            <Row
              label="Öğrenci"
              value={value.student}
              onChange={(v) => onChange({ ...value, student: v })}
            />
            <Row
              label="Çocuk"
              value={value.child}
              onChange={(v) => onChange({ ...value, child: v })}
            />
            <Row
              label="Bebek"
              value={value.infant}
              onChange={(v) => onChange({ ...value, infant: v })}
              max={4}
            />
            <Row
              label="Yaşlı"
              value={value.senior}
              onChange={(v) => onChange({ ...value, senior: v })}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
