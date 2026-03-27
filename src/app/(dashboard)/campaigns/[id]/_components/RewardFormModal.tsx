'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CampaignReward } from '../../types'

type RewardFormValues = {
  title: string
  description: string
  price: string
  quantity: string
  estimatedDeliveryDate: string
}

interface RewardFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: {
    title: string
    description: string
    price: number
    quantity: number | null
    estimatedDeliveryDate: string
  }) => Promise<unknown> | unknown
  isSubmitting: boolean
  reward?: CampaignReward | null
}

const emptyValues: RewardFormValues = {
  title: '',
  description: '',
  price: '',
  quantity: '',
  estimatedDeliveryDate: '',
}

const formatDateInput = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : ''

export default function RewardFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  reward,
}: RewardFormModalProps) {
  const [values, setValues] = useState<RewardFormValues>(emptyValues)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setValues(emptyValues)
      setError('')
      return
    }

    if (reward) {
      setValues({
        title: reward.title,
        description: reward.description,
        price: String(reward.price),
        quantity: reward.quantity === null ? '' : String(reward.quantity),
        estimatedDeliveryDate: formatDateInput(reward.estimatedDeliveryDate),
      })
      setError('')
      return
    }

    setValues(emptyValues)
    setError('')
  }, [isOpen, reward])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!values.title.trim() || !values.description.trim()) {
      setError('Title and description are required.')
      return
    }

    const price = Number(values.price)
    if (!Number.isFinite(price) || price < 1) {
      setError('Minimum donation amount must be at least $1.')
      return
    }

    const quantity =
      values.quantity.trim() === '' ? null : Number(values.quantity)
    if (quantity !== null && (!Number.isInteger(quantity) || quantity < 1)) {
      setError('Quantity must be a whole number greater than 0.')
      return
    }

    if (!values.estimatedDeliveryDate) {
      setError('Estimated delivery date is required.')
      return
    }

    setError('')
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      price,
      quantity,
      estimatedDeliveryDate: values.estimatedDeliveryDate,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-[640px] rounded-[24px] border border-[#D7E8FF] bg-white p-0 shadow-[0_24px_60px_rgba(46,171,252,0.16)]">
        <div className="h-1.5 w-full rounded-t-[24px] bg-[linear-gradient(90deg,#DFF3FF_0%,#2EABFC_55%,#8C5CFF_100%)]" />
        <div className="p-6 md:p-8">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-[24px] font-bold text-[#1F2937]">
              {reward ? 'Edit Reward' : 'Add Reward'}
            </DialogTitle>
            <p className="text-sm text-[#6B7280]">
              Configure donation rewards for this campaign and control what
              backers can claim.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2D2D2D]">
                Title
              </label>
              <Input
                value={values.title}
                onChange={event =>
                  setValues(current => ({ ...current, title: event.target.value }))
                }
                placeholder="Limited edition poster"
                className="h-12 rounded-[16px] border-[#D7E8FF] bg-[#FBFDFF]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2D2D2D]">
                Description
              </label>
              <Textarea
                value={values.description}
                onChange={event =>
                  setValues(current => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe what the backer receives."
                className="min-h-[120px] rounded-[16px] border-[#D7E8FF] bg-[#FBFDFF]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D2D2D]">
                  Minimum Donation Amount
                </label>
                <Input
                  type="number"
                  min="1"
                  value={values.price}
                  onChange={event =>
                    setValues(current => ({ ...current, price: event.target.value }))
                  }
                  placeholder="25"
                  className="h-12 rounded-[16px] border-[#D7E8FF] bg-[#FBFDFF]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D2D2D]">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  value={values.quantity}
                  onChange={event =>
                    setValues(current => ({
                      ...current,
                      quantity: event.target.value,
                    }))
                  }
                  placeholder="Leave blank for unlimited"
                  className="h-12 rounded-[16px] border-[#D7E8FF] bg-[#FBFDFF]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#2D2D2D]">
                Estimated Delivery Date
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C5CFF]" />
                <Input
                  type="date"
                  value={values.estimatedDeliveryDate}
                  onChange={event =>
                    setValues(current => ({
                      ...current,
                      estimatedDeliveryDate: event.target.value,
                    }))
                  }
                  className="h-12 rounded-[16px] border-[#D7E8FF] bg-[#FBFDFF] pl-11"
                />
              </div>
            </div>

            {error ? <p className="text-sm text-[#DC2626]">{error}</p> : null}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EAF2FA] pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full border-[#D7E8FF] px-6 text-[#4B5563] hover:bg-[#F8FBFF]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#2EABFC] px-7 text-white hover:bg-[#2396DF]"
              >
                {isSubmitting ? 'Saving...' : 'Save Reward'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
