import SourcesCard, { SourceChip } from '@/shared/components/sources-card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Separator } from '@/shared/ui/separator'

interface ISourcesDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  extractedLinks: SourceChip[]
}

const SourcesDialog = ({
  isOpen,
  onOpenChange,
  extractedLinks,
}: ISourcesDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card scrollbar max-h-[80vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-card-foreground text-center text-lg font-semibold">
            Sources{' '}
            {extractedLinks.length > 0 ? `(${extractedLinks.length})` : null}
          </DialogTitle>
        </DialogHeader>

        <div className="text-card-foreground mt-6 space-y-4 text-sm">
          {extractedLinks.length === 0 && (
            <p className="text-card-foreground bg-muted mx-auto w-fit rounded-md p-2 text-sm font-semibold">
              No Extracted Sources
            </p>
          )}

          {extractedLinks.map((link, index) => (
            <>
              <div key={link.title} className="flex gap-2">
                <SourcesCard {...link} serialNumber={index + 1} />
              </div>
              {index !== extractedLinks.length - 1 && <Separator />}
            </>
          ))}
        </div>
        <DialogClose className="text-card-foreground" />
      </DialogContent>
    </Dialog>
  )
}

export default SourcesDialog
