import posthog from 'posthog-js'

/**
 * It runs when the intro i.e Welcome Drawer or Paid Drawer is skipped.
 *
 * @param introTitle - The title of that intro drawer.
 * @param stepNumber - That active step number where it was skipped.
 */
export const postHogIntroCapture = (introTitle: string, stepNumber: number) => {
  posthog.capture('intro:skipped', {
    introTitle,
    stepNumber,
  })
}
