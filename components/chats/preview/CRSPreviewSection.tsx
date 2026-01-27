/**
 * CRSPreviewSection Component
 * Renders a section of the CRS preview with fields
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CRSPreviewField {
  label: string;
  value: any;
  array?: boolean;
  required?: boolean;
  fieldName?: string;
}

interface CRSPreviewSectionProps {
  title: string;
  fields: CRSPreviewField[];
  fieldSources?: Record<string, string>;
  weakFields?: string[];
}

export function CRSPreviewSection({ 
  title, 
  fields, 
  fieldSources = {}, 
  weakFields = [] 
}: CRSPreviewSectionProps) {
  const hasContent = fields.some((f) => {
    if (f.array) return Array.isArray(f.value) && f.value.length > 0;
    return f.value && f.value !== "Not specified";
  });

  if (!hasContent) return null;

  return (
    <div className="bg-white rounded-lg p-5 border shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 border-b pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {fields.map((field) => {
          const isEmpty = field.array
            ? !Array.isArray(field.value) || field.value.length === 0
            : !field.value || field.value === "Not specified";

          if (isEmpty) return null;

          const fieldName = field.fieldName || field.label.toLowerCase().replace(/ /g, "_");
          const source = fieldSources[fieldName] || "empty";
          const isInferred = source === "llm_inference";
          const isWeak = weakFields.includes(fieldName);

          return (
            <div 
              key={field.label}
              className={cn(
                "rounded-lg p-3 transition-colors",
                isInferred && "bg-yellow-50 border border-yellow-200"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <label className="font-medium text-gray-700 text-sm">
                  {field.label}
                </label>
                {field.required && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Required
                  </Badge>
                )}
                {isInferred && (
                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                    Inferred
                  </Badge>
                )}
                {isWeak && (
                  <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                    Needs Detail
                  </Badge>
                )}
              </div>
              {isInferred && (
                <p className="text-xs text-yellow-700 mb-2 italic">
                  This field was inferred by AI. Please verify or provide more details.
                </p>
              )}
              {isWeak && (
                <p className="text-xs text-orange-700 mb-2 italic">
                  This field needs more detail to count toward completion.
                </p>
              )}
              {field.array && Array.isArray(field.value) ? (
                <ul className="space-y-1.5 ml-4">
                  {field.value.map((item: any, idx: number) => {
                    const displayText = typeof item === 'string' 
                      ? item 
                      : item.title || item.description || item.name || JSON.stringify(item);
                    
                    return (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-600 mt-1.5">•</span>
                        <span className="flex-1">{displayText}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-700 ml-4">{String(field.value)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
