"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ChevronRight, Laptop, Shield, User, Zap,
  AlertCircle, HelpCircle, FileText, Info, Target,
  Clock, DollarSign, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CRSContentDisplayProps {
  content?: string;
  crsData?: any; // Pre-parsed data for direct reactivity
}

export function CRSContentDisplay({ content, crsData: providedCrsData }: CRSContentDisplayProps) {
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());
  const [activeStreamingField, setActiveStreamingField] = useState<string | null>(null);
  const prevContentRef = useRef<any>(null);

  const crsData = useMemo(() => {
    if (providedCrsData) return providedCrsData;
    if (!content) return null;
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      return null;
    }
  }, [content, providedCrsData]);

  // Track field changes for highlight effect
  useEffect(() => {
    if (!crsData) return;

    const newFields = new Set<string>();
    const checkFields = (obj: any, prefix = '') => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (Array.isArray(obj[key])) {
            obj[key].forEach((item: any, idx: number) => {
              if (item) newFields.add(`${prefix}${key}.${idx}`);
            });
          } else {
            checkFields(obj[key], `${prefix}${key}.`);
          }
        } else if (obj[key] && obj[key] !== "Not specified" && obj[key] !== "None" && obj[key] !== "") {
          newFields.add(`${prefix}${key}`);
        }
      }
    };
    checkFields(crsData);

    // Detect which field is currently "streaming" (changing)
    if (prevContentRef.current) {
      const findActiveField = (current: any, prev: any, prefix = '') => {
        for (const key in current) {
          if (current[key] !== prev[key]) {
            if (typeof current[key] === 'string' && current[key].length > (prev[key]?.length || 0)) {
              return `${prefix}${key}`;
            }
            if (typeof current[key] === 'object' && current[key] !== null) {
              return findActiveField(current[key], prev[key] || {}, `${prefix}${key}.`);
            }
          }
        }
        return null;
      };
      const active = findActiveField(crsData, prevContentRef.current);
      setActiveStreamingField(active);

      // Clear active streaming field after a short delay if no more updates
      const timer = setTimeout(() => setActiveStreamingField(null), 1000);
      return () => clearTimeout(timer);
    }
    prevContentRef.current = crsData;

    setHighlightedFields(prev => {
      const diff = Array.from(newFields).filter(f => !prev.has(f));
      if (diff.length > 0) {
        // We keep the old ones to avoid flickering, but the animations handle the "new" feel
        return new Set([...prev, ...diff]);
      }
      return prev;
    });
  }, [crsData]);

  if (!crsData) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No specification data available yet.</p>
        <div className="mt-4 text-[10px] text-gray-400 font-mono truncate max-w-xs mx-auto">
          {content?.substring(0, 100)}...
        </div>
      </div>
    );
  }

  const HighlightWrapper = ({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) => {
    const isNew = highlightedFields.has(id);
    return (
      <motion.div
        animate={isNew ? { backgroundColor: ['rgba(52, 27, 171, 0.08)', 'rgba(52, 27, 171, 0)'] } : {}}
        transition={{ duration: 2.5 }}
        className={cn("rounded-md transition-all duration-700", className)}
      >
        {children}
      </motion.div>
    );
  };

  const RevealText = ({ value, placeholder, id, className }: { value?: string, placeholder: string, id: string, className?: string }) => {
    const isStreaming = activeStreamingField === id;

    return (
      <HighlightWrapper id={id}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("text-sm relative inline-block", value ? "text-gray-600" : "text-gray-400 italic", className)}
          >
            {value || placeholder}
            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-1.5 h-4 bg-primary/40 ml-0.5 align-middle rounded-sm"
              />
            )}
          </motion.span>
        </AnimatePresence>
      </HighlightWrapper>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Topic */}
      <div className="relative">
        <HighlightWrapper id="project_title">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={crsData.project_title || crsData.project_details?.name || 'empty'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative inline-block"
              >
                {crsData.project_title || crsData.project_details?.name || "Drafting Project Identity..."}
                {activeStreamingField === 'project_title' && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="inline-block w-2 h-6 bg-primary/40 ml-1 align-middle rounded-sm"
                  />
                )}
              </motion.span>
            </AnimatePresence>
          </h3>
        </HighlightWrapper>
        <div className="h-1 w-12 bg-primary/20 rounded-full" />
      </div>

      {/* Project Description */}
      <section>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Info className="w-3 h-3 text-primary/40" /> Executive Summary
        </h4>
        <div className="pl-5 border-l-2 border-gray-100">
          <RevealText
            id="project_description"
            value={crsData.project_description || crsData.project_details?.description}
            placeholder="Synthesizing project vision and core objectives..."
            className="leading-relaxed block"
          />
        </div>
      </section>

      {/* Objectives */}
      <section>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Target className="w-3 h-3 text-primary/40" /> Strategic Objectives
        </h4>
        <HighlightWrapper id="project_objectives" className="pl-5">
          {crsData.project_objectives && crsData.project_objectives.length > 0 ? (
            <ul className="space-y-2">
              {crsData.project_objectives.map((obj: string, idx: number) => (
                <motion.li
                  key={`${idx}-${obj}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-gray-600 flex items-start gap-2"
                >
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
                  <span>{obj}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Defining success metrics...</p>
          )}
        </HighlightWrapper>
      </section>

      {/* Target Users */}
      <section>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <User className="w-3 h-3 text-primary/40" /> Target Users
        </h4>
        <HighlightWrapper id="target_users" className="pl-5">
          {crsData.target_users && (Array.isArray(crsData.target_users) ? crsData.target_users.length > 0 : !!crsData.target_users) ? (
            Array.isArray(crsData.target_users) ? (
              <ul className="space-y-2">
                {crsData.target_users.map((user: string, idx: number) => (
                  <motion.li key={`${idx}-${user}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
                    <span>{user}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">{crsData.target_users}</p>
            )
          ) : (
            <p className="text-sm text-gray-400 italic">Identifying user personas...</p>
          )}
        </HighlightWrapper>
      </section>

      {/* Capabilities */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary/40" /> Functional Capabilities
          </h4>
          <span className="text-[10px] text-gray-300 font-medium">
            {crsData.functional_requirements?.length || 0} Artifacts
          </span>
        </div>

        <HighlightWrapper id="functional_requirements" className="space-y-3">
          {crsData.functional_requirements && crsData.functional_requirements.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {crsData.functional_requirements.map((req: any, idx: number) => {
                const isObj = typeof req === "object" && req !== null;
                const reqId = isObj ? (req.id || `F-${idx + 1}`) : `F-${idx + 1}`;
                return (
                  <motion.div
                    key={`${reqId}-${idx}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] font-black text-primary/60 tracking-wider font-mono bg-primary/5 px-2 py-0.5 rounded">
                        {isObj ? req.id : `REQ-${idx + 1}`}
                      </span>
                      {isObj && req.priority && (
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full",
                          req.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        )}>
                          {req.priority}
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-gray-900 mb-1">
                      {isObj ? (req.title || "Untitled Requirement") : req}
                    </h5>
                    {isObj && req.description && (
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {req.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50/50 border border-dashed border-gray-100 rounded-xl p-8 text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Identifying core functionality...</p>
            </div>
          )}
        </HighlightWrapper>
      </section>

      {/* Non-Functional Requirements Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">Non-Functional Requirements</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5"><Shield className="w-3 h-3 text-primary/40" /> Security</h5>
            <HighlightWrapper id="security_requirements">
              {crsData.security_requirements?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {crsData.security_requirements.map((req: string, idx: number) => (
                    <motion.li key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-gray-600 leading-tight">{req}</motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-400 italic">Analyzing security needs...</p>
              )}
            </HighlightWrapper>
          </div>

          <div>
            <h5 className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3 text-primary/40" /> Performance</h5>
            <HighlightWrapper id="performance_requirements">
              {crsData.performance_requirements?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {crsData.performance_requirements.map((req: string, idx: number) => (
                    <motion.li key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-gray-600 leading-tight">{req}</motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-400 italic">Determining requirements...</p>
              )}
            </HighlightWrapper>
          </div>

          <div>
            <h5 className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5"><Laptop className="w-3 h-3 text-primary/40" /> Scalability</h5>
            <HighlightWrapper id="scalability_requirements">
              {crsData.scalability_requirements?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {crsData.scalability_requirements.map((req: string, idx: number) => (
                    <motion.li key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-gray-600 leading-tight">{req}</motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-400 italic">Mapping growth...</p>
              )}
            </HighlightWrapper>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Laptop className="w-3 h-3 text-primary/40" /> Recommended Stack
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'frontend', label: 'Frontend', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
            { key: 'backend', label: 'Backend', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
            { key: 'database', label: 'Database', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
            { key: 'other', label: 'Infrastructure', bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-700' }
          ].map((stack) => (
            <div key={stack.key} className={cn(stack.bg, stack.border, "border rounded-lg p-3")}>
              <span className="text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-60">{stack.label}</span>
              <HighlightWrapper id={`technology_stack.${stack.key}`}>
                {crsData.technology_stack?.[stack.key]?.length > 0 ? (
                  <p className={cn("text-xs font-semibold", stack.text)}>{crsData.technology_stack[stack.key].join(", ")}</p>
                ) : (
                  <p className="text-[10px] text-gray-400 italic">Pending...</p>
                )}
              </HighlightWrapper>
            </div>
          ))}
        </div>
      </div>

      {/* Constraints Footer */}
      <div className="pt-8 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'timeline_constraints', label: 'Timeline', icon: <Clock className="w-3 h-3 text-primary/40" />, placeholder: 'Negotiating...' },
          { id: 'budget_constraints', label: 'Budget', icon: <DollarSign className="w-3 h-3 text-primary/40" />, placeholder: 'Estimating...' },
          { id: 'target_users_count', label: 'Scale', icon: <Zap className="w-3 h-3 text-primary/40" />, placeholder: 'Quantifying...' },
          { id: 'risks_summary', label: 'Risks', icon: <AlertTriangle className="w-3 h-3 text-primary/40" />, placeholder: 'Identifying...' }
        ].map(item => (
          <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              {item.icon} {item.label}
            </span>
            <RevealText
              id={item.id}
              value={Array.isArray(crsData[item.id]) ? crsData[item.id][0] : crsData[item.id]}
              placeholder={item.placeholder}
              className="text-[11px] font-bold"
            />
          </div>
        ))}
      </div>

      {/* Success Metrics & Acceptance Criteria */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-primary/40" /> Validation & Success
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <HighlightWrapper id="success_metrics">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Success Metrics</h5>
            {crsData.success_metrics?.length > 0 ? (
              <ul className="space-y-2">
                {crsData.success_metrics.map((m: string, i: number) => (
                  <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-600 flex items-start gap-2">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-green-300 flex-shrink-0" />
                    <span>{m}</span>
                  </motion.li>
                ))}
              </ul>
            ) : <p className="text-[11px] text-gray-400 italic px-1">Defining success criteria...</p>}
          </HighlightWrapper>

          <HighlightWrapper id="acceptance_criteria">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Acceptance Criteria</h5>
            {crsData.acceptance_criteria?.length > 0 ? (
              <ul className="space-y-2">
                {crsData.acceptance_criteria.map((c: string, i: number) => (
                  <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-600 flex items-start gap-2">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-primary/30 flex-shrink-0" />
                    <span>{c}</span>
                  </motion.li>
                ))}
              </ul>
            ) : <p className="text-[11px] text-gray-400 italic px-1">Awaiting criteria...</p>}
          </HighlightWrapper>
        </div>
      </div>

      {/* Out of Scope & Notes */}
      <div className="pt-8 grid grid-cols-1 gap-4">
        <HighlightWrapper id="out_of_scope" className="bg-slate-50 border border-slate-100 rounded-xl p-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Extended Boundaries (Out of Scope)</h4>
          {crsData.out_of_scope?.length > 0 ? (
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{crsData.out_of_scope.join(". ")}</p>
          ) : <p className="text-[10px] text-slate-300 italic">Not defined yet.</p>}
        </HighlightWrapper>

        <div className="pt-4 border-t border-gray-50 text-center opacity-40">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">End of Technical Specification</span>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}
