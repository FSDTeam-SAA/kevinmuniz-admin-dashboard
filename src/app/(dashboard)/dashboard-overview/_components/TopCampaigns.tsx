'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TopCampaign } from '../types'

interface TopCampaignsProps {
  campaigns: TopCampaign[]
  isLoading: boolean
}

export default function TopCampaigns({
  campaigns,
  isLoading,
}: TopCampaignsProps) {
  const skeletonItems = Array.from({ length: 2 }, (_, index) => index)

  return (
    <section className="rounded-[16px] border border-[#DDEBF1] bg-white px-4 py-5 shadow-[0px_3px_12px_rgba(17,24,39,0.04)] md:px-8 md:py-6">
      <div className="flex items-center justify-between border-b border-[#E9EEF2] pb-3">
        <h2 className="text-[18px] font-bold text-[#2D2D2D]">Top Campaigns</h2>
        <Link
          href="/campaigns"
          className="text-[14px] font-semibold text-[#0A63FF] transition-colors hover:text-[#084FD1]"
        >
          See all
        </Link>
      </div>

      <div className="grid gap-6 pt-8 xl:grid-cols-2">
        {isLoading
          ? skeletonItems.map(item => (
              <div
                key={item}
                className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-sm"
              >
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full rounded-[16px]" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-11 w-full rounded-full" />
                  </div>
                </div>
              </div>
            ))
          : campaigns.map(campaign => (
              <div
                key={campaign.campaignId}
                className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-sm"
              >
                <div className="flex h-full flex-col">
                  <div className="relative mb-4 h-[200px] w-full overflow-hidden rounded-[16px]">
                    <Image
                      src={campaign.image || '/assets/images/placeholder.png'}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-1">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <h3 className="line-clamp-2 font-bold text-[18px] text-[#111827]">
                        {campaign.title}
                      </h3>
                      <Badge
                        className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${
                          campaign.activeStatus === 'active'
                            ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#10B981] hover:bg-[#ECFDF5]'
                            : 'border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {campaign.activeStatus === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="mb-4 flex-1 line-clamp-2 text-sm leading-relaxed text-[#5C5C5C]">
                      {campaign.shortDescription}
                    </p>
                    <div className="mb-4">
                      <p className="text-[15px] font-bold text-[#111827]">
                        ${campaign.totalRaised.toLocaleString()} raised
                      </p>
                      {campaign.category && (
                        <div className="mt-2">
                          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                            {campaign.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/campaigns/${campaign.campaignId}`}
                      className="mt-auto block"
                    >
                      <Button
                        type="button"
                        className="h-11 w-full rounded-full bg-[#8C5CFF] font-semibold text-white transition-colors hover:bg-[#7A4AEF]"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}
