import { useEffect, useState } from 'react'
import { useBattle } from '../../context/battleStore'
import type { Noble, PlayerArmy, Side } from '../../rules/types'
import {
  pooledUnitCount,
  sideColorClass,
  sideInFortifiedCity,
  sideInStronghold,
} from '../../rules/sides'
import {
  resolveArcherAttack,
  resolveBombardAttack,
  resolveTrebuchetAttack,
  getArcherAttackRequirement,
} from '../../rules/projectiles'
import { pooledActiveNobles } from '../../rules/losses'
import { computeSideStrengthPoints } from '../../rules/strength'
import { idleText, hitsText } from '../../rules/battleText'
import { useSides } from '../../hooks/useSides'
import { useRoundStage } from '../../hooks/useRoundStage'
import { DiceInput } from './DiceInput'
import type { LossTask } from './LossPanels'
import { RoundResultsAndLosses } from './RoundResultsAndLosses'
import { SubPhaseTracker } from '../layout/SubPhaseTracker'

const PROJECTILE_STEPS = [
  { key: 'projectiles-trebuchet', label: 'Trebuchets' },
  { key: 'projectiles-bombard', label: 'Bombardas' },
  { key: 'projectiles-archer', label: 'Arqueros / Ballesteros' },
]

function TrebuchetStep({ onComplete }: { onComplete: () => void }) {
  const { sideA, sideB } = useSides()
  const countA = pooledUnitCount(sideA, 'trebuchet')
  const countB = pooledUnitCount(sideB, 'trebuchet')

  const [rollsA, setRollsA] = useState<number[]>([0, 0])
  const [rollsB, setRollsB] = useState<number[]>([0, 0])
  const { stage, setStage, tasks, setTasks, applied, recordApplied, resultText, setResultText, resultsRef } =
    useRoundStage()
  // Se captura una sola vez al entrar en la sub-fase: las bajas que ocurran
  // durante la propia sub-fase (p.ej. autodestrucción de Bombardas) no deben
  // hacer que se salte a mitad de camino.
  const [skip] = useState(() => countA <= 0 && countB <= 0)

  useEffect(() => {
    if (skip) onComplete()
  }, [skip, onComplete])

  if (skip) return null

  function handleConfirmRoll() {
    const resultA = countA > 0 ? resolveTrebuchetAttack(countA, rollsA) : { hits: 0, secondTrebuchetBonus: false }
    const resultB = countB > 0 ? resolveTrebuchetAttack(countB, rollsB) : { hits: 0, secondTrebuchetBonus: false }
    const newTasks: LossTask[] = []
    if (resultA.hits > 0) newTasks.push({ side: 'B', hits: resultA.hits })
    if (resultB.hits > 0) newTasks.push({ side: 'A', hits: resultB.hits })
    setTasks(newTasks)
    setResultText({
      a: countA > 0 ? hitsText(resultA.hits, 'B', resultA.secondTrebuchetBonus ? '+1f' : undefined) : idleText('Trebuchets'),
      b: countB > 0 ? hitsText(resultB.hits, 'A', resultB.secondTrebuchetBonus ? '+1f' : undefined) : idleText('Trebuchets'),
    })
    setStage('rolled')
  }

  return (
    <div className="card">
      <h3>Trebuchets</h3>
      <div className="player-columns">
        <div className={`card player-column ${sideColorClass(sideA)}`}>
          <p className="side-tag">Bando A</p>
          {countA > 0 ? (
            <DiceInput
              label={`${countA} Trebuchet(s)`}
              count={2}
              values={rollsA}
              onChange={setRollsA}
              disabled={stage !== 'rolling'}
            />
          ) : (
            <p>{idleText('Trebuchets')}</p>
          )}
        </div>
        <div className={`card player-column ${sideColorClass(sideB)}`}>
          <p className="side-tag">Bando B</p>
          {countB > 0 ? (
            <DiceInput
              label={`${countB} Trebuchet(s)`}
              count={2}
              values={rollsB}
              onChange={setRollsB}
              disabled={stage !== 'rolling'}
            />
          ) : (
            <p>{idleText('Trebuchets')}</p>
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
        onComplete={onComplete}
      />
    </div>
  )
}

function BombardStep({ onComplete }: { onComplete: () => void }) {
  const { dispatch } = useBattle()
  const { sideA, sideB } = useSides()
  // Capturados una sola vez al entrar: la explosión de Bombardas reduce
  // estos conteos durante la propia sub-fase y no deben cambiar la pantalla
  // (dados/columna) a mitad de camino ni disparar un salto de sub-fase.
  const [{ a: countA, b: countB }] = useState(() => ({
    a: pooledUnitCount(sideA, 'bombard'),
    b: pooledUnitCount(sideB, 'bombard'),
  }))

  const [rollsA, setRollsA] = useState<number[]>(() => Array(Math.max(countA, 0)).fill(0))
  const [rollsB, setRollsB] = useState<number[]>(() => Array(Math.max(countB, 0)).fill(0))
  const { stage, setStage, tasks, setTasks, applied, recordApplied, resultText, setResultText, resultsRef } =
    useRoundStage()
  const skip = countA <= 0 && countB <= 0

  useEffect(() => {
    if (skip) onComplete()
  }, [skip, onComplete])

  if (skip) return null

  function applySelfExplosion(players: PlayerArmy[], exploded: number) {
    if (exploded <= 0) return
    let remainingBombards = exploded
    let remainingMenAtArms = exploded
    const removals = players.map((p) => {
      const bombardTake = Math.min(remainingBombards, p.units.bombard ?? 0)
      remainingBombards -= bombardTake
      const menTake = Math.min(remainingMenAtArms, p.units.menAtArms ?? 0)
      remainingMenAtArms -= menTake
      return { playerId: p.id, units: { bombard: bombardTake, menAtArms: menTake } }
    })
    dispatch({ type: 'APPLY_LOSSES', removals })
  }

  function handleConfirmRoll() {
    const resultA = countA > 0 ? resolveBombardAttack(countA, rollsA) : { hits: 0, exploded: 0 }
    const resultB = countB > 0 ? resolveBombardAttack(countB, rollsB) : { hits: 0, exploded: 0 }
    applySelfExplosion(sideA, resultA.exploded)
    applySelfExplosion(sideB, resultB.exploded)
    const newTasks: LossTask[] = []
    if (resultA.hits > 0) newTasks.push({ side: 'B', hits: resultA.hits })
    if (resultB.hits > 0) newTasks.push({ side: 'A', hits: resultB.hits })
    setTasks(newTasks)
    setResultText({
      a:
        (countA > 0 ? hitsText(resultA.hits, 'B') : idleText('Bombardas')) +
        (resultA.exploded > 0 ? ` · −${resultA.exploded} propia(s)` : ''),
      b:
        (countB > 0 ? hitsText(resultB.hits, 'A') : idleText('Bombardas')) +
        (resultB.exploded > 0 ? ` · −${resultB.exploded} propia(s)` : ''),
    })
    setStage('rolled')
  }

  return (
    <div className="card">
      <h3>Bombardas</h3>
      <div className="player-columns">
        <div className={`card player-column ${sideColorClass(sideA)}`}>
          <p className="side-tag">Bando A</p>
          {countA > 0 ? (
            <DiceInput
              label={`${countA} Bombarda(s)`}
              count={countA}
              values={rollsA}
              onChange={setRollsA}
              disabled={stage !== 'rolling'}
            />
          ) : (
            <p>{idleText('Bombardas')}</p>
          )}
        </div>
        <div className={`card player-column ${sideColorClass(sideB)}`}>
          <p className="side-tag">Bando B</p>
          {countB > 0 ? (
            <DiceInput
              label={`${countB} Bombarda(s)`}
              count={countB}
              values={rollsB}
              onChange={setRollsB}
              disabled={stage !== 'rolling'}
            />
          ) : (
            <p>{idleText('Bombardas')}</p>
          )}
        </div>
      </div>
      {stage === 'rolling' && (
        <>
          <p style={{ color: 'var(--color-text-muted)' }}>Blank = −1 Bombarda propia y −1 Sargento.</p>
          <button type="button" onClick={handleConfirmRoll}>
            Confirmar tirada
          </button>
        </>
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
        onComplete={onComplete}
      />
    </div>
  )
}

function archerIdleReason(count: number, targetFortified: boolean, targetStronghold: boolean): string {
  if (count <= 0) return idleText('Arqueros/Ballesteros')
  if (targetFortified) return `Mín. 3 vs Amurallada (tienes ${count}).`
  if (targetStronghold) return `Mín. 2 vs Fortaleza (tienes ${count}).`
  return 'No puede disparar.'
}

function ArcherStep({ onComplete }: { onComplete: () => void }) {
  const { dispatch } = useBattle()
  const { sideA, sideB } = useSides()
  // Capturados una sola vez al entrar: no deben cambiar por bajas que
  // ocurran dentro de esta misma sub-fase (p.ej. arqueros que mueren al
  // recibir hits del otro bando).
  const [{ groupA, groupB, reqA, reqB, noblesOnA, noblesOnB }] = useState(() => {
    const gA = pooledUnitCount(sideA, 'archer') + pooledUnitCount(sideA, 'crossbowman')
    const gB = pooledUnitCount(sideB, 'archer') + pooledUnitCount(sideB, 'crossbowman')
    return {
      groupA: gA,
      groupB: gB,
      reqA: getArcherAttackRequirement(gA, sideInFortifiedCity(sideB), sideInStronghold(sideB)),
      reqB: getArcherAttackRequirement(gB, sideInFortifiedCity(sideA), sideInStronghold(sideA)),
      noblesOnA: pooledActiveNobles(sideA),
      noblesOnB: pooledActiveNobles(sideB),
    }
  })

  const [targetNobleA, setTargetNobleA] = useState(false)
  const [targetNobleB, setTargetNobleB] = useState(false)
  const [rollsA, setRollsA] = useState<number[]>([0])
  const [rollsB, setRollsB] = useState<number[]>([0])
  const { stage, setStage, tasks, setTasks, applied, recordApplied, resultText, setResultText, resultsRef } =
    useRoundStage()
  const skip = !reqA.canFire && !reqB.canFire

  useEffect(() => {
    if (skip) onComplete()
  }, [skip, onComplete])

  if (skip) return null

  function describeArcherResult(
    canFire: boolean,
    targetingNoble: boolean,
    nobleSlain: boolean,
    hits: number,
    targetLetter: Side,
    opponentNobles: Noble[],
  ): string {
    if (!canFire) return 'No dispara.'
    if (targetingNoble) {
      return nobleSlain ? `Asesina a ${opponentNobles[0]?.name ?? 'Noble'}.` : 'Falla disparo a Noble.'
    }
    return hitsText(hits, targetLetter)
  }

  function handleConfirmRoll() {
    const resultA = reqA.canFire
      ? resolveArcherAttack({
          archerCount: groupA,
          targetFortifiedCity: sideInFortifiedCity(sideB),
          targetStronghold: sideInStronghold(sideB),
          targetNoble: targetNobleA,
          rolls: rollsA,
        })
      : { hits: 0, targetingNoble: false, nobleSlain: false }
    const resultB = reqB.canFire
      ? resolveArcherAttack({
          archerCount: groupB,
          targetFortifiedCity: sideInFortifiedCity(sideA),
          targetStronghold: sideInStronghold(sideA),
          targetNoble: targetNobleB,
          rolls: rollsB,
        })
      : { hits: 0, targetingNoble: false, nobleSlain: false }

    const newTasks: LossTask[] = []
    const slain: string[] = []

    if (resultA.targetingNoble) {
      if (resultA.nobleSlain && noblesOnB[0]) slain.push(noblesOnB[0].id)
    } else if (resultA.hits > 0) {
      newTasks.push({ side: 'B', hits: resultA.hits })
    }

    if (resultB.targetingNoble) {
      if (resultB.nobleSlain && noblesOnA[0]) slain.push(noblesOnA[0].id)
    } else if (resultB.hits > 0) {
      newTasks.push({ side: 'A', hits: resultB.hits })
    }

    setResultText({
      a: describeArcherResult(reqA.canFire, resultA.targetingNoble, resultA.nobleSlain, resultA.hits, 'B', noblesOnB),
      b: describeArcherResult(reqB.canFire, resultB.targetingNoble, resultB.nobleSlain, resultB.hits, 'A', noblesOnA),
    })

    // Un Noble asesinado por disparo dirigido se resuelve al instante (no
    // pasa por el motor de bajas de tropas del LossSelector).
    if (slain.length > 0) {
      dispatch({ type: 'APPLY_LOSSES', removals: [], nobleSlainIds: slain })
      if (resultA.targetingNoble && resultA.nobleSlain) {
        recordApplied('B', { removals: [], nobleSlainIds: [noblesOnB[0].id], nobleCapturedIds: [] })
      }
      if (resultB.targetingNoble && resultB.nobleSlain) {
        recordApplied('A', { removals: [], nobleSlainIds: [noblesOnA[0].id], nobleCapturedIds: [] })
      }
    }

    setTasks(newTasks)
    setStage('rolled')
  }

  return (
    <div className="card">
      <h3>Arqueros / Ballesteros</h3>
      <div className="player-columns">
        <div className={`card player-column ${sideColorClass(sideA)}`}>
          <p className="side-tag">Bando A</p>
          {reqA.canFire ? (
            <>
              <p>{groupA} tirador(es)</p>
              {noblesOnB.length > 0 && (
                <label>
                  <input
                    type="checkbox"
                    checked={targetNobleA}
                    disabled={stage !== 'rolling'}
                    onChange={(e) => setTargetNobleA(e.target.checked)}
                  />{' '}
                  A Noble (solo 'fff')
                </label>
              )}
              <DiceInput label="Resultado" count={1} values={rollsA} onChange={setRollsA} disabled={stage !== 'rolling'} />
            </>
          ) : (
            <p>{archerIdleReason(groupA, sideInFortifiedCity(sideB), sideInStronghold(sideB))}</p>
          )}
        </div>
        <div className={`card player-column ${sideColorClass(sideB)}`}>
          <p className="side-tag">Bando B</p>
          {reqB.canFire ? (
            <>
              <p>{groupB} tirador(es)</p>
              {noblesOnA.length > 0 && (
                <label>
                  <input
                    type="checkbox"
                    checked={targetNobleB}
                    disabled={stage !== 'rolling'}
                    onChange={(e) => setTargetNobleB(e.target.checked)}
                  />{' '}
                  A Noble (solo 'fff')
                </label>
              )}
              <DiceInput label="Resultado" count={1} values={rollsB} onChange={setRollsB} disabled={stage !== 'rolling'} />
            </>
          ) : (
            <p>{archerIdleReason(groupB, sideInFortifiedCity(sideA), sideInStronghold(sideA))}</p>
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
        onComplete={onComplete}
      />
    </div>
  )
}

export function ProjectilePhase() {
  const { state, dispatch } = useBattle()
  const { sideA, sideB } = useSides()

  const phaseOrder = ['projectiles-trebuchet', 'projectiles-bombard', 'projectiles-archer', 'melee-roll'] as const

  function advance() {
    // Si algún bando se ha quedado sin fuerza (0 SP: ni tropas ni Nobles
    // activos), no tiene sentido seguir pasando por el resto de sub-fases
    // de Proyectiles ni por Melé: se salta directo a Fin de Ronda.
    if (computeSideStrengthPoints(sideA) === 0 || computeSideStrengthPoints(sideB) === 0) {
      dispatch({ type: 'SET_PHASE', phase: 'round-outcome' })
      return
    }
    const currentIndex = phaseOrder.indexOf(state.phase as (typeof phaseOrder)[number])
    const next = phaseOrder[currentIndex + 1]
    if (next) dispatch({ type: 'SET_PHASE', phase: next })
  }

  return (
    <div>
      <SubPhaseTracker steps={PROJECTILE_STEPS} currentKey={state.phase} />
      {state.phase === 'projectiles-trebuchet' && <TrebuchetStep onComplete={advance} />}
      {state.phase === 'projectiles-bombard' && <BombardStep onComplete={advance} />}
      {state.phase === 'projectiles-archer' && <ArcherStep onComplete={advance} />}
    </div>
  )
}
