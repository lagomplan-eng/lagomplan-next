// Copies each content/demos/<slug>/ image (logo) to public/demos/<slug>/ so it
// is served as a static file. Runs before `dev` and `build` (see package.json);
// public/demos/ is generated and git-ignored. Warns, never fails, on a missing logo.
import fs from 'node:fs'
import path from 'node:path'

const src = path.join(process.cwd(), 'content', 'demos')
const dst = path.join(process.cwd(), 'public', 'demos')
fs.rmSync(dst, { recursive: true, force: true })
if (!fs.existsSync(src)) process.exit(0)

let n = 0
for (const d of fs.readdirSync(src, { withFileTypes: true })) {
  if (!d.isDirectory()) continue
  const cfgFile = path.join(src, d.name, 'demo.json')
  const logo = fs.existsSync(cfgFile) ? JSON.parse(fs.readFileSync(cfgFile, 'utf8')).partner?.logo : undefined
  if (logo && !fs.existsSync(path.join(src, d.name, logo))) console.warn(`[demos] ${d.name}: logo "${logo}" declared but missing`)
  for (const f of fs.readdirSync(path.join(src, d.name))) {
    if (!/\.(png|jpe?g|webp|svg)$/i.test(f)) continue
    fs.mkdirSync(path.join(dst, d.name), { recursive: true })
    fs.copyFileSync(path.join(src, d.name, f), path.join(dst, d.name, f)); n++
  }
}
console.log(`[demos] synced ${n} asset(s) to public/demos/`)
