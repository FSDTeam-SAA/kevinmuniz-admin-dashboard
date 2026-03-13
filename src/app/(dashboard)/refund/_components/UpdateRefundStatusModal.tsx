/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RefundDonation } from '../types'
import { updateRefundStatus } from '../api'
import { useSession } from 'next-auth/react'

interface UpdateRefundStatusModalProps {
    isOpen: boolean
    onClose: () => void
    donation: RefundDonation
    newStatus: 'pending' | 'review' | 'refunded'
}

export function UpdateRefundStatusModal({
    isOpen,
    onClose,
    donation,
    newStatus,
}: UpdateRefundStatusModalProps) {
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient()


    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: (status: 'pending' | 'review' | 'refunded') =>
            updateRefundStatus(token, donation._id, status),
        onSuccess: () => {
            toast.success('Status updated successfully')
            queryClient.invalidateQueries({ queryKey: ['refunds'] })
            onClose()
        },
        onError: () => {
            toast.error('Failed to update status')
        },
    })

    const handleConfirm = () => {
        updateStatus(newStatus)
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "refunded":
                return { label: "Refund", className: "bg-[#FF3D00] text-white" };
            case "pending":
                return { label: "Pending", className: "bg-[#FFB100] text-white" };
            case "review":
                return { label: "Review", className: "bg-[#33BAFF] text-white" };
            default:
                return { label: status, className: "bg-gray-100 text-gray-800" };
        }
    };

    const statusConfig = getStatusConfig(newStatus);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Refund status</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Campaign title:</span>
                            <span className="col-span-3 text-sm text-muted-foreground break-words truncate">
                                {donation.campaignId.title}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Refund reason:</span>
                            <span className="col-span-3 text-sm text-muted-foreground">
                                {donation.refundReason || '—'}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Amount:</span>
                            <span className="col-span-3 text-sm text-muted-foreground">
                                {donation.amount}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <span className="text-sm font-medium">Status:</span>
                            <div className="col-span-3 flex">
                                <span
                                    className={`inline-flex items-center justify-center h-8 min-w-[80px] rounded-[4px] px-3 py-1 text-xs font-semibold whitespace-nowrap ${statusConfig.className}`}
                                >
                                    {statusConfig.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isPending}
                            className="bg-[#1E90FF] hover:bg-[#1C86EE]"
                        >
                            {isPending ? 'Confirming...' : 'Confirm'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
