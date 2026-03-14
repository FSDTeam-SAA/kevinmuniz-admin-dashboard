"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import { AppPagination } from "@/components/share/AppPagination";
import { SearchField } from "@/components/share/SearchField";
import { fetchDonations } from "./api";
import DonationsTable from "./_components/DonationsTable";
import DonationsTableSkeleton from "./_components/DonationsTableSkeleton";

export default function DonationsPage() {
    const { data: session } = useSession();
    const token = session?.accessToken || "";

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["donations", page],
        queryFn: () => fetchDonations(token, page, 10),
        enabled: !!token,
    });

    const filteredDonations = useMemo(() => {
        if (!data?.donations) return [];
        if (!searchTerm) return data.donations;

        const lowerTerm = searchTerm.toLowerCase();
        return data.donations.filter((donation) => {
            const donorName =
                `${donation.donorId?.firstName} ${donation.donorId?.lastName}`.toLowerCase();
            const campaignTitle = donation.campaignId?.title?.toLowerCase() || "";
            return donorName.includes(lowerTerm) || campaignTitle.includes(lowerTerm);
        });
    }, [data?.donations, searchTerm]);

    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-[24px] font-bold text-[#1F2937]">Donations</h1>

                <SearchField
                    className="sm:w-[320px]"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1); // Reset to page 1 on search
                    }}
                />
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

                        {data?.pagination && !searchTerm && (
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
