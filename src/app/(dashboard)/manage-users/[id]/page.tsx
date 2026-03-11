"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import { fetchUserById } from "../api";
import UserProfileView from "./_components/UserProfileView";
import UserProfileSkeleton from "./_components/UserProfileSkeleton";

interface ManageUserDetailProps {
    params: Promise<{ id: string }>;
}

export default function ManageUserDetailPage({ params }: ManageUserDetailProps) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "USER";

    const { data: session } = useSession();
    const token = session?.accessToken || "";

    const { data, isLoading, isError } = useQuery({
        queryKey: ["user", id],
        queryFn: () => fetchUserById(token, id),
        enabled: !!token && !!id,
        retry: 1, // Don't retry endlessly if backend doesn't support
    });

    if (isLoading) {
        return <UserProfileSkeleton />;
    }

    if (isError || !data) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center p-8">
                <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
                <p className="text-[#5C5C5C] text-center max-w-md">
                    Failed to load user information. It's possible the user was deleted or the endpoint is unavailable. Please navigate back to the list and try again.
                </p>
            </div>
        );
    }

    // Ensure role overrides the nested object if backend doesn't send it correctly for generic GET
    const targetUser = { ...data, role: role as any };

    return <UserProfileView user={targetUser} />;
}
