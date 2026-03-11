import React from "react";
import { cn } from "@/lib/utils";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface AppPaginationProps {
    currentPage: number;
    totalPages: number;
    totalData: number;
    onPageChange: (page: number) => void;
}

export function AppPagination({
    currentPage,
    totalPages,
    totalData,
    onPageChange,
}: AppPaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("ellipsis-1");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push("ellipsis-2");
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    const startIdx = (currentPage - 1) * 10 + 1;
    const endIdx = Math.min(currentPage * 10, totalData);

    return (
        <div className="flex flex-col items-center justify-between gap-4 py-4 md:flex-row">
            <p className="text-sm text-[#5C5C5C]">
                Showing {totalData === 0 ? 0 : startIdx} to {endIdx} of {totalData} results
            </p>

            <Pagination className="w-auto mx-0">
                <PaginationContent className="gap-2">
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                            className={cn(
                                "h-10 w-10 border border-[#8C5CFF]/20 text-[#8C5CFF] hover:bg-[#8C5CFF]/10",
                                currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                            )}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {typeof page === "number" ? (
                                <PaginationLink
                                    href="#"
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        onPageChange(page);
                                    }}
                                    isActive={currentPage === page}
                                    className={cn(
                                        "h-10 w-10 border border-[#8C5CFF]/20 text-[#8C5CFF] hover:bg-[#8C5CFF]/10 transition-colors cursor-pointer",
                                        currentPage === page && "bg-[#8C5CFF] text-white hover:bg-[#8C5CFF] border-[#8C5CFF]"
                                    )}
                                >
                                    {page}
                                </PaginationLink>
                            ) : (
                                <PaginationEllipsis className="h-10 w-10 border border-[#8C5CFF]/20 text-[#8C5CFF] rounded-md" />
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(currentPage + 1);
                            }}
                            className={cn(
                                "h-10 w-10 border border-[#8C5CFF]/20 text-[#8C5CFF] hover:bg-[#8C5CFF]/10",
                                currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
