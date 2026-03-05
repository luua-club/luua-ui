import { createLazyRoute } from '@tanstack/react-router'

function Payments() {
  return (
    <div className="m-auto max-w-4xl p-2">
      <div className="mt-4 py-4 text-center">
        <h1 className="text-3xl font-bold">Pricing Details</h1>
        <p className="text-muted-foreground my-2">
          A Comprehensive Breakdown of Our Pricing Plans to Help You Make the
          Best Choice!
        </p>
      </div>
      <h2 className="text-muted-foreground/60 rounded-md border border-dashed p-4 text-center text-xl">
        To be decided
      </h2>
    </div>
  )
}

export const Route = createLazyRoute('/payments')({
  component: Payments,
})

export default Payments
