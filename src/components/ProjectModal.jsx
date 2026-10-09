import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { projects } from '../data/projects'
import { lockScroll, unlockScroll } from '../lib/smoothScroll'
import Cover from './Cover'

const EASE = [0.76, 0, 0.24, 1]
const HTTP_URL = /^(https?:|mailto:)/i

function TiltCover({ project }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const glare = useTransform(ry, [-10, 10], ['0%', '100%'])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 20)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 20)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div className="tilt" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div className="tilt__card" style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}>
        <Cover project={project} />
        <motion.span className="tilt__glare" style={{ backgroundPositionX: glare }} />
      </motion.div>
    </div>
  )
}

export default function ProjectModal({ projectId, onClose, onNavigate }) {
  const scroller = useRef(null)
  const index = projects.findIndex((p) => p.id === projectId)
  const project = projects[index]
  const next = projects[(index + 1) % projects.length]

  useEffect(() => {
    lockScroll()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [onClose])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [projectId])

  if (!project) return null

  const meta = [
    ['Category', project.category],
    ['Role', project.role],
    ['Period', project.period || project.year],
    ['Status', project.status],
  ].filter(([, v]) => v)
  const links = (project.links || []).filter((l) => HTTP_URL.test(l.url))
  const gallery = (project.images || []).slice(1)

  return (
    <motion.div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="modal__scroll" ref={scroller} data-lenis-prevent>
        <div className="container modal__inner" key={project.id}>
          <div className="modal__bar">
            <button type="button" className="link-btn" onClick={onClose} data-cursor="link" autoFocus>
              ← Back
            </button>
            <span className="mono">
              {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          <motion.h2
            className="modal__title"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.title}
          </motion.h2>

          <TiltCover project={project} />

          <dl className="modal__meta">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="modal__body">
            <p className="modal__summary">{project.summary}</p>
            <div className="modal__text">
              {project.description.map((para) => (
                <p key={para}>{para}</p>
              ))}
              {project.highlights.length > 0 && (
                <ul className="modal__highlights">
                  {project.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              {project.stack.length > 0 && (
                <ul className="chips" aria-label="Technologies">
                  {project.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              {links.length > 0 && (
                <div className="modal__links">
                  {links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="pill-link" data-cursor="link">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {gallery.length > 0 && (
            <div className="modal__gallery">
              {gallery.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          )}

          <button type="button" className="modal__next" onClick={() => onNavigate(next.id)} data-cursor="link">
            <span className="mono">Next project</span>
            <span className="modal__next-title">{next.title} →</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
