"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { AppPagination } from "@/components/share/AppPagination";
import { SearchField } from "@/components/share/SearchField";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fetchDonations } from "./api";
import DonationsTable from "./_components/DonationsTable";
import DonationsTableSkeleton from "./_components/DonationsTableSkeleton";

type RewardFilter = "all" | "with_reward" | "no_reward";

export default function DonationsPage() {
    const { data: session } = useSession();
    const token = session?.accessToken || "";

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [rewardFilter, setRewardFilter] = useState<RewardFilter>("all");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["donations", page],
        queryFn: () => fetchDonations(token, page, 10),
        enabled: !!token,
    });

    const filteredDonations = useMemo(() => {
        if (!data?.donations) return [];

        return data.donations.filter((donation) => {
            if (rewardFilter === "with_reward" && !donation.reward) {
                return false;
            }

            if (rewardFilter === "no_reward" && donation.reward) {
                return false;
            }

            if (!searchTerm) {
                return true;
            }

            const lowerTerm = searchTerm.toLowerCase();
            const donorName =
                `${donation.donorId?.firstName} ${donation.donorId?.lastName}`.toLowerCase();
            const campaignTitle = donation.campaignId?.title?.toLowerCase() || "";
            const rewardTitle = donation.reward?.title?.toLowerCase() || "";
            return (
                donorName.includes(lowerTerm) ||
                campaignTitle.includes(lowerTerm) ||
                rewardTitle.includes(lowerTerm)
            );
        });
    }, [data?.donations, rewardFilter, searchTerm]);

    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-[24px] font-bold text-[#1F2937]">Donations</h1>
                    <p className="mt-1 text-sm text-[#6B7280]">
                        Track who claimed a reward and who donated without one.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <Select
                        value={rewardFilter}
                        onValueChange={(value: RewardFilter) => {
                            setRewardFilter(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="h-[40px] w-full rounded-full border-[#E5E7EB] bg-white text-sm focus:ring-[#33BAFF] sm:w-[190px]">
                            <SelectValue placeholder="All Donations" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="all">All Donations</SelectItem>
                            <SelectItem value="with_reward">With Reward</SelectItem>
                            <SelectItem value="no_reward">No Reward</SelectItem>
                        </SelectContent>
                    </Select>

                    <SearchField
                        className="sm:w-[320px]"
                        placeholder="Search donor, campaign, reward"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-2">
                {isLoading ? (
                    <DonationsTableSkeleton />
                ) : isError ? (
                    <div className="py-10 text-center text-red-500">
                        Failed to load donations. Please try again.
                    </div>
                ) : (
                    <>
                        <DonationsTable donations={filteredDonations} />

                        {data?.pagination && !searchTerm && rewardFilter === "all" && (
                            <AppPagination
                                currentPage={page}
                                totalPages={data.pagination.totalPages}
                                totalData={data.pagination.totalData}
                                onPageChange={setPage}
                            />
                        )}

                        {/* If searching, and we have client side filtered results but server didn't provide global searched pagination, we might just hide or show a simple placeholder. 
                For a real app, search usually hits the API. But as per spec, "client-side filter by donorId...". So we just don't show the pagination nicely when filtering, or we hide it.
                I'll keep it simple: if there's a search term, pagination might break since we only filter the current page. To properly paginate, it needs to be server side.
                But the spec says "Search input (top-right): client-side filter...".
            */}
                    </>
                )}
            </div>
        </div>
    );
}
