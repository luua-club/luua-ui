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

  // Determine if dark mode is active (either explicitly set or system preference)
  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LucideSun className="h-[1rem] w-[1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <LucideMoon className="absolute h-[1rem] w-[1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <Switch
        className="cursor-pointer"
        checked={isDarkMode}
        onCheckedChange={() => setTheme(isDarkMode ? 'light' : 'dark')}
      />
    </div>
  )
}

export default ThemeToggle
