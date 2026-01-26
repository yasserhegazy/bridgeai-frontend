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
      className="relative flex flex-col justify-between p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Top: Name + Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <StatusBadge status={item.status} />
      </div>

      <p className="text-sm text-muted-foreground">
        Last update: {item.lastUpdate}
      </p>

      {/* Bottom: Members / Team + Dropdown */}
      <div className="flex items-center justify-between mt-4">
        {showAvatars ? (
          <AvatarList names={type === "team" ? item.members! : item.team!} />
        ) : (
          <div />
        )}
        {type === "team" && (
          <TeamActionsMenu
            teamId={item.id}
            teamName={item.name}
            teamStatus={item.status}
            teamDescription={item.description}
            onActionComplete={onItemsChange}
          />
        )}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

