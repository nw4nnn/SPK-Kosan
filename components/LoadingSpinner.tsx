export default function LoadingSpinner({
  text = "Memuat...",
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 animate-spin" />
      </div>
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  );
}
