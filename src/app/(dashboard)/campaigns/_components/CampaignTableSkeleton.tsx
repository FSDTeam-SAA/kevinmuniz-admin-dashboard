import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function CampaignTableSkeleton() {
    return (
        <div className="rounded-[20px] bg-white p-6 shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Campaign Title</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Amount raised</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Approval Status</TableHead>
                        <TableHead>Active Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-[90px] rounded-[4px]" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-[90px] rounded-[4px]" /></TableCell>
                            <TableCell className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
