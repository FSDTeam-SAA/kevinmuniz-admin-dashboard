'use client'

import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Power, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CampaignReward } from '../../types'
import { createReward, deleteReward, toggleReward, updateReward } from '../../api'
import RewardFormModal from './RewardFormModal'

interface RewardsManagementPanelProps {
  token: string
  campaignId: string
  rewards: CampaignReward[]
}

const formatCurrency = (value: number) => `$${value.toFixed(2)}`

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function RewardsManagementPanel({
  token,
  campaignId,
  rewards,
}: RewardsManagementPanelProps) {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<CampaignReward | null>(null)

  const sortedRewards = useMemo(
    () =>
      [...rewards].sort((left, right) => {
        if (left.isActive === right.isActive) {
          return left.price - right.price
        }

        return left.isActive ? -1 : 1
      }),
    [rewards],
  )

  const invalidateCampaign = () =>
    queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })

  const createMutation = useMutation({
    mutationFn: (values: {
      title: string
      description: string
      price: number
      quantity: number | null
      estimatedDeliveryDate: string
    }) =>
      createReward(token, {
        campaignId,
        ...values,
      }),
    onSuccess: async () => {
      toast.success('Reward created successfully')
      setIsModalOpen(false)
      await invalidateCampaign()
    },
    onError: () => {
      toast.error('Failed to create reward')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (values: {
      title: string
      description: string
      price: number
      quantity: number | null
      estimatedDeliveryDate: string
    }) => updateReward(token, editingReward?._id || '', values),
    onSuccess: async () => {
      toast.success('Reward updated successfully')
      setIsModalOpen(false)
      setEditingReward(null)
      await invalidateCampaign()
    },
    onError: () => {
      toast.error('Failed to update reward')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: (rewardId: string) => toggleReward(token, rewardId),
    onSuccess: async () => {
      toast.success('Reward status updated')
      await invalidateCampaign()
    },
    onError: () => {
      toast.error('Failed to update reward status')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (rewardId: string) => deleteReward(token, rewardId),
    onSuccess: async () => {
      toast.success('Reward deleted successfully')
      await invalidateCampaign()
    },
    onError: () => {
      toast.error('Failed to delete reward')
    },
  })

  return (
    <>
      <section className="overflow-hidden rounded-[24px] border border-[#D7E8FF] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#EAF2FA] bg-[linear-gradient(180deg,#F8FCFF_0%,#F2FAFF_100%)] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8C5CFF]">
              Rewards Management
            </p>
            <h2 className="mt-2 text-[24px] font-bold text-[#1F2937]">
              Campaign Rewards
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Add and manage pledge rewards for this campaign.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => {
              setEditingReward(null)
              setIsModalOpen(true)
            }}
            className="h-11 rounded-full bg-[#2EABFC] px-5 text-white hover:bg-[#2396DF]"
          >
            <Plus className="h-4 w-4" />
            Add Reward
          </Button>
        </div>

        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#EEF4FA] hover:bg-transparent">
                <TableHead className="text-center text-[#5C5C5C]">Title</TableHead>
                <TableHead className="text-center text-[#5C5C5C]">Price</TableHead>
                <TableHead className="text-center text-[#5C5C5C]">Quantity</TableHead>
                <TableHead className="text-center text-[#5C5C5C]">Delivery Date</TableHead>
                <TableHead className="text-center text-[#5C5C5C]">Status</TableHead>
                <TableHead className="text-right text-[#5C5C5C]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRewards.map(reward => {
                const quantityLabel =
                  reward.quantity === null
                    ? `${reward.quantityClaimed} claimed / Unlimited`
                    : `${reward.quantityClaimed}/${reward.quantity}`

                return (
                  <TableRow
                    key={reward._id}
                    className="border-b border-[#EEF4FA] hover:bg-[#F9FCFF]"
                  >
                    <TableCell className="text-center">
                      <div>
                        <p className="font-semibold text-[#1F2937]">
                          {reward.title}
                        </p>
                        <p className="mt-1 text-sm text-[#6B7280]">
                          {reward.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-[#1F2937]">
                      {formatCurrency(reward.price)}
                    </TableCell>
                    <TableCell className="text-center text-[#4B5563]">
                      {quantityLabel}
                    </TableCell>
                    <TableCell className="text-center text-[#4B5563]">
                      {formatDate(reward.estimatedDeliveryDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          reward.isActive
                            ? 'bg-[#EAF6FF] text-[#2EABFC]'
                            : 'bg-[#F3F4F6] text-[#6B7280]'
                        }`}
                      >
                        {reward.isAvailable
                          ? reward.isActive
                            ? 'Active'
                            : 'Inactive'
                          : 'Sold Out'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingReward(reward)
                            setIsModalOpen(true)
                          }}
                          className="h-9 rounded-full border-[#D7E8FF] px-3 text-[#2EABFC] hover:bg-[#F3FAFF]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => toggleMutation.mutate(reward._id)}
                          disabled={toggleMutation.isPending}
                          className="h-9 rounded-full border-[#E9D8FF] px-3 text-[#8C5CFF] hover:bg-[#F8F1FF]"
                        >
                          <Power className="h-4 w-4" />
                          Toggle
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(reward._id)}
                          disabled={deleteMutation.isPending}
                          className="h-9 rounded-full border-[#FDD5D5] px-3 text-[#DC2626] hover:bg-[#FEF2F2]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {!sortedRewards.length && (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-[#6B7280]">
                    No rewards added for this campaign yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <RewardFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingReward(null)
        }}
        reward={editingReward}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={values =>
          editingReward
            ? updateMutation.mutateAsync(values)
            : createMutation.mutateAsync(values)
        }
      />
    </>
  )
}
