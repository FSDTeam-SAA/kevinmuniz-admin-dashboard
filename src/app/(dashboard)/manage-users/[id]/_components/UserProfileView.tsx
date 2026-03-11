'use client'

import { ArrowLeft, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ManagedUser } from '../../types'

interface UserProfileViewProps {
  user: ManagedUser
}

export default function UserProfileView({ user }: UserProfileViewProps) {
  const router = useRouter()

  const isCreator = user.role === 'CREATOR'
  const title = isCreator ? 'Campaign Creator Profile' : 'Backer Profile'
  const infoTitle = isCreator
    ? 'Campaign Creator Information'
    : 'Backer Information'

  const handleSuspend = () => {
    toast.info('Coming soon')
  }

  const extractUsername = (email: string) => {
    return email ? `@${email.split('@')[0]}` : '—'
  }

  const formatAddress = (address: ManagedUser['address']) => {
    if (!address) return '—'
    const parts = [
      address.roadArea,
      address.cityState,
      address.country,
      address.postalCode,
    ].filter(Boolean)
    if (parts.length === 0) return '—'
    return parts.join(' ')
  }

  return (
    <div className="mx-auto max-w-full space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-full p-2 text-[#111827] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-[28px] font-medium text-[#111827]">{title}</h1>
        <Button
          onClick={handleSuspend}
          className="rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-semibold gap-2"
        >
          Suspend
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* User Card */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback className="text-xl bg-gray-100 text-[#111827]">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-[22px] font-bold text-[#111827]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-[#909090]">{extractUsername(user.email)}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-[#111827]">
            Campaign involvement
          </p>
          <p className="text-[22px] font-bold text-[#5C5C5C] mt-1">
            {user.campaigns?.length || 0}
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-sm">
        <h3 className="text-center font-bold text-[#111827] mb-8">
          {infoTitle}
        </h3>
        <div className="grid gap-y-8 gap-x-12 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#909090]">Full Name</p>
            <p className="text-[#5C5C5C]">
              {user.firstName} {user.lastName}
            </p>
          </div>
          {/* Username */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#909090]">User name</p>
            <p className="text-[#5C5C5C]">{extractUsername(user.email)}</p>
          </div>
          {/* Email */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#909090]">Email</p>
            <p className="text-[#5C5C5C]">{user.email}</p>
          </div>
          {/* Phone */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#909090]">Phone number</p>
            <p className="text-[#5C5C5C]">—</p>
          </div>
        </div>
        {/* Address */}
        <div className="mt-8 space-y-2">
          <p className="text-sm font-medium text-[#909090]">Address</p>
          <p className="text-[#5C5C5C]">{formatAddress(user.address)}</p>
        </div>
      </div>

      {/* Campaign Involvement list */}
      {user.campaigns?.length > 0 && (
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-bold text-[#111827]">
            Campaign involvement
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {user.campaigns.map(camp => (
              <div
                key={camp._id}
                className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-sm flex flex-col h-full"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] mb-4">
                  <Image
                    src={camp.image || '/assets/images/placeholder.png'}
                    alt={camp.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col px-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="line-clamp-2 md:line-clamp-1 font-bold text-[18px] text-[#111827]">
                      {camp.title}
                    </h3>
                    <Badge
                      className={`whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-full border ${
                        camp.activeStatus === 'active'
                          ? 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0] hover:bg-[#ECFDF5]'
                          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {camp.activeStatus === 'active' ? 'Active' : 'Donated'}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#5C5C5C] line-clamp-2 mb-4 leading-relaxed flex-1">
                    {camp.shortDescription}
                  </p>
                  <div className="mb-4">
                    <p className="text-[#111827] font-bold text-[15px]">
                      $
                      {(isCreator
                        ? camp.totalRaised
                        : camp.userTotalDonated || 0
                      ).toLocaleString()}{' '}
                      raised
                    </p>
                    {camp.category?.name && (
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 bg-white">
                          {camp.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => router.push(`/campaigns/${camp._id}`)}
                    className="w-full h-11 rounded-full bg-[#8C5CFF] hover:bg-[#7A4AEF] text-white font-semibold transition-colors mt-auto"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
