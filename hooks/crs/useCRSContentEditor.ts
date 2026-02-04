/**
 * CRS Content Editor Hook
 * Manages CRS content editing state and operations
 */

import { useState, useCallback } from "react";
import { updateCRSContent } from "@/services/crs.service";
import { CRSError } from "@/services/errors.service";

export interface CRSContentEditorState {
  formData: Record<string, any>;
  isSaving: boolean;
  error: string | null;
}

export interface UseCRSContentEditorReturn {
  formData: Record<string, any>;
  isSaving: boolean;
  error: string | null;
  handleChange: (field: string, value: any) => void;
  handleArrayChange: (field: string, index: number, value: any) => void;
  handleNestedArrayChange: (
    field: string,
    nestedField: string,
    index: number,
    value: string
  ) => void;
  addItem: (field: string, defaultValue?: any) => void;
  removeItem: (field: string, index: number) => void;
  addNestedItem: (field: string, nestedField: string) => void;
  removeNestedItem: (field: string, nestedField: string, index: number) => void;
  saveContent: (crsId: number, editVersion: number) => Promise<void>;
  resetForm: (initialContent: string) => void;
  clearError: () => void;
}

export interface UseCRSContentEditorOptions {
  initialContent: string;
  onChange?: (formData: Record<string, any>) => void;
}

/**
 * Hook for managing CRS content editing
 */
export function useCRSContentEditor({
  initialContent,
  onChange,
}: UseCRSContentEditorOptions): UseCRSContentEditorReturn {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    try {
      return JSON.parse(initialContent);
    } catch {
      return {};
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to update state and trigger onChange
  const updateFormData = useCallback((updater: (prev: Record<string, any>) => Record<string, any>) => {
    setFormData((prev) => {
      const next = updater(prev);
      if (onChange) onChange(next);
      return next;
    });
  }, [onChange]);

  const handleChange = useCallback((field: string, value: any) => {
    updateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, [updateFormData]);

  const handleArrayChange = useCallback(
    (field: string, index: number, value: any) => {
      updateFormData((prev) => {
        const array = Array.isArray(prev[field]) ? [...prev[field]] : [];
        array[index] = value;
        return {
          ...prev,
          [field]: array,
        };
      });
    },
    [updateFormData]
  );

  const handleNestedArrayChange = useCallback(
    (field: string, nestedField: string, index: number, value: string) => {
      updateFormData((prev) => {
        const nested = { ...(prev[field] || {}) };
        const array = Array.isArray(nested[nestedField])
          ? [...nested[nestedField]]
          : [];
        array[index] = value;
        nested[nestedField] = array;
        return {
          ...prev,
          [field]: nested,
        };
      });
    },
    [updateFormData]
  );

  const addItem = useCallback((field: string, defaultValue: any = "") => {
    updateFormData((prev) => {
      const array = Array.isArray(prev[field]) ? [...prev[field]] : [];
      array.push(defaultValue);
      return {
        ...prev,
        [field]: array,
      };
    });
  }, [updateFormData]);

  const removeItem = useCallback((field: string, index: number) => {
    updateFormData((prev) => {
      const array = Array.isArray(prev[field]) ? [...prev[field]] : [];
      array.splice(index, 1);
      return {
        ...prev,
        [field]: array,
      };
    });
  }, [updateFormData]);

  const addNestedItem = useCallback(
    (field: string, nestedField: string) => {
      updateFormData((prev) => {
        const nested = { ...(prev[field] || {}) };
        const array = Array.isArray(nested[nestedField])
          ? [...nested[nestedField]]
          : [];
        array.push("");
        nested[nestedField] = array;
        return {
          ...prev,
          [field]: nested,
        };
      });
    },
    [updateFormData]
  );

  const removeNestedItem = useCallback(
    (field: string, nestedField: string, index: number) => {
      updateFormData((prev) => {
        const nested = { ...(prev[field] || {}) };
        const array = Array.isArray(nested[nestedField])
          ? [...nested[nestedField]]
          : [];
        array.splice(index, 1);
        nested[nestedField] = array;
        return {
          ...prev,
          [field]: nested,
        };
      });
    },
    [updateFormData]
  );

  const saveContent = useCallback(
    async (crsId: number, editVersion: number) => {
      setIsSaving(true);
      setError(null);

      try {
        const newContent = JSON.stringify(formData, null, 2);
        await updateCRSContent(crsId, newContent, editVersion);
      } catch (err) {
        if (err instanceof CRSError) {
          setError(err.message);
        } else {
          setError("Failed to save changes. Please try again.");
        }
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [formData]
  );

  const resetForm = useCallback((initialContent: string) => {
    try {
      setFormData(JSON.parse(initialContent));
      setError(null);
    } catch {
      setFormData({});
      setError("Invalid content format");
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    formData,
    isSaving,
    error,
    handleChange,
    handleArrayChange,
    handleNestedArrayChange,
    addItem,
    removeItem,
    addNestedItem,
    removeNestedItem,
    saveContent,
    resetForm,
    clearError,
  };
}
