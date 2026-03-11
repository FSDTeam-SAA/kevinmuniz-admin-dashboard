import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function DonationsTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                    <TableHead className="font-semibold text-[#5C5C5C]">Name</TableHead>
                    <TableHead className="font-semibold text-[#5C5C5C]">Mail</TableHead>
                    <TableHead className="font-semibold text-[#5C5C5C]">Amount</TableHead>
                    <TableHead className="font-semibold text-[#5C5C5C]">Campaign Title</TableHead>
                    <TableHead className="font-semibold text-[#5C5C5C] text-center">Campaign Details</TableHead>
                    <TableHead className="font-semibold text-[#5C5C5C]">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="border-b border-[#F0F0F0] hover:bg-transparent">
                        <TableCell>
                            <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[160px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                        <TableCell className="flex justify-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[140px]" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
