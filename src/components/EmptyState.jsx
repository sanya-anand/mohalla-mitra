import { SearchX } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-[fade-in_0.4s_ease-out]">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-400 mb-1">No issues found</h3>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        No reports match your current filters. Try adjusting your search or category selection.
      </p>
    </div>
  );
}
