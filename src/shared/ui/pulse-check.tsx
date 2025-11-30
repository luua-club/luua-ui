import { Check } from 'lucide-react'

function PulseCheck() {
  return (
    <div className="bg-brand-background-success flex size-10 items-center justify-center rounded-full">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-6 animate-ping rounded-full bg-green-500 opacity-30" />
        <div className="relative flex size-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
          <Check className="size-3.5" strokeWidth={3} />
        </div>
      </div>
    </div>
  )
}

export default PulseCheck
