"use client";

import { ChevronDown, LoaderCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActiveStatusDropdownProps {
    currentStatus: "active" | "inactive";
    onStatusChange: (newStatus: "active" | "inactive") => void;
    isLoading?: boolean;
}

export default function ActiveStatusDropdown({
    currentStatus,
    onStatusChange,
    isLoading,
}: ActiveStatusDropdownProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "active":
                return {
                    label: "Active",
                    className: "bg-[#0BB05F] hover:bg-[#099650] !text-white hover:!text-white",
                };
            case "inactive":
                return {
                    label: "Inactive",
                    className: "bg-[#6B7280] hover:bg-[#4B5563] !text-white hover:!text-white",
                };
            default:
                return { label: status, className: "bg-gray-100" };
        }
    };

    const config = getStatusConfig(currentStatus);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={isLoading}
                    className={cn(
                        "h-8 min-w-[90px] rounded-[4px] px-3 py-1 text-xs font-semibold gap-1",
                        config.className
                    )}
                >
                    {isLoading ? (
                        <LoaderCircle className="h-3 w-3 animate-spin" />
                    ) : (
                        <>
                            {config.label}
                            <ChevronDown className="h-3 w-3" />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-[8px]">
                <DropdownMenuItem
                    className="text-[#0BB05F] focus:text-[#0BB05F] focus:bg-[#0BB05F]/10 font-medium"
                    disabled={currentStatus === "active"}
                    onClick={() => onStatusChange("active")}
                >
                    Active
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-[#6B7280] focus:text-[#6B7280] focus:bg-[#6B7280]/10 font-medium"
                    disabled={currentStatus === "inactive"}
                    onClick={() => onStatusChange("inactive")}
                >
                    Inactive
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
