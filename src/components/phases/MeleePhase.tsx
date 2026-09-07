import { useEffect, useState } from 'react'
import { useBattle } from '../../context/battleStore'
import { sideColorClass, sideInFortifiedCity, sideInStronghold } from '../../rules/sides'
import { computeSideStrengthPoints } from '../../rules/strength'
import { meleeDiceCount, resolveMeleeAttack } from '../../rules/melee'
import { pooledActiveNobles } from '../../rules/losses'
import { hitsText } from '../../rules/battleText'
import { useSides } from '../../hooks/useSides'
import { useRoundStage } from '../../hooks/useRoundStage'
import { DiceInput } from './DiceInput'
import type { LossTask } from './LossPanels'
import { RoundResultsAndLosses } from './RoundResultsAndLosses'

export function MeleePhase() {
  const { dispatch } = useBattle()
  const { sideA, sideB } = useSides()

  // Capturados una sola vez al entrar: las bajas de esta misma ronda de
  // Melé no deben cambiar el nº de dados a mitad de camino.
  const [{ diceA, diceB, excaliburA, excaliburB }] = useState(() => {
    const spA = computeSideStrengthPoints(sideA)
    const spB = computeSideStrengthPoints(sideB)
    return {
      diceA: meleeDiceCount(spA, sideInStronghold(sideB), sideInFortifiedCity(sideB)),
      diceB: meleeDiceCount(spB, sideInStronghold(sideA), sideInFortifiedCity(sideA)),
      excaliburA: pooledActiveNobles(sideA).some((n) => n.hasExcalibur),
      excaliburB: pooledActiveNobles(sideB).some((n) => n.hasExcalibur),
    }
  })

  const [rollsA, setRollsA] = useState<number[]>(() => Array(Math.max(diceA, 0)).fill(0))
  const [rollsB, setRollsB] = useState<number[]>(() => Array(Math.max(diceB, 0)).fill(0))
  const { stage, setStage, tasks, setTasks, applied, recordApplied, resultText, setResultText, resultsRef } =
    useRoundStage()
  const [skip] = useState(() => diceA <= 0 && diceB <= 0)

  function advance() {
    dispatch({ type: 'SET_PHASE', phase: 'round-outcome' })
  }

  useEffect(() => {
    if (skip) dispatch({ type: 'SET_PHASE', phase: 'round-outcome' })
  }, [skip, dispatch])

  if (skip) return null

  function handleConfirmRoll() {
    const hitsA = diceA > 0 ? resolveMeleeAttack(rollsA, excaliburA) : 0
    const hitsB = diceB > 0 ? resolveMeleeAttack(rollsB, excaliburB) : 0
    const newTasks: LossTask[] = []
    if (hitsA > 0) newTasks.push({ side: 'B', hits: hitsA })
    if (hitsB > 0) newTasks.push({ side: 'A', hits: hitsB })
    setTasks(newTasks)
    setResultText({
      a: diceA > 0 ? hitsText(hitsA, 'B', excaliburA ? 'Excalibur' : undefined) : 'Sin fuerza para luchar.',
      b: diceB > 0 ? hitsText(hitsB, 'A', excaliburB ? 'Excalibur' : undefined) : 'Sin fuerza para luchar.',
    })
    setStage('rolled')
  }

  return (
    <div className="card">
      <h3>Melé</h3>
      <div className="player-columns">
        <div className={`card player-column ${sideColorClass(sideA)}`}>
          <p className="side-tag">Bando A</p>
          {diceA > 0 ? (
            <DiceInput label={`${diceA} dado(s)`} count={diceA} values={rollsA} onChange={setRollsA} disabled={stage !== 'rolling'} />
          ) : (
            <p>Sin fuerza para luchar.</p>
          )}
        </div>
        <div className={`card player-column ${sideColorClass(sideB)}`}>
          <p className="side-tag">Bando B</p>
          {diceB > 0 ? (
            <DiceInput label={`${diceB} dado(s)`} count={diceB} values={rollsB} onChange={setRollsB} disabled={stage !== 'rolling'} />
          ) : (
            <p>Sin fuerza para luchar.</p>
          )}
        </div>
      </div>
      {stage === 'rolling' && (
        <button type="button" onClick={handleConfirmRoll}>
          Confirmar tirada
        </button>
      )}

      <RoundResultsAndLosses
        sideA={sideA}
        sideB={sideB}
        stage={stage}
        setStage={setStage}
        resultText={resultText}
        resultsRef={resultsRef}
        tasks={tasks}
        applied={applied}
        recordApplied={recordApplied}
        onComplete={advance}
        nextLabel="Fin de Ronda"
      />
    </div>
  )
}
