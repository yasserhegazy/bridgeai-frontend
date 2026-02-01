export function StatusBadge({ status }: { status: string }) {
  const statusStyles: { [key: string]: { text: string; bg: string } } = {
    Active: { text: "text-green-700", bg: "bg-green-100" },
    Completed: { text: "text-primary", bg: "bg-primary/10" },
    Pending: { text: "text-secondary", bg: "bg-secondary/10" },
    Approved: { text: "text-green-800", bg: "bg-green-200" },
    Rejected: { text: "text-red-800", bg: "bg-red-200" },
    Inactive: { text: "text-red-700", bg: "bg-red-100" },
    Archived: { text: "text-gray-700", bg: "bg-gray-100" },
  };

  // Capitalize first letter to match keys
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const style = statusStyles[formattedStatus] || { text: "text-gray-700", bg: "bg-gray-100" };

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${style.text} ${style.bg}`}>
      {formattedStatus}
    </div>
  );
}
