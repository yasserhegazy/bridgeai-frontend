"use client";

import { useState, useEffect } from "react";
import { Bell, ChevronDown, ChevronUp, Search, Plus, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLORS } from "@/constants";
import { geistSans } from "@/fonts";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { apiCall } from "@/lib/api";
import { getCookie } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";

interface Team {
  id: string;
  name: string;
}

interface HeaderProps {
  currentTeamId?: string;
  setCurrentTeamId?: (id: string) => void;
}

export function Header({ currentTeamId: initialTeamId, setCurrentTeamId: setParentTeamId }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading state
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check for authentication token in cookies
    const checkAuth = () => {
      const token = getCookie("token");
      setIsAuthenticated(!!token);
    };

    // Initial check
    checkAuth();

    // Listen for auth state changes
    window.addEventListener('auth-state-changed', checkAuth);

    // Cleanup listener
    return () => {
      window.removeEventListener('auth-state-changed', checkAuth);
    };
  }, []);

  // Fetch teams when authenticated
  useEffect(() => {
    const fetchTeams = async () => {
      if (!isAuthenticated) {
        setTeams([]);
        setLoadingTeams(false);
        return;
      }

      try {
        setLoadingTeams(true);
        const data = await apiCall<Team[]>('/api/teams');
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [isAuthenticated]);

  // Local state for current team
  const [currentTeamId, setCurrentTeamId] = useState(initialTeamId || pathname.split("/")[2] || "");

  // Current team name for display
  const currentTeam = teams.find(t => t.id === currentTeamId)?.name || "Select Team";

  // Keep parent in sync
  useEffect(() => {
    if (initialTeamId) setCurrentTeamId(initialTeamId);
  }, [initialTeamId]);

  const handleTeamSelect = (team: Team) => {
    setCurrentTeamId(team.id);
    if (setParentTeamId) setParentTeamId(team.id);
    router.push(`/teams/${team.id}/dashboard`);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyVisited = filteredTeams.slice(0, 2);
  const moreTeams = filteredTeams.slice(2);

  return (
    <header className="fixed top-0 left-0 w-full h-12 px-4 sm:px-3 bg-white border-b z-50 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center h-full">
          <span className={`font-bold ${geistSans.variable} text-lg sm:text-xl`} style={{ color: COLORS.primary, lineHeight: 1 }}>
            BridgeAI
          </span>
        </Link>

        {pathname !== "/teams" && isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between h-12 px-4 w-50 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-[15px] sm:text-base font-medium text-gray-700">{currentTeam}</span>
              </div>
              {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>

            {open && (
              <div className="absolute top-8 left-0 w-90 mt-4 bg-white shadow-md border rounded-lg p-4 z-50 min-h-[400px] flex flex-col">
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
                    onClick={() => router.push('/teams')}
                  >
                    <Plus className="w-4 h-4" /> Create Team
                  </Button>
                </div>

                {loadingTeams ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#341BAB]"></div>
                  </div>
                ) : filteredTeams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mb-2 opacity-30" />
                    <p className="text-sm">
                      {searchQuery ? 'No teams found' : 'No teams yet'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Recently Visited */}
                    {recentlyVisited.length > 0 && (
                      <Section title="Recently Visited">
                        <ul className="flex flex-col gap-1 flex-1 max-h-60 overflow-y-auto pr-1">
                          {recentlyVisited.map(team => (
                            <TeamItem
                              key={team.id}
                              name={team.name}
                              isActive={team.id === currentTeamId}
                              onClick={() => handleTeamSelect(team)}
                            />
                          ))}
                        </ul>
                      </Section>
                    )}

                    {/* More Teams */}
                    {moreTeams.length > 0 && (
                      <Section title={recentlyVisited.length > 0 ? "More Teams" : "All Teams"}>
                        <ul className="flex flex-col gap-1 flex-1 max-h-60 overflow-y-auto pr-1">
                          {moreTeams.map(team => (
                            <TeamItem
                              key={team.id}
                              name={team.name}
                              isActive={team.id === currentTeamId}
                              onClick={() => handleTeamSelect(team)}
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
                    onClick={handleClose}
                  >
                    View All Teams →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated === null ? (
          // Loading state - show nothing or a skeleton to prevent flash
          <div className="w-20 h-8" /> // Empty space while loading
        ) : isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <NotificationBell />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="rounded-full w-8 h-8 flex items-center justify-center p-0 cursor-pointer hover:opacity-80 transition-opacity" 
                  style={{ backgroundColor: COLORS.primary, color: COLORS.textLight }}
                  onClick={() => router.push("/profile")}
                >
                  <span className="font-semibold text-sm">KJ</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  className="text-sm cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-sm text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    // Clear token and role from cookies
                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                    // Update authentication state
                    setIsAuthenticated(false);
                    // Dispatch auth state change event
                    window.dispatchEvent(new Event('auth-state-changed'));
                    // Redirect to login page
                    router.push("/login");
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            {pathname === "/register" ? (
              <Button 
                variant="primary"
                size="sm" 
                onClick={() => router.push("/login")}
                className="flex items-center gap-2"
              >
                Login
              </Button>
            ) : pathname === "/login" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/register")}
                className="flex items-center gap-2"
              >
                Register
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/register")}
                  className="flex items-center gap-2"
                >
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

// Section & TeamItem (unchanged)
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">{title}</h4>
      {children}
    </div>
  );
}

function TeamItem({ name, isActive, onClick }: { name: string; isActive?: boolean; onClick?: () => void }) {
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
          <button className="p-1 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center" title="Team Settings">
            <Settings className="w-4 h-4 text-gray-500 cursor-pointer" />
          </button>
        </div>
      </div>
    </li>
  );
}

interface HeaderButtonProps {
  icon: any;
  label: string;
  badge?: string;
}

function HeaderButton({ icon: Icon, label, badge }: HeaderButtonProps) {
  return (
    <div className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 cursor-pointer" title={label}>
      <Icon className="w-4 h-4" />
      {badge && (
        <span className="absolute -top-1 -right-2 text-[10px] font-semibold rounded-full px-1 text-white" style={{ backgroundColor: "#341BAB" }}>
          {badge}
        </span>
      )}
    </div>
  );
}
