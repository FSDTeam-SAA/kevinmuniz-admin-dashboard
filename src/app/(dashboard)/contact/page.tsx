'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { AppPagination } from '@/components/share/AppPagination'
import { SearchField } from '@/components/share/SearchField'
import { deleteContact, fetchContacts } from './api'
import type { Contact } from './types'
import ContactTable from './_components/ContactTable'
import ContactTableSkeleton from './_components/ContactTableSkeleton'
import DeleteContactModal from './_components/DeleteContactModal'

export default function ContactPage() {
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    contactId: string
    contactName: string
  }>({
    isOpen: false,
    contactId: '',
    contactName: '',
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['contacts', page],
    queryFn: () => fetchContacts(token, page, 10),
    enabled: !!token,
  })

  const filteredContacts = useMemo(() => {
    if (!data?.data) {
      return []
    }

    const searchTerm = search.trim().toLowerCase()

    if (!searchTerm) {
      return data.data
    }

    return data.data.filter(contact => {
      return (
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm)
      )
    })
  }, [data?.data, search])

  const deleteMutation = useMutation({
    mutationFn: (contactId: string) => deleteContact(token, contactId),
    onSuccess: () => {
      toast.success('Contact deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      setDeleteModal({
        isOpen: false,
        contactId: '',
        contactName: '',
      })
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete contact'
      toast.error(message)
    },
  })

  const handleDeleteClick = (contact: Contact) => {
    setDeleteModal({
      isOpen: true,
      contactId: contact._id,
      contactName: contact.name,
    })
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[24px] font-bold text-[#1F2937]">Contacts</h1>
        <SearchField
          className="sm:w-[320px]"
          value={search}
          onChange={event => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search by name or email"
        />
      </div>

      <div className="pt-2">
        {isLoading ? (
          <ContactTableSkeleton />
        ) : isError ? (
          <div className="py-10 text-center text-red-500">
            Failed to load contacts. Please try again.
          </div>
        ) : (
          <>
            <ContactTable
              contacts={filteredContacts}
              token={token}
              onDelete={handleDeleteClick}
            />

            {data?.pagination && !search.trim() && (
              <AppPagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                totalData={data.pagination.total}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      <DeleteContactModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            contactId: '',
            contactName: '',
          })
        }
        onConfirm={() => deleteMutation.mutate(deleteModal.contactId)}
        contactName={deleteModal.contactName}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
