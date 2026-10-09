import { useState } from 'react'
import { motion } from 'motion/react'
import { profile } from '../data/profile'
import Magnetic from './Magnetic'

const EASE = [0.16, 1, 0.3, 1]

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const socials = profile.socials.filter((s) => s.url)

  return (
    <section id="contact" className="contact">
      <div className="container">
        <span className="mono">Contact</span>
        <motion.h2
          className="contact__title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
        >
          Let’s build
          <br />
          something <em>together.</em>
        </motion.h2>

        <div className="contact__row">
          <Magnetic>
            <a className="round-btn" href={`mailto:${profile.email}`} data-cursor="link">
              Get in touch
            </a>
          </Magnetic>

          <div className="contact__links">
            <button type="button" className="email-btn" onClick={copyEmail} data-cursor="link">
              {profile.email}
              <span className="mono" role="status">
                {copied ? 'Copied ✓' : 'Copy'}
              </span>
            </button>
            <ul>
              {profile.cvUrl && (
                <li>
                  <a href={profile.cvUrl} download data-cursor="link">
                    Download CV ↓
                  </a>
                </li>
              )}
              {socials
                .filter((s) => s.label !== 'Email')
                .map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" data-cursor="link">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
