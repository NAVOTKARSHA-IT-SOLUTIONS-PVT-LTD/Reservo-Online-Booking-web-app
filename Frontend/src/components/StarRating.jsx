import { Star } from "lucide-react";

export default function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-orange-400 text-orange-400" : "fill-neutral-200 text-neutral-200"}
        />
      ))}
    </div>
  );
}
