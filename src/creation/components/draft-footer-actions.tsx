import { AnimatePresence, motion } from 'framer-motion'
import { Calendar1, ChevronRight, FileCheck, Save } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { ProgressiveBlur } from '@/shared/ui/progressive-blur'

interface DraftFooterActionsProps {
  loading?: boolean
  saveDisabled?: boolean
  onSaveDraft: () => void
}

function DraftFooterActions({
  loading,
  onSaveDraft,
  saveDisabled = false,
}: DraftFooterActionsProps) {
  return (
    <AnimatePresence>
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 z-20 flex w-[-webkit-fill-available] justify-center p-4"
        >
          <div className="bg-card z-20 flex w-full max-w-2xl flex-col justify-between gap-2 rounded-md border-1 p-2 sm:flex-row">
            {/** Save Button */}
            <Button
              variant="default"
              size="sm"
              className="text-xs"
              onClick={onSaveDraft}
              disabled={saveDisabled}
            >
              <Save className="size-3" /> Save
            </Button>

            {/** Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="flex-1 text-xs">
                <Calendar1 className="size-4" /> Schedule
              </Button>

              <Button size="sm" className="flex-1 text-xs">
                <FileCheck className="size-4" /> Review & Share
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/** Backdrop blur */}
          <ProgressiveBlur
            height="4.5rem"
            blurLevels={[64, 64, 64, 64, 64, 64, 64, 64]}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DraftFooterActions
