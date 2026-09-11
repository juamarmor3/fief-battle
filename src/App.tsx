import { BattleProvider } from './context/BattleContext'
import { useBattle } from './context/battleStore'
import { PhaseTracker } from './components/layout/PhaseTracker'
import { SetupScreen } from './components/setup/SetupScreen'
import { ProjectilePhase } from './components/phases/ProjectilePhase'
import { MeleePhase } from './components/phases/MeleePhase'
import { RoundOutcomePhase } from './components/phases/RoundOutcomePhase'
import { SiegePhase } from './components/phases/SiegePhase'
import { CaptivesPhase } from './components/phases/CaptivesPhase'
import { SummaryPhase } from './components/phases/SummaryPhase'

function BattleScreen() {
  const { state } = useBattle()

  switch (state.phase) {
    case 'setup':
      return <SetupScreen />
    case 'projectiles-trebuchet':
    case 'projectiles-bombard':
    case 'projectiles-archer':
      return <ProjectilePhase />
    case 'melee-roll':
      return <MeleePhase />
    case 'round-outcome':
      return <RoundOutcomePhase />
    case 'siege':
      return <SiegePhase />
    case 'captives-ransom':
      return <CaptivesPhase />
    case 'summary':
      return <SummaryPhase />
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
