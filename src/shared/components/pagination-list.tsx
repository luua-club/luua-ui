import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'

interface PaginationListProps {
  limit: number
  offset: number
  total: number
  onOffsetChange: (nextOffset: number) => void
}

const PaginationList = ({
  limit,
  offset,
  total,
  onOffsetChange,
}: PaginationListProps) => {
  const currentPage = Math.floor(offset / Math.max(1, limit)) + 1
  const canPrev = offset > 0
  const canNext = offset + limit < total
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)))
  const windowSize = 5
  const maxStart = Math.max(1, totalPages - windowSize + 1)
  const start = Math.max(
    1,
    Math.min(currentPage - Math.floor(windowSize / 2), maxStart)
  )
  const end = Math.min(totalPages, start + windowSize - 1)
  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  )

  const goPrev = () => {
    if (!canPrev) return
    onOffsetChange(Math.max(0, offset - limit))
  }

  const goNext = () => {
    if (!canNext) return
    onOffsetChange(offset + limit)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={!canPrev}
            onClick={e => {
              e.preventDefault()
              goPrev()
            }}
          />
        </PaginationItem>
        {start > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {visiblePages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              aria-disabled={page === currentPage}
              className={
                page === currentPage
                  ? 'pointer-events-none cursor-default'
                  : undefined
              }
              onClick={e => {
                e.preventDefault()
                if (page === currentPage) return
                onOffsetChange((page - 1) * Math.max(1, limit))
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {end < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={!canNext}
            onClick={e => {
              e.preventDefault()
              goNext()
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationList
