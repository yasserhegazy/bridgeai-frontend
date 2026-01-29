/**
 * Loading Spinner Component
 * Reusable loading indicator with smooth animations
 * Single Responsibility: Display loading state
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className = "", 
  message 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        {/* Outer spinning ring */}
        <div 
          className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {/* Inner pulsing dot */}
        <div className={`absolute inset-0 m-auto ${size === 'lg' ? 'h-3 w-3' : size === 'md' ? 'h-2 w-2' : 'h-1.5 w-1.5'} bg-blue-600 rounded-full animate-pulse`} />
      </div>
      {message && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
