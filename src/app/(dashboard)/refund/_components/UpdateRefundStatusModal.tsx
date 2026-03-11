/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { RefundDonation } from '../types'
import { updateRefundStatus } from '../api'
import { useSession } from 'next-auth/react'

interface UpdateRefundStatusModalProps {
  isOpen: boolean
  onClose: () => void
  donation: RefundDonation
}

export function UpdateRefundStatusModal({
  isOpen,
  onClose,
  donation,
}: UpdateRefundStatusModalProps) {
  const { data: session } = useSession() as any
  const token = session?.accessToken as string
  const queryClient = useQueryClient()

  const [selectedStatus, setSelectedStatus] = useState<
    'pending' | 'review' | 'refunded'
  >(donation.refundStatus)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // Sync state when donation changes
  useEffect(() => {
    setSelectedStatus(donation.refundStatus)
  }, [donation])

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (newStatus: 'pending' | 'review' | 'refunded') =>
      updateRefundStatus(token, donation._id, newStatus),
    onSuccess: () => {
      toast.success('Status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['refunds'] })
      setIsAlertOpen(false)
      onClose()
    },
    onError: () => {
      toast.error('Failed to update status')
      setIsAlertOpen(false)
    },
  })

  const handleConfirm = () => {
    updateStatus(selectedStatus)
  }

  const hasStatusChanged = selectedStatus !== donation.refundStatus

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
              <div className="col-span-3">
                <Select
                  value={selectedStatus}
                  onValueChange={(val: 'pending' | 'review' | 'refunded') =>
                    setSelectedStatus(val)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="pending"
                      disabled={donation.refundStatus === 'pending'}
                    >
                      Pending
                    </SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {hasStatusChanged && (
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setIsAlertOpen(true)}
                disabled={isPending}
                className="bg-[#1E90FF] hover:bg-[#1C86EE]"
              >
                {isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the refund status to{' '}
              <span className="font-semibold text-foreground capitalize">
                {selectedStatus}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className="bg-[#1E90FF] hover:bg-[#1C86EE]"
            >
              {isPending ? 'Confirming...' : 'Confirm Update'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
