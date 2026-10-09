const WORDS = ['Projects', 'Hackathons', 'Internships', 'Experiments']

export default function Marquee() {
  // Two identical halves so the -50% translate loops seamlessly.
  const half = [...WORDS, ...WORDS]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((n) => (
          <div className="marquee__half" key={n}>
            {half.map((w, i) => (
              <span key={`${n}-${i}`} className={i % 2 ? 'is-outline' : ''}>
                {w} <b>✦</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
