"use client";

import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ManagedUser, UserRole } from "../types";

interface UsersTableProps {
    users: ManagedUser[];
    onDelete: (id: string, name: string) => void;
    role: UserRole;
}

export default function UsersTable({ users, onDelete, role }: UsersTableProps) {
    // No longer using age calculation as per request

    const formatLocation = (address: ManagedUser["address"]) => {
        if (!address) return "—";
        const parts = [address.roadArea, address.cityState, address.country].filter(Boolean);
        if (parts.length === 0) return "—";
        return parts.join(", ");
    };

    return (
        <div className="rounded-[20px] bg-transparent overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">
                            User Name
                        </TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">
                            User Location
                        </TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">
                            Job Role
                        </TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">
                            Gender
                        </TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user._id}
                            className="hover:bg-slate-50/50 border-b border-[#F0F0F0]"
                        >
                            <TableCell className="py-4">
                                <div className="flex items-center justify-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        {user.profileImage ? (
                                            <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                                        ) : null}
                                        <AvatarFallback className="bg-gray-100 text-[#111827] uppercase">
                                            {user.firstName?.[0]}
                                            {user.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left flex flex-col items-start w-[140px]">
                                        <span className="font-bold text-[#111827] truncate w-full">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <span className="text-xs text-[#909090] truncate w-full">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-left text-[#5C5C5C]">
                                {formatLocation(user.address)}
                            </TableCell>
                            <TableCell className="text-left text-[#5C5C5C]">
                                {user.jobRole || "—"}
                            </TableCell>
                            <TableCell className="text-left text-[#5C5C5C] capitalize">
                                {user.gender || "—"}
                            </TableCell>
                            <TableCell className="text-left">
                                <div className="flex items-center justify-start gap-3">
                                    <Link
                                        href={`/manage-users/${user._id}?role=${role}`}
                                        className="p-1.5 text-gray-400 hover:text-[#33BAFF] transition-colors"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            onDelete(user._id, `${user.firstName} ${user.lastName}`)
                                        }
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center py-10 text-[#909090]"
                            >
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
