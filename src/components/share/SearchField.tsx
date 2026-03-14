"use client";

import type { ChangeEventHandler } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchFieldProps = {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  className,
  inputClassName,
}: SearchFieldProps) {
  return (
    <div className={cn("relative w-full sm:w-72", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "h-[40px] rounded-full border-[#E5E7EB] bg-white pl-10 focus-visible:ring-[#33BAFF]",
          inputClassName
        )}
      />
    </div>
  );
}
