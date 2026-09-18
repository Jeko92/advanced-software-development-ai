'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { SessionUser } from '@/lib/auth/session'

interface AuthHydratorProps {
  user: SessionUser | null
}

export function AuthHydrator({ user }: AuthHydratorProps) {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return null
}
