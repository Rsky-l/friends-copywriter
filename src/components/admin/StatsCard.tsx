export function StatsCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="card flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xs text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
