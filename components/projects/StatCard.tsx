/**
 * StatCard Component
 * Displays project statistics
 * Single Responsibility: Stats UI rendering
 */

"use client";

interface StatCardProps {
  title: string;
  value: number;
  statusCounts?: { [key: string]: number };
  icon?: React.ReactNode;
}

const statusColors: { [key: string]: string } = {
  Active: "bg-green-200 text-black",
  Completed: "bg-blue-200 text-black",
  Pending: "bg-yellow-200 text-black",
  Cancelled: "bg-red-200 text-black",
};

export function StatCard({ title, value, statusCounts, icon }: StatCardProps) {
  return (
    <div className="relative p-5 rounded-2xl bg-[#eceded]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl text-black">{icon}</div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <div className="text-3xl font-bold text-black">{value}</div>
      </div>
      {statusCounts && (
        <div className="flex flex-col gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center text-sm">
              <span className="text-black">{status}</span>
              <span
                className={`px-2 py-1 rounded-full font-semibold text-xs ${
                  statusColors[status] || "bg-gray-300 text-black"
                }`}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
