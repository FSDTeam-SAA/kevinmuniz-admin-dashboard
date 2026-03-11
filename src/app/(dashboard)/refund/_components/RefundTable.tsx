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
import { Badge } from "@/components/ui/badge";
import { RefundDonation } from "../types";

interface RefundTableProps {
    donations: RefundDonation[];
    activeTab: "refunded" | "pending";
    onStatusClick: (donation: RefundDonation) => void;
}

export function RefundTable({ donations, activeTab, onStatusClick }: RefundTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "refunded":
                return (
                    <Badge className="bg-[#FFB6C1]/30 text-[#FF6B81] hover:bg-[#FFB6C1]/40 border-none px-4 py-1 rounded-sm uppercase text-[10px] tracking-wider font-semibold">
                        Refund
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-[#FCD34D]/30 text-[#F59E0B] hover:bg-[#FCD34D]/40 border-none px-4 py-1 rounded-sm uppercase text-[10px] tracking-wider font-semibold">
                        Pending
                    </Badge>
                );
            case "review":
                return (
                    <Badge className="bg-[#93C5FD]/30 text-[#3B82F6] hover:bg-[#93C5FD]/40 border-none px-4 py-1 rounded-sm uppercase text-[10px] tracking-wider font-semibold">
                        Review
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getInteractiveStatusBadge = (donation: RefundDonation) => {
        if (activeTab === "refunded") {
            return getStatusBadge(donation.refundStatus);
        }

        return (
            <div
                className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => onStatusClick(donation)}
            >
                {getStatusBadge(donation.refundStatus)}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
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
        <div className="rounded-md border mt-6 bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-[#F8F9FA]">
                    <TableRow className="border-b-[#E5E7EB]">
                        <TableHead className="font-semibold text-black h-12">Title/Name</TableHead>
                        <TableHead className="font-semibold text-black h-12">Campaign Name</TableHead>
                        <TableHead className="font-semibold text-black h-12">Email</TableHead>
                        <TableHead className="font-semibold text-black h-12 whitespace-nowrap">Given Date</TableHead>
                        <TableHead className="font-semibold text-black h-12">Status</TableHead>
                        <TableHead className="font-semibold text-black h-12">Amount</TableHead>
                        <TableHead className="font-semibold text-black h-12">Action</TableHead>
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
                            <TableRow key={donation._id} className="border-b-[#E5E7EB]">
                                <TableCell className="font-medium text-[#4B5563] h-[60px] whitespace-nowrap">
                                    {donation.donorId.firstName} {donation.donorId.lastName}
                                </TableCell>
                                <TableCell className="text-[#4B5563]">
                                    {campaignTitle}
                                </TableCell>
                                <TableCell className="text-[#4B5563]">
                                    {donation.donorId.email}
                                </TableCell>
                                <TableCell className="text-[#4B5563]">
                                    {formattedDate}
                                </TableCell>
                                <TableCell>
                                    {getInteractiveStatusBadge(donation)}
                                </TableCell>
                                <TableCell className="text-[#4B5563]">
                                    {donation.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={`/campaigns/${donation.campaignId._id}`}
                                        className="flex justify-center w-8 h-8 items-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 group"
                                    >
                                        <Eye className="w-5 h-5 group-hover:text-gray-600" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
