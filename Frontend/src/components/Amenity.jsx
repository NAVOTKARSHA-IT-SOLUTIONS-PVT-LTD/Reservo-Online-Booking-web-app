export default function Amenity({ icon: Icon, label }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-600">
      <Icon size={12} />
      {label}
    </span>
  );
}
