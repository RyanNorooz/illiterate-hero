import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * detects is user is ever inactive for the specified timeout
 * @param timeout time that is considered active and not idle
 */
export default function useIdleDetector(timeout = 10) {
  const [idleTime, setIdleTime] = useState(0)
  const interval = useRef<NodeJS.Timeout | null>(null)

  const resetTime = useCallback(() => setIdleTime(0), [])

  useEffect(() => {
    interval.current = setInterval(() => setIdleTime((ps) => ps + 1), 1000)

    window.addEventListener('mousemove', resetTime)
    window.addEventListener('keypress', resetTime)
    return () => {
      window.removeEventListener('mousemove', resetTime)
      window.removeEventListener('keypress', resetTime)
      if (interval.current) clearInterval(interval.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { idleTime, isIdle: idleTime >= timeout }
}
