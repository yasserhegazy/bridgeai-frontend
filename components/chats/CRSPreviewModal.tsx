"use client";

import { useState } from "react";
import { X, FileText, CheckCircle2, AlertCircle, Info, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CRSProgressIndicator } from "./CRSProgressIndicator";
import { CRSPreviewOut } from "@/lib/api-crs";
import { cn } from "@/lib/utils";

interface CRSPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: CRSPreviewOut | null;
  loading?: boolean;
  onGenerateDraft?: () => Promise<void>;
  generatingDraft?: boolean;
}

export function CRSPreviewModal({
  open,
  onOpenChange,
  preview,
  loading = false,
  onGenerateDraft,
  generatingDraft = false,
}: CRSPreviewModalProps) {
  const [activeTab, setActiveTab] = useState("preview");

  if (!preview && !loading) {
    return null;
  }

  // Parse CRS content JSON
  const parsedContent = preview ? (() => {
    try {
      return JSON.parse(preview.content);
    } catch {
      return null;
    }
  })() : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                CRS Preview
              </DialogTitle>
              <DialogDescription>
                Review your progress and see what information has been captured so far
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <p className="text-gray-600">Generating preview...</p>
            </div>
          </div>
        ) : preview && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">CRS Content</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="progress">What's Missing</TabsTrigger>
            </TabsList>

            {/* CRS Content Tab */}
            <TabsContent value="preview" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-[500px] rounded-lg border bg-gray-50 p-6">
                {parsedContent ? (
                  <div className="space-y-6">
                    <CRSSection
                      title="Project Overview"
                      fields={[
                        { label: "Title", value: parsedContent.project_title, required: true, fieldName: "project_title" },
                        { label: "Description", value: parsedContent.project_description, required: true, fieldName: "project_description" },
                        { label: "Objectives", value: parsedContent.project_objectives, array: true, fieldName: "project_objectives" },
                      ]}
                      fieldSources={preview.field_sources}
                      weakFields={preview.weak_fields}
                    />

                    <CRSSection
                      title="Requirements"
                      fields={[
                        { label: "Functional Requirements", value: parsedContent.functional_requirements, array: true, required: true, fieldName: "functional_requirements" },
                        { label: "Performance Requirements", value: parsedContent.performance_requirements, array: true, fieldName: "performance_requirements" },
                        { label: "Security Requirements", value: parsedContent.security_requirements, array: true, fieldName: "security_requirements" },
                        { label: "Scalability Requirements", value: parsedContent.scalability_requirements, array: true, fieldName: "scalability_requirements" },
                      ]}
                      fieldSources={preview.field_sources}
                      weakFields={preview.weak_fields}
                    />

                    <CRSSection
                      title="Stakeholders & Users"
                      fields={[
                        { label: "Target Users", value: parsedContent.target_users, array: true, fieldName: "target_users" },
                        { label: "Stakeholders", value: parsedContent.stakeholders, array: true, fieldName: "stakeholders" },
                      ]}
                      fieldSources={preview.field_sources}
                      weakFields={preview.weak_fields}
                    />

                    <CRSSection
                      title="Technical Details"
                      fields={[
                        { label: "Technology Stack", value: parsedContent.technology_stack, array: true, fieldName: "technology_stack" },
                        { label: "Integrations", value: parsedContent.integrations, array: true, fieldName: "integrations" },
                      ]}
                      fieldSources={preview.field_sources}
                      weakFields={preview.weak_fields}
                    />

                    <CRSSection
                      title="Constraints & Timeline"
                      fields={[
                        { label: "Budget Constraints", value: parsedContent.budget_constraints, fieldName: "budget_constraints" },
                        { label: "Timeline Constraints", value: parsedContent.timeline_constraints, fieldName: "timeline_constraints" },
                        { label: "Technical Constraints", value: parsedContent.technical_constraints, array: true, fieldName: "technical_constraints" },
                      ]}
                      fieldSources={preview.field_sources}
                      weakFields={preview.weak_fields}
                    />

                    <CRSSection
                      title="Success Criteria"
                      fields={[
                        { label: "Success Metrics", value: parsedContent.success_metrics, array: true, fieldName: "success_metrics" },
                        { label: "Acceptance Criteria", value: parsedContent.acceptance_criteria, array: true, fieldName: "acceptance_criteria" },
                      ]}
                      fieldSources={preview.field_sources}
                      weakFields={preview.weak_fields}
                    />

                    <CRSSection
                      title="Additional Information"
                      fields={[
                        { label: "Assumptions", value: parsedContent.assumptions, array: true, fieldName: "assumptions" },
                        { label: "Risks", value: parsedContent.risks, array: true, fieldName: "risks" },
                        { label: "Out of Scope", value: parsedContent.out_of_scope, array: true, fieldName: "out_of_scope" },
                      ]}
                      fieldSources={preview.field_sources}
                      weakFields={preview.weak_fields}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">Unable to parse CRS content</p>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-[500px] rounded-lg border bg-gray-50 p-6">
                <div className="space-y-6">
                  {/* Overall Summary */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Overall Summary
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-white rounded-lg p-4 border">
                      {preview.overall_summary || "No summary available yet"}
                    </p>
                  </div>

                  {/* Key Points */}
                  {preview.summary_points && preview.summary_points.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Key Points
                      </h3>
                      <ul className="space-y-2">
                        {preview.summary_points.map((point, index) => (
                          <li key={index} className="flex items-start gap-3 bg-white rounded-lg p-3 border">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 flex-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-6">
                  {/* Progress Indicator */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <CRSProgressIndicator
                      percentage={preview.completeness_percentage}
                      isComplete={preview.is_complete}
                      missingRequiredFields={preview.missing_required_fields}
                      missingOptionalFields={preview.missing_optional_fields}
                      weakFields={preview.weak_fields}
                      size="lg"
                    />
                  </div>

                  {/* What's Missing Section */}
                  <div className="space-y-4">
                    {/* Special message for 95% (clarification mode) */}
                    {preview.completeness_percentage === 95 && 
                     preview.missing_required_fields.length === 0 && 
                     (!preview.weak_fields || preview.weak_fields.length === 0) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          Almost Complete!
                        </h3>
                        <p className="text-sm text-blue-700">
                          Your CRS is nearly ready. The AI is still asking clarification questions to ensure all details are captured accurately. 
                          Once the conversation is complete, your CRS will reach 100% and be ready for review.
                        </p>
                      </div>
                    )}
                    
                    {preview.missing_required_fields.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Required Fields Missing
                        </h3>
                        <ul className="space-y-2">
                          {/* Only show fields that are truly missing, not just weak */}
                          {preview.missing_required_fields.filter(field => 
                            !preview.weak_fields?.includes(field)
                          ).map((field) => (
                            <li key={field} className="flex items-center gap-2 text-red-700">
                              <X className="h-4 w-4" />
                              <span>{formatFieldName(field)}</span>
                            </li>
                          ))}
                        </ul>
                        {preview.missing_required_fields.filter(field => 
                          !preview.weak_fields?.includes(field)
                        ).length > 0 && (
                          <p className="mt-3 text-sm text-red-600">
                            Continue the conversation to provide this information.
                          </p>
                        )}
                      </div>
                    )}

                    {preview.weak_fields && preview.weak_fields.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          Fields Need More Detail
                        </h3>
                        <ul className="space-y-2">
                          {preview.weak_fields.map((field) => (
                            <li key={field} className="flex items-center gap-2 text-orange-700">
                              <AlertCircle className="h-4 w-4" />
                              <span>{formatFieldName(field)}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-sm text-orange-600">
                          These fields have some content but need more specific details to count toward completion.
                        </p>
                      </div>
                    )}

                    {preview.missing_required_fields.length === 0 && preview.missing_optional_fields.length > 2 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                          <Info className="h-5 w-5" />
                          Optional Fields (Need {2 - preview.filled_optional_count} more)
                        </h3>
                        <p className="text-sm text-yellow-700 mb-3">
                          You need at least 2 optional fields to complete the CRS. Consider providing:
                        </p>
                        <ul className="space-y-2">
                          {preview.missing_optional_fields.slice(0, 5).map((field) => (
                            <li key={field} className="flex items-center gap-2 text-yellow-700">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>{formatFieldName(field)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {preview.is_complete && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          CRS Complete!
                        </h3>
                        <p className="text-green-700">
                          All required information has been gathered. The CRS will be automatically saved.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          {preview && !preview.is_complete && onGenerateDraft && (
            <Button 
              onClick={onGenerateDraft} 
              disabled={generatingDraft}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generatingDraft ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Generate Draft CRS
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CRSSectionProps {
  title: string;
  fields: Array<{
    label: string;
    value: any;
    array?: boolean;
    required?: boolean;
    fieldName?: string;  // For field source tracking
  }>;
  fieldSources?: Record<string, string>;
  weakFields?: string[];
}

function CRSSection({ title, fields, fieldSources = {}, weakFields = [] }: CRSSectionProps) {
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
                    // Handle both string and object items
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

function formatFieldName(field: string): string {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
