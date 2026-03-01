import type { ReactNode } from 'react'

type AllSettingsLayoutProps = {
  aside: ReactNode
  children: ReactNode
}

function AllSettingsLayout({ aside, children }: AllSettingsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="bg-sidebar border-b p-4 lg:w-72 lg:border-r lg:border-b-0">
        {aside}
      </aside>
      <section className="flex-1 p-4 sm:p-6 lg:p-8">{children}</section>
    </div>
  )
}

export default AllSettingsLayout
