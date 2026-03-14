"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AppPagination } from "@/components/share/AppPagination";
import { SearchField } from "@/components/share/SearchField";
import { fetchUsersByRole, deleteUser } from "./api";
import { UserRole } from "./types";
import UsersTable from "./_components/UsersTable";
import UsersTableSkeleton from "./_components/UsersTableSkeleton";
import DeleteUserModal from "./_components/DeleteUserModal";

export default function ManageUsersPage() {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient();
    const initialTab = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState<UserRole>(
        initialTab === "CREATOR" ? "CREATOR" : "USER"
    );
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: "",
        name: "",
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ["users", activeTab, page],
        queryFn: () => fetchUsersByRole(token, activeTab, page, 10),
        enabled: !!token,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUser(token, id),
        onSuccess: () => {
            toast.success("User deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["users", activeTab] });
            setDeleteModal({ isOpen: false, id: "", name: "" });
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message ?? "Failed to delete user.");
        },
    });

    const filteredUsers = useMemo(() => {
        if (!data?.users) return [];
        if (!searchTerm) return data.users;

        const lowerTerm = searchTerm.toLowerCase();
        return data.users.filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const email = user.email.toLowerCase();
            return fullName.includes(lowerTerm) || email.includes(lowerTerm);
        });
    }, [data?.users, searchTerm]);

    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="text-[24px] font-bold text-[#1F2937]">Manage User</h1>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    {/* Tabs */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setActiveTab("USER");
                                setPage(1);
                            }}
                            className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === "USER"
                                ? "bg-[#8C5CFF] text-white shadow-sm"
                                : "bg-white text-[#8C5CFF] border border-[#E5E7EB] hover:bg-gray-50"
                                }`}
                        >
                            Backers
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("CREATOR");
                                setPage(1);
                            }}
                            className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeTab === "CREATOR"
                                ? "bg-[#8C5CFF] text-white shadow-sm"
                                : "bg-[#F3E8FF] text-[#C19BFF] hover:bg-[#EADDFF]" // using standard purple tints based on visual
                                }`}
                        >
                            Campaign Creators
                        </button>
                    </div>

                    {/* Search */}
                    <SearchField
                        className="sm:w-[280px]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-8">
                {isLoading ? (
                    <UsersTableSkeleton />
                ) : isError ? (
                    <div className="py-10 text-center text-red-500">
                        Failed to load users. Please try again.
                    </div>
                ) : (
                    <>
                        <UsersTable
                            users={filteredUsers}
                            role={activeTab}
                            onDelete={(id, name) =>
                                setDeleteModal({ isOpen: true, id, name })
                            }
                        />

                        {data?.pagination && !searchTerm && (
                            <AppPagination
                                currentPage={page}
                                totalPages={data.pagination.totalPages}
                                totalData={data.pagination.totalData}
                                onPageChange={setPage}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Delete Modal */}
            <DeleteUserModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: "", name: "" })}
                onConfirm={() => deleteMutation.mutate(deleteModal.id)}
                userName={deleteModal.name}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
