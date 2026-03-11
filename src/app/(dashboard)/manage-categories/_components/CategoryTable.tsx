"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Category } from "../types";

interface CategoryTableProps {
    categories: Category[];
    onDelete: (id: string, name: string) => void;
}

export default function CategoryTable({
    categories,
    onDelete,
}: CategoryTableProps) {
    const formatDate = (dateString: string) =>
        dateString.slice(0, 10); // YYYY-MM-DD

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                    <TableHead className="text-[#5C5C5C] font-semibold">
                        Category Name
                    </TableHead>
                    <TableHead className="text-[#5C5C5C] font-semibold">
                        Campaigns
                    </TableHead>
                    <TableHead className="text-[#5C5C5C] font-semibold">
                        Last added
                    </TableHead>
                    <TableHead className="text-[#5C5C5C] font-semibold text-right">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((cat) => (
                    <TableRow
                        key={cat._id}
                        className="hover:bg-slate-50/50 border-b border-[#F0F0F0]"
                    >
                        <TableCell className="py-4">
                            <p className="font-bold text-[#111827]">{cat.name}</p>
                            <p className="text-sm text-[#5C5C5C] mt-0.5 max-w-[380px] line-clamp-2">
                                {cat.description}
                            </p>
                        </TableCell>
                        <TableCell className="text-[#5C5C5C]">—</TableCell>
                        <TableCell className="text-[#5C5C5C]">
                            {formatDate(cat.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={`/manage-categories/${cat._id}`}
                                    className="p-1.5 text-gray-400 hover:text-[#8C5CFF] transition-colors"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => onDelete(cat._id, cat.name)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
                {categories.length === 0 && (
                    <TableRow>
                        <TableCell
                            colSpan={4}
                            className="text-center py-10 text-[#909090]"
                        >
                            No categories found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
