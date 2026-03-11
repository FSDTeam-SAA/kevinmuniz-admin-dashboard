"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AppPagination } from "@/components/share/AppPagination";
import { deleteCampaign, fetchCampaigns, updateCampaignStatus } from "./api";
import CampaignsTable from "./_components/CampaignsTable";
import CampaignTableSkeleton from "./_components/CampaignTableSkeleton";
import DeleteCampaignModal from "./_components/DeleteCampaignModal";

export default function CampaignsPage() {
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: "", title: "" });
    const [updatingId, setUpdatingId] = useState<string | undefined>();
    const [updatingActiveId, setUpdatingActiveId] = useState<string | undefined>();

    const { data, isLoading } = useQuery({
        queryKey: ["campaigns", page],
        queryFn: () => fetchCampaigns(token, page, 10),
        enabled: !!token,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: "accepted" | "rejected" }) => {
            setUpdatingId(id);
            return updateCampaignStatus(token, id, { approvalStatus: status });
        },
        onSuccess: () => {
            toast.success("Campaign approval status updated");
            queryClient.invalidateQueries({ queryKey: ["campaigns"] });
            setUpdatingId(undefined);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update status");
            setUpdatingId(undefined);
        },
    });

    const updateActiveStatusMutation = useMutation({
        mutationFn: ({ id, activeStatus }: { id: string; activeStatus: "active" | "inactive" }) => {
            setUpdatingActiveId(id);
            return updateCampaignStatus(token, id, { activeStatus });
        },
        onSuccess: () => {
            toast.success("Campaign active status updated");
            queryClient.invalidateQueries({ queryKey: ["campaigns"] });
            setUpdatingActiveId(undefined);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update active status");
            setUpdatingActiveId(undefined);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCampaign(token, id),
        onSuccess: () => {
            toast.success("Campaign deleted");
            queryClient.invalidateQueries({ queryKey: ["campaigns"] });
            setDeleteModal({ isOpen: false, id: "", title: "" });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete campaign");
        },
    });

    const filteredCampaigns = data?.data?.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleStatusChange = (id: string, status: "accepted" | "rejected") => {
        updateStatusMutation.mutate({ id, status });
    };

    const handleActiveStatusChange = (id: string, activeStatus: "active" | "inactive") => {
        updateActiveStatusMutation.mutate({ id, activeStatus });
    };

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteModal({ isOpen: true, id, title });
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#1F2937]">All Campaigns</h1>
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input className="pl-10 h-10 rounded-full bg-white border-[#E9EEF3]" placeholder="Search" />
                    </div>
                </div>
                <CampaignTableSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-[24px] font-bold text-[#1F2937]">All Campaigns</h1>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-[40px] rounded-full bg-white border-[#E5E7EB] focus-visible:ring-[#33BAFF]"
                        placeholder="Search"
                    />
                </div>
            </div>

            <div className="p-4 md:p-8">
                <CampaignsTable
                    campaigns={filteredCampaigns}
                    onStatusChange={handleStatusChange}
                    onActiveStatusChange={handleActiveStatusChange}
                    onDelete={handleDeleteClick}
                    updatingId={updatingId}
                    updatingActiveId={updatingActiveId}
                />

                {data?.pagination && (
                    <AppPagination
                        currentPage={page}
                        totalPages={data.pagination.totalPages}
                        totalData={data.pagination.totalData}
                        onPageChange={setPage}
                    />
                )}
            </div>

            <DeleteCampaignModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: "", title: "" })}
                campaignId={deleteModal.id}
                campaignTitle={deleteModal.title}
                onConfirm={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}
