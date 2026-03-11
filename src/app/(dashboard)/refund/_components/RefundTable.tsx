import { Eye, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefundDonation } from "../types";

interface RefundTableProps {
    donations: RefundDonation[];
    activeTab: "refunded" | "pending";
    onStatusClick: (donation: RefundDonation) => void;
}

export function RefundTable({ donations, activeTab, onStatusClick }: RefundTableProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "refunded":
                return { label: "Refund", className: "bg-[#FF3D00] hover:bg-[#E63700] text-white" }; // Red like Reject/Refunded
            case "pending":
                return { label: "Pending", className: "bg-[#FFB100] hover:bg-[#E69F00] text-white" }; // Amber
            case "review":
                return { label: "Review", className: "bg-[#33BAFF] hover:bg-[#2AA5E5] text-white" }; // Blue like Campaign accepts
            default:
                return { label: status, className: "bg-gray-100 text-gray-800" };
        }
    };

    const getInteractiveStatusBadge = (donation: RefundDonation) => {
        const config = getStatusConfig(donation.refundStatus);

        if (activeTab === "refunded") {
            return (
                <span
                    className={cn(
                        "inline-flex items-center justify-center h-8 min-w-[80px] rounded-[4px] px-3 py-1 text-xs font-semibold whitespace-nowrap",
                        config.className
                    )}
                >
                    {config.label}
                </span>
            );
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            "h-8 min-w-[80px] rounded-[4px] px-3 py-1 text-xs font-semibold gap-1 whitespace-nowrap",
                            config.className
                        )}
                    >
                        {config.label}
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-[8px] min-w-[120px]">
                    <DropdownMenuItem
                        className="text-[#FFB100] focus:text-[#FFB100] focus:bg-[#FFB100]/10 font-medium cursor-pointer"
                        onClick={() => onStatusClick({ ...donation, refundStatus: "pending" })}
                    >
                        Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-[#33BAFF] focus:text-[#33BAFF] focus:bg-[#33BAFF]/10 font-medium cursor-pointer"
                        onClick={() => onStatusClick({ ...donation, refundStatus: "review" })}
                    >
                        Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-[#FF3D00] focus:text-[#FF3D00] focus:bg-[#FF3D00]/10 font-medium cursor-pointer"
                        onClick={() => onStatusClick({ ...donation, refundStatus: "refunded" })}
                    >
                        Refunded
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    if (donations.length === 0) {
        return (
            <div className="text-center py-10 border mt-6 rounded-md text-muted-foreground bg-white">
                No {activeTab} refund requests found.
            </div>
        );
    }

    return (
        <div className="rounded-[20px] bg-transparent overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Title/Name</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Campaign Name</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Email</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12 whitespace-nowrap">Given Date</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Status</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Amount</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {donations.map((donation) => {
                        const dateStr = donation.refundRequestedAt || donation.createdAt;
                        let formattedDate = "—";
                        if (dateStr) {
                            const d = new Date(dateStr);
                            const day = d.getDate().toString().padStart(2, "0");
                            const month = (d.getMonth() + 1).toString().padStart(2, "0");
                            const year = d.getFullYear().toString().slice(-2);
                            formattedDate = `${day}/${month}/${year}`;
                        }

                        let campaignTitle = donation.campaignId.title || "";
                        if (campaignTitle.length > 20) {
                            campaignTitle = campaignTitle.substring(0, 20) + "...";
                        }

                        return (
                            <TableRow key={donation._id} className="hover:bg-slate-50/50 border-b border-[#F0F0F0]">
                                <TableCell className="text-left font-medium text-[#1E1E1E] max-w-[300px] truncate">
                                    {donation.donorId.firstName} {donation.donorId.lastName}
                                </TableCell>
                                <TableCell className="text-left text-[#5C5C5C]">
                                    {campaignTitle}
                                </TableCell>
                                <TableCell className="text-left text-[#5C5C5C]">
                                    {donation.donorId.email}
                                </TableCell>
                                <TableCell className="text-left text-[#5C5C5C]">
                                    {formattedDate}
                                </TableCell>
                                <TableCell className="text-left">
                                    {getInteractiveStatusBadge(donation)}
                                </TableCell>
                                <TableCell className="text-left text-[#5C5C5C]">
                                    {donation.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-left">
                                    <div className="flex items-center justify-start gap-3">
                                        <Link
                                            href={`/campaigns/${donation.campaignId._id}`}
                                            className="p-2 text-gray-400 hover:text-[#33BAFF] transition-colors"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
