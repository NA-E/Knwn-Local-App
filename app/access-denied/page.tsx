import Link from 'next/link'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand-text-1 mb-3">
          Access Denied
        </h1>
        <p className="text-[14px] text-muted-foreground mb-6">
          Your email is not associated with a team member account.
          Contact your administrator to get access.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-brand-text-1 text-white text-[13px] font-medium rounded-[6px] hover:opacity-85 transition-opacity"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
