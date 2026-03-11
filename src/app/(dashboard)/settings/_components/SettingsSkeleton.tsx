import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsSkeleton() {
    return (
        <div className="rounded-[2px] bg-white p-6 md:p-10 shadow-sm">
            <div className="flex flex-col gap-6 border-b border-[#F0F0F0] pb-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                    <Skeleton className="h-[100px] w-[100px] rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-[44px] w-[140px] rounded-full" />
                    <Skeleton className="h-[44px] w-[140px] rounded-full" />
                </div>
            </div>

            <div className="space-y-6 pt-8">
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-[52px] w-full rounded-[10px]" />
                        </div>
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-[52px] w-full rounded-[10px]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
