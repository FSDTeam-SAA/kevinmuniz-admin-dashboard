"use client";

import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatusDropdownProps {
    currentStatus: "pending" | "accepted" | "rejected";
    onStatusChange: (newStatus: "accepted" | "rejected") => void;
    isLoading?: boolean;
}

export default function StatusDropdown({
    currentStatus,
    onStatusChange,
    isLoading,
}: StatusDropdownProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "accepted":
                return { label: "Accept", className: "bg-[#0BB05F] hover:bg-[#099650] !text-white hover:!text-white" };
            case "rejected":
                return { label: "Reject", className: "bg-[#FF3D00] hover:bg-[#E63700] !text-white hover:!text-white" };
            case "pending":
                return { label: "Pending", className: "bg-[#FFB100] hover:bg-[#E69F00] !text-white hover:!text-white" };
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
                        "h-8 min-w-[80px] rounded-[4px] px-3 py-1 text-xs font-semibold gap-1",
                        config.className
                    )}
                >
                    {isLoading ? (
                        <Skeleton className="h-3 w-12 rounded-full bg-white/40" />
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
                    disabled={currentStatus === "accepted"}
                    onClick={() => onStatusChange("accepted")}
                >
                    Accept
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-[#FF3D00] focus:text-[#FF3D00] focus:bg-[#FF3D00]/10 font-medium"
                    disabled={currentStatus === "rejected"}
                    onClick={() => onStatusChange("rejected")}
                >
                    Reject
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
