/**
 * Error State Component
 * Displays error message with optional retry action and smooth animations
 * Single Responsibility: Error state UI
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export function ErrorState({ message, onRetry, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 animate-in fade-in duration-500">
      <div className="bg-red-50 rounded-full p-6 mb-6 animate-in zoom-in duration-300">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {message}
      </p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}
