'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useNotification } from '@/provider/NotificationProvider'
import { relativeTime } from '@/lib/relativeTime'

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotification()

  const handleMarkAllRead = async () => {
    try {
      await markAllRead()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mark all as read')
    }
  }

  const handleMarkOneRead = async (id: string) => {
    try {
      await markOneRead(id)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update notification')
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#111827]">Notifications</h1>
          <p className="text-sm text-[#6B7280]">
            You have {unreadCount} unread notifications
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void handleMarkAllRead()}
          disabled={!unreadCount}
          className="w-fit rounded-full border-[#D7E8FF] px-6 text-[#2EABFC] hover:bg-[#F5FBFF]"
        >
          Mark all read
        </Button>
      </div>

      <div className="rounded-[24px] bg-[linear-gradient(180deg,#F4FBFF_0%,#EEF9FF_100%)] p-4 md:p-6">
        <div className="rounded-[20px] bg-white/70 p-4 md:p-5">
          <h2 className="mb-5 text-lg font-semibold text-[#1F2937]">Notifications</h2>

          <div className="space-y-3">
            {notifications.map(notification => (
              <button
                key={notification._id}
                type="button"
                onClick={() => void handleMarkOneRead(notification._id)}
                className={`w-full rounded-[12px] border px-4 py-4 text-left transition-colors ${
                  notification.isRead
                    ? 'border-[#9ED3FF] bg-white'
                    : 'border-[#7AC0FF] bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-[#1F2937]">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-[#5C5C5C]">{notification.message}</p>
                    <p className="text-xs font-medium text-[#374151]">
                      {relativeTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <span className="rounded-full bg-[#9ED3FF] px-3 py-1 text-xs font-semibold text-[#0F6CBD]">
                      New
                    </span>
                  )}
                </div>
              </button>
            ))}

            {!notifications.length && (
              <div className="rounded-[12px] border border-dashed border-[#D7E8FF] bg-white px-4 py-10 text-center text-sm text-[#6B7280]">
                No notifications available right now.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
