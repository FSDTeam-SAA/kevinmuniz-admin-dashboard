import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function UsersTableSkeleton() {
    return (
        <div className="rounded-[20px] bg-transparent overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">User Name</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">User Location</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Age</TableHead>
                        <TableHead className="text-left text-[#5C5C5C] font-semibold h-12">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i} className="border-b border-[#F0F0F0]">
                            <TableCell className="flex items-center gap-3 justify-start py-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[120px]" />
                                    <Skeleton className="h-3 w-[150px]" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-start">
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-start">
                                    <Skeleton className="h-4 w-6" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-start gap-3">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-5 w-5 rounded" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
