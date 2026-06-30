import { Link2, Users, ArrowRight } from 'lucide-react';

export default function MergeNotification({ mergeData, matchedReport, onViewReport }) {
  if (!mergeData || !matchedReport) return null;

  return (
    <div className="animate-[slide-down_0.4s_cubic-bezier(0.16,1,0.3,1)] glass-card-static p-5 border-l-2 border-amber-500">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-400">Duplicate Detected & Merged!</h3>
          <p className="text-xs text-slate-400">Your report strengthens an existing community signal</p>
        </div>
      </div>

      {/* Matched report preview */}
      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mb-3">
        <p className="text-xs text-slate-500 mb-1">Merged with existing report:</p>
        <p className="text-sm text-slate-300 line-clamp-2">{matchedReport.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Users className="w-3 h-3" />
            {matchedReport.confirmations} residents confirmed
          </span>
          <span className="text-xs text-slate-500">{matchedReport.locality}</span>
        </div>
      </div>

      {/* Reason */}
      <p className="text-xs text-slate-400 mb-3">
        <span className="text-slate-500 font-medium">AI Match Reason:</span>{' '}
        {mergeData.reason}
      </p>

      {/* Action */}
      {onViewReport && (
        <button
          onClick={() => onViewReport(matchedReport)}
          className="btn-secondary flex items-center gap-2 text-xs"
        >
          View Merged Report
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
