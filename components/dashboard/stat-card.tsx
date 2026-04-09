interface StatCardProps {
  label: string
  value: number
  accent?: 'amber' | 'red' | 'green' | 'default'
}

export function StatCard({ label, value, accent = 'default' }: StatCardProps) {
  const accentClasses: Record<string, string> = {
    default: '',
    amber: value > 0 ? 'border-amber-300' : '',
    red: value > 0 ? 'border-red-300' : '',
    green: value > 0 ? 'border-green-300' : '',
  }

  const valueClasses: Record<string, string> = {
    default: 'text-brand-text-1',
    amber: value > 0 ? 'text-amber-600' : 'text-brand-text-1',
    red: value > 0 ? 'text-red-600' : 'text-brand-text-1',
    green: value > 0 ? 'text-green-700' : 'text-brand-text-1',
  }

  return (
    <div
      className={`bg-card border border-border rounded-[8px] px-5 py-4 shadow-[0_1px_3px_rgba(26,25,22,0.06),0_1px_2px_rgba(26,25,22,0.04)] ${accentClasses[accent]}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3 mb-1">
        {label}
      </p>
      <p className={`text-[28px] font-semibold leading-tight ${valueClasses[accent]}`}>
        {value}
      </p>
    </div>
  )
}
