import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function CategoryTableSkeleton() {
    return (
        <div className="rounded-[20px] bg-transparent overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                        <TableHead className="text-[#5C5C5C] font-semibold">Category Name</TableHead>
                        <TableHead className="text-[#5C5C5C] font-semibold">Campaigns</TableHead>
                        <TableHead className="text-[#5C5C5C] font-semibold">Last added</TableHead>
                        <TableHead className="text-[#5C5C5C] font-semibold text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <TableRow key={i} className="border-b border-[#F0F0F0]">
                            <TableCell>
                                <Skeleton className="h-4 w-[180px] mb-2" />
                                <Skeleton className="h-3 w-[260px]" />
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
                            <TableCell className="flex justify-end gap-3">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-5 w-5 rounded" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
