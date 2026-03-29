'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface EditControlsModalProps {
    isOpen: boolean
    onClose: () => void
    campaignTitle: string
    proposedFunding?: number
    creatingDate: string
    endDate: string
    onSave: (payload: {
        proposedFunding?: number
        creatingDate?: string
        endDate?: string
    }) => void
    isSaving: boolean
}

const toDateInput = (value: string) =>
    value ? new Date(value).toISOString().slice(0, 10) : ''

export default function EditControlsModal({
    isOpen,
    onClose,
    campaignTitle,
    proposedFunding,
    creatingDate,
    endDate,
    onSave,
    isSaving,
}: EditControlsModalProps) {
    const [values, setValues] = useState({
        proposedFunding: proposedFunding ? String(proposedFunding) : '',
        creatingDate: toDateInput(creatingDate),
        endDate: toDateInput(endDate),
    })

    useEffect(() => {
        if (isOpen) {
            setValues({
                proposedFunding: proposedFunding ? String(proposedFunding) : '',
                creatingDate: toDateInput(creatingDate),
                endDate: toDateInput(endDate),
            })
        }
    }, [isOpen, proposedFunding, creatingDate, endDate])

    const handleSave = () => {
        onSave({
            proposedFunding: values.proposedFunding
                ? Number(values.proposedFunding)
                : undefined,
            creatingDate: values.creatingDate
                ? new Date(values.creatingDate).toISOString()
                : undefined,
            endDate: values.endDate
                ? new Date(values.endDate).toISOString()
                : undefined,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[480px] rounded-[24px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#111827]">
                        Edit Campaign Controls
                    </DialogTitle>
                    <DialogDescription className="pt-1 text-[#6B7280]">
                        Update budget and dates for{' '}
                        <span className="font-semibold text-[#111827]">
                            &quot;{campaignTitle}&quot;
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#111827]">
                            Budget
                        </label>
                        <Input
                            type="number"
                            value={values.proposedFunding}
                            onChange={e =>
                                setValues(prev => ({ ...prev, proposedFunding: e.target.value }))
                            }
                            className="h-[46px] rounded-[12px] border-[#E8EDF3] bg-[#FBFBFB]"
                            placeholder="Enter budget"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#111827]">
                            Start Date
                        </label>
                        <Input
                            type="date"
                            value={values.creatingDate}
                            onChange={e =>
                                setValues(prev => ({ ...prev, creatingDate: e.target.value }))
                            }
                            className="h-[46px] rounded-[12px] border-[#E8EDF3] bg-[#FBFBFB]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#111827]">
                            End Date
                        </label>
                        <Input
                            type="date"
                            value={values.endDate}
                            onChange={e =>
                                setValues(prev => ({ ...prev, endDate: e.target.value }))
                            }
                            className="h-[46px] rounded-[12px] border-[#E8EDF3] bg-[#FBFBFB]"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6 flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isSaving}
                        onClick={handleSave}
                        className="flex-1 rounded-xl bg-[#2EABFC] text-white hover:bg-[#2396DF]"
                    >
                        {isSaving ? (
                            <Skeleton className="h-4 w-16 rounded-full bg-white/40" />
                        ) : (
                            'Save Controls'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
