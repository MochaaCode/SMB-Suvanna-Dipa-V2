import { CheckCircle2, Clock, Zap } from "lucide-react";

interface AttendanceStats {
  hadir: number;
  terlambat: number;
  totalScan: number;
}

export default function AttendanceStatsCards({
  stats,
}: {
  stats: AttendanceStats;
}) {
  const cards = [
    {
      title: "Hadir Tepat Waktu",
      value: stats.hadir,
      icon: <CheckCircle2 className="text-green-600" size={20} />,
      color: "text-green-700",
      bgColor: "bg-green-50/80",
      borderColor: "border-green-100",
    },
    {
      title: "Terlambat",
      value: stats.terlambat,
      icon: <Clock className="text-orange-600" size={20} />,
      color: "text-orange-700",
      bgColor: "bg-orange-50/80",
      borderColor: "border-orange-100",
    },
    {
      title: "Total Scan",
      value: stats.totalScan,
      icon: <Zap className="text-blue-600" size={20} />,
      color: "text-blue-700",
      bgColor: "bg-blue-50/80",
      borderColor: "border-blue-100",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="p-6 rounded-[1rem] border border-slate-200 flex items-center gap-4 bg-white shadow-sm hover:border-slate-300 transition-all group"
        >
          <div
            className={`p-3.5 ${card.bgColor} ${card.borderColor} border rounded-xl transition-colors group-hover:bg-white`}
          >
            {card.icon}
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider leading-none">
              {card.title}
            </p>
            <p className={`text-2xl font-bold ${card.color} leading-none`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
