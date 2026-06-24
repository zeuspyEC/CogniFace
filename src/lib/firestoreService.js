import {
  collection, doc, addDoc, updateDoc,
  getDocs, deleteDoc, writeBatch,
  serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from './firebase'

export async function createParticipant(gender, participantCode = '', age = null) {
  const ref = await addDoc(collection(db, 'participants'), {
    gender,
    participant_code: participantCode,
    age,
    timestamp: serverTimestamp(),
    completed: false,
    n_back: null,
    iaf: null,
    iaf_n1: null,
    iaf_n2: null,
    hits: null,
    misses: null,
    false_alarms: null,
    emotional_errors: null,
    mean_rt: null,
    accuracy: null,
  })
  return ref.id
}

export async function saveBlockTrials(participantId, block, trials) {
  const batch = writeBatch(db)
  const trialsRef = collection(db, 'participants', participantId, 'trials')
  for (const trial of trials) {
    const trialDoc = doc(trialsRef)
    batch.set(trialDoc, { ...trial, block, is_practice: false })
  }
  await batch.commit()
}

export async function completeParticipant(participantId, nBack, iaf, stats) {
  const ref = doc(db, 'participants', participantId)
  // keep iaf_n1/iaf_n2 for backward compat with charts
  const iafByBlock = nBack === 1 ? { iaf_n1: iaf, iaf_n2: null } : { iaf_n1: null, iaf_n2: iaf }
  await updateDoc(ref, {
    completed: true,
    n_back: nBack,
    iaf,
    ...iafByBlock,
    hits: stats.hits,
    misses: stats.misses,
    false_alarms: stats.false_alarms,
    emotional_errors: stats.emotional_errors,
    mean_rt: stats.mean_rt,
    accuracy: stats.accuracy,
  })
}

export async function getAllParticipants() {
  const q = query(collection(db, 'participants'), orderBy('timestamp', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getParticipantTrials(participantId) {
  const snap = await getDocs(
    collection(db, 'participants', participantId, 'trials')
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function deleteParticipant(participantId) {
  const trialsSnap = await getDocs(
    collection(db, 'participants', participantId, 'trials')
  )
  const batch = writeBatch(db)
  trialsSnap.docs.forEach(d => batch.delete(d.ref))
  batch.delete(doc(db, 'participants', participantId))
  await batch.commit()
}
