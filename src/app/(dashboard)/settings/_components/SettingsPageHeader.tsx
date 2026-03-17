import { ChevronRight } from 'lucide-react'

export default function SettingsPageHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-[24px] font-semibold text-[#131313]">Settings</h1>
      <div className="flex items-center gap-2 text-[16px] text-[#7B7B7B]">
        <span>Dashboard</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#1E1E1E]">Settings</span>
      </div>
    </div>
  )
}
