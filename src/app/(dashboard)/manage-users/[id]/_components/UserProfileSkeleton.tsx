import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileSkeleton() {
    return (
        <div className="mx-auto max-w-full space-y-8 p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* User Card */}
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 md:p-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="text-right">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-8 ml-auto" />
                </div>
            </div>

            {/* Info Card */}
            <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <Skeleton className="h-6 w-64 mb-6 mx-auto" />
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                </div>
                <div className="mt-8 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full max-w-2xl" />
                </div>
            </div>

            {/* Campaigns list */}
            <div className="space-y-6 pt-6">
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-80 w-full rounded-[24px]" />
                    <Skeleton className="h-80 w-full rounded-[24px]" />
                </div>
            </div>
        </div>
    );
}
