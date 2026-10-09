import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

// Custom cursor. Elements opt in with data-cursor="link" | "view".
export default function Cursor() {
  const [mode, setMode] = useState('')
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(fine)
    if (!fine) return undefined
    document.body.classList.add('has-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const onOver = (e) => {
      const el = e.target.closest?.('[data-cursor]')
      setMode(el ? el.dataset.cursor : '')
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div className={`cursor ${mode ? `cursor--${mode}` : ''}`} style={{ x: sx, y: sy }} aria-hidden="true">
      <span className="cursor__label">{mode === 'view' ? 'View' : ''}</span>
    </motion.div>
  )
}
