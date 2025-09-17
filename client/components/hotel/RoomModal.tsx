import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type Room = {
  name: string;
  images: string[];
  description: string;
  features?: string[];
};

export default function RoomModal({
  open,
  onOpenChange,
  room,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  room: Room | null;
}) {
  if (!room) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselPrevious />
              <CarouselNext />
              <CarouselContent>
                {room.images.map((src, i) => (
                  <CarouselItem key={i}>
                    <img
                      src={src}
                      alt={`${room.name} ${i + 1}`}
                      className="w-full h-64 md:h-80 object-cover rounded"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {room.description}
            </p>
            {room.features && (
              <ul className="mt-3 space-y-1 text-sm">
                {room.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand inline-block" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
