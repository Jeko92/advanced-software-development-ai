import { UserSummary } from '@/types'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  user: UserSummary | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
}

export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  if (!user) {
    return (
      <div className={cn('flex items-center justify-center rounded-full bg-muted', sizeClasses[size], className)}>
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium', sizeClasses[size], className)}>
      {user.username.slice(0, 2).toUpperCase()}
    </div>
  )
}

interface UserWithNameProps {
  user: UserSummary
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserWithName({ user, size = 'md', className }: UserWithNameProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <UserAvatar user={user} size={size} />
      <span className="text-sm font-medium text-foreground">{user.username}</span>
    </div>
  )
}
