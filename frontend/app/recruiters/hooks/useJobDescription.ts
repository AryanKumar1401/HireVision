import { useState } from 'react';
import { getBackendUrl } from '@/utils/env';

const API_BASE_URL = getBackendUrl();

interface UseJobDescriptionReturn {
  jobDescription: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateJobDescription: (recruiterId: string, description: string) => Promise<void>;
  loadJobDescription: (recruiterId: string) => Promise<void>;
}

export const useJobDescription = (): UseJobDescriptionReturn => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateJobDescription = async (recruiterId: string, description: string) => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/update-job-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recruiter_id: recruiterId,
          description: description
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update job description: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setJobDescription(description);
      } else {
        throw new Error('Failed to update job description');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
      console.error('Error updating job description:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const loadJobDescription = async (recruiterId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading job description for recruiterId: ', recruiterId);
      const response = await fetch(`${API_BASE_URL}/get-job-description/${recruiterId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load job description: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setJobDescription(result.description || '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading');
      console.error('Error loading job description:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    jobDescription,
    isLoading,
    isSaving,
    error,
    updateJobDescription,
    loadJobDescription
  };
};