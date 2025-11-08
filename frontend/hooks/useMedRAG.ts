// React hooks for MedRAG API integration

import { useState, useEffect, useCallback } from 'react';
import { 
  medragAPI, 
  DiagnosisResult, 
  CaseRecord, 
  PatientData, 
  ManifestationsData, 
  HistoryData,
  handleAPIError 
} from '@/lib/api';

// Hook for health check
export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const health = await medragAPI.healthCheck();
      setIsHealthy(true);
      return health;
    } catch (err) {
      setIsHealthy(false);
      setError(handleAPIError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return { isHealthy, loading, error, checkHealth };
};

// Hook for diagnosis
export const useDiagnosis = () => {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDiagnosis = useCallback(async (query: string, patientData?: Partial<PatientData>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.diagnose(query, patientData);
      setDiagnosis(result);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDiagnosis = useCallback(() => {
    setDiagnosis(null);
    setError(null);
  }, []);

  return { 
    diagnosis, 
    loading, 
    error, 
    getDiagnosis, 
    clearDiagnosis 
  };
};

// Hook for case management
export const useCases = () => {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0,
  });

  const loadCases = useCallback(async (page: number = 1, perPage: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.listCases(page, perPage);
      setCases(result.cases);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitCase = useCallback(async (
    patient: PatientData,
    manifestations: ManifestationsData,
    history?: HistoryData
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.submitCase(patient, manifestations, history);
      // Refresh cases list
      await loadCases();
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadCases]);

  const getCase = useCallback(async (caseId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.getCase(caseId);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const regenerateDiagnosis = useCallback(async (caseId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.regenerateDiagnosis(caseId);
      // Refresh cases list
      await loadCases();
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadCases]);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  return {
    cases,
    loading,
    error,
    pagination,
    loadCases,
    submitCase,
    getCase,
    regenerateDiagnosis,
  };
};

// Hook for feedback
export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async (
    caseId: string,
    feedbackType: 'positive' | 'negative',
    rating: number,
    comments: string = ''
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.submitFeedback(caseId, feedbackType, rating, comments);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitFeedback, loading, error };
};

// Hook for export functionality
export const useExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportCase = useCallback(async (caseId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.exportCase(caseId);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medrag-case-${caseId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { exportCase, loading, error };
};

// Hook for dashboard stats
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    total_cases: 0,
    pending_cases: 0,
    diagnosed_cases: 0,
    recent_cases: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await medragAPI.getDashboardStats();
      setStats(result);
      return result;
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, error, loadStats };
};

// File upload hook removed - will be added in next update

// Combined hook for complete MedRAG functionality
export const useMedRAG = () => {
  const health = useHealthCheck();
  const diagnosis = useDiagnosis();
  const cases = useCases();
  const feedback = useFeedback();
  const exportHook = useExport();
  const dashboardStats = useDashboardStats();

  return {
    health,
    diagnosis,
    cases,
    feedback,
    export: exportHook,
    dashboardStats,
  };
};