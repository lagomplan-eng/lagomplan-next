/**
 * components/smart-finds/PersonaBadge.tsx
 *
 * Small persona-coloured pill shown in each KitSection header next to
 * the "KIT NN" eyebrow. Three palettes — one per persona — so a kit's
 * audience reads at a glance during scroll.
 *
 * Pure render — safe in Server Components.
 */

import type { Persona } from '../../lib/smart-finds'

const PALETTE: Record<Persona, { bg: string; fg: string; label: string }> = {
  familias: { bg: '#E1F5EE', fg: '#085041', label: 'Familias' },
  parejas:  { bg: '#EEEDFE', fg: '#26215C', label: 'Parejas'  },
  fan:      { bg: '#FAEEDA', fg: '#412402', label: 'Fan'      },
}

interface Props {
  persona: Persona
}

export default function PersonaBadge({ persona }: Props) {
  const { bg, fg, label } = PALETTE[persona]
  return (
    <span style={{
      display:        'inline-block',
      background:     bg,
      color:          fg,
      fontFamily:     "'Manrope',sans-serif",
      fontSize:       10,
      fontWeight:     700,
      letterSpacing:  '.1em',
      textTransform:  'uppercase',
      padding:        '3px 10px',
      borderRadius:   999,
      whiteSpace:     'nowrap',
    }}>
      {label}
    </span>
  )
}
