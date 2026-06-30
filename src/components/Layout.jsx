import { Shield } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(10,14,26,0.85)] border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent leading-tight">
                Mohalla Mitra
              </h1>
              <p className="text-[0.65rem] text-slate-400 font-medium tracking-wider uppercase">
                Your Neighborhood Friend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-amber-300/80">AI Powered by Gemini</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Mohalla Mitra — Built for{' '}
            <span className="text-amber-500/70 font-medium">Vibe2Ship 2026</span>
            {' '}(Coding Ninjas × Google for Developers)
          </p>
          <p className="text-xs text-slate-600">
            Powered by Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
