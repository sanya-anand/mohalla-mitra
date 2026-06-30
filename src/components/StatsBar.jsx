import { useReports } from '../lib/store';
import { AlertTriangle, Users, Layers, CheckCircle2 } from 'lucide-react';

export default function StatsBar() {
  const { reports } = useReports();

  const totalIssues = reports.length;
  const activeIssues = reports.filter((r) => r.status === 'open').length;
  const totalConfirmations = reports.reduce((sum, r) => sum + r.confirmations, 0);
  const categoriesCovered = new Set(reports.map((r) => r.category)).size;

  const stats = [
    {
      label: 'Total Issues',
      value: totalIssues,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Active',
      value: activeIssues,
      icon: Layers,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Confirmations',
      value: totalConfirmations,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Categories',
      value: categoriesCovered,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 animate-[fade-in_0.4s_ease-out]">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card-static p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
