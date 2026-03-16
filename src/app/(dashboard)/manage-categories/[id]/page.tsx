'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCategoryById, updateCategory } from '../api'
import { CategoryFormValues } from '../schema'
import CategoryForm from '../_components/CategoryForm'

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const queryClient = useQueryClient()

  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['category', id],
    queryFn: () => fetchCategoryById(token, id),
    enabled: !!token && !!id,
  })

  const updateMutation = useMutation({
    mutationFn: (payload: CategoryFormValues) =>
      updateCategory(token, id, payload),
    onSuccess: () => {
      toast.success('Category updated successfully')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      router.push('/manage-categories')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to update category')
    },
  })

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="relative mb-8 flex items-center justify-center">
          <Skeleton className="absolute left-0 h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-40 rounded-md" />
        </div>
        <div className="mx-auto max-w-7xl rounded-[24px] border border-[#E5E7EB] bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-11 w-full rounded-[8px]" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-28 w-full rounded-[8px]" />
            </div>
            <Skeleton className="h-11 w-32 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#111827]">
            Failed to load category
          </h2>
          <p className="text-[#5C5C5C]">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      {/* Page header */}
      <div className="relative mb-8 flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="absolute left-0 flex items-center justify-center rounded-full p-1 text-[#111827] hover:text-[#8C5CFF] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-[24px] font-bold text-[#111827]">Edit Category</h1>
      </div>

      {/* Form card */}
      <div className="mx-auto max-w-7xl rounded-[24px] bg-white border border-[#E5E7EB] p-8 shadow-sm">
        <CategoryForm
          defaultValues={{
            name: category.name,
            description: category.description,
          }}
          onSubmit={values => updateMutation.mutate(values)}
          isLoading={updateMutation.isPending}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}
