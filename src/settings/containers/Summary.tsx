const Summary = () => {
  return (
    <>
      <div className="py-4">
        <h1 className="text-lg font-medium">Analysis Summary</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="border-sidebar-border bg-sidebar rounded-lg border-1 p-4">
          <p className="text-sm font-semibold">Sources Analyzed</p>
          <p className="text-lg font-medium text-gray-600">14</p>
        </div>
        <div className="border-sidebar-border bg-sidebar rounded-lg border-1 p-4">
          <p className="text-sm font-semibold">Total Characters</p>
          <p className="truncate text-lg font-medium text-gray-600">187,900</p>
        </div>
      </div>

      <p className="py-4 text-base font-medium">Style Profile</p>
      <div className="flex flex-wrap gap-2">
        <p className="rounded-md border-1 px-4 py-2 text-sm font-medium">
          Humour
        </p>
        <p className="rounded-md border-1 px-4 py-2 text-sm font-medium">
          Humour
        </p>
        <p className="rounded-md border-1 px-4 py-2 text-sm font-medium">
          Humour
        </p>
        <p className="rounded-md border-1 px-4 py-2 text-sm font-medium">
          Humour
        </p>
        <p className="rounded-md border-1 px-4 py-2 text-sm font-medium">
          Humour
        </p>
        <p className="rounded-md border-1 px-4 py-2 text-sm font-medium">
          Humour
        </p>
        <p className="rounded-md border-1 px-4 py-2 text-sm font-medium">
          Humour
        </p>
      </div>
    </>
  )
}

export default Summary
