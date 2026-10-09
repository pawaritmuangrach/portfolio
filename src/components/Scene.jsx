import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { prefersReducedMotion } from '../lib/smoothScroll'

const ORANGE = '#ff5b1f'
const INK = '#17130f'
const WHITE = '#ffffff'

// A small "molecule": nods to the chemistry project and to connected bots.
const ATOMS = [
  { p: [0, 0, 0], r: 0.72, c: ORANGE },
  { p: [1.5, 0.7, 0.3], r: 0.38, c: INK },
  { p: [-1.4, 0.9, -0.2], r: 0.46, c: WHITE },
  { p: [0.2, -1.5, 0.6], r: 0.42, c: INK },
  { p: [-0.9, -1.1, -0.9], r: 0.3, c: ORANGE },
  { p: [2.35, -0.5, -0.6], r: 0.26, c: WHITE },
  { p: [-2.3, -0.1, 0.5], r: 0.24, c: INK },
  { p: [1.0, 1.75, -0.8], r: 0.22, c: WHITE },
]
const BONDS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 5],
  [2, 6],
  [1, 7],
]

// Where the molecule sits for each section.
// x: fraction of viewport width from center, y: fraction of viewport height,
// w: molecule diameter as a fraction of viewport width, o: opacity.
const TARGETS = {
  hero: { x: 0.2, y: 0, w: 0.78, o: 1 },
  work: { x: 0, y: 0, w: 0.55, o: 0.1 },
  about: { x: -0.3, y: 0, w: 0.33, o: 1 },
  contact: { x: 0.3, y: 0.1, w: 0.34, o: 1 },
}
const MOLECULE_DIAMETER = 7.4 // world units at scale 1
const MAX_SCALE = 1.15
const SECTION_IDS = Object.keys(TARGETS)

function Bond({ a, b }) {
  const { position, quaternion, length } = useMemo(() => {
    const va = new THREE.Vector3(...a)
    const vb = new THREE.Vector3(...b)
    const dir = vb.clone().sub(va)
    const length = dir.length()
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize(),
    )
    return { position: va.clone().add(vb).multiplyScalar(0.5), quaternion, length }
  }, [a, b])

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[0.045, 0.045, length, 12]} />
      <meshStandardMaterial color="#cfc8bb" roughness={0.6} />
    </mesh>
  )
}

function Dust({ count = 40 }) {
  const ref = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 2.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      dummy.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.7,
        radius * Math.cos(phi) * 0.6,
      )
      dummy.scale.setScalar(0.03 + Math.random() * 0.05)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [count, dummy])

  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.04
  })

  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color={INK} />
    </instancedMesh>
  )
}

function Molecule({ ready }) {
  const group = useRef()
  const inner = useRef()
  const rings = useRef()
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 })
  const state = useRef({ x: 0, y: 0, s: 0, o: 0, intro: 0 })
  const reduced = useMemo(prefersReducedMotion, [])

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((frame, dt) => {
    const { viewport, gl, clock } = frame
    const t = clock.elapsedTime
    const s = state.current
    const p = pointer.current
    const mobile = window.innerWidth < 768

    // Pick the section sitting at the middle of the viewport.
    let active = 'hero'
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (!el) continue
      const r = el.getBoundingClientRect()
      if (r.top <= window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5) {
        active = id
        break
      }
    }
    const target = TARGETS[active]
    const width = mobile ? 0.85 : target.w
    const tx = mobile ? 0 : target.x * viewport.width
    const ty = (mobile ? 0.2 : target.y) * viewport.height
    const ts = Math.min((width * viewport.width) / MOLECULE_DIAMETER, MAX_SCALE)
    const to = target.o * (mobile ? 0.5 : 1)

    s.x = THREE.MathUtils.damp(s.x, tx, 2.6, dt)
    s.y = THREE.MathUtils.damp(s.y, ty, 2.6, dt)
    s.s = THREE.MathUtils.damp(s.s, ts, 2.6, dt)
    s.o = THREE.MathUtils.damp(s.o, to, 3, dt)
    s.intro = THREE.MathUtils.damp(s.intro, ready ? 1 : 0, 1.6, dt)

    p.sx = THREE.MathUtils.damp(p.sx, p.x, 3, dt)
    p.sy = THREE.MathUtils.damp(p.sy, p.y, 3, dt)

    const g = group.current
    g.position.set(s.x, s.y, 0)
    g.scale.setScalar(Math.max(s.s * s.intro, 0.0001))

    const motion = reduced ? 0 : 1
    inner.current.rotation.y = window.scrollY * 0.0016 + t * 0.12 * motion + p.sx * 0.6
    inner.current.rotation.x = p.sy * 0.35 + Math.sin(t * 0.4) * 0.08 * motion
    inner.current.position.y = Math.sin(t * 0.8) * 0.12 * motion
    rings.current.rotation.z = t * 0.1 * motion
    rings.current.rotation.x = Math.PI / 2.6 + p.sy * 0.2

    gl.domElement.style.opacity = String(s.o)
  })

  return (
    <group ref={group}>
      <group ref={inner}>
        {ATOMS.map((a, i) => (
          <mesh key={i} position={a.p}>
            <sphereGeometry args={[a.r, 48, 48]} />
            <meshPhysicalMaterial
              color={a.c}
              roughness={a.c === ORANGE ? 0.28 : 0.5}
              clearcoat={a.c === ORANGE ? 0.8 : 0.2}
              clearcoatRoughness={0.3}
            />
          </mesh>
        ))}
        {BONDS.map(([i, j]) => (
          <Bond key={`${i}-${j}`} a={ATOMS[i].p} b={ATOMS[j].p} />
        ))}
      </group>
      <group ref={rings}>
        <mesh>
          <torusGeometry args={[3.2, 0.008, 8, 160]} />
          <meshBasicMaterial color={INK} transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[3.7, 0.006, 8, 160]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.7} />
        </mesh>
      </group>
      <Dust />
    </group>
  )
}

export default function Scene({ ready }) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} />
        <pointLight position={[-4, -2, 3]} intensity={18} color={ORANGE} />
        <Molecule ready={ready} />
      </Canvas>
    </div>
  )
}
