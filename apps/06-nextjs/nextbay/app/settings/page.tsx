import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getSession } from '@/lib/auth/session'

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <div className="mt-6 bg-card border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Username</p>
          <p className="text-lg font-medium text-foreground">{session.username}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
