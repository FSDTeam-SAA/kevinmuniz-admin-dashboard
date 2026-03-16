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
import { RepresentationStatus } from "../types";

interface StatusDropdownProps {
    status: RepresentationStatus;
    onStatusChange: (newStatus: RepresentationStatus) => void;
    isLoading?: boolean;
}

const STATUS_OPTIONS: RepresentationStatus[] = ["pending", "approved", "rejected"];

const getStatusConfig = (status: RepresentationStatus) => {
    switch (status) {
        case "approved":
            return {
                label: "Approved",
                className: "bg-[#0BB05F] hover:bg-[#099650] !text-white hover:!text-white",
                itemClassName: "text-[#0BB05F] focus:text-[#0BB05F] focus:bg-[#0BB05F]/10",
            };
        case "rejected":
            return {
                label: "Rejected",
                className: "bg-[#FF3D00] hover:bg-[#E63700] !text-white hover:!text-white",
                itemClassName: "text-[#FF3D00] focus:text-[#FF3D00] focus:bg-[#FF3D00]/10",
            };
        case "pending":
        default:
            return {
                label: "Pending",
                className: "bg-[#FFB100] hover:bg-[#E69F00] !text-white hover:!text-white",
                itemClassName: "text-[#FFB100] focus:text-[#FFB100] focus:bg-[#FFB100]/10",
            };
    }
};

export default function StatusDropdown({
    status,
    onStatusChange,
    isLoading,
}: StatusDropdownProps) {
    const config = getStatusConfig(status);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={isLoading}
                    className={cn(
                        "h-8 min-w-[95px] rounded-[4px] px-3 py-1 text-xs font-semibold gap-1",
                        config.className
                    )}
                >
                    {isLoading ? (
                        <Skeleton className="h-3 w-14 rounded-full bg-white/40" />
                    ) : (
                        <>
                            {config.label}
                            <ChevronDown className="h-3 w-3" />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-[8px]">
                {STATUS_OPTIONS.map((option) => {
                    const optConfig = getStatusConfig(option);
                    return (
                        <DropdownMenuItem
                            key={option}
                            disabled={status === option}
                            onClick={() => onStatusChange(option)}
                            className={cn("font-medium", optConfig.itemClassName)}
                        >
                            {optConfig.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
