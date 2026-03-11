"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppPagination } from "@/components/share/AppPagination";
import {
    createCategory,
    deleteCategory,
    fetchCategories,
} from "./api";
import { CategoryFormValues } from "./schema";
import CategoryForm from "./_components/CategoryForm";
import CategoryTable from "./_components/CategoryTable";
import CategoryTableSkeleton from "./_components/CategoryTableSkeleton";
import DeleteCategoryModal from "./_components/DeleteCategoryModal";

export default function ManageCategoriesPage() {
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: "",
        name: "",
    });

    const { data, isLoading } = useQuery({
        queryKey: ["categories", page],
        queryFn: () => fetchCategories(token, page, 10),
        enabled: !!token,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CategoryFormValues) =>
            createCategory(token, payload),
        onSuccess: () => {
            toast.success("Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setShowForm(false);
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message ?? "Failed to create category");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(token, id),
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setDeleteModal({ isOpen: false, id: "", name: "" });
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message ?? "Failed to delete category");
        },
    });

    return (
        <div className="space-y-6 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-[24px] font-bold text-[#1F2937]">
                    Manage categories
                </h1>
                <Button
                    onClick={() => setShowForm((prev) => !prev)}
                    className={
                        showForm
                            ? "rounded-full border border-[#E5E7EB] bg-white text-[#1F2937] shadow-none hover:bg-gray-50 gap-2"
                            : "rounded-full bg-[#8C5CFF] hover:bg-[#7A4AEF] text-white font-semibold gap-2"
                    }
                    variant={showForm ? "outline" : "default"}
                >
                    {showForm ? (
                        <>
                            <X className="h-4 w-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            Add new
                            <Plus className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>

            {/* Inline Add Form */}
            {showForm && (
                <div className="rounded-[16px] bg-white border border-[#E5E7EB] p-6 shadow-sm">
                    <CategoryForm
                        onSubmit={(values) => createMutation.mutate(values)}
                        isLoading={createMutation.isPending}
                        submitLabel="Add category +"
                    />
                </div>
            )}

            {/* Table Section */}
            <div className="rounded-[20px] bg-white p-6 shadow-sm border border-[#F0F0F0]">
                {isLoading ? (
                    <CategoryTableSkeleton />
                ) : (
                    <>
                        <CategoryTable
                            categories={data?.data ?? []}
                            onDelete={(id, name) =>
                                setDeleteModal({ isOpen: true, id, name })
                            }
                        />
                        {data?.pagination && (
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
            <DeleteCategoryModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: "", name: "" })}
                onConfirm={() => deleteMutation.mutate(deleteModal.id)}
                categoryName={deleteModal.name}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
