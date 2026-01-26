/**
 * Empty State Component
 * Displays message when no data is available
 * Single Responsibility: Empty state UI
 */

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  message, 
  action, 
  className = "" 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 text-center ${className}`}>
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
