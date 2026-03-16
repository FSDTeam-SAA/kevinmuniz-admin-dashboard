'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { sanitizeNotificationText } from '@/lib/sanitizeNotificationText'
import { useSocket } from '@/hooks/useSocket'
import type { Notification } from '@/types/notification'

interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  markAllRead: () => Promise<void>
  markOneRead: (id: string) => Promise<void>
}

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const socket = useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!token) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    let isMounted = true

    const fetchNotifications = async () => {
      try {
        const response = await axios.get<{ data: NotificationsResponse }>(
          `${API_URL}/notification/my`,
          {
            headers: getAuthHeaders(token),
          },
        )

        if (!isMounted) {
          return
        }

        setNotifications(
          (response.data.data.notifications || []).map(notification => ({
            ...notification,
            title: sanitizeNotificationText(notification.title),
            message: sanitizeNotificationText(notification.message),
          })),
        )
        setUnreadCount(response.data.data.unreadCount || 0)
      } catch (error) {
        const message =
          axios.isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message || error.message
            : 'Failed to fetch notifications'

        toast.error(message)
      }
    }

    void fetchNotifications()

    return () => {
      isMounted = false
    }
  }, [token])

  useEffect(() => {
    if (!socket) {
      return
    }

    const handleNotification = (notification: Notification) => {
      const sanitizedNotification = {
        ...notification,
        title: sanitizeNotificationText(notification.title),
        message: sanitizeNotificationText(notification.message),
      }

      setNotifications(current => [sanitizedNotification, ...current])
      setUnreadCount(current => current + (sanitizedNotification.isRead ? 0 : 1))
      toast.info(sanitizedNotification.title)
    }

    socket.on('notification', handleNotification)

    return () => {
      socket.off('notification', handleNotification)
    }
  }, [socket])

  const markAllRead = async () => {
    if (!token) {
      return
    }

    await axios.patch(
      `${API_URL}/notification/read-all`,
      {},
      {
        headers: getAuthHeaders(token),
      },
    )

    setNotifications(current =>
      current.map(notification => ({ ...notification, isRead: true })),
    )
    setUnreadCount(0)
  }

  const markOneRead = async (id: string) => {
    if (!token) {
      return
    }

    const target = notifications.find(notification => notification._id === id)
    if (!target || target.isRead) {
      return
    }

    await axios.patch(
      `${API_URL}/notification/${id}/read`,
      {},
      {
        headers: getAuthHeaders(token),
      },
    )

    setNotifications(current =>
      current.map(notification =>
        notification._id === id ? { ...notification, isRead: true } : notification,
      ),
    )
    setUnreadCount(current => Math.max(0, current - 1))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        markOneRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }

  return context
}
