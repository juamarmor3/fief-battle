import { BattleProvider } from './context/BattleContext'
import { useBattle } from './context/battleStore'
import { SetupScreen } from './components/setup/SetupScreen'

function BattleScreen() {
  const { state } = useBattle()

  switch (state.phase) {
    case 'setup':
      return <SetupScreen />
    default:
      return <p>Fase «{state.phase}» en construcción.</p>
  }
}

function App() {
  return (
    <main>
      <h1>Fief Battle</h1>
      <BattleProvider>
        <BattleScreen />
      </BattleProvider>
    </main>
  )
}

export default App
