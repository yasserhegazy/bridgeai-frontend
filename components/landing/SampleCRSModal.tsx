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
import { FileText, CheckCircle2, ShieldCheck, History, Download, X, CheckCircle, Edit, Clock } from "lucide-react";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { cn } from "@/lib/utils";

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

const mockHistoryLogs = [
  {
    id: 1,
    action: "approved",
    changed_by: "Khaled Jamal",
    formattedDate: "Oct 24, 2024 • 14:30",
    summary: "Business Requirements validated against stakeholder vision. High-fidelity extraction complete.",
  },
  {
    id: 2,
    action: "updated",
    changed_by: "System Agent",
    formattedDate: "Oct 24, 2024 • 11:15",
    summary: "Refined Technical Stack based on scalability constraints (10,000 concurrent users).",
  },
  {
    id: 3,
    action: "created",
    changed_by: "Sarah Miller",
    formattedDate: "Oct 23, 2024 • 09:00",
    summary: "Initial Project Extraction from requirement gathering phase.",
  }
];

export function SampleCRSModal() {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-11 px-6 rounded-lg font-semibold hover:border-primary transition-colors">
          <FileText className="h-4 w-4" />
          View Sample CRS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl">
        <DialogHeader className="px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
              Sample Document: {sampleCRS.project_title}
            </DialogTitle>
            <CRSStatusBadge status="approved" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50/30">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Version</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black text-gray-900">v1.2.0</p>
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold">Stable</span>
              </div>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Issue date</p>
              <p className="text-sm font-bold text-gray-900 mt-1">Oct 24, 2024</p>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status class</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-sm font-bold text-gray-900 capitalize">Validated</p>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Project Archetype & Vision
            </h3>
            <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
              {sampleCRS.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sampleCRS.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-primary/5">
                  <div className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-primary/40" />
                  <span className="text-sm text-gray-700 font-medium leading-tight">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Container */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm relative overflow-hidden space-y-12">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <FileText className="w-24 h-24" />
            </div>

            {/* Technical Context Section */}
            <section className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Engineered tech stack</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleCRS.tech_stack.map((item, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{item.area}</div>
                    <div className="text-sm font-bold text-gray-800">{item.stack}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Functional Hierarchy Section */}
            <section className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Functional capability matrix</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleCRS.functional_requirements.map((req, index) => (
                  <div key={index} className="p-5 border border-gray-100 rounded-xl flex flex-col gap-3 hover:border-primary/20 transition-all bg-white shadow-sm group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-300 group-hover:text-primary transition-colors">{req.id}</span>
                        <h4 className="font-bold text-gray-900 tracking-tight">{req.title}</h4>
                      </div>
                      <Badge variant="outline" className={cn("text-[9px] font-black border-none px-2",
                        req.priority === 'High' ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100'
                      )}>
                        {req.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quality Safeguards & Operational Scope */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 relative z-10">
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">Quality safeguards</h3>
                </div>
                <div className="space-y-3">
                  {sampleCRS.non_functional_requirements.map((nfr, i) => (
                    <div key={i} className="flex flex-col gap-1 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">{nfr.label}</span>
                      <p className="text-xs font-bold text-gray-700">{nfr.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">Operational scope</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Primary stakeholders</span>
                    <div className="flex flex-wrap gap-2">
                      {sampleCRS.stakeholders.map((s, i) => (
                        <Badge key={i} variant="secondary" className="bg-white border border-gray-200 text-gray-600 font-bold text-[9px] rounded-lg">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Global constraints</span>
                    <p className="text-xs font-bold text-gray-700 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 leading-relaxed">
                      {sampleCRS.constraints}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex gap-2">
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl font-bold text-xs h-10 px-6 gap-2 transition-all active:scale-95">
                  <History className="w-4 h-4" />
                  History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl">
                <DialogHeader className="px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
                  <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-gray-900 tracking-tight">
                    <History className="w-5 h-5 text-primary" />
                    Audit Trail & History
                  </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50/30">
                  <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-gray-100">
                    {mockHistoryLogs.map((log) => (
                      <div key={log.id} className="relative flex gap-5 group">
                        <div className="relative z-10 shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                            {log.action === 'approved' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                              log.action === 'updated' ? <Edit className="w-5 h-5 text-orange-500" /> :
                                <Clock className="w-5 h-5 text-primary" />}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="font-bold text-gray-900 tracking-tight capitalize">
                              {log.action}
                            </p>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                              {log.formattedDate}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                            <span className="font-bold text-gray-900">{log.changed_by}</span> performed this action.
                          </p>

                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-xs text-gray-600 border border-gray-100 italic shadow-xs">
                            {log.summary}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="rounded-xl font-bold text-xs h-10 px-6"
            >
              Close
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="primary"
              className="rounded-xl font-bold text-xs h-10 px-8"
            >
              Get started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
