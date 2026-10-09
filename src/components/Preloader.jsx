import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../data/profile'
import { lockScroll, unlockScroll } from '../lib/smoothScroll'

const DURATION_MS = 1400

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    lockScroll()
    const start = performance.now()
    let frame
    const tick = (now) => {
      const p = Math.min((now - start) / DURATION_MS, 1)
      setCount(Math.round(p * p * (3 - 2 * p) * 100))
      if (p < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setVisible(false)
        onDone()
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onDone])

  return (
    <AnimatePresence
      onExitComplete={() => {
        unlockScroll()
      }}
    >
      {visible && (
        <motion.div
          className="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <span className="mono preloader__name">{profile.name}</span>
          <span className="preloader__count">{count}</span>
          <span className="preloader__bar" style={{ transform: `scaleX(${count / 100})` }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
