import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { profile } from '../data/profile'

function Word({ word, range, progress }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return <motion.span style={{ opacity }}>{word} </motion.span>
}

function ScrollText({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')

  return (
    <p ref={ref} className="about__lead" aria-label={text}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} word={w} range={[i / words.length, (i + 1) / words.length]} progress={scrollYProgress} />
      ))}
    </p>
  )
}

function Block({ title, children, delay = 0 }) {
  return (
    <motion.div
      className="about__block"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="mono">{title}</h3>
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container about__grid">
        <span className="mono about__label">About</span>
        <div className="about__content">
          <ScrollText text={profile.about} />
          <div className="about__blocks">
            <Block title="Focus">
              <ul>
                {profile.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Block>
            <Block title="Experience" delay={0.1}>
              <ul>
                {profile.experience.map((e) => (
                  <li key={e.org}>
                    <strong>{e.org}</strong>
                    <span>
                      {e.role} · {e.period}
                    </span>
                  </li>
                ))}
              </ul>
            </Block>
            <Block title="Now" delay={0.2}>
              <ul>
                {profile.now.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </Block>
          </div>
        </div>
      </div>
    </section>
  )
}
