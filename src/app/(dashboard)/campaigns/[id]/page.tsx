'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'
import { fetchCampaignById } from '../api'
import CampaignDetailView from './_components/CampaignDetailView'

export default function CampaignDetailPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const [donorPage, setDonorPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['campaign', id, donorPage],
    queryFn: () => fetchCampaignById(token, id as string, donorPage),
    enabled: !!token && !!id,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <LoaderCircle className="h-10 w-10 animate-spin text-[#33BAFF]" />
        <p className="text-sm font-medium text-[#5C5C5C]">
          Loading campaign details...
        </p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#111827]">
            Failed to load campaign
          </h2>
          <p className="text-[#5C5C5C]">
            Please check back later or try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <CampaignDetailView
      data={data}
      donorPage={donorPage}
      onDonorPageChange={setDonorPage}
    />
  )
}
