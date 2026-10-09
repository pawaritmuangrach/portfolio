import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { CATEGORIES, projects } from '../data/projects'
import Cover from './Cover'

const FILTERS = ['All', ...CATEGORIES]

function HoverPreview({ project, x, y }) {
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 })
  const rotate = useTransform(useVelocity(sx), [-1600, 1600], [-12, 12])

  return (
    <motion.div className="preview" style={{ x: sx, y: sy, rotate }} aria-hidden="true">
      <AnimatePresence mode="popLayout">
        {project && (
          <motion.div
            key={project.id}
            className="preview__card"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Cover project={project} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Work({ onOpen }) {
  const [filter, setFilter] = useState('All')
  const [hovered, setHovered] = useState(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )
  const countFor = (f) => (f === 'All' ? projects.length : projects.filter((p) => p.category === f).length)

  const onMove = (e) => {
    x.set(e.clientX - 150)
    y.set(e.clientY - 190)
  }

  return (
    <section id="work" className="work">
      <div className="container">
        <div className="work__head">
          <h2 className="section-title">Selected work</h2>
          <div className="filters" role="tablist" aria-label="Filter work by category">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={`filter ${filter === f ? 'is-active' : ''}`}
                onClick={() => setFilter(f)}
                data-cursor="link"
              >
                {filter === f && <motion.span layoutId="filter-pill" className="filter__pill" />}
                <span className="filter__label">
                  {f} <sup>{countFor(f)}</sup>
                </span>
              </button>
            ))}
          </div>
        </div>

        <ul className="rows" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  className="row"
                  onClick={() => onOpen(p.id)}
                  onPointerEnter={() => setHovered(p)}
                  onFocus={() => setHovered(p)}
                  data-cursor="view"
                >
                  <span className="row__idx">{String(projects.indexOf(p) + 1).padStart(2, '0')}</span>
                  <span className="row__title">{p.title}</span>
                  <span className="row__meta">
                    <span className="row__cat">{p.category}</span>
                    <span className="row__year">{p.year || p.status}</span>
                  </span>
                  <Cover project={p} className="row__thumb" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <HoverPreview project={hovered} x={x} y={y} />
    </section>
  )
}
