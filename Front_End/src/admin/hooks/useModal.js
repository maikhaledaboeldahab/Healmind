import { useCallback, useState } from 'react'

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [payload, setPayload] = useState(null)

  const open = useCallback((data = null) => {
    setPayload(data)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setPayload(null)
  }, [])

  return { isOpen, payload, open, close }
}
