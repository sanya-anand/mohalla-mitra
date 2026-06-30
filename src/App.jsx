import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ReportProvider, useReports } from './lib/store';
import Layout from './components/Layout';
import StatsBar from './components/StatsBar';
import ReportForm from './components/ReportForm';
import ReportCard from './components/ReportCard';
import ReportDetail from './components/ReportDetail';
import FeedFilters from './components/FeedFilters';
import EmptyState from './components/EmptyState';

function AppContent() {
  const { getFilteredReports } = useReports();
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = getFilteredReports();

  return (
    <Layout>
      <StatsBar />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Report Form */}
        <div className="lg:col-span-4 xl:col-span-4">
          <div className="lg:sticky lg:top-24">
            <ReportForm />
          </div>
        </div>

        {/* Right column: Feed */}
        <div className="lg:col-span-8 xl:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Community Feed
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({filteredReports.length} {filteredReports.length === 1 ? 'issue' : 'issues'})
              </span>
            </h2>
          </div>

          <FeedFilters />

          {filteredReports.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((report, index) => (
                <div
                  key={report.id}
                  className="animate-[slide-up_0.5s_cubic-bezier(0.16,1,0.3,1)]"
                  style={{ animationDelay: `${Math.min(index * 60, 300)}ms`, animationFillMode: 'both' }}
                >
                  <ReportCard report={report} onClick={setSelectedReport} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ReportProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#12172b',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
          },
        }}
      />
      <AppContent />
    </ReportProvider>
  );
}
