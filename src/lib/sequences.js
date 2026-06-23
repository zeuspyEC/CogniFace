/**
 * sequences.js — Generador de secuencias N-Back para CogniFace
 *
 * Estrategia segura (garantiza cero targets accidentales y género exacto):
 * 1. Generar un orden de géneros 50/50 mezclado y llenar las 20 posiciones
 *    como no-targets, evitando coincidencias accidentales con n atrás.
 * 2. Seleccionar 6 posiciones target (≥ n) sin formar cadenas entre sí
 *    (ninguna pareja de targets puede estar n posiciones separada), y
 *    cuyos trials de referencia den exactamente 3 female y 3 male.
 * 3. Sobreescribir esas posiciones en ORDEN ASCENDENTE, copiando
 *    face_id = sequence[pos - n].face_id.
 *
 * Al prohibir cadenas de targets, los géneros clasificados en paso 2 son
 * definitivos (las referencias siempre son no-targets que no cambian).
 */

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Elige una cara del pool que NO produzca un target accidental en la posición pos.
 */
function pickNonTarget(pool, pos, n, sequence) {
  const forbiddenId = (pos >= n && sequence[pos - n]) ? sequence[pos - n].face_id : null
  const shuffled = shuffle(pool)
  const safe = shuffled.find(f => f.id !== forbiddenId)
  return safe || shuffled[0]
}

/**
 * Selecciona hasta `count` posiciones para targets de [n, total),
 * garantizando que ningún par de posiciones elegidas esté separado por exactamente n
 * (evita cadenas de targets que complicarían la propagación de género).
 */
function selectNonChainedTargetPositions(n, total = 20, count = 6) {
  const available = shuffle(Array.from({ length: total - n }, (_, i) => i + n))
  const selected = []
  for (const pos of available) {
    // Rechazar si cualquier posición ya seleccionada está a n de distancia
    const chainConflict = selected.some(s => Math.abs(s - pos) === n)
    if (!chainConflict) {
      selected.push(pos)
      if (selected.length === count) break
    }
  }
  return selected
}

/**
 * Construye una secuencia de 20 trials con exactamente 3 female + 3 male targets.
 */
function buildSequence(n, females, males) {
  for (let attempt = 0; attempt < 500; attempt++) {
    // Orden de géneros: 10 female + 10 male mezclados para distribución uniforme
    const genderOrder = shuffle([
      ...Array(10).fill('female'),
      ...Array(10).fill('male'),
    ])

    // Paso 1: llenar las 20 posiciones como no-targets
    const sequence = []
    for (let i = 0; i < 20; i++) {
      const pool = genderOrder[i] === 'female' ? females : males
      const face = pickNonTarget(pool, i, n, sequence)
      sequence.push({
        id: `trial-${i}`,
        face_id: face.id,
        face_gender: face.gender,
        is_target: false,
        src: face.src,
      })
    }

    // Paso 2: elegir 6 posiciones sin cadenas entre sí
    const candidatePositions = selectNonChainedTargetPositions(n)

    if (candidatePositions.length < 6) {
      continue // espacio insuficiente para 6 posiciones sin cadenas — raro
    }

    // Clasificar según género de la referencia (siempre un no-target — no hay cadenas)
    const femaleCandidates = candidatePositions.filter(pos => sequence[pos - n].face_gender === 'female')
    const maleCandidates   = candidatePositions.filter(pos => sequence[pos - n].face_gender === 'male')

    if (femaleCandidates.length < 3 || maleCandidates.length < 3) {
      continue // distribución de géneros no permite 3+3 — reintentar
    }

    const femaleTargets = shuffle(femaleCandidates).slice(0, 3)
    const maleTargets   = shuffle(maleCandidates).slice(0, 3)
    const allTargetPos  = [...femaleTargets, ...maleTargets].sort((a, b) => a - b)

    // Paso 3: sobreescribir posiciones target EN ORDEN ASCENDENTE
    for (const pos of allTargetPos) {
      const ref = sequence[pos - n] // siempre un no-target (sin cadenas)
      sequence[pos] = {
        id: `trial-${pos}`,
        face_id: ref.face_id,
        face_gender: ref.face_gender,
        is_target: true,
        src: ref.src,
      }
    }

    // Verificación de seguridad: ningún no-target debe coincidir con n atrás
    let valid = true
    for (let i = n; i < 20; i++) {
      if (!sequence[i].is_target && sequence[i].face_id === sequence[i - n].face_id) {
        valid = false
        break
      }
    }

    if (valid) return sequence
  }

  throw new Error('generateSequence: no se pudo construir una secuencia válida en 500 intentos')
}

export function generateSequence(n, faceManifest) {
  const females = faceManifest.filter(f => f.gender === 'female')
  const males   = faceManifest.filter(f => f.gender === 'male')
  return buildSequence(n, females, males)
}

export const PRACTICE_SEQUENCE = [
  { id: 'p0', face_id: 'f01', face_gender: 'female', is_target: false, src: null },
  { id: 'p1', face_id: 'm01', face_gender: 'male',   is_target: false, src: null },
  { id: 'p2', face_id: 'f01', face_gender: 'female', is_target: true,  src: null },
  { id: 'p3', face_id: 'm02', face_gender: 'male',   is_target: false, src: null },
  { id: 'p4', face_id: 'm01', face_gender: 'male',   is_target: true,  src: null },
]
