// Dates in projects.js are strings: 'YYYY-MM', 'YYYY-MM-DD', or 'present' (end only).

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_MS = 86_400_000

export function parseDate(value) {
  if (!value) return null
  if (value === 'present') return new Date()
  const [y, m = 1, d = 1] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(value) {
  if (!value) return ''
  if (value === 'present') return 'Present'
  const date = parseDate(value)
  const month = MONTHS[date.getMonth()]
  return value.split('-').length === 3 ? `${date.getDate()} ${month} ${date.getFullYear()}` : `${month} ${date.getFullYear()}`
}

export function formatRange(start, end) {
  if (!start) return ''
  if (!end || end === start) return formatDate(start)
  return `${formatDate(start)} – ${formatDate(end)}`
}

export function durationLabel(start, end) {
  const s = parseDate(start)
  const e = parseDate(end)
  if (!s || !e) return ''
  const days = Math.max(1, Math.round((e - s) / DAY_MS))
  if (days < 31) return `${days} ${days === 1 ? 'day' : 'days'}`
  const months = Math.round(days / 30.44)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'}`
  const years = Math.floor(months / 12)
  const rest = months % 12
  return rest ? `${years} yr ${rest} mo` : `${years} ${years === 1 ? 'year' : 'years'}`
}
