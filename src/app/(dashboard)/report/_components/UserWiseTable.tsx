"use client";

import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateUserCSV } from "../api";
import type { UserReport } from "../types";

interface UserWiseTableProps {
  users: UserReport[];
}

const formatAmount = (amount: number) => amount.toLocaleString();

export default function UserWiseTable({ users }: UserWiseTableProps) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-transparent">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#F0F0F0] hover:bg-transparent">
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              User name
            </TableHead>
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              Title/Name
            </TableHead>
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              Raised amount
            </TableHead>
            <TableHead className="h-12 text-center font-semibold text-[#5C5C5C]">
              Download report
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.donorId}
              className="border-b border-[#F0F0F0] hover:bg-slate-50/50"
            >
              <TableCell className="text-left font-medium text-[#1E1E1E]">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="text-left text-[#5C5C5C]">
                {user.totalCampaignsSupported > 0
                  ? `${user.totalCampaignsSupported} campaigns`
                  : "—"}
              </TableCell>
              <TableCell className="text-left font-medium text-[#1E1E1E]">
                {formatAmount(user.totalRaised)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => generateUserCSV(user)}
                  className="mx-auto h-9 w-9 rounded-full text-[#9CA3AF] hover:bg-slate-100 hover:text-[#111827]"
                  aria-label={`Download report for ${user.firstName} ${user.lastName}`}
                >
                  <ArrowDownToLine className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-[#5C5C5C]">
                No user reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
