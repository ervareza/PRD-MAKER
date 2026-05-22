import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-surface-0">
      <Sidebar userEmail={data.user.email || ''} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
