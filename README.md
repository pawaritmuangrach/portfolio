# Pawarit Muangrat — Portfolio

Vite + React + Three.js portfolio. Minimal white, orange accent, light 3D.

## Develop

```bash
npm install
npm run dev
```

## Add or edit content

- `src/data/projects.js` — append an object to add a project / hackathon / internship / other.
- `src/data/profile.js` — name, bio, email, socials, CV link (`public/cv.pdf` + `cvUrl: '/cv.pdf'`).
- Images: put files in `public/work/` and list them in a project's `images` array.

## Deploy (Render)

`render.yaml` defines a free static site: build `npm ci && npm run build`, publish `dist`.
Render dashboard → New → Blueprint → select this repo.
