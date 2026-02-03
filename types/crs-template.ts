/**
 * CRS Template Structure
 * Matches the backend CRSTemplate class
 */

export interface CRSTemplate {
    project_title: string;
    project_description: string;
    project_objectives: string[];
    target_users: string[];
    stakeholders: string[];
    functional_requirements: CRSFunctionalRequirement[];
    performance_requirements: string[];
    security_requirements: string[];
    scalability_requirements: string[];
    technology_stack: {
        frontend: string[];
        backend: string[];
        database: string[];
        other: string[];
    };
    integrations: string[];
    budget_constraints: string;
    timeline_constraints: string;
    technical_constraints: string[];
    success_metrics: string[];
    acceptance_criteria: string[];
    assumptions: string[];
    risks: string[];
    out_of_scope: string[];
    additional_notes?: string;
}

export interface CRSFunctionalRequirement {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

/**
 * Default empty template
 */
export const DEFAULT_CRS_TEMPLATE: CRSTemplate = {
    project_title: "",
    project_description: "",
    project_objectives: [],
    target_users: [],
    stakeholders: [],
    functional_requirements: [],
    performance_requirements: [],
    security_requirements: [],
    scalability_requirements: [],
    technology_stack: {
        frontend: [],
        backend: [],
        database: [],
        other: []
    },
    integrations: [],
    budget_constraints: "",
    timeline_constraints: "",
    technical_constraints: [],
    success_metrics: [],
    acceptance_criteria: [],
    assumptions: [],
    risks: [],
    out_of_scope: []
};
