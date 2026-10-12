import { useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { projects } from '../data/projects'
import { durationLabel, formatDate, formatRange, parseDate } from '../lib/dates'

const EASE = [0.16, 1, 0.3, 1]
const DAY_MS = 86_400_000
const MIN_SPAN_MS = 30 * DAY_MS
const ORDERS = [
  ['newest', 'Newest first'],
  ['oldest', 'Oldest first'],
]

function RangeBar({ project, min, total }) {
  const start = parseDate(project.start).getTime()
  const end = project.end ? parseDate(project.end).getTime() : start
  const left = ((start - min) / total) * 100
  const width = Math.max(((end - start) / total) * 100, 1.5)
  const ongoing = project.end === 'present'

  return (
    <div className="tl__bar" aria-hidden="true">
      <motion.span
        className={`tl__bar-fill ${ongoing ? 'is-ongoing' : ''}`}
        style={{ left: `${Math.min(left, 100 - width)}%`, width: `${width}%` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      />
    </div>
  )
}

function Item({ project, min, total, onOpen }) {
  const dated = Boolean(project.start)
  const duration = durationLabel(project.start, project.end)

  return (
    <motion.li
      className={`tl__item ${dated ? '' : 'is-undated'}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="tl__date mono">
        <span>{dated ? formatRange(project.start, project.end) : 'Date TBA'}</span>
        {duration && <span className="tl__duration">{duration}</span>}
      </div>
      <span className="tl__dot" aria-hidden="true" />
      <div className="tl__body">
        <span className="mono tl__cat">{project.category}</span>
        <button type="button" className="tl__title" onClick={() => onOpen(project.id)} data-cursor="view">
          {project.title} <span aria-hidden="true">↗</span>
        </button>
        <p className="tl__summary">{project.summary}</p>
        {dated && <RangeBar project={project} min={min} total={total} />}
      </div>
    </motion.li>
  )
}

export default function Timeline({ onOpen }) {
  const [order, setOrder] = useState('newest')
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.65', 'end 0.55'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  const { items, undated, min, total, firstLabel } = useMemo(() => {
    const dated = projects.filter((p) => p.start)
    const startOf = (p) => parseDate(p.start).getTime()
    const sorted = [...dated].sort((a, b) => (order === 'newest' ? startOf(b) - startOf(a) : startOf(a) - startOf(b)))
    const starts = dated.map(startOf)
    const ends = dated.map((p) => (p.end ? parseDate(p.end).getTime() : startOf(p)))
    const minStart = starts.length ? Math.min(...starts) : Date.now()
    const maxEnd = Math.max(Date.now(), ...ends)
    return {
      items: sorted,
      undated: projects.filter((p) => !p.start),
      min: minStart,
      total: Math.max(maxEnd - minStart, MIN_SPAN_MS),
      firstLabel: starts.length ? formatDate(dated.find((p) => startOf(p) === minStart).start) : '',
    }
  }, [order])

  return (
    <section id="timeline" className="timeline">
      <div className="container">
        <div className="work__head">
          <div>
            <h2 className="section-title">Timeline</h2>
            {firstLabel && (
              <p className="tl__legend mono">Bars show when each piece of work ran, from {firstLabel} to today.</p>
            )}
          </div>
          <div className="filters" role="group" aria-label="Sort timeline">
            {ORDERS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={order === key}
                className={`filter ${order === key ? 'is-active' : ''}`}
                onClick={() => setOrder(key)}
                data-cursor="link"
              >
                {order === key && <motion.span layoutId="tl-pill" className="filter__pill" />}
                <span className="filter__label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tl-wrap" ref={listRef}>
          <span className="tl__line" aria-hidden="true">
            <motion.span className="tl__line-fill" style={{ scaleY: progress }} />
          </span>
          <ol className="tl">
            {[...items, ...undated].map((p) => (
              <Item key={p.id} project={p} min={min} total={total} onOpen={onOpen} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
