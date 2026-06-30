import { X, MapPin, Users, Clock, Copy, Check, Building2 } from 'lucide-react';
import { useState } from 'react';
import { CATEGORY_CONFIG } from './ReportCard';
import { useReports } from '../lib/store';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function ReportDetail({ report, onClose }) {
  const [copied, setCopied] = useState(false);
  const { confirmReport } = useReports();

  if (!report) return null;

  const catConfig = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG['Other'];
  const CategoryIcon = catConfig.icon;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report.draftedComplaint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = report.draftedComplaint;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: catConfig.bg }}
              >
                <CategoryIcon className="w-5 h-5" style={{ color: catConfig.color }} />
              </div>
              <div>
                <div
                  className="category-badge mb-1"
                  style={{ background: catConfig.bg, color: catConfig.color }}
                >
                  {report.category}
                </div>
                <span
                  className={`severity-${report.severity.toLowerCase()} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
                >
                  {report.severity} Severity
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Issue Description
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{report.description}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400" />
            {report.locality}
          </div>

          {/* Responsible Authority */}
          <div className="glass-card-static p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Responsible Authority
              </h3>
            </div>
            <p className="text-sm font-medium text-blue-300">{report.responsibleAuthority}</p>
          </div>

          {/* Drafted Complaint */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                AI-Drafted Complaint
              </h3>
              <button
                onClick={handleCopy}
                className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="glass-card-static p-4 text-sm text-slate-300 leading-relaxed border-l-2 border-amber-500/40">
              {report.draftedComplaint}
            </div>
          </div>

          {/* Confirmations */}
          <div className="glass-card-static p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Community Confirmations
                </h3>
              </div>
              <span className="text-lg font-bold text-amber-400">{report.confirmations}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.confirmedBy.map((name, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.04)] text-slate-400 border border-[rgba(255,255,255,0.06)]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            Reported {timeAgo(report.createdAt)}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.06)] flex gap-3">
          <button
            onClick={() => {
              confirmReport(report.id);
              onClose();
            }}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            Confirm This Issue
          </button>
          <button onClick={handleCopy} className="btn-secondary flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Complaint
          </button>
        </div>
      </div>
    </div>
  );
}
