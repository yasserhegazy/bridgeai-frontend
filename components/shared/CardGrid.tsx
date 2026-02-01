/**
 * Card Grid Component
 * Displays items in a responsive grid layout
 * Refactored for performance and SOLID principles
 * Single Responsibility: Grid layout for cards
 */

"use client";

import { useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AvatarList } from "./AvatarList";
import { StatusBadge } from "./StatusBadge";
import { TeamActionsMenu } from "@/components/teams/TeamActionsMenu";

interface CardItem {
  id: number;
  name: string;
  lastUpdate: string;
  members?: string[];
  team?: string[];
  status: string;
  description?: string;
}

interface CardGridProps<T extends CardItem> {
  items: T[];
  type?: "project" | "team";
  showAvatars?: boolean;
  onItemsChange?: () => void;
}

/**
 * Individual Card Component - Memoized for performance
 */
const GridCard = memo(function GridCard<T extends CardItem>({
  item,
  type,
  showAvatars,
  onItemsChange,
  onCardClick,
}: {
  item: T;
  type: "project" | "team";
  showAvatars: boolean;
  onItemsChange?: () => void;
  onCardClick: (id: number) => void;
}) {
  const handleClick = useCallback(() => {
    onCardClick(item.id);
  }, [item.id, onCardClick]);

  return (
    <Card
      className="relative flex flex-col h-full p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-primary/20 bg-white hover-lift overflow-hidden"
      onClick={handleClick}
    >
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Name + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight flex-1">
            {item.name}
          </h2>
          <StatusBadge status={item.status} />
        </div>

        {/* Description (for teams) */}
        {type === "team" && (
          <div className="mb-4 flex-1">
            {item.description ? (
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No description provided
              </p>
            )}
          </div>
        )}

        {/* Last update */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Updated {item.lastUpdate}</span>
        </div>

        {/* Footer: Members (teams only) + Actions */}
        <div className="flex items-center justify-between mt-auto">
          {type === "team" ? (
            <>
              <div className="flex items-center gap-3">
                {showAvatars && item.members && item.members.length > 0 ? (
                  <>
                    <AvatarList names={item.members} />
                    <span className="text-xs text-gray-500 font-medium">
                      {item.members.length} {item.members.length === 1 ? 'member' : 'members'}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400 italic">No members</span>
                )}
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <TeamActionsMenu
                  teamId={item.id}
                  teamName={item.name}
                  teamStatus={item.status}
                  teamDescription={item.description}
                  onActionComplete={onItemsChange}
                />
              </div>
            </>
          ) : (
            <div className="w-full" />
          )}
        </div>
      </div>
    </Card>
  );
});

/**
 * Card Grid Component
 */
export function CardGrid<T extends CardItem>({
  items,
  type = "project",
  showAvatars = true,
  onItemsChange,
}: CardGridProps<T>) {
  const router = useRouter();

  const handleCardClick = useCallback(
    (id: number) => {
      if (type === "team") {
        router.push(`/teams/${id}/dashboard`);
      } else {
        router.push(`/projects/${id}`);
      }
    },
    [type, router]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
      {items.map((item) => (
        <GridCard
          key={item.id}
          item={item}
          type={type}
          showAvatars={showAvatars}
          onItemsChange={onItemsChange}
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  );
}

