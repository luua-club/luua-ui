import { LucideMoon, LucideSun } from 'lucide-react'
import { HTMLAttributes } from 'react'

import { useTheme } from '../provider/theme-provider'
import { Switch } from '../ui/switch'
import { cn } from '../utils'

interface IThemeToggleProps {
  className?: HTMLAttributes<HTMLDivElement>['className']
}

function ThemeToggle({ className }: IThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LucideSun
        size={16}
        className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
      />
      <LucideMoon
        size={16}
        className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
      />
      <Switch
        className="cursor-pointer"
        checked={theme === 'dark'}
        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
    </div>
  )
}

export default ThemeToggle
