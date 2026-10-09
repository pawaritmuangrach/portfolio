import { motion } from 'motion/react'
import { profile } from '../data/profile'
import { scrollToTarget } from '../lib/smoothScroll'

const EASE = [0.16, 1, 0.3, 1]

function Line({ children, ready, delay = 0 }) {
  return (
    <span className="hero__line">
      <motion.span
        initial={{ y: '115%' }}
        animate={{ y: ready ? '0%' : '115%' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero({ ready }) {
  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 16 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <motion.div className="hero__top mono" {...fade(0.5)}>
          <span>Portfolio ’{profile.edition.slice(2)}</span>
          <span className="status">
            <i className="status__dot" /> {profile.availability}
          </span>
        </motion.div>

        <h1 className="hero__name" aria-label={profile.name}>
          <Line ready={ready} delay={0.15}>
            {profile.firstName}
          </Line>
          <Line ready={ready} delay={0.3}>
            {profile.lastName}
          </Line>
        </h1>

        <div className="hero__foot">
          <motion.p className="hero__intro" {...fade(0.7)}>
            {profile.intro}
          </motion.p>
          <motion.button
            type="button"
            className="scroll-cue"
            onClick={() => scrollToTarget('#work')}
            data-cursor="link"
            {...fade(0.85)}
          >
            <span className="scroll-cue__ring" aria-hidden="true">
              ↓
            </span>
            <span className="mono">Scroll to explore</span>
          </motion.button>
        </div>
      </div>
    </section>
  )
}
