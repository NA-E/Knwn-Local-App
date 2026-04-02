import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  meta?: string
  action?: ReactNode
}

export function PageHeader({ title, meta, action }: PageHeaderProps) {
  return (
    <div className="flex items-baseline justify-between mb-5">
      <div className="flex items-baseline gap-2.5">
        <h1 className="text-[19px] font-semibold tracking-tight">{title}</h1>
        {meta && <span className="text-[12px] text-muted-foreground">{meta}</span>}
      </div>
      {action}
    </div>
  )
}
