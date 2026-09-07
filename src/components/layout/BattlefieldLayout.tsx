import type { ReactNode } from 'react'

interface Props {
  sideA: ReactNode
  sideB: ReactNode
}

export function BattlefieldLayout({ sideA, sideB }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Bando A</h3>
        {sideA}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Bando B</h3>
        {sideB}
      </div>
    </div>
  )
}
