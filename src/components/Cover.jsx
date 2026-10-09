// Generated cover art for a project. Uses project.images[0] when available.

function seededRandom(seed) {
  let s = 0
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export default function Cover({ project, className = '' }) {
  const { bg, fg } = project.cover
  const image = project.images?.[0]

  if (image) {
    return (
      <div className={`cover ${className}`} style={{ background: bg }}>
        <img src={image} alt={`${project.title} preview`} loading="lazy" />
      </div>
    )
  }

  const rand = seededRandom(project.id)
  const nodes = Array.from({ length: 7 }, () => ({
    x: 12 + rand() * 76,
    y: 12 + rand() * 60,
    r: 2.5 + rand() * 9,
  }))

  return (
    <div className={`cover ${className}`} style={{ background: bg, color: fg }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {nodes.slice(1).map((n, i) => (
          <line
            key={`l${i}`}
            x1={nodes[i].x}
            y1={nodes[i].y}
            x2={n.x}
            y2={n.y}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="0.35"
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={`c${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={i % 3 === 0 ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="0.45"
            strokeOpacity={i % 3 === 0 ? 1 : 0.7}
          />
        ))}
      </svg>
      <span className="cover__title">{project.title}</span>
      <span className="cover__tag">{project.category}</span>
    </div>
  )
}
