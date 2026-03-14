'use client'

import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Contact } from '../types'
import ContactDetailModal from './ContactDetailModal'

interface ContactTableProps {
  contacts: Contact[]
  token: string
  onDelete: (contact: Contact) => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

const truncateMessage = (message: string) => {
  if (message.length <= 40) {
    return message
  }

  return `${message.slice(0, 40)}...`
}

export default function ContactTable({
  contacts,
  token,
  onDelete,
}: ContactTableProps) {
  const [selectedContactId, setSelectedContactId] = useState('')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleView = (contactId: string) => {
    setSelectedContactId(contactId)
    setIsDetailModalOpen(true)
  }

  return (
    <>
      <div className="rounded-[20px] bg-transparent overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#F0F0F0] hover:bg-transparent">
              <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
                Name
              </TableHead>
              <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
                Email
              </TableHead>
              <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
                Phone
              </TableHead>
              <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
                Message
              </TableHead>
              <TableHead className="h-12 text-left font-semibold text-[#5C5C5C]">
                Date
              </TableHead>
              <TableHead className="h-12 text-center font-semibold text-[#5C5C5C]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map(contact => (
              <TableRow
                key={contact._id}
                className="border-b border-[#F0F0F0] hover:bg-slate-50/50"
              >
                <TableCell className="font-medium text-[#1E1E1E]">
                  {contact.name}
                </TableCell>
                <TableCell className="text-[#5C5C5C]">
                  {contact.email}
                </TableCell>
                <TableCell className="text-[#5C5C5C]">
                  {contact.phone || '—'}
                </TableCell>
                <TableCell
                  className="max-w-[320px] truncate text-[#5C5C5C]"
                  title={contact.message}
                >
                  {truncateMessage(contact.message)}
                </TableCell>
                <TableCell className="text-[#5C5C5C]">
                  {formatDate(contact.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleView(contact._id)}
                      className="p-2 text-gray-400 transition-colors hover:text-[#33BAFF]"
                      aria-label={`View ${contact.name}`}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(contact)}
                      className="p-2 text-gray-400 transition-colors hover:text-red-500"
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ContactDetailModal
        contactId={selectedContactId}
        token={token}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  )
}
