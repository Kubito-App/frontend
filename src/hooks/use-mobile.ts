import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 640
const MEDIUM_BREAKPOINT = 768

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  const [isMedium, setIsMedium] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(width <= ${MOBILE_BREAKPOINT}px)`)
    const medium = window.matchMedia(`(width <= ${MEDIUM_BREAKPOINT}px)`)
    const smCallback = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    }
    const mdCallback = () => {
      setIsMedium(window.innerWidth <= MEDIUM_BREAKPOINT)
    }
    mql.addEventListener('change', smCallback)
    medium.addEventListener('change', mdCallback)
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    setIsMedium(window.innerWidth <= MEDIUM_BREAKPOINT)
    return () => {
      mql.removeEventListener('change', smCallback)
      medium.removeEventListener('change', mdCallback)
    }
  }, [])

  return { isMobile: !!isMobile, isMedium: !!isMedium }
}
