import { useState } from 'react';
import { Send, Loader2, MapPin, FileText, User } from 'lucide-react';
import { triageReport, detectDuplicate } from '../lib/gemini';
import { useReports } from '../lib/store';
import AITriageResult from './AITriageResult';
import MergeNotification from './MergeNotification';
import toast from 'react-hot-toast';

export default function ReportForm({ onReportMerged }) {
  const { reports, addReport, mergeReport } = useReports();

  const [description, setDescription] = useState('');
  const [locality, setLocality] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [mergeData, setMergeData] = useState(null);
  const [matchedReport, setMatchedReport] = useState(null);

  const canSubmit = description.trim().length > 10 && locality.trim().length > 2 && !isProcessing;

  const resetForm = () => {
    setDescription('');
    setLocality('');
    setName('');
    setTriageResult(null);
    setMergeData(null);
    setMatchedReport(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsProcessing(true);
    setTriageResult(null);
    setMergeData(null);
    setMatchedReport(null);

    try {
      // Step 1: AI Triage
      setProcessingStep('Analyzing issue with AI...');
      const triage = await triageReport(description.trim(), locality.trim());
      setTriageResult(triage);

      // Step 2: Duplicate Detection
      setProcessingStep('Checking for similar reports...');
      const dupeResult = await detectDuplicate(
        description.trim(),
        locality.trim(),
        triage.category,
        reports
      );

      if (dupeResult.isDuplicate && dupeResult.matchedReportId) {
        // Found a duplicate — merge!
        const matched = reports.find((r) => r.id === dupeResult.matchedReportId);
        if (matched) {
          mergeReport(matched.id, name.trim() || 'A neighbor');
          setMergeData(dupeResult);
          setMatchedReport({ ...matched, confirmations: matched.confirmations + 1 });

          toast(
            `🔗 Merged! Your report confirms an existing issue. Now ${matched.confirmations + 1} residents have reported this.`,
            {
              duration: 5000,
              className: 'toast-merge',
              icon: '🤝',
            }
          );

          // Notify parent for potential scroll
          if (onReportMerged) {
            onReportMerged(matched.id);
          }
        } else {
          // Matched ID not found (edge case) — add as new
          addAsNew(triage);
        }
      } else {
        // No duplicate — add as new report
        addAsNew(triage);
      }
    } catch (error) {
      console.error('Report submission error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.', {
        className: 'toast-merge',
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const addAsNew = (triage) => {
    const newReport = {
      id: `report-${Date.now()}`,
      description: description.trim(),
      locality: locality.trim(),
      category: triage.category,
      severity: triage.severity,
      severityScore: triage.severityScore,
      responsibleAuthority: triage.responsibleAuthority,
      draftedComplaint: triage.draftedComplaint,
      confirmations: 1,
      confirmedBy: [name.trim() || 'Anonymous Resident'],
      createdAt: new Date().toISOString(),
      status: 'open',
      mergeHighlight: false,
    };

    addReport(newReport);

    toast.success('Report submitted and added to the community feed!', {
      className: 'toast-merge',
      icon: '✅',
      duration: 3000,
    });
  };

  return (
    <div className="glass-card-static p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Report an Issue</h2>
          <p className="text-xs text-slate-400">AI will classify and route your report</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            What's the problem?
          </label>
          <textarea
            className="input-field"
            placeholder="e.g., Streetlight outside Block C has been off for a week, very dark at night..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={isProcessing}
          />
        </div>

        {/* Locality */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            <MapPin className="w-3 h-3 inline mr-1" />
            Locality / Landmark
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., Sector 12 Market, Dwarka"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Name (optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            <User className="w-3 h-3 inline mr-1" />
            Your Name <span className="text-slate-600 normal-case">(optional)</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Anonymous if left blank"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {processingStep}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Report
            </>
          )}
        </button>
      </form>

      {/* AI Results */}
      {triageResult && (
        <div className="mt-5 space-y-4">
          <AITriageResult result={triageResult} />

          {mergeData && matchedReport && (
            <MergeNotification
              mergeData={mergeData}
              matchedReport={matchedReport}
              onViewReport={(report) => {
                // Could open modal — for now just show toast
                toast('Scroll down to see the merged report in the feed!', {
                  className: 'toast-merge',
                  icon: '👇',
                  duration: 3000,
                });
              }}
            />
          )}

          {/* New Report button to submit another */}
          <button
            onClick={resetForm}
            className="btn-secondary w-full flex items-center justify-center gap-2 mt-3"
          >
            Report Another Issue
          </button>
        </div>
      )}
    </div>
  );
}
