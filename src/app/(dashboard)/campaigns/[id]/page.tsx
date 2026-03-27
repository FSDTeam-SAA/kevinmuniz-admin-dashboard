'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
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
      <div className="mx-auto max-w-full space-y-8 p-4 md:p-8">
        <Skeleton className="h-5 w-16" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <Skeleton className="aspect-[16/9] w-full rounded-[24px]" />
            <Skeleton className="h-[320px] w-full rounded-[24px]" />
          </div>
          <Skeleton className="h-[560px] w-full rounded-[28px] lg:col-span-4" />
        </div>
        <Skeleton className="h-[280px] w-full rounded-[24px]" />
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
      token={token}
      donorPage={donorPage}
      onDonorPageChange={setDonorPage}
    />
  )
}
