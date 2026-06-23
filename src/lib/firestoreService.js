import {
  collection, doc, addDoc, setDoc, updateDoc,
  getDocs, getDoc, deleteDoc, writeBatch,
  serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from './firebase'

export async function createParticipant(gender) {
  const ref = await addDoc(collection(db, 'participants'), {
    gender,
    timestamp: serverTimestamp(),
    completed: false,
    iaf_n1: null,
    iaf_n2: null,
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

export async function completeParticipant(participantId, iaf_n1, iaf_n2) {
  const ref = doc(db, 'participants', participantId)
  await updateDoc(ref, { completed: true, iaf_n1, iaf_n2 })
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
