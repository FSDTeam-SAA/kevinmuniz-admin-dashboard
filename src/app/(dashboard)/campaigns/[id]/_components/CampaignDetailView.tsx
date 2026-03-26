'use client'

import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CampaignDetailResponse, Donor } from '../../types'
import { cn } from '@/lib/utils'
import { AppPagination } from '@/components/share/AppPagination'

interface CampaignDetailViewProps {
  data: CampaignDetailResponse
  donorPage: number
  onDonorPageChange: (page: number) => void
}

export default function CampaignDetailView({
  data,
  donorPage,
  onDonorPageChange,
}: CampaignDetailViewProps) {
  const router = useRouter()
  const { campaign, totalRaised, totalDonations, donors, donorPagination } =
    data

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const yyyy = date.getFullYear()
    let hh = date.getHours()
    const min = String(date.getMinutes()).padStart(2, '0')
    const ampm = hh >= 12 ? 'pm' : 'am'
    hh = hh % 12 || 12
    const hhStr = String(hh).padStart(2, '0')
    return `${mm}/${dd}/${yyyy} ${hhStr}:${min}${ampm}`
  }

  const getDaysLeft = (endDate: string) => {
    const remaining = new Date(endDate).getTime() - new Date().getTime()
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="mx-auto max-w-full space-y-8 p-4 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-semibold text-[#111827] hover:text-[#33BAFF] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Content Column */}
        <div className="space-y-8 lg:col-span-8">
          <section className="space-y-6">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px]">
              <Image
                src={campaign.image || '/assets/images/placeholder.png'}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-[32px] font-bold text-[#111827]">
                  {campaign.title}
                </h1>
                <Badge
                  className={cn(
                    'rounded-full px-4 py-1 text-xs font-medium',
                    campaign.activeStatus === 'active'
                      ? 'bg-[#E6F6F0] text-[#0BB05F] hover:bg-[#E6F6F0]'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-100',
                  )}
                >
                  {campaign.activeStatus.charAt(0).toUpperCase() +
                    campaign.activeStatus.slice(1)}
                </Badge>
              </div>
              <p className="text-lg text-[#5C5C5C] leading-relaxed">
                {campaign.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#111827]">
                    ${totalRaised.toLocaleString()} raised
                  </p>
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#E5E7EB] px-4 font-normal text-[#5C5C5C]"
                  >
                    {campaign.category.name}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-[#F0F0F0] pt-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={campaign.createdBy.profileImage} />
                  <AvatarFallback>
                    {campaign.createdBy.firstName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-[#111827]">
                    {campaign.createdBy.firstName} {campaign.createdBy.lastName}
                  </p>
                  <p className="text-xs text-[#909090]">Campaign Creator</p>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-[#D7E8FF] bg-white">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#8C5CFF] to-[#2EABFC]" />
            <div className="space-y-4 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-[#111827]">
                Campaign Details
              </h2>
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: campaign.campaignDetails }}
              />
            </div>
          </section>
        </div>

        {/* Sticky Summary Card */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <div className="overflow-hidden rounded-[28px] border border-[#D9CCFF] bg-white shadow-[0_18px_45px_rgba(46,171,252,0.14)]">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#8C5CFF] to-[#2EABFC]" />
              <div className="space-y-6 bg-[linear-gradient(180deg,rgba(140,92,255,0.08)_0%,rgba(46,171,252,0.03)_38%,#FFFFFF_100%)] p-6 md:p-8">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8C5CFF]">
                    Campaign Snapshot
                  </p>
                  <h2 className="text-[30px] font-bold text-[#0BB05F]">
                    ${totalRaised.toLocaleString()} Raised
                  </h2>
                </div>

                <div className="space-y-5 pt-2">
                  <div className="flex items-start gap-4 rounded-[20px] border border-[#EFEAFE] bg-white/80 p-4">
                    <div className="mt-1 rounded-full bg-[#F3EEFF] p-2 text-[#8C5CFF]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#111827]">
                        {totalDonations}
                      </p>
                      <p className="text-sm text-[#909090]">Backers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-[20px] border border-[#DBEEFF] bg-white/80 p-4">
                    <div className="mt-1 rounded-full bg-[#EAF6FF] p-2 text-[#2EABFC]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#111827]">
                        {getDaysLeft(campaign.endDate)} Days
                      </p>
                      <p className="text-sm text-[#909090]">
                        Left to this project
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-[20px] border border-[#DBEEFF] bg-white/80 p-4">
                    <div className="mt-1 rounded-full bg-[#EAF6FF] p-2 text-[#2EABFC]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#111827]">
                        {campaign.location}
                      </p>
                      <p className="text-sm text-[#909090]">Location</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-[20px] border border-[#EFEAFE] bg-white/80 p-4">
                    <div className="mt-1 rounded-full bg-[#F3EEFF] p-2 text-[#8C5CFF]">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#111827]">
                        {formatDate(campaign.endDate)}
                      </p>
                      <p className="text-sm text-[#909090]">End Date</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-[#E9EEF5] pt-6">
                  <Button className="h-14 w-full cursor-not-allowed rounded-full bg-gradient-to-r from-[#8C5CFF] to-[#2EABFC] font-semibold text-white opacity-55 hover:from-[#8C5CFF] hover:to-[#2EABFC]">
                    Donate to this Campaign
                  </Button>
                  <p className="text-center text-xs text-[#909090]">
                    Secure payment via Stripe. All contributions are final.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation List Section */}
      <div className="space-y-6 pt-12">
        <h2 className="text-2xl font-bold text-[#111827]">Donation list</h2>
        <div className="rounded-[20px] bg-transparent overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-[#F0F0F0]">
                <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                  Name
                </TableHead>
                <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                  Mail
                </TableHead>
                <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                  Amount
                </TableHead>
                <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                  Campaign Title
                </TableHead>
                <TableHead className="text-center text-[#5C5C5C] font-semibold h-12">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor: Donor, idx: number) => (
                <TableRow
                  key={idx}
                  className="hover:bg-slate-50/50 border-b border-[#F0F0F0]"
                >
                  <TableCell className="text-center text-[#5C5C5C]">
                    {donor.firstName} {donor.lastName}
                  </TableCell>
                  <TableCell className="text-center text-[#5C5C5C]">
                    {donor.email}
                  </TableCell>
                  <TableCell className="text-center text-[#1E1E1E] font-medium">
                    {donor.totalDonated}$
                  </TableCell>
                  <TableCell className="text-center font-medium text-[#1E1E1E] max-w-[300px] truncate">
                    {campaign.title}
                  </TableCell>
                  <TableCell className="text-center text-[#5C5C5C]">
                    {formatDate(donor.lastDonatedAt)}
                  </TableCell>
                </TableRow>
              ))}
              {donors.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-[#5C5C5C]"
                  >
                    No donations yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {donorPagination && donorPagination.totalPages > 1 && (
            <div className="mt-4">
              <AppPagination
                currentPage={donorPage}
                totalPages={donorPagination.totalPages}
                totalData={donorPagination.totalData}
                onPageChange={onDonorPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
