import f01 from '../assets/faces/female/f01.jpg'
import f02 from '../assets/faces/female/f02.jpg'
import f03 from '../assets/faces/female/f03.jpg'
import f04 from '../assets/faces/female/f04.jpg'
import f05 from '../assets/faces/female/f05.jpg'
import f06 from '../assets/faces/female/f06.jpg'
import m01 from '../assets/faces/male/m01.jpg'
import m02 from '../assets/faces/male/m02.jpg'
import m03 from '../assets/faces/male/m03.jpg'
import m04 from '../assets/faces/male/m04.jpg'
import m05 from '../assets/faces/male/m05.jpg'
import m06 from '../assets/faces/male/m06.jpg'

export const FACE_MANIFEST = [
  { id: 'f01', gender: 'female', src: f01 },
  { id: 'f02', gender: 'female', src: f02 },
  { id: 'f03', gender: 'female', src: f03 },
  { id: 'f04', gender: 'female', src: f04 },
  { id: 'f05', gender: 'female', src: f05 },
  { id: 'f06', gender: 'female', src: f06 },
  { id: 'm01', gender: 'male', src: m01 },
  { id: 'm02', gender: 'male', src: m02 },
  { id: 'm03', gender: 'male', src: m03 },
  { id: 'm04', gender: 'male', src: m04 },
  { id: 'm05', gender: 'male', src: m05 },
  { id: 'm06', gender: 'male', src: m06 },
]

export function preloadImages() {
  return Promise.all(
    FACE_MANIFEST.map(face => new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ id: face.id, el: img })
      img.onerror = reject
      img.src = face.src
    }))
  ).then(results => Object.fromEntries(results.map(r => [r.id, r.el])))
}
