/**
 * Form Validation Hook
 * Handles client-side form validation logic
 * Single Responsibility: Input validation
 */

"use client";

import { useState, useCallback } from "react";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export interface ValidationErrors {
  [field: string]: string;
}

interface UseFormValidationReturn {
  errors: ValidationErrors;
  validateField: (field: string, value: string) => boolean;
  validateAll: (values: Record<string, string>) => boolean;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
  setFieldError: (field: string, error: string) => void;
}

/**
 * Custom hook for form validation
 */
export function useFormValidation(
  rules: ValidationRules
): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback(
    (field: string, value: string): boolean => {
      const rule = rules[field];
      if (!rule) return true;

      let error: string | null = null;

      if (rule.required && !value.trim()) {
        error = `${field} is required`;
      } else if (rule.minLength && value.length < rule.minLength) {
        error = `${field} must be at least ${rule.minLength} characters`;
      } else if (rule.maxLength && value.length > rule.maxLength) {
        error = `${field} must not exceed ${rule.maxLength} characters`;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        error = `${field} format is invalid`;
      } else if (rule.custom) {
        error = rule.custom(value);
      }

      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error as string }));
        return false;
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      return true;
    },
    [rules]
  );

  const validateAll = useCallback(
    (values: Record<string, string>): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      Object.keys(rules).forEach((field) => {
        const value = values[field] || "";
        const rule = rules[field];

        let error: string | null = null;

        if (rule.required && !value.trim()) {
          error = `${field} is required`;
        } else if (rule.minLength && value.length < rule.minLength) {
          error = `${field} must be at least ${rule.minLength} characters`;
        } else if (rule.maxLength && value.length > rule.maxLength) {
          error = `${field} must not exceed ${rule.maxLength} characters`;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          error = `${field} format is invalid`;
        } else if (rule.custom) {
          error = rule.custom(value);
        }

        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [rules]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
    setFieldError,
  };
}
