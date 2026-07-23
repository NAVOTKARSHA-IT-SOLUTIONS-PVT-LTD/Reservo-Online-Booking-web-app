export default function RoomImage({ gradient }) {
  return (
    <div
      className={`relative h-40 w-56 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${gradient} sm:h-44 sm:w-64`}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute bottom-3 left-3 h-8 w-14 rounded-sm bg-white/25 backdrop-blur-sm" />
      <div className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/20" />
    </div>
  );
}
