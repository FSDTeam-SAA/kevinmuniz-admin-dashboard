'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchContactById } from '../api'

interface ContactDetailModalProps {
  contactId: string
  token: string
  isOpen: boolean
  onClose: () => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

function ContactDetailSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-full" />
        </div>
      ))}
    </div>
  )
}

export default function ContactDetailModal({
  contactId,
  token,
  isOpen,
  onClose,
}: ContactDetailModalProps) {
  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => fetchContactById(token, contactId),
    enabled: !!contactId && !!token && isOpen,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[560px] rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#111827]">
            Contact Details
          </DialogTitle>
          <DialogDescription className="pt-1 text-[#6B7280]">
            Review the full contact message details.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <ContactDetailSkeleton />
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Name</p>
              <p className="mt-1 text-[15px] text-[#111827]">
                {contact?.name || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Email</p>
              <p className="mt-1 text-[15px] text-[#111827]">
                {contact?.email || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Phone</p>
              <p className="mt-1 text-[15px] text-[#111827]">
                {contact?.phone || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7 text-[#111827]">
                {contact?.message || '—'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Consent</p>
              <p className="mt-1 text-[15px] text-[#111827]">
                {contact?.consent ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280]">Date</p>
              <p className="mt-1 text-[15px] text-[#111827]">
                {contact?.createdAt ? formatDate(contact.createdAt) : '—'}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button
            onClick={onClose}
            className="rounded-xl bg-[#33BAFF] px-6 text-white hover:bg-[#1EA9EF]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
