"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft,
    ExternalLink,
    FileText,
    LoaderCircle,
    MapPin,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    deleteRepresentation,
    fetchRepresentationById,
    updateRepresentationStatus,
} from "../api";
import { RepresentationStatus } from "../types";
import StatusDropdown from "../_components/StatusDropdown";
import DeleteModal from "../_components/DeleteModal";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    let hh = date.getHours();
    const min = String(date.getMinutes()).padStart(2, "0");
    const ampm = hh >= 12 ? "pm" : "am";
    hh = hh % 12 || 12;
    const hhStr = String(hh).padStart(2, "0");
    return `${mm}/${dd}/${yyyy} ${hhStr}:${min}${ampm}`;
};

const getStatusBadgeClass = (status: RepresentationStatus) => {
    switch (status) {
        case "approved":
            return "bg-[#E6F6F0] text-[#0BB05F] hover:bg-[#E6F6F0]";
        case "rejected":
            return "bg-[#FFF0EC] text-[#FF3D00] hover:bg-[#FFF0EC]";
        case "pending":
        default:
            return "bg-[#FFF8E6] text-[#FFB100] hover:bg-[#FFF8E6]";
    }
};

export default function ProducerRequestDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient();

    const [deleteModal, setDeleteModal] = useState(false);

    const { data: rep, isLoading, error } = useQuery({
        queryKey: ["producer-request", id],
        queryFn: () => fetchRepresentationById(token, id),
        enabled: !!token && !!id,
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: RepresentationStatus) =>
            updateRepresentationStatus(token, id, status),
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["producer-request", id] });
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message ?? "Failed to update status");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteRepresentation(token, id),
        onSuccess: () => {
            toast.success("Producer request deleted");
            router.push("/producer-request");
        },
        onError: (error: { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message ?? "Failed to delete");
        },
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <LoaderCircle className="h-10 w-10 animate-spin text-[#33BAFF]" />
                <p className="text-sm font-medium text-[#5C5C5C]">
                    Loading request details...
                </p>
            </div>
        );
    }

    if (error || !rep) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center p-8">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-[#111827]">
                        Failed to load request
                    </h2>
                    <p className="text-[#5C5C5C]">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-full space-y-6 p-4 md:p-8">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-semibold text-[#111827] hover:text-[#33BAFF] transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            {/* Top campaign card */}
            <div className="rounded-[24px] border border-[#E0E7FF] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Campaign image */}
                    <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-[16px] md:w-[280px]">
                        <Image
                            src={rep.campaignId?.image || "/assets/images/placeholder.png"}
                            alt={rep.campaignId?.title ?? "Campaign"}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Campaign info */}
                    <div className="flex flex-1 flex-col justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-[#111827]">
                                {rep.campaignId?.title ?? "—"}
                            </h1>
                            <p className="text-[#5C5C5C] leading-relaxed">
                                {rep.campaignId?.shortDescription ?? ""}
                            </p>
                            {rep.campaignId?.location && (
                                <div className="flex items-center gap-1.5 pt-1">
                                    <MapPin className="h-4 w-4 text-[#33BAFF]" />
                                    <span className="text-sm text-[#5C5C5C]">
                                        {rep.campaignId.location}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Requester info */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#F0F0F0]">
                            <Avatar className="h-11 w-11">
                                <AvatarImage src={rep.userId?.profileImage} />
                                <AvatarFallback>
                                    {rep.userId?.firstName?.[0] ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-[#111827]">
                                    {rep.userId?.firstName} {rep.userId?.lastName}
                                </p>
                                <p className="text-xs text-[#909090]">{rep.userId?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details card */}
            <div className="rounded-[24px] border border-[#E0E7FF] bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#111827] pb-2 border-b border-[#F0F0F0]">
                    Request Details
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* First Name */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#909090]">
                            First Name
                        </p>
                        <p className="text-sm font-medium text-[#111827]">{rep.firstName}</p>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#909090]">
                            Last Name
                        </p>
                        <p className="text-sm font-medium text-[#111827]">{rep.lastName}</p>
                    </div>

                    {/* Production Company */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#909090]">
                            Production Company
                        </p>
                        <p className="text-sm font-medium text-[#111827]">
                            {rep.productionCompany}
                        </p>
                    </div>

                    {/* IMDB Page */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#909090]">
                            IMDB Page
                        </p>
                        {rep.imdbPageLink ? (
                            <a
                                href={rep.imdbPageLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-[#33BAFF] hover:underline"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View on IMDB
                            </a>
                        ) : (
                            <p className="text-sm text-[#909090]">—</p>
                        )}
                    </div>

                    {/* CV */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#909090]">
                            CV / Resume
                        </p>
                        {rep.cv ? (
                            <a
                                href={rep.cv}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm font-medium text-[#33BAFF] hover:underline"
                            >
                                <FileText className="h-3.5 w-3.5" />
                                View CV
                            </a>
                        ) : (
                            <p className="text-sm text-[#909090]">—</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#909090]">
                            Status
                        </p>
                        <Badge
                            className={cn(
                                "rounded-full px-3 py-0.5 text-xs font-medium",
                                getStatusBadgeClass(rep.status)
                            )}
                        >
                            {rep.status.charAt(0).toUpperCase() + rep.status.slice(1)}
                        </Badge>
                    </div>

                    {/* Submitted date */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#909090]">
                            Submitted
                        </p>
                        <p className="text-sm font-medium text-[#111827]">
                            {formatDate(rep.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action card */}
            <div className="rounded-[24px] border border-[#E0E7FF] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                    <StatusDropdown
                        status={rep.status}
                        onStatusChange={(status) => updateStatusMutation.mutate(status)}
                        isLoading={updateStatusMutation.isPending}
                    />
                    <Button
                        variant="destructive"
                        className="rounded-full bg-[#FF3D00] hover:bg-[#E63700] px-6"
                        onClick={() => setDeleteModal(true)}
                    >
                        Delete Request
                    </Button>
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={() => deleteMutation.mutate()}
                title={`${rep.firstName} ${rep.lastName}`}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
