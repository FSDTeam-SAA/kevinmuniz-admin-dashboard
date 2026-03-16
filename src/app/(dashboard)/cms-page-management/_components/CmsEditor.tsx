'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const ReactQuill = dynamic(async () => import('react-quill'), {
  ssr: false,
  loading: () => <Skeleton className="h-[360px] w-full rounded-[24px]" />,
})

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
]

interface CmsEditorProps {
  value: string
  onChange: (val: string) => void
}

export default function CmsEditor({ value, onChange }: CmsEditorProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white shadow-sm">
      <div className="cms-quill-editor">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write page content here..."
        />
      </div>
    </div>
  )
}
