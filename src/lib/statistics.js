export function classifyError(isTarget, responded) {
  if (isTarget && responded) return 'hit'
  if (isTarget && !responded) return 'miss'
  if (!isTarget && responded) return 'false_alarm'
  return 'correct_rejection'
}

export function calculateAccuracy(trials, faceGender) {
  const filtered = faceGender
    ? trials.filter(t => t.face_gender === faceGender && !t.is_practice)
    : trials.filter(t => !t.is_practice)
  if (filtered.length === 0) return 0
  return filtered.filter(t => t.accuracy === 1).length / filtered.length
}

export function calculateIAF(trials, participantGender) {
  const realTrials = trials.filter(t => !t.is_practice)
  const accFemale = calculateAccuracy(realTrials, 'female')
  const accMale = calculateAccuracy(realTrials, 'male')
  return participantGender === 'male'
    ? accFemale - accMale
    : accMale - accFemale
}

export function calculateMeanRT(trials, faceGender) {
  const filtered = (faceGender
    ? trials.filter(t => t.face_gender === faceGender)
    : trials
  ).filter(t => t.reaction_time !== null && t.reaction_time !== undefined)

  if (filtered.length === 0) return 0
  return filtered.reduce((sum, t) => sum + t.reaction_time, 0) / filtered.length
}

export function aggregateForCharts(participants) {
  const byGroup = { male: [], female: [] }
  for (const p of participants) {
    if (p.gender === 'male' || p.gender === 'female') {
      byGroup[p.gender].push(p)
    }
  }

  const globalIAF = participants.length > 0
    ? participants.reduce((sum, p) => sum + ((p.iaf_n1 || 0) + (p.iaf_n2 || 0)) / 2, 0) / participants.length
    : 0

  return {
    globalIAF,
    maleCount: byGroup.male.length,
    femaleCount: byGroup.female.length,
    maleIAF_n1: avg(byGroup.male.map(p => p.iaf_n1)),
    maleIAF_n2: avg(byGroup.male.map(p => p.iaf_n2)),
    femaleIAF_n1: avg(byGroup.female.map(p => p.iaf_n1)),
    femaleIAF_n2: avg(byGroup.female.map(p => p.iaf_n2)),
  }
}

function avg(values) {
  const valid = values.filter(v => v !== null && v !== undefined)
  if (valid.length === 0) return 0
  return valid.reduce((a, b) => a + b, 0) / valid.length
}
