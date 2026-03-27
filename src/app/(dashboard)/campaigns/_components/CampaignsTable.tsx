"use client";

import { Eye, Gift, Trash2 } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Campaign } from "../types";
import StatusDropdown from "./StatusDropdown";
import ActiveStatusDropdown from "./ActiveStatusDropdown";

interface CampaignsTableProps {
    campaigns: Campaign[];
    onStatusChange: (id: string, status: "accepted" | "rejected") => void;
    onActiveStatusChange: (id: string, activeStatus: "active" | "inactive") => void;
    onDelete: (id: string, title: string) => void;
    updatingId?: string;
    updatingActiveId?: string;
}

export default function CampaignsTable({
    campaigns,
    onStatusChange,
    onActiveStatusChange,
    onDelete,
    updatingId,
    updatingActiveId,
}: CampaignsTableProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const yyyy = date.getFullYear();
        let hh = date.getHours();
        const min = String(date.getMinutes()).padStart(2, "0");
        const ampm = hh >= 12 ? "pm" : "am";
        hh = hh % 12 || 12;
        const hhStr = String(hh).padStart(2, "0");
        return `${mm}/${dd}/${yyyy} ${hhStr}:${min}${ampm}`;
    };

    return (
        <div className="rounded-[20px] bg-transparent overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Campaign Title</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Name</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Amount raised</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Date</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Approval Status</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Active Status</TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow key={campaign._id} className="hover:bg-slate-50/50 border-b border-[#F0F0F0]">
                            <TableCell className="text-center font-medium text-[#1E1E1E] max-w-[300px] truncate">
                                {campaign.title}
                            </TableCell>
                            <TableCell className="text-center text-[#5C5C5C]">
                                {campaign.createdBy?.firstName ? `${campaign.createdBy.firstName} ${campaign.createdBy.lastName || ""}` : campaign.createdBy?.email || "N/A"}
                            </TableCell>
                            <TableCell className="text-center text-[#1E1E1E]">500$</TableCell>
                            <TableCell className="text-center text-[#5C5C5C]">{formatDate(campaign.createdAt)}</TableCell>
                            <TableCell className="text-center">
                                <StatusDropdown
                                    currentStatus={campaign.approvalStatus}
                                    onStatusChange={(status) => onStatusChange(campaign._id, status)}
                                    isLoading={updatingId === campaign._id}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <ActiveStatusDropdown
                                    currentStatus={campaign.activeStatus}
                                    onStatusChange={(activeStatus) => onActiveStatusChange(campaign._id, activeStatus)}
                                    isLoading={updatingActiveId === campaign._id}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <Link
                                        href={`/campaigns/${campaign._id}`}
                                        className="p-2 text-gray-400 hover:text-[#33BAFF] transition-colors"
                                        title="View campaign"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href={`/campaigns/${campaign._id}`}
                                        className="inline-flex items-center gap-2 rounded-full border border-[#D7E8FF] px-3 py-2 text-xs font-semibold text-[#2EABFC] transition-colors hover:bg-[#F3FAFF]"
                                        title="Manage rewards"
                                    >
                                        <Gift className="h-4 w-4" />
                                        Rewards
                                    </Link>
                                    <button
                                        onClick={() => onDelete(campaign._id, campaign.title)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete campaign"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
