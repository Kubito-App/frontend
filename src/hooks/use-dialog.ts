import { useEffect, useRef, useState, type ReactNode } from 'react'

type Content = ReactNode | null

export const useDialog = () => {
  const [showDialog, setShowDialog] = useState(false)

  const showDialogTrace = useRef(showDialog)
  const dialogContent = useRef<Content>(null)

  useEffect(() => {
    showDialogTrace.current = showDialog
  }, [showDialog])

  function toggleDialog(content?: Content) {
    dialogContent.current = content || null
    setShowDialog(prev => !prev)
  }

  return {
    showDialog,
    toggleDialog,
    dialogContent: dialogContent.current,
  }
}
