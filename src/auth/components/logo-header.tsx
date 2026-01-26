import luuaIconLogo from '@/assets/logos/luua-icon-logo.svg'
import luuaWhiteIconLogo from '@/assets/logos/luua-white-icon-logo.svg'

function IconLogo() {
  return (
    <div className="flex size-16 items-center justify-center rounded-full border border-dashed border-gray-300 dark:border-gray-500">
      <img src={luuaIconLogo} alt="Luua Icon" className="size-9 dark:hidden" />
      <img
        src={luuaWhiteIconLogo}
        alt="Luua Icon"
        className="hidden size-9 dark:block"
      />
    </div>
  )
}

export default IconLogo
