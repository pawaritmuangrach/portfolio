import Lenis from 'lenis'

let instance = null

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {}

  instance = new Lenis({ lerp: 0.09, smoothWheel: true })
  let frame = requestAnimationFrame(function raf(time) {
    instance?.raf(time)
    frame = requestAnimationFrame(raf)
  })

  return () => {
    cancelAnimationFrame(frame)
    instance?.destroy()
    instance = null
  }
}

export function scrollToTarget(target) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export function lockScroll() {
  instance?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  instance?.start()
  document.documentElement.style.overflow = ''
}
