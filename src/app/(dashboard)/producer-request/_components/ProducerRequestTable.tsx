"use client";

import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Representation, RepresentationStatus } from "../types";
import StatusDropdown from "./StatusDropdown";

interface ProducerRequestTableProps {
    representations: Representation[];
    onStatusChange: (id: string, status: RepresentationStatus) => void;
    onDelete: (id: string, name: string) => void;
    updatingId?: string;
}

export default function ProducerRequestTable({
    representations,
    onStatusChange,
    onDelete,
    updatingId,
}: ProducerRequestTableProps) {
    return (
        <div className="rounded-[20px] bg-transparent overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            Campaign Name
                        </TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            First Name
                        </TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            Last Name
                        </TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            Production Company
                        </TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            Status
                        </TableHead>
                        <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {representations.map((rep) => (
                        <TableRow
                            key={rep._id}
                            className="hover:bg-slate-50/50 border-b border-[#F0F0F0]"
                        >
                            <TableCell className="text-center font-medium text-[#1E1E1E] max-w-[200px] truncate">
                                {rep.campaignId?.title ?? "—"}
                            </TableCell>
                            <TableCell className="text-center text-[#5C5C5C]">
                                {rep.firstName}
                            </TableCell>
                            <TableCell className="text-center text-[#5C5C5C]">
                                {rep.lastName}
                            </TableCell>
                            <TableCell className="text-center text-[#5C5C5C]">
                                {rep.productionCompany}
                            </TableCell>
                            <TableCell className="text-center">
                                <StatusDropdown
                                    status={rep.status}
                                    onStatusChange={(status) => onStatusChange(rep._id, status)}
                                    isLoading={updatingId === rep._id}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-3">
                                    <Link
                                        href={`/producer-request/${rep._id}`}
                                        className="p-2 text-gray-400 hover:text-[#33BAFF] transition-colors"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            onDelete(rep._id, `${rep.firstName} ${rep.lastName}`)
                                        }
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {representations.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center py-10 text-[#909090]"
                            >
                                No producer requests found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
