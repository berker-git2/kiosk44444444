import {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";

export type TripType = "one" | "round" | "multi";

export type PassengerCounts = {
  adult: number;
  student: number;
  child: number; // 2-12
  infant: number; // <2
  senior: number;
};

export type SelectedLeg = {
  flightId: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  seller: string;
  currency: string;
  price: number; // total for all passengers
};

export type PackageType = "ekonomi" | "standart" | "esnek";

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface PaxInfo {
  firstName: string;
  lastName: string;
  dob: string; // yyyy-mm-dd
  gender: "male" | "female" | "other";
  nationality: string;
  idNumber: string; // TC Kimlik No or passport
}

export interface BookingState {
  tripType: TripType;
  from: string;
  to: string;
  departDate: string; // yyyy-mm-dd
  returnDate?: string;
  passengers: PassengerCounts;
  nonstopOnly: boolean;
  selectedOutbound?: SelectedLeg;
  selectedReturn?: SelectedLeg;
  selectedPackage?: PackageType;
  contact?: ContactInfo;
  pax?: PaxInfo[];
}

const defaultPassengers: PassengerCounts = {
  adult: 1,
  student: 0,
  child: 0,
  infant: 0,
  senior: 0,
};

const defaultState: BookingState = {
  tripType: "round",
  from: "Antalya (AYT)",
  to: "Istanbul (IST)",
  departDate: "",
  returnDate: "",
  passengers: defaultPassengers,
  nonstopOnly: false,
};

function load(): BookingState {
  try {
    const raw = localStorage.getItem("booking_state");
    if (raw) return JSON.parse(raw) as BookingState;
  } catch {}
  return defaultState;
}

function save(state: BookingState) {
  try {
    localStorage.setItem("booking_state", JSON.stringify(state));
  } catch {}
}

const Ctx = createContext<{
  state: BookingState;
  setState: (next: Partial<BookingState>) => void;
  reset: () => void;
  totalPassengers: number;
  totalAmount: number;
} | null>(null);

export function BookingProvider({ children }: PropsWithChildren) {
  const [state, setStateRaw] = useState<BookingState>(load);

  const setState = (next: Partial<BookingState>) => {
    setStateRaw((prev) => {
      const merged = { ...prev, ...next } as BookingState;
      save(merged);
      return merged;
    });
  };

  const reset = () => {
    setStateRaw(defaultState);
    save(defaultState);
  };

  const totalPassengers = useMemo(() => {
    const p = state.passengers;
    return p.adult + p.student + p.child + p.infant + p.senior;
  }, [state.passengers]);

  const totalAmount = useMemo(() => {
    const out = state.selectedOutbound?.price || 0;
    const ret =
      state.tripType === "round" ? state.selectedReturn?.price || 0 : 0;
    return out + ret;
  }, [state.selectedOutbound, state.selectedReturn, state.tripType]);

  const value = useMemo(
    () => ({ state, setState, reset, totalPassengers, totalAmount }),
    [state, totalPassengers, totalAmount],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
