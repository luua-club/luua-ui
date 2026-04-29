/**
 * Marketing copy above auth options (default login step only).
 */
export function LeftPanelHero() {
  return (
    <>
      <p className="text-muted-foreground flex items-center justify-center gap-2 text-[0.7rem] font-semibold tracking-[0.22em] uppercase lg:justify-start">
        <span
          aria-hidden
          className="bg-foreground/40 inline-block h-px w-6 shrink-0"
        />
        Sign in to Luua
      </p>

      <h1 className="text-foreground text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
        A Social <span className="font-medium italic">media</span> tool
      </h1>

      <p className="text-foreground font-medium sm:text-xl">
        Turn ideas into ready-to-publish content. Generate, manage, and automate
        — without the extra team.
      </p>
    </>
  )
}
