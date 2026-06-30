import { useState } from 'react';
import { useReports } from '../lib/store';
import {
  MapPin,
  Users,
  Clock,
  ChevronRight,
  ThumbsUp,
  Construction,
  Trash2,
  Droplets,
  Zap,
  Dog,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';

const CATEGORY_CONFIG = {
  'Roads & Potholes': { icon: Construction, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  'Garbage & Sanitation': { icon: Trash2, color: '#84cc16', bg: 'rgba(132,204,22,0.12)' },
  'Water Supply & Leakage': { icon: Droplets, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'Electricity & Streetlights': { icon: Zap, color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  'Stray Animals': { icon: Dog, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  'Public Safety': { icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  'Other': { icon: HelpCircle, color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ReportCard({ report, onClick }) {
  const { confirmReport } = useReports();
  const [justConfirmed, setJustConfirmed] = useState(false);

  const catConfig = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG['Other'];
  const CategoryIcon = catConfig.icon;

  const handleConfirm = (e) => {
    e.stopPropagation();
    if (justConfirmed) return;
    confirmReport(report.id);
    setJustConfirmed(true);
  };

  return (
    <div
      className={`glass-card p-5 cursor-pointer group ${report.mergeHighlight ? 'merge-highlight' : ''}`}
      onClick={() => onClick(report)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(report)}
    >
      {/* Top row: category + severity */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="category-badge"
          style={{ background: catConfig.bg, color: catConfig.color }}
        >
          <CategoryIcon className="w-3.5 h-3.5" />
          {report.category}
        </div>
        <span
          className={`severity-${report.severity.toLowerCase()} text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap`}
        >
          {report.severity}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed mb-3 line-clamp-2">
        {report.description}
      </p>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
        <MapPin className="w-3.5 h-3.5 text-slate-500" />
        {report.locality}
      </div>

      {/* Bottom row: confirmations + time + expand */}
      <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          {/* Confirm button */}
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={justConfirmed}
            style={justConfirmed ? { opacity: 0.5, cursor: 'default' } : {}}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className={report.mergeHighlight ? 'count-animate' : ''}>
              {report.confirmations}
            </span>
          </button>

          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {report.confirmations} confirmed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(report.createdAt)}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}

export { CATEGORY_CONFIG };
