'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

const resolveSocketUrl = () => {
  const explicitUrl = process.env.NEXT_PUBLIC_SOCKET_URL

  if (explicitUrl) {
    return explicitUrl
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  return apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '')
}

export function useSocket(): Socket | null {
  const { data: session } = useSession()
  const token = session?.accessToken || ''
  const userId = session?.user?._id || ''
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!token) {
      return
    }

    const socket = io(resolveSocketUrl(), {
      auth: { token },
      transports: ['websocket'],
    })

    if (userId) {
      socket.on('connect', () => {
        socket.emit('registerUser', userId)
      })
    }

    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, userId])

  return socketRef.current
}
