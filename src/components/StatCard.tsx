interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-slate-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2 text-slate-900">
        {value}
      </h2>
    </div>
  );
}