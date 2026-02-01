/**
 * Form Select Component
 * Reusable select field with label and error display
 * Single Responsibility: Select field rendering
 */

import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Select an option",
  disabled = false,
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 ml-1 mb-2">
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "h-12 border-gray-200 rounded-xl focus:ring-primary/20 transition-all text-sm font-medium shadow-sm",
            error && "border-destructive"
          )}
          aria-invalid={!!error}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
