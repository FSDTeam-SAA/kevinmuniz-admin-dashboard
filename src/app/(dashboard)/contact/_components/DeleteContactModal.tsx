'use client'

import { LoaderCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteContactModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  contactName: string
  isLoading: boolean
}

export default function DeleteContactModal({
  isOpen,
  onClose,
  onConfirm,
  contactName,
  isLoading,
}: DeleteContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#111827]">
            Delete Contact
          </DialogTitle>
          <DialogDescription className="pt-2 text-[#6B7280]">
            Are you sure you want to delete contact from{' '}
            <span className="font-semibold text-[#111827]">
              {contactName || 'this user'}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#FF3D00] hover:bg-[#E63700]"
          >
            {isLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
