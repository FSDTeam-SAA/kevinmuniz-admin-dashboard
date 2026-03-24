"use client";

import { Download, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Donation } from "../types";
import { downloadDonationReceipt } from "@/utils/downloadDonationReceipt";

interface DonationsTableProps {
    donations: Donation[];
}

export default function DonationsTable({ donations }: DonationsTableProps) {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    };

    return (
        <div className="rounded-[20px] bg-transparent overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Name</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Mail</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Amount</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Campaign Title</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            Campaign Details
                        </TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            Receipt
                        </TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {donations.map((donation) => (
                        <TableRow
                            key={donation._id}
                            className="hover:bg-slate-50/50 border-b border-[#F0F0F0]"
                        >
                            <TableCell className="text-center text-[#5C5C5C]">
                                {donation.donorId?.firstName} {donation.donorId?.lastName}
                            </TableCell>
                            <TableCell className="text-center text-[#5C5C5C]">
                                {donation.donorId?.email}
                            </TableCell>
                            <TableCell className="text-center text-[#1E1E1E] font-medium">
                                {donation.amount}$
                            </TableCell>
                            <TableCell className="text-center font-medium text-[#1E1E1E] max-w-[300px] truncate">
                                {donation.campaignId?.title}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => router.push(`/campaigns/${donation.campaignId._id}`)}
                                    className="mx-auto h-8 w-8 rounded-md border-[#33BAFF] text-[#33BAFF] hover:bg-[#33BAFF] hover:text-white transition-colors"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => downloadDonationReceipt(donation)}
                                    className="mx-auto inline-flex h-8 items-center gap-2 rounded-md border-[#8C5CFF] px-3 text-[#8C5CFF] hover:bg-[#8C5CFF] hover:text-white transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Receipt
                                </Button>
                            </TableCell>
                            <TableCell className="text-center text-[#5C5C5C]">
                                {formatDate(donation.createdAt)}
                            </TableCell>
                        </TableRow>
                    ))}
                    {donations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-[#5C5C5C]">
                                No donations found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
