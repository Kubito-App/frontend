import { useEffect, useRef, useState } from 'react'

interface Params {
  value: unknown
  time?: number
  onChange?: (debouncedValue: unknown) => void
  omitFirstRender?: boolean
}

export const useDebounce = ({ value, time = 250, onChange, omitFirstRender }: Params) => {
  const [debounceValue, setDebounceValue] = useState(value)

  const isFirstRender = useRef(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value)
    }, time)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, time])

  useEffect(() => {
    if (onChange && (!omitFirstRender || (omitFirstRender && !isFirstRender.current))) {
      onChange(debounceValue)
    }

    isFirstRender.current = false
  }, [debounceValue])

  return debounceValue
}
