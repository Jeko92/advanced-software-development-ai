'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { loginAction } from '@/lib/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

interface LoginFormValues {
  username: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>()

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await loginAction(values)
      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
                <p className="text-muted-foreground mt-2">Sign in to your DarkBay account to continue</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {serverError && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{serverError}</div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="your-username"
                    className="text-foreground"
                    {...register('username', { required: 'Username is required' })}
                  />
                  {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="text-foreground pr-12"
                      {...register('password', { required: 'Password is required' })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-foreground hover:underline">
                  Create one now
                </Link>
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="bg-muted/50 rounded-xl p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Join the Community</h2>
                  <p className="text-muted-foreground">
                    Discover rare objects and connect with fellow collectors from around the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
