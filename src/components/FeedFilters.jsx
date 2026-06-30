import { useReports } from '../lib/store';
import { CATEGORIES } from '../data/seedReports';
import { ArrowUpDown, Search } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'severity', label: 'Severity' },
  { value: 'confirmations', label: 'Most Confirmed' },
  { value: 'newest', label: 'Newest' },
];

export default function FeedFilters() {
  const { filters, setFilters } = useReports();

  return (
    <div className="space-y-3 mb-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by locality or description..."
          className="input-field pl-10"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <div className="flex items-center gap-1.5 mr-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">Sort:</span>
        </div>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilters({ sortBy: opt.value })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              filters.sortBy === opt.value
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                : 'bg-[rgba(255,255,255,0.04)] text-slate-400 border border-transparent hover:bg-[rgba(255,255,255,0.07)]'
            }`}
          >
            {opt.label}
          </button>
        ))}

        <div className="w-px h-5 bg-[rgba(255,255,255,0.08)] mx-1" />

        {/* Category chips */}
        <button
          onClick={() => setFilters({ category: 'all' })}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
            filters.category === 'all'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
              : 'bg-[rgba(255,255,255,0.04)] text-slate-400 border border-transparent hover:bg-[rgba(255,255,255,0.07)]'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters({ category: cat })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              filters.category === cat
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                : 'bg-[rgba(255,255,255,0.04)] text-slate-400 border border-transparent hover:bg-[rgba(255,255,255,0.07)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
