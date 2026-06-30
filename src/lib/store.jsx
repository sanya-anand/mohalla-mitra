import { createContext, useContext, useReducer, useCallback } from 'react';
import { SEED_REPORTS } from '../data/seedReports';

const ReportContext = createContext(null);

const initialState = {
  reports: SEED_REPORTS,
  filters: {
    sortBy: 'severity', // severity | confirmations | newest
    category: 'all',
    search: '',
  },
};

function reportReducer(state, action) {
  switch (action.type) {
    case 'ADD_REPORT':
      return {
        ...state,
        reports: [action.payload, ...state.reports],
      };

    case 'MERGE_REPORT': {
      return {
        ...state,
        reports: state.reports.map((r) =>
          r.id === action.payload.reportId
            ? {
                ...r,
                confirmations: r.confirmations + 1,
                confirmedBy: [...r.confirmedBy, action.payload.confirmerName || 'A neighbor'],
                mergeHighlight: true,
              }
            : r
        ),
      };
    }

    case 'CONFIRM_REPORT': {
      return {
        ...state,
        reports: state.reports.map((r) =>
          r.id === action.payload.reportId
            ? {
                ...r,
                confirmations: r.confirmations + 1,
                confirmedBy: [...r.confirmedBy, 'A neighbor'],
              }
            : r
        ),
      };
    }

    case 'CLEAR_MERGE_HIGHLIGHT': {
      return {
        ...state,
        reports: state.reports.map((r) =>
          r.id === action.payload.reportId
            ? { ...r, mergeHighlight: false }
            : r
        ),
      };
    }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    default:
      return state;
  }
}

export function ReportProvider({ children }) {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  const addReport = useCallback((report) => {
    dispatch({ type: 'ADD_REPORT', payload: report });
  }, []);

  const mergeReport = useCallback((reportId, confirmerName) => {
    dispatch({ type: 'MERGE_REPORT', payload: { reportId, confirmerName } });
    // Clear the highlight after animation
    setTimeout(() => {
      dispatch({ type: 'CLEAR_MERGE_HIGHLIGHT', payload: { reportId } });
    }, 2000);
  }, []);

  const confirmReport = useCallback((reportId) => {
    dispatch({ type: 'CONFIRM_REPORT', payload: { reportId } });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Apply filters and sorting
  const getFilteredReports = useCallback(() => {
    let filtered = [...state.reports];

    // Category filter
    if (state.filters.category !== 'all') {
      filtered = filtered.filter((r) => r.category === state.filters.category);
    }

    // Search filter
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.description.toLowerCase().includes(search) ||
          r.locality.toLowerCase().includes(search)
      );
    }

    // Sort
    switch (state.filters.sortBy) {
      case 'severity':
        filtered.sort((a, b) => b.severityScore - a.severityScore);
        break;
      case 'confirmations':
        filtered.sort((a, b) => b.confirmations - a.confirmations);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [state.reports, state.filters]);

  const value = {
    reports: state.reports,
    filters: state.filters,
    getFilteredReports,
    addReport,
    mergeReport,
    confirmReport,
    setFilters,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}
