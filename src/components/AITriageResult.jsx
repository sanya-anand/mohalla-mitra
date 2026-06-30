import { Copy, Check, Building2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { CATEGORY_CONFIG } from './ReportCard';

export default function AITriageResult({ result, onDismiss }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const catConfig = CATEGORY_CONFIG[result.category] || CATEGORY_CONFIG['Other'];
  const CategoryIcon = catConfig.icon;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.draftedComplaint);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = result.draftedComplaint;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-[slide-up_0.5s_cubic-bezier(0.16,1,0.3,1)] glass-card-static p-5 space-y-4 border-l-2 border-amber-500/50">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
          AI Analysis Complete
        </h3>
      </div>

      {/* Category + Severity */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="category-badge"
          style={{ background: catConfig.bg, color: catConfig.color }}
        >
          <CategoryIcon className="w-3.5 h-3.5" />
          {result.category}
        </div>
        <span
          className={`severity-${result.severity.toLowerCase()} text-xs font-semibold px-2.5 py-1 rounded-full`}
        >
          {result.severity} Severity
        </span>
      </div>

      {/* Responsible Authority */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.12)]">
        <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
        <div>
          <p className="text-[0.65rem] text-slate-500 uppercase font-semibold tracking-wider">Route to</p>
          <p className="text-sm font-medium text-blue-300">{result.responsibleAuthority}</p>
        </div>
      </div>

      {/* Drafted Complaint */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Draft Complaint
          </p>
          <button
            onClick={handleCopy}
            className="btn-secondary flex items-center gap-1.5 text-xs py-1 px-2.5"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-sm text-slate-300 leading-relaxed">
          {result.draftedComplaint}
        </div>
      </div>

      {onDismiss && (
        <button onClick={onDismiss} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          Dismiss
        </button>
      )}
    </div>
  );
}
