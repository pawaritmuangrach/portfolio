import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { profile } from './data/profile'
import { getProject } from './data/projects'
import { scrollToTarget, startSmoothScroll } from './lib/smoothScroll'
import About from './components/About'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import ProjectModal from './components/ProjectModal'
import Work from './components/Work'

// three.js is the heaviest dependency — load it after the page has painted.
const Scene = lazy(() => import('./components/Scene'))

const HASH_PREFIX = '#work/'

const idFromHash = () => {
  const id = window.location.hash.startsWith(HASH_PREFIX) ? window.location.hash.slice(HASH_PREFIX.length) : null
  return id && getProject(id) ? id : null
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [activeId, setActiveId] = useState(idFromHash)

  useEffect(() => startSmoothScroll(), [])

  useEffect(() => {
    const onHash = () => setActiveId(idFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openProject = useCallback((id) => {
    window.history.pushState(null, '', `${HASH_PREFIX}${id}`)
    setActiveId(id)
  }, [])

  const closeProject = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + '#work')
    setActiveId(null)
  }, [])

  const handleReady = useCallback(() => setReady(true), [])

  return (
    <>
      <Cursor />
      <Preloader onDone={handleReady} />
      <Suspense fallback={null}>
        <Scene ready={ready} />
      </Suspense>
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Work onOpen={openProject} />
        <About />
        <Contact />
      </main>
      <footer className="footer">
        <span className="mono">
          © {profile.edition} {profile.name}
        </span>
        <button type="button" className="link-btn" onClick={() => scrollToTarget(0)} data-cursor="link">
          Back to top ↑
        </button>
      </footer>
      <AnimatePresence>
        {activeId && <ProjectModal projectId={activeId} onClose={closeProject} onNavigate={openProject} />}
      </AnimatePresence>
    </>
  )
}
