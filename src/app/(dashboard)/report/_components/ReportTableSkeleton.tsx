import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] bg-transparent">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#F0F0F0] hover:bg-transparent">
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="h-12 text-center font-semibold text-[#5C5C5C]">
              <div className="flex justify-center">
                <Skeleton className="h-4 w-28" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="border-b border-[#F0F0F0]">
              <TableCell>
                <Skeleton className="h-4 w-[220px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
