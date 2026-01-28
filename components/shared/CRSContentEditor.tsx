/**
 * CRS Content Editor Component
 * Refactored to follow SOLID principles:
 * - Uses useCRSContentEditor hook for state management
 * - Decomposed into smaller, focused sub-components
 * - Single Responsibility: orchestrates editing UI
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, XCircle } from "lucide-react";
import { useCRSContentEditor } from "@/hooks/crs/useCRSContentEditor";
import { ProjectInfoFields } from "./crs-editor/ProjectInfoFields";
import { StringListEditor } from "./crs-editor/StringListEditor";
import { FunctionalRequirementsEditor } from "./crs-editor/FunctionalRequirementsEditor";
import { NonFunctionalRequirementsEditor } from "./crs-editor/NonFunctionalRequirementsEditor";
import { TechnologyStackEditor } from "./crs-editor/TechnologyStackEditor";
import { ConstraintsEditor } from "./crs-editor/ConstraintsEditor";

interface CRSContentEditorProps {
  initialContent: string;
  onSave: (newContent: string) => Promise<void>;
  onCancel: () => void;
}

export function CRSContentEditor({
  initialContent,
  onSave,
  onCancel,
}: CRSContentEditorProps) {
  const {
    formData,
    isSaving,
    handleChange,
    handleArrayChange,
    handleNestedArrayChange,
    addItem,
    removeItem,
    addNestedItem,
    removeNestedItem,
  } = useCRSContentEditor(initialContent);

  const [localSaving, setLocalSaving] = useState(false);

  const handleSave = async () => {
    setLocalSaving(true);
    try {
      const newContent = JSON.stringify(formData, null, 2);
      await onSave(newContent);
    } finally {
      setLocalSaving(false);
    }
  };

  const saving = isSaving || localSaving;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      {/* Header with Actions */}
      <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-3 border-b">
        <h3 className="text-lg font-bold text-gray-900">Editing CRS</h3>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
            <XCircle className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#341bab] hover:bg-[#2a1589]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(80vh-100px)] pr-4">
        <div className="space-y-6">
          {/* Project Info */}
          <ProjectInfoFields
            projectTitle={formData.project_title || ""}
            projectDescription={formData.project_description || ""}
            onChangeTitle={(value) => handleChange("project_title", value)}
            onChangeDescription={(value) =>
              handleChange("project_description", value)
            }
          />

          {/* Objectives */}
          <StringListEditor
            label="Objectives"
            items={formData.project_objectives || []}
            onAdd={() => addItem("project_objectives")}
            onRemove={(idx) => removeItem("project_objectives", idx)}
            onChange={(idx, value) =>
              handleArrayChange("project_objectives", idx, value)
            }
            className="border-b pb-6"
          />

          {/* Functional Requirements */}
          <FunctionalRequirementsEditor
            requirements={formData.functional_requirements || []}
            onAdd={() =>
              addItem("functional_requirements", {
                id: `FR-${(formData.functional_requirements?.length || 0) + 1}`,
                title: "",
                priority: "medium",
                description: "",
              })
            }
            onRemove={(idx) => removeItem("functional_requirements", idx)}
            onChange={(idx, req) =>
              handleArrayChange("functional_requirements", idx, req)
            }
          />

          {/* Target Users */}
          <StringListEditor
            label="Target Users"
            items={formData.target_users || []}
            onAdd={() => addItem("target_users")}
            onRemove={(idx) => removeItem("target_users", idx)}
            onChange={(idx, value) =>
              handleArrayChange("target_users", idx, value)
            }
            className="border-b pb-6"
          />

          {/* Non-Functional Requirements */}
          <NonFunctionalRequirementsEditor
            securityRequirements={formData.security_requirements || []}
            performanceRequirements={formData.performance_requirements || []}
            scalabilityRequirements={formData.scalability_requirements || []}
            onAddSecurity={() => addItem("security_requirements")}
            onRemoveSecurity={(idx) => removeItem("security_requirements", idx)}
            onChangeSecurity={(idx, value) =>
              handleArrayChange("security_requirements", idx, value)
            }
            onAddPerformance={() => addItem("performance_requirements")}
            onRemovePerformance={(idx) =>
              removeItem("performance_requirements", idx)
            }
            onChangePerformance={(idx, value) =>
              handleArrayChange("performance_requirements", idx, value)
            }
            onAddScalability={() => addItem("scalability_requirements")}
            onRemoveScalability={(idx) =>
              removeItem("scalability_requirements", idx)
            }
            onChangeScalability={(idx, value) =>
              handleArrayChange("scalability_requirements", idx, value)
            }
          />

          {/* Technology Stack */}
          <TechnologyStackEditor
            technologyStack={formData.technology_stack || {}}
            onAdd={(category) => addNestedItem("technology_stack", category)}
            onRemove={(category, idx) =>
              removeNestedItem("technology_stack", category, idx)
            }
            onChange={(category, idx, value) =>
              handleNestedArrayChange("technology_stack", category, idx, value)
            }
          />

          {/* Constraints */}
          <ConstraintsEditor
            timelineConstraints={formData.timeline_constraints || ""}
            budgetConstraints={formData.budget_constraints || ""}
            technicalConstraints={formData.technical_constraints || []}
            onChangeTimeline={(value) =>
              handleChange("timeline_constraints", value)
            }
            onChangeBudget={(value) => handleChange("budget_constraints", value)}
            onAddTechnical={() => addItem("technical_constraints")}
            onRemoveTechnical={(idx) => removeItem("technical_constraints", idx)}
            onChangeTechnical={(idx, value) =>
              handleArrayChange("technical_constraints", idx, value)
            }
          />

          {/* Integrations */}
          <StringListEditor
            label="Integrations"
            items={formData.integrations || []}
            onAdd={() => addItem("integrations")}
            onRemove={(idx) => removeItem("integrations", idx)}
            onChange={(idx, value) => handleArrayChange("integrations", idx, value)}
            className="border-b pb-6"
          />

          {/* Success Metrics */}
          <StringListEditor
            label="Success Metrics"
            items={formData.success_metrics || []}
            onAdd={() => addItem("success_metrics")}
            onRemove={(idx) => removeItem("success_metrics", idx)}
            onChange={(idx, value) =>
              handleArrayChange("success_metrics", idx, value)
            }
            className="border-b pb-6"
          />

          {/* Assumptions & Risks */}
          <div className="grid grid-cols-2 gap-6 border-b pb-6">
            <StringListEditor
              label="Assumptions"
              items={formData.assumptions || []}
              onAdd={() => addItem("assumptions")}
              onRemove={(idx) => removeItem("assumptions", idx)}
              onChange={(idx, value) =>
                handleArrayChange("assumptions", idx, value)
              }
            />
            <StringListEditor
              label="Risks"
              items={formData.risks || []}
              onAdd={() => addItem("risks")}
              onRemove={(idx) => removeItem("risks", idx)}
              onChange={(idx, value) => handleArrayChange("risks", idx, value)}
            />
          </div>

          {/* Out of Scope */}
          <StringListEditor
            label="Out of Scope"
            items={formData.out_of_scope || []}
            onAdd={() => addItem("out_of_scope")}
            onRemove={(idx) => removeItem("out_of_scope", idx)}
            onChange={(idx, value) =>
              handleArrayChange("out_of_scope", idx, value)
            }
            className="border-b pb-6"
          />

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={formData.additional_notes || ""}
              onChange={(e) => handleChange("additional_notes", e.target.value)}
              className="h-24"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
