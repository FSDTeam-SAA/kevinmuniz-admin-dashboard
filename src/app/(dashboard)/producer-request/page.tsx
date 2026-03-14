"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppPagination } from "@/components/share/AppPagination";
import { SearchField } from "@/components/share/SearchField";
import {
    deleteRepresentation,
    fetchRepresentations,
    updateRepresentationStatus,
} from "./api";
import { RepresentationStatus } from "./types";
import ProducerRequestTable from "./_components/ProducerRequestTable";
import ProducerRequestSkeleton from "./_components/ProducerRequestSkeleton";
import DeleteModal from "./_components/DeleteModal";

export default function ProducerRequestPage() {
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: "",
        name: "",
    });
    const [updatingId, setUpdatingId] = useState<string | undefined>();

    const { data, isLoading } = useQuery({
        queryKey: ["producer-requests", page],
        queryFn: () => fetchRepresentations(token, page, 10),
        enabled: !!token,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: RepresentationStatus;
        }) => {
            setUpdatingId(id);
            return updateRepresentationStatus(token, id, status);
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["producer-requests"] });
            setUpdatingId(undefined);
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(
                error.response?.data?.message ?? "Failed to update status"
            );
            setUpdatingId(undefined);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteRepresentation(token, id),
        onSuccess: () => {
            toast.success("Producer request deleted");
            queryClient.invalidateQueries({ queryKey: ["producer-requests"] });
            setDeleteModal({ isOpen: false, id: "", name: "" });
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(
                error.response?.data?.message ?? "Failed to delete request"
            );
        },
    });

    const filteredRepresentations =
        data?.representations?.filter((rep) => {
            const q = search.toLowerCase();
            return (
                rep.firstName.toLowerCase().includes(q) ||
                rep.lastName.toLowerCase().includes(q) ||
                rep.campaignId?.title?.toLowerCase().includes(q)
            );
        }) ?? [];

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#1F2937]">Producer Request</h1>
                    <SearchField className="w-72" />
                </div>
                <ProducerRequestSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-[24px] font-bold text-[#1F2937]">Producer Request</h1>
                <SearchField value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="p-4 md:p-8">
                <ProducerRequestTable
                    representations={filteredRepresentations}
                    onStatusChange={(id, status) =>
                        updateStatusMutation.mutate({ id, status })
                    }
                    onDelete={(id, name) =>
                        setDeleteModal({ isOpen: true, id, name })
                    }
                    updatingId={updatingId}
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

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: "", name: "" })}
                onConfirm={() => deleteMutation.mutate(deleteModal.id)}
                title={deleteModal.name}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
