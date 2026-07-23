import { Wifi, Coffee, ConciergeBell, MapPin } from "lucide-react";
import RoomImage from "./RoomImage";
import StarRating from "./StarRating";
import Amenity from "./Amenity";

export default function RoomCard({ room }) {
  return (
    <div className="flex flex-row gap-4 py-6 sm:gap-6">
      <RoomImage gradient={room.gradient} />
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        <p className="text-xs text-neutral-500">{room.location}</p>
        <h3 className="font-serif text-xl text-neutral-900">{room.name}</h3>
        <div className="flex items-center gap-2">
          <StarRating rating={room.rating} />
          <span className="text-xs text-neutral-500">{room.reviews}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <MapPin size={12} />
          {room.address}
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          <Amenity icon={Wifi} label="free wifi" />
          <Amenity icon={Coffee} label="free breakfast" />
          <Amenity icon={ConciergeBell} label="room service" />
        </div>
        <p className="mt-2 text-lg font-semibold text-neutral-900">
          ₹ {room.price} <span className="text-sm font-normal text-neutral-500">/day</span>
        </p>
      </div>
    </div>
  );
}
