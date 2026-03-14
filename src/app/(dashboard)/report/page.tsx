"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { SearchField } from "@/components/share/SearchField";
import { AppPagination } from "@/components/share/AppPagination";
import { cn } from "@/lib/utils";
import {
  fetchCampaignWiseReport,
  fetchUserWiseReport,
} from "./api";
import CampaignWiseTable from "./_components/CampaignWiseTable";
import ReportTableSkeleton from "./_components/ReportTableSkeleton";
import UserWiseTable from "./_components/UserWiseTable";

type ReportTab = "campaign" | "user";

export default function ReportPage() {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const [activeTab, setActiveTab] = useState<ReportTab>("campaign");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const campaignQuery = useQuery({
    queryKey: ["report-campaign", page],
    queryFn: () => fetchCampaignWiseReport(token, page, 10),
    enabled: !!token && activeTab === "campaign",
  });

  const userQuery = useQuery({
    queryKey: ["report-user", page],
    queryFn: () => fetchUserWiseReport(token, page, 10),
    enabled: !!token && activeTab === "user",
  });

  const filteredCampaigns = useMemo(() => {
    const campaigns = campaignQuery.data?.campaigns ?? [];
    if (!search.trim()) return campaigns;

    const term = search.toLowerCase();
    return campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(term)
    );
  }, [campaignQuery.data?.campaigns, search]);

  const filteredUsers = useMemo(() => {
    const users = userQuery.data?.users ?? [];
    if (!search.trim()) return users;

    const term = search.toLowerCase();
    return users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term)
    );
  }, [search, userQuery.data?.users]);

  const isLoading =
    activeTab === "campaign" ? campaignQuery.isLoading : userQuery.isLoading;
  const isError =
    activeTab === "campaign" ? campaignQuery.isError : userQuery.isError;
  const pagination =
    activeTab === "campaign"
      ? campaignQuery.data?.pagination
      : userQuery.data?.pagination;

  const handleTabChange = (tab: ReportTab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-[24px] font-bold text-[#1F2937]">Reports</h1>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-end">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleTabChange("campaign")}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                activeTab === "campaign"
                  ? "border-[#8C5CFF] bg-[#8C5CFF] text-white shadow-sm"
                  : "border-[#E5E7EB] bg-white text-[#8C5CFF] hover:bg-[#F8F5FF]"
              )}
            >
              Campaign wise donation report
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("user")}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                activeTab === "user"
                  ? "border-[#8C5CFF] bg-[#8C5CFF] text-white shadow-sm"
                  : "border-[#E5E7EB] bg-white text-[#8C5CFF] hover:bg-[#F8F5FF]"
              )}
            >
              User wise donation report
            </button>
          </div>

          <SearchField
            className="sm:w-[300px]"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              activeTab === "campaign"
                ? "Search campaign"
                : "Search user"
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <ReportTableSkeleton />
        ) : isError ? (
          <div className="py-10 text-center text-red-500">
            Failed to load reports. Please try again.
          </div>
        ) : (
          <>
            {activeTab === "campaign" ? (
              <CampaignWiseTable campaigns={filteredCampaigns} />
            ) : (
              <UserWiseTable users={filteredUsers} />
            )}

            {pagination && (
              <AppPagination
                currentPage={page}
                totalPages={pagination.totalPages}
                totalData={pagination.totalData}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
