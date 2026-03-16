'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import CmsEditor from './_components/CmsEditor'
import {
  fetchAllCmsPages,
  fetchCmsPage,
  getErrorMessage,
  saveCmsPage,
} from './api'
import type { CmsPageKey } from './types'

const tabItems: Array<{ key: CmsPageKey; label: string }> = [
  { key: 'privacy_policy', label: 'Privacy Policy' },
  { key: 'terms_conditions', label: 'Terms & Condition' },
]

export default function CmsPageManagementPage() {
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<CmsPageKey>('privacy_policy')
  const [editorContent, setEditorContent] = useState('')

  const {
    data: cmsPages,
    isLoading: isCmsPagesLoading,
    isError: isCmsPagesError,
    error: cmsPagesError,
  } = useQuery({
    queryKey: ['cms-pages'],
    queryFn: () => fetchAllCmsPages(token),
    enabled: !!token,
  })

  const activePageExists = cmsPages?.some(page => page.page === activeTab) ?? false

  const {
    data: activePage,
    isLoading: isActivePageLoading,
    isError: isActivePageError,
    error: activePageError,
  } = useQuery({
    queryKey: ['cms-page', activeTab],
    queryFn: () => fetchCmsPage(token, activeTab),
    enabled: !!token && activePageExists,
    retry: false,
  })

  useEffect(() => {
    if (activePageExists && activePage) {
      setEditorContent(activePage.description || '')
      return
    }

    if (!activePageExists) {
      setEditorContent('')
    }
  }, [activePage, activePageExists, activeTab])

  useEffect(() => {
    if (isCmsPagesError) {
      toast.error(getErrorMessage(cmsPagesError))
    }
  }, [cmsPagesError, isCmsPagesError])

  useEffect(() => {
    if (isActivePageError && activePageExists) {
      toast.error(getErrorMessage(activePageError))
    }
  }, [activePageError, activePageExists, isActivePageError])

  const saveMutation = useMutation({
    mutationFn: () =>
      saveCmsPage(
        token,
        activeTab,
        editorContent,
        !activePageExists,
      ),
    onSuccess: async () => {
      toast.success('Saved successfully')
      await queryClient.invalidateQueries({ queryKey: ['cms-pages'] })
      await queryClient.invalidateQueries({ queryKey: ['cms-page', activeTab] })
    },
    onError: error => {
      toast.error(getErrorMessage(error))
    },
  })

  const handleCancel = () => {
    setEditorContent(activePage?.description || '')
  }

  const isInitialLoading =
    !token || isCmsPagesLoading || (activePageExists && isActivePageLoading)

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h1 className="text-[24px] font-bold text-[#1F2937]">
          CMS Page Management
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {tabItems.map(tab => {
            const isActive = tab.key === activeTab

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={
                  isActive
                    ? 'rounded-full bg-[#8C5CFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors'
                    : 'rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#5C5C5C] transition-colors hover:border-[#8C5CFF] hover:text-[#8C5CFF]'
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {isInitialLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[360px] w-full rounded-[24px]" />
          <div className="flex justify-end gap-3">
            <Skeleton className="h-11 w-28 rounded-full" />
            <Skeleton className="h-11 w-28 rounded-full" />
          </div>
        </div>
      ) : (
        <>
          <CmsEditor value={editorContent} onChange={setEditorContent} />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saveMutation.isPending}
              className="rounded-full border-[#E5E7EB] px-7 text-[#5C5C5C] hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="rounded-full bg-[#8C5CFF] px-8 text-white hover:bg-[#7A4AEF]"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
