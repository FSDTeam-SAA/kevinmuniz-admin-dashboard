'use client'

import { BarChart3, Megaphone, UserRound, UsersRound } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardStats } from '../types'

interface StatsCardsProps {
  stats?: DashboardStats
  isLoading: boolean
}

const statsConfig = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: UserRound,
    iconClassName: 'text-[#118B2F]',
    dotClassName: 'bg-[#118B2F]',
  },
  {
    key: 'totalCampaigns',
    label: 'Total Campaigns',
    icon: Megaphone,
    iconClassName: 'text-[#F0B429]',
    dotClassName: 'bg-[#118B2F]',
  },
  {
    key: 'totalRaisedAmount',
    label: 'Total amount raise',
    icon: BarChart3,
    iconClassName: 'text-[#118B2F]',
    dotClassName: 'bg-[#118B2F]',
    prefix: '$',
  },
  {
    key: 'totalDonations',
    label: 'Total Donation',
    icon: UsersRound,
    iconClassName: 'text-[#F0B429]',
    dotClassName: 'bg-[#D4D940]',
  },
] as const

// const formatStatValue = (value: number, prefix?: string) => {
//   const formattedValue = value.toLocaleString()
//   return prefix ? `${prefix}${formattedValue}` : formattedValue
// }

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statsConfig.map(item => {
        const Icon = item.icon
        const statValue = stats?.[item.key] ?? 0
        // const prefix = 'prefix' in item ? item.prefix : undefined

        return (
          <Card
            key={item.key}
            className="rounded-[12px] border border-[#E8EEF3] bg-white shadow-[0px_3px_12px_rgba(17,24,39,0.05)]"
          >
            <CardContent className="flex items-start justify-between p-6">
              <div className="space-y-4">
                <p className="text-[14px] font-medium text-[#353535]">
                  {item.label}
                </p>
                {isLoading || !stats ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* <p className="text-[30px] font-bold leading-none text-[#111827]">
                      {formatStatValue(statValue, prefix)}
                    </p> */}
                    <p className="flex items-center gap-2 text-[24px] font-semibold leading-none text-[#4B5563]">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${item.dotClassName}`}
                      />
                      <span className="text-[24px]">
                        {statValue.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="pt-1">
                {isLoading ? (
                  <Skeleton className="h-12 w-12 rounded-xl" />
                ) : (
                  <Icon
                    className={`h-12 w-12 ${item.iconClassName}`}
                    strokeWidth={1.8}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
