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
import { generateCampaignCSV } from "../api";
import type { CampaignReport } from "../types";

interface CampaignWiseTableProps {
  campaigns: CampaignReport[];
}

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const formatAmount = (amount: number) => amount.toLocaleString();

const truncateText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

export default function CampaignWiseTable({
  campaigns,
}: CampaignWiseTableProps) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-transparent">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#F0F0F0] hover:bg-transparent">
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              Title/Name
            </TableHead>
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              Given Date
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
          {campaigns.map((campaign) => (
            <TableRow
              key={campaign.campaignId}
              className="border-b border-[#F0F0F0] hover:bg-slate-50/50"
            >
              <TableCell className="max-w-[280px] text-left font-medium text-[#1E1E1E]">
                {truncateText(campaign.title, 25)}
              </TableCell>
              <TableCell className="text-left text-[#5C5C5C]">
                {formatShortDate(campaign.lastDonationAt)}
              </TableCell>
              <TableCell className="text-left font-medium text-[#1E1E1E]">
                {formatAmount(campaign.totalRaised)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => generateCampaignCSV(campaign)}
                  className="mx-auto h-9 w-9 rounded-full text-[#9CA3AF] hover:bg-slate-100 hover:text-[#111827]"
                  aria-label={`Download report for ${campaign.title}`}
                >
                  <ArrowDownToLine className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {campaigns.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-[#5C5C5C]">
                No campaign reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
