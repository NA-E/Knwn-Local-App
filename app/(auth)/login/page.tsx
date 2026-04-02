'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <div className="w-full max-w-sm">
      <div className="bg-card border border-border rounded-[10px] p-7">
        <h1 className="text-lg font-semibold tracking-tight mb-1">Known Local</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to continue</p>

        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
            <Input id="password" name="password" type="password" required className="mt-1.5" />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
