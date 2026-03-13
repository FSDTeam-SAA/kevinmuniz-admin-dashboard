/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Search, ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AppPagination } from '@/components/share/AppPagination'
import { fetchRefundRequests } from './api'
import { RefundTable } from './_components/RefundTable'
import { RefundTableSkeleton } from './_components/RefundTableSkeleton'
import { UpdateRefundStatusModal } from './_components/UpdateRefundStatusModal'
import { RefundDonation } from './types'

export default function RefundPage() {
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  const [activeTab, setActiveTab] = useState<'refunded' | 'pending'>('refunded')
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedDonation, setSelectedDonation] =
    useState<RefundDonation | null>(null)
  const [pendingStatus, setPendingStatus] = useState<'pending' | 'review' | 'refunded' | ''>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // For the API, we use "pending&status=review" to fetch both new and review requests
  const { data, isLoading, isError } = useQuery({
    queryKey: ['refunds', activeTab, page],
    queryFn: async () => {
      if (activeTab === 'refunded') {
        return fetchRefundRequests(token, 'refunded', page, 10)
      }

      // Fetch pending and review in parallel
      const [pendingData, reviewData] = await Promise.all([
        fetchRefundRequests(token, 'pending', page, 10),
        fetchRefundRequests(token, 'review', page, 10),
      ])

      // Merge results
      return {
        donations: [...pendingData.donations, ...reviewData.donations],
        pagination: {
          currentPage: page,
          totalPages: Math.max(
            pendingData.pagination.totalPages,
            reviewData.pagination.totalPages
          ),
          totalData:
            pendingData.pagination.totalData + reviewData.pagination.totalData,
          hasNextPage:
            pendingData.pagination.hasNextPage ||
            reviewData.pagination.hasNextPage,
          hasPrevPage:
            pendingData.pagination.hasPrevPage ||
            reviewData.pagination.hasPrevPage,
        },
      }
    },
    enabled: !!token,
  })

  const handleTabChange = (newTab: 'refunded' | 'pending') => {
    setActiveTab(newTab)
    setPage(1)
    setSearchTerm('')
  }

  const handleStatusChange = (donation: RefundDonation, newStatus: 'pending' | 'review' | 'refunded') => {
    if (activeTab === 'pending') {
      setSelectedDonation(donation)
      setPendingStatus(newStatus)
      setIsModalOpen(true)
    }
  }

  const currentDonations = data?.donations || []
  const pagination = data?.pagination

  // Client-side filtering
  const filteredDonations = currentDonations.filter(donation => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    const donorName =
      `${donation.donorId.firstName} ${donation.donorId.lastName}`.toLowerCase()
    const campaignTitle = (donation.campaignId.title || '').toLowerCase()
    return donorName.includes(term) || campaignTitle.includes(term)
  })

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">
          {activeTab === 'refunded' ? 'Refund' : 'New refund request'}
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {activeTab === 'refunded' && (
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          <button
            onClick={() =>
              handleTabChange(activeTab === 'refunded' ? 'pending' : 'refunded')
            }
            className="bg-[#1E90FF] hover:bg-[#1C86EE] text-white px-4 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-2"
          >
            {activeTab === 'refunded' ? (
              'New refund request'
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Back to Refund
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <RefundTableSkeleton />
      ) : isError ? (
        <div className="text-center py-10 border mt-6 rounded-md text-red-500 bg-white">
          Failed to load refund requests. Please try again.
        </div>
      ) : (
        <>
          <RefundTable
            donations={filteredDonations}
            activeTab={activeTab}
            onStatusChange={handleStatusChange}
          />

          {pagination && pagination.totalData > 0 && (
            <AppPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalData={pagination.totalData}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {selectedDonation && pendingStatus && (
        <UpdateRefundStatusModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDonation(null)
            setPendingStatus('')
          }}
          donation={selectedDonation}
          newStatus={pendingStatus}
        />
      )}
    </div>
  )
}
