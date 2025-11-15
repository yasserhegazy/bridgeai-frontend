import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-10 bg-white border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#341BAB]"
      />
    </div>
  );
}
