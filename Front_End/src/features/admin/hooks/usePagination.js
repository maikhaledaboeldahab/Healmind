import { useMemo, useState } from 'react'

export function usePagination(items = [], pageSize = 8) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return {
    currentPage: safePage,
    totalPages,
    pageItems,
    goToPage,
    resetPage: () => setCurrentPage(1),
  }
}
