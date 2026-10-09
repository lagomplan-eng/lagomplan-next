/**
 * app/demo/layout.tsx
 *
 * /demo/[prospect] is the same standalone co-branded guide as /guia/[partner]
 * (own <html>/<body>, fonts, GA consent), so it reuses that root layout.
 */
import GuiaLayout from '../guia/layout'

export { metadata } from '../guia/layout'
export default GuiaLayout
