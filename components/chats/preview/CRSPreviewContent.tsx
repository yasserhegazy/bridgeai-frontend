/**
 * CRSPreviewContent Component
 * Displays the main CRS content in a structured format
 */

"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CRSPreviewOut } from "@/dto";
import { CRSPreviewSection } from "./CRSPreviewSection";

interface CRSPreviewContentProps {
  preview: CRSPreviewOut;
}

export function CRSPreviewContent({ preview }: CRSPreviewContentProps) {
  const parsedContent = (() => {
    try {
      return JSON.parse(preview.content);
    } catch {
      return null;
    }
  })();

  if (!parsedContent) {
    return (
      <ScrollArea className="h-[500px] rounded-lg border bg-gray-50 p-6">
        <p className="text-gray-500">Unable to parse CRS content</p>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[500px] rounded-lg border bg-gray-50 p-6">
      <div className="space-y-6">
        <CRSPreviewSection
          title="Project Overview"
          fields={[
            { label: "Title", value: parsedContent.project_title, required: true, fieldName: "project_title" },
            { label: "Description", value: parsedContent.project_description, required: true, fieldName: "project_description" },
            { label: "Objectives", value: parsedContent.project_objectives, array: true, fieldName: "project_objectives" },
          ]}
          fieldSources={preview.field_sources}
          weakFields={preview.weak_fields}
        />

        <CRSPreviewSection
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

        <CRSPreviewSection
          title="Stakeholders & Users"
          fields={[
            { label: "Target Users", value: parsedContent.target_users, array: true, fieldName: "target_users" },
            { label: "Stakeholders", value: parsedContent.stakeholders, array: true, fieldName: "stakeholders" },
          ]}
          fieldSources={preview.field_sources}
          weakFields={preview.weak_fields}
        />

        <CRSPreviewSection
          title="Technical Details"
          fields={[
            { label: "Technology Stack", value: parsedContent.technology_stack, array: true, fieldName: "technology_stack" },
            { label: "Integrations", value: parsedContent.integrations, array: true, fieldName: "integrations" },
          ]}
          fieldSources={preview.field_sources}
          weakFields={preview.weak_fields}
        />

        <CRSPreviewSection
          title="Constraints & Timeline"
          fields={[
            { label: "Budget Constraints", value: parsedContent.budget_constraints, fieldName: "budget_constraints" },
            { label: "Timeline Constraints", value: parsedContent.timeline_constraints, fieldName: "timeline_constraints" },
            { label: "Technical Constraints", value: parsedContent.technical_constraints, array: true, fieldName: "technical_constraints" },
          ]}
          fieldSources={preview.field_sources}
          weakFields={preview.weak_fields}
        />

        <CRSPreviewSection
          title="Success Criteria"
          fields={[
            { label: "Success Metrics", value: parsedContent.success_metrics, array: true, fieldName: "success_metrics" },
            { label: "Acceptance Criteria", value: parsedContent.acceptance_criteria, array: true, fieldName: "acceptance_criteria" },
          ]}
          fieldSources={preview.field_sources}
          weakFields={preview.weak_fields}
        />

        <CRSPreviewSection
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
    </ScrollArea>
  );
}
