import { motion } from 'motion/react'
import { profile } from '../data/profile'
import { scrollToTarget } from '../lib/smoothScroll'

const LINKS = [
  { label: 'Work', target: '#work' },
  { label: 'Timeline', target: '#timeline' },
  { label: 'About', target: '#about' },
  { label: 'Contact', target: '#contact' },
]

export default function Nav({ ready }) {
  return (
    <motion.header
      className="nav"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: ready ? 0 : -30, opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <button type="button" className="nav__logo" onClick={() => scrollToTarget(0)} data-cursor="link">
        {profile.name}
      </button>
      <nav aria-label="Main navigation">
        <ul>
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.target}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(l.target)
                }}
                data-cursor="link"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  )
}
