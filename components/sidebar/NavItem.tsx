"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed: boolean;
}

export function NavItem({ href, label, icon: Icon, isActive, isCollapsed }: NavItemProps) {
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const iconRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    // Only show tooltip when collapsed
    if (isCollapsed && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 20,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
  };

  const tooltip = tooltipPos ? (
    <span
      className="fixed whitespace-nowrap rounded px-2 py-1 text-sm text-white pointer-events-none z-[9999] opacity-100 transition-opacity"
      style={{
        backgroundColor: "#341BAB",
        top: tooltipPos.top,
        left: tooltipPos.left,
        transform: "translateY(-50%)",
      }}
    >
      {label}
    </span>
  ) : null;

  return (
    <div className="relative w-full">
      <a
        href={href}
        ref={iconRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center rounded-lg px-3 py-2 transition-colors ${
          isActive 
            ? "text-white" 
            : "text-white/80 hover:text-white hover:bg-white/10"
        } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
        style={{ backgroundColor: isActive ? "#6C63FF" : "transparent" }}
        aria-label={label}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </a>

      {isCollapsed && tooltip && createPortal(tooltip, document.body)}
    </div>
  );
}
