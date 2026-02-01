"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, ShieldCheck, Cpu, Database, Network } from "lucide-react";

const sampleCRS = {
  project_title: "SmartTask: AI-Enabled Project Management",
  description:
    "A comprehensive project management solution designed for agile teams to organize, track, and manage their software development lifecycle with intelligent automation and real-time collaboration",
  objectives: [
    "Streamline task allocation and progress tracking?",
    "Improve team velocity through automated sprint reports?",
    "Provide a centralized source of truth for all project documentation?"
  ],
  functional_requirements: [
    {
      id: "FR-01",
      title: "Interactive Kanban Board",
      priority: "High",
      description: "A drag-and-drop interface for managing tasks across different workflow stages (To Do, In Progress, Review, Done)?",
    },
    {
      id: "FR-02",
      title: "Automated Reporting",
      priority: "Medium",
      description: "Weekly generation of burndown charts and velocity reports for stakeholders?",
    },
    {
      id: "FR-03",
      title: "Role-Based Access",
      priority: "High",
      description: "Granular permission settings for Developers, Project Managers, and External Clients?",
    },
    {
      id: "FR-04",
      title: "Real-time Notifications",
      priority: "Low",
      description: "Push and email notifications for task assignments, mentions, and deadline approaching?",
    },
    {
      id: "FR-05",
      title: "AI Workload Prediction",
      priority: "Medium",
      description: "Predict potential bottlenecks based on historical team velocity and current sprint load?",
    },
    {
      id: "FR-06",
      title: "Automated Documentation",
      priority: "High",
      description: "Generate technical documentation and release notes automatically from task descriptions?",
    },
  ],
  non_functional_requirements: [
    { label: "Performance", value: "Dashboard load time should be under 1.5 seconds?" },
    { label: "Security", value: "SOC-2 compliant data encryption and 2FA authentication?" },
    { label: "Scalability", value: "Support up to 10,000 concurrent users?" },
    { label: "Reliability", value: "99.9% uptime during business hours?" }
  ],
  stakeholders: ["Project Managers", "Software Engineers", "Product Owners", "QA Analysts", "Stakeholders"],
  constraints: "Must be accessible via web and mobile browsers; budget capped at $50k",
  tech_stack: [
    { area: "Frontend", stack: "Next.js 14, TailwindCSS, Framer Motion" },
    { area: "Backend", stack: "Python FastAPI, PostgreSQL, Redis" },
    { area: "AI Layer", stack: "OpenAI GPT-4, Vector Embeddings" }
  ]
};

export function SampleCRSModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-11 px-6 rounded-lg font-semibold hover:border-primary transition-colors">
          <FileText className="h-4 w-4" />
          View Sample CRS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden border-none shadow-2xl flex flex-col bg-white">
        {/* Header - No Shrink */}
        <div className="p-8 border-b bg-gray-50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-[10px] uppercase tracking-widest">
                Sample Output
              </Badge>
              <div className="h-[1px] w-8 bg-gray-200" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Document ID: ST-2024-X1</span>
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
              {sampleCRS.project_title}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium">
              Comprehensive Requirement Specification Workflow
            </DialogDescription>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 pb-12">

            {/* Overview Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">Project Archetype & Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-base font-medium">
                {sampleCRS.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {sampleCRS.objectives.map((obj, i) => (
                  <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex gap-3 group hover:border-primary/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-semibold text-gray-700 leading-snug">{obj}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Context Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">Engineered Tech Stack</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleCRS.tech_stack.map((item, i) => (
                  <div key={i} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{item.area}</div>
                    <div className="text-sm font-bold text-gray-800">{item.stack}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Functional Hierarchy Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-lg font-black uppercase tracking-tight text-gray-900">Functional Capability Matrix</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleCRS.functional_requirements.map((req, index) => (
                  <div key={index} className="p-6 border border-gray-100 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all bg-white relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-300 group-hover:text-primary transition-colors">{req.id}</span>
                        <h4 className="font-black text-gray-900 tracking-tight">{req.title}</h4>
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-black uppercase ${req.priority === 'High' ? 'border-red-100 text-red-500 bg-red-50' : 'border-gray-200'
                        }`}>
                        {req.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Non-Functional & Constraints Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  <h3 className="text-base font-black uppercase tracking-tight text-gray-900">Quality Safeguards</h3>
                </div>
                <div className="space-y-4">
                  {sampleCRS.non_functional_requirements.map((nfr, i) => (
                    <div key={i} className="flex flex-col gap-1.5 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{nfr.label}</span>
                      <p className="text-sm font-bold text-gray-700">{nfr.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  <h3 className="text-base font-black uppercase tracking-tight text-gray-900">Operational Scope</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Primary Stakeholders</span>
                    <div className="flex flex-wrap gap-2">
                      {sampleCRS.stakeholders.map((s, i) => (
                        <Badge key={i} variant="secondary" className="bg-white border border-gray-200 text-gray-600 font-bold text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Global Constraints</span>
                    <p className="text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                      {sampleCRS.constraints}
                    </p>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t bg-gray-50 flex items-center justify-between text-[10px] font-black text-gray-400 shrink-0">
          <div className="flex items-center gap-4">
            <span>BRIDGEAI // CRS_ENGINE_v4.2</span>
            <div className="h-3 w-[1px] bg-gray-300" />
            <span>ENCRYPTION: AES-256</span>
          </div>
          <span>CERTIFIED SPECIFICATION // 2024</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
