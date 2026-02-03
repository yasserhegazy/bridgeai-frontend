"use client";

import { useState, useRef, useEffect } from "react";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TeamListItemDTO } from "@/dto/teams.dto";

interface TeamSelectorProps {
  currentTeamName: string;
  currentTeamId: string;
  teams: TeamListItemDTO[];
  loading: boolean;
  onTeamSelect: (teamId: number) => void;
}

export function TeamSelector({
  currentTeamName,
  currentTeamId,
  teams,
  loading,
  onTeamSelect,
}: TeamSelectorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyVisited = filteredTeams.slice(0, 2);
  const moreTeams = filteredTeams.slice(2, 7);

  const handleSelect = (teamId: number) => {
    onTeamSelect(teamId);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between h-12 px-4 w-70 hover:bg-gray-100 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-[15px] sm:text-base font-medium text-gray-700">
            {currentTeamName}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 w-90 mt-2 bg-white shadow-xl border rounded-lg p-4 z-[100] min-h-[400px] flex flex-col">
          {/* Top bar */}
          <div className="flex items-center gap-2 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#341BAB]"
              />
            </div>
            <Button
              size="sm"
              className="flex items-center gap-1 bg-[#341BAB] text-white hover:bg-[#271080]"
              onClick={() => router.push("/teams")}
            >
              <Plus className="w-4 h-4" /> Create Team
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#341BAB]"></div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Users className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">
                {searchQuery ? "No teams found" : "No teams yet"}
              </p>
            </div>
          ) : (
            <>
              {/* Recently Visited */}
              {recentlyVisited.length > 0 && (
                <Section title="Recently Visited">
                  <ul className="flex flex-col gap-1 flex-1 max-h-60 overflow-y-auto pr-1">
                    {recentlyVisited.map((team) => (
                      <TeamItem
                        key={team.id}
                        name={team.name}
                        isActive={team.id === Number(currentTeamId)}
                        onClick={() => handleSelect(team.id)}
                      />
                    ))}
                  </ul>
                </Section>
              )}

              {/* More Teams */}
              {moreTeams.length > 0 && (
                <Section
                  title={recentlyVisited.length > 0 ? "More Teams" : "All Teams"}
                >
                  <ul className="flex flex-col gap-1 flex-1 max-h-60 overflow-y-auto pr-1">
                    {moreTeams.map((team) => (
                      <TeamItem
                        key={team.id}
                        name={team.name}
                        isActive={team.id === Number(currentTeamId)}
                        onClick={() => handleSelect(team.id)}
                      />
                    ))}
                  </ul>
                </Section>
              )}
            </>
          )}

          <div className="border-t pt-3 mt-3">
            <Link
              href="/teams"
              className="w-full text-center text-sm font-medium text-[#341BAB] hover:underline block"
              onClick={() => setOpen(false)}
            >
              View All Teams →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function TeamItem({
  name,
  isActive,
  onClick,
}: {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <li>
      <div
        onClick={onClick}
        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
          isActive ? "bg-[#edeaff]" : "hover:bg-[#f5f3ff]"
        }`}
      >
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-medium text-gray-700 hover:text-[#341BAB]">
          <Users className="w-4 h-4 text-gray-500 shrink-0" /> {name}
        </div>
        <div className="shrink-0">
          <button
            className="p-1 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
            title="Team Settings"
          >
            <Settings className="w-4 h-4 text-gray-500 cursor-pointer" />
          </button>
        </div>
      </div>
    </li>
  );
}
