'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { TopBacker } from '../types'

interface TopBackersProps {
  backers: TopBacker[]
  isLoading: boolean
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}` || 'U'

export default function TopBackers({ backers, isLoading }: TopBackersProps) {
  const skeletonItems = Array.from({ length: 3 }, (_, index) => index)

  return (
    <section className="rounded-[16px] border border-[#DDEBF1] bg-white px-4 py-5 shadow-[0px_3px_12px_rgba(17,24,39,0.04)] md:px-8 md:py-6">
      <div className="flex items-center justify-between border-b border-[#E9EEF2] pb-3">
        <h2 className="text-[18px] font-bold text-[#2D2D2D]">Top Backers</h2>
        <Link
          href="/manage-users?tab=USER"
          className="text-[14px] font-semibold text-[#0A63FF] transition-colors hover:text-[#084FD1]"
        >
          See all
        </Link>
      </div>

      <div className="grid gap-8 pt-8 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? skeletonItems.map(item => (
              <div
                key={item}
                className="flex items-center gap-5 rounded-[14px] bg-white"
              >
                <Skeleton className="h-[74px] w-[74px] rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))
          : backers.map(backer => (
              <div
                key={backer.donorId}
                className="flex items-center gap-5 rounded-[14px] bg-white"
              >
                <Avatar className="h-[74px] w-[74px]">
                  <AvatarImage src={backer.profileImage} />
                  <AvatarFallback className="bg-[#E5E7EB] text-lg font-semibold text-[#4B5563]">
                    {getInitials(backer.firstName, backer.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-[18px] font-bold text-[#111827]">
                    {backer.firstName} {backer.lastName}
                  </h3>
                  <p className="text-[15px] text-[#353535]">
                    Donated ${backer.totalDonated.toLocaleString()}
                  </p>
                  <Link
                    href={`/manage-users/${backer.donorId}?role=USER`}
                    className="inline-block text-[15px] font-medium text-[#0A63FF] transition-colors hover:text-[#084FD1]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}
