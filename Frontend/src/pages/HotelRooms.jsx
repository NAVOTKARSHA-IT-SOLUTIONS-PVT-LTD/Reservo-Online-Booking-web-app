import { useState } from "react";
import RoomCard from "../components/RoomCard";
import { ROOMS } from "../data/data";

export default function HotelRooms() {
  const [visibleCount, setVisibleCount] = useState(5);

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-row gap-6 sm:gap-10">
        {/* Main listing column */}
        <div className="flex-1">
          <h1 className="font-serif text-3xl text-neutral-900">Hotel Rooms</h1>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            Take advantage of our limited-time offers and special packages to enhance your stay
            and create unforgettable memories.
          </p>

          <div className="mt-2 divide-y divide-neutral-200">
            {ROOMS.slice(0, visibleCount).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {visibleCount < ROOMS.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount(ROOMS.length)}
                className="rounded-md bg-blue-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
