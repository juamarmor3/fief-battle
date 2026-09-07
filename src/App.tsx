import { BattleProvider } from './context/BattleContext'
import { useBattle } from './context/battleStore'
import { PhaseTracker } from './components/layout/PhaseTracker'
import { SetupScreen } from './components/setup/SetupScreen'
import { ProjectilePhase } from './components/phases/ProjectilePhase'

function BattleScreen() {
  const { state } = useBattle()

  switch (state.phase) {
    case 'setup':
      return <SetupScreen />
    case 'projectiles-trebuchet':
    case 'projectiles-bombard':
    case 'projectiles-archer':
      return <ProjectilePhase />
    default:
      return <p>Fase «{state.phase}» en construcción.</p>
  }
}

function App() {
  return (
    <BattleProvider>
      <main>
        <h1>Fief Battle</h1>
        <PhaseTracker />
        <BattleScreen />
      </main>
    </BattleProvider>
  )
}

export default App
