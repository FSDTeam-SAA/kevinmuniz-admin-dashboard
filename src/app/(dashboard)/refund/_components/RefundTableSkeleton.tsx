import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function RefundTableSkeleton() {
    return (
        <div className="rounded-md border mt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title/Name</TableHead>
                        <TableHead>Campaign Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Given Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-4 w-[150px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[200px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[180px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[100px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6 w-[80px] rounded-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
