interface SectionHeaderProps {
  title: string
}

/**
 * Cabeçalho de seção no menu
 */
export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="px-4 pt-4 pb-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </div>
    </div>
  )
}

