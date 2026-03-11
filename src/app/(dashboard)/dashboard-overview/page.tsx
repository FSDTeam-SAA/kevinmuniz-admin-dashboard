'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import DonationReportChart from './_components/DonationReportChart'
import StatsCards from './_components/StatsCards'
import TopBackers from './_components/TopBackers'
import TopCampaigns from './_components/TopCampaigns'
import { fetchDashboardOverview, fetchDonationReport } from './api'

export default function DashboardOverviewPage() {
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const {
    data: overview,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => fetchDashboardOverview(token),
    enabled: !!token,
  })

  const {
    data: donationReport,
    isLoading: isDonationReportLoading,
    isError: isDonationReportError,
  } = useQuery({
    queryKey: ['donation-report', selectedYear],
    queryFn: () => fetchDonationReport(token, selectedYear),
    enabled: !!token,
  })

  useEffect(() => {
    if (isOverviewError) {
      toast.error('Failed to load dashboard overview.')
    }
  }, [isOverviewError])

  useEffect(() => {
    if (isDonationReportError) {
      toast.error('Failed to load donation report.')
    }
  }, [isDonationReportError])

  if (!token) {
    return null
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-[32px] font-bold text-[#2D2D2D]">Over View</h1>
        <p className="pt-1 text-sm text-[#8A8A8A]">Dashboard</p>
      </div>

      <StatsCards stats={overview?.stats} isLoading={isOverviewLoading} />

      <DonationReportChart
        report={donationReport}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        isLoading={isDonationReportLoading}
      />

      <TopBackers
        backers={overview?.topBackers || []}
        isLoading={isOverviewLoading}
      />

      <TopCampaigns
        campaigns={overview?.topCampaigns || []}
        isLoading={isOverviewLoading}
      />
    </div>
  )
}
