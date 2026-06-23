# CogniFace N-Back — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una plataforma web completa de experimento N-Back con rostros, panel admin con estadísticas, y deploy automático en Firebase Hosting.

**Architecture:** React SPA (Vite) con React Router v6. Dos rutas principales: `/` para el experimento del participante (cliente puro, timing en ms) y `/admin` protegida con Firebase Auth. Firestore almacena participantes y ensayos; la escritura ocurre en batch al terminar cada bloque, nunca trial-a-trial.

**Tech Stack:** React 18, Vite, React Router v6, Firebase 10 (Auth + Firestore + Hosting), Recharts 2, Vitest.

## Global Constraints

- Firebase plan Spark gratuito — sin Cloud Functions, sin Storage
- Imágenes: assets estáticos en `/src/assets/faces/` — NO red en runtime
- RT medido con `performance.now()` — no `Date.now()`
- Variables Firebase llevan prefijo `VITE_` — nunca commitear `.env`
- Escritura Firestore: batch al final de cada bloque (no trial-a-trial)
- Repo: https://github.com/zeuspyEC/CogniFace.git — commit frecuente
- Node >= 18, npm >= 9
- Idioma de la UI: Español

---

## Mapa de Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/lib/firebase.js` | Init Firebase SDK con env vars |
| `src/lib/sequences.js` | Generador secuencias N-Back con backtracking |
| `src/lib/statistics.js` | IAF, exactitud, RT por grupos |
| `src/lib/imagePreloader.js` | Precarga Image objects antes del experimento |
| `src/lib/firestoreService.js` | CRUD Firestore: crear participante, escribir trials, leer admin |
| `src/hooks/useExperimentEngine.js` | Máquina estados: fixation→stimulus→response→iti |
| `src/context/AuthContext.jsx` | Firebase Auth state global |
| `src/context/ExperimentContext.jsx` | Estado del experimento (participante, bloque, resultados) |
| `src/components/shared/ProtectedRoute.jsx` | Guard /admin |
| `src/components/shared/LoadingSpinner.jsx` | Spinner reutilizable |
| `src/components/experiment/WelcomeScreen.jsx` | Pantalla bienvenida |
| `src/components/experiment/GenderSelector.jsx` | Selector ♂/♀ |
| `src/components/experiment/InstructionsScreen.jsx` | Instrucciones N-1 o N-2 con ejemplo |
| `src/components/experiment/FixationCross.jsx` | Cruz fijación 500ms |
| `src/components/experiment/StimulusDisplay.jsx` | Rostro 1000ms |
| `src/components/experiment/PracticeBlock.jsx` | 5 ensayos práctica con feedback |
| `src/components/experiment/ExperimentBlock.jsx` | 20 ensayos reales sin feedback |
| `src/components/experiment/BreakScreen.jsx` | Descanso entre bloques |
| `src/components/experiment/ResultsScreen.jsx` | Resultados personales del participante |
| `src/components/admin/AdminLogin.jsx` | Login Firebase Auth |
| `src/components/admin/AdminDashboard.jsx` | Layout del panel admin |
| `src/components/admin/ParticipantsTable.jsx` | Tabla CRUD participantes |
| `src/components/admin/charts/AccuracyBarChart.jsx` | Exactitud por género×rostro×bloque |
| `src/components/admin/charts/ReactionTimeChart.jsx` | RT por género×rostro |
| `src/components/admin/charts/IAFWidget.jsx` | IAF global + semáforo |
| `src/components/admin/charts/MemoryLoadChart.jsx` | N-1 vs N-2 rendimiento |
| `src/pages/ExperimentPage.jsx` | Orquestador del flujo del participante |
| `src/pages/AdminPage.jsx` | Orquestador del panel admin |
| `src/App.jsx` | Router raíz |
| `.github/workflows/deploy.yml` | CI/CD Firebase Hosting |

---

## Task 1: Scaffold del Proyecto + Git + Dependencias

**Files:**
- Create: `package.json`, `vite.config.js`, `src/App.jsx`, `src/main.jsx`
- Create: `.env.example`, `.gitignore`, `index.html`
- Create: `src/index.css`

**Interfaces:**
- Produces: App Vite funcional en `http://localhost:5173`, React Router v6 configurado, Firebase SDK instalado

- [ ] **Step 1: Crear el proyecto Vite**

```bash
cd /home/zeus/Documentos/N-Back
npm create vite@latest . -- --template react
```
Responder: `y` para sobreescribir el directorio actual.

- [ ] **Step 2: Instalar todas las dependencias**

```bash
npm install
npm install firebase react-router-dom recharts
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Configurar Vitest en vite.config.js**

Reemplazar contenido completo de `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 4: Crear setup de tests**

```bash
mkdir -p src/test
```

Crear `src/test/setup.js`:
```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Crear .gitignore**

Crear `.gitignore`:
```
node_modules/
dist/
.env
.env.local
.firebase/
*.local
```

- [ ] **Step 6: Crear .env.example**

Crear `.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

- [ ] **Step 7: Crear .env con credenciales reales**

Crear `.env` (NO commitear):
```
VITE_FIREBASE_API_KEY=AIzaSyDnu3JcdOCOlMuLm0LZd1JvDhRz-6But8k
VITE_FIREBASE_AUTH_DOMAIN=cogniface.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cogniface
VITE_FIREBASE_MESSAGING_SENDER_ID=348142257575
VITE_FIREBASE_APP_ID=1:348142257575:web:84d51abde6d09168c5a282
VITE_FIREBASE_MEASUREMENT_ID=G-KMT78KDZ1D
```

- [ ] **Step 8: Crear App.jsx base con Router**

Reemplazar `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ExperimentPage from './pages/ExperimentPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider } from './context/AuthContext'
import { ExperimentProvider } from './context/ExperimentContext'
import ProtectedRoute from './components/shared/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <ExperimentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ExperimentPage />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </ExperimentProvider>
    </AuthProvider>
  )
}
```

- [ ] **Step 9: Crear páginas y contextos placeholder**

Crear `src/pages/ExperimentPage.jsx`:
```jsx
export default function ExperimentPage() {
  return <div>Experiment — coming soon</div>
}
```

Crear `src/pages/AdminPage.jsx`:
```jsx
export default function AdminPage() {
  return <div>Admin — coming soon</div>
}
```

Crear `src/context/AuthContext.jsx`:
```jsx
import { createContext, useContext, useState } from 'react'
export const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
```

Crear `src/context/ExperimentContext.jsx`:
```jsx
import { createContext, useContext, useReducer } from 'react'
export const ExperimentContext = createContext(null)
export function ExperimentProvider({ children }) {
  return <ExperimentContext.Provider value={{}}>{children}</ExperimentContext.Provider>
}
export const useExperiment = () => useContext(ExperimentContext)
```

Crear `src/components/shared/ProtectedRoute.jsx`:
```jsx
export default function ProtectedRoute({ children }) {
  return children
}
```

- [ ] **Step 10: Crear CSS global base**

Reemplazar `src/index.css`:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --color-bg: #0D1B2A;
  --color-surface: #1A2D42;
  --color-accent: #6C63FF;
  --color-text: #E8EAF0;
  --color-text-muted: #8892A4;
  --color-success: #4CAF8A;
  --color-error: #E05C5C;
  font-family: 'Inter', system-ui, sans-serif;
}
html, body, #root {
  height: 100%;
  background: var(--color-bg);
  color: var(--color-text);
}
```

Actualizar `index.html` para cargar Inter desde Google Fonts, añadir en `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>CogniFace — Experimento N-Back</title>
```

- [ ] **Step 11: Verificar que la app levanta**

```bash
npm run dev
```
Esperado: `http://localhost:5173` carga sin errores en consola.

- [ ] **Step 12: Inicializar Git y primer commit**

```bash
git init
git remote add origin https://github.com/zeuspyEC/CogniFace.git
git add -A
git commit -m "feat: scaffold inicial Vite + React + Firebase + Recharts"
git branch -M main
git push -u origin main
```

---

## Task 2: Imágenes de Rostros + imagePreloader.js

**Files:**
- Create: `src/assets/faces/female/f01.jpg` … `f06.jpg`
- Create: `src/assets/faces/male/m01.jpg` … `m06.jpg`
- Create: `src/lib/imagePreloader.js`
- Create: `src/test/imagePreloader.test.js`

**Interfaces:**
- Produces: `preloadImages(): Promise<Record<string, HTMLImageElement>>`
- Produces: `FACE_MANIFEST` — array de `{id, gender, src}` para los 12 rostros

- [ ] **Step 1: Crear directorios para las imágenes**

```bash
mkdir -p src/assets/faces/female src/assets/faces/male
```

- [ ] **Step 2: Obtener imágenes de rostros neutros**

Descargar 6 rostros femeninos y 6 masculinos de expresión neutral del
**Chicago Face Database** (CFD): https://www.chicagofacedatabase.com/

Los archivos deben nombrarse exactamente: `f01.jpg`…`f06.jpg` y `m01.jpg`…`m06.jpg`.

Si aún no tienes las imágenes, crear SVG placeholders temporales con este script:

```bash
for i in 01 02 03 04 05 06; do
  cat > src/assets/faces/female/f${i}.svg << 'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="350" viewBox="0 0 300 350">
  <rect width="300" height="350" fill="#2A3F5A"/>
  <circle cx="150" cy="140" r="80" fill="#8892A4"/>
  <rect x="80" y="240" width="140" height="110" rx="10" fill="#8892A4"/>
  <text x="150" y="330" font-size="18" fill="#0D1B2A" text-anchor="middle" font-family="sans-serif">F_PLACEHOLDER</text>
</svg>
SVG
  cp src/assets/faces/female/f${i}.svg src/assets/faces/female/f${i}.jpg
done

for i in 01 02 03 04 05 06; do
  cat > src/assets/faces/male/m${i}.svg << 'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="350" viewBox="0 0 300 350">
  <rect width="300" height="350" fill="#1A2D42"/>
  <circle cx="150" cy="140" r="85" fill="#6B7888"/>
  <rect x="75" y="240" width="150" height="110" rx="10" fill="#6B7888"/>
  <text x="150" y="330" font-size="18" fill="#0D1B2A" text-anchor="middle" font-family="sans-serif">M_PLACEHOLDER</text>
</svg>
SVG
  cp src/assets/faces/male/m${i}.svg src/assets/faces/male/m${i}.jpg
done
```

- [ ] **Step 3: Escribir el test para imagePreloader**

Crear `src/test/imagePreloader.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { FACE_MANIFEST } from '../lib/imagePreloader'

describe('FACE_MANIFEST', () => {
  it('tiene exactamente 12 rostros', () => {
    expect(FACE_MANIFEST).toHaveLength(12)
  })

  it('tiene 6 femeninos y 6 masculinos', () => {
    const female = FACE_MANIFEST.filter(f => f.gender === 'female')
    const male = FACE_MANIFEST.filter(f => f.gender === 'male')
    expect(female).toHaveLength(6)
    expect(male).toHaveLength(6)
  })

  it('cada rostro tiene id, gender y src', () => {
    for (const face of FACE_MANIFEST) {
      expect(face).toHaveProperty('id')
      expect(face).toHaveProperty('gender')
      expect(face).toHaveProperty('src')
      expect(['female', 'male']).toContain(face.gender)
    }
  })

  it('los ids femeninos son f01-f06', () => {
    const ids = FACE_MANIFEST.filter(f => f.gender === 'female').map(f => f.id)
    expect(ids).toEqual(['f01', 'f02', 'f03', 'f04', 'f05', 'f06'])
  })

  it('los ids masculinos son m01-m06', () => {
    const ids = FACE_MANIFEST.filter(f => f.gender === 'male').map(f => f.id)
    expect(ids).toEqual(['m01', 'm02', 'm03', 'm04', 'm05', 'm06'])
  })
})
```

- [ ] **Step 4: Correr el test — debe fallar**

```bash
npx vitest run src/test/imagePreloader.test.js
```
Esperado: FAIL — `Cannot find module '../lib/imagePreloader'`

- [ ] **Step 5: Implementar imagePreloader.js**

Crear `src/lib/imagePreloader.js`:
```js
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
```

- [ ] **Step 6: Correr test — debe pasar**

```bash
npx vitest run src/test/imagePreloader.test.js
```
Esperado: 5 tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/assets/faces/ src/lib/imagePreloader.js src/test/imagePreloader.test.js
git commit -m "feat: face assets manifest + imagePreloader con tests"
```

---

## Task 3: Generador de Secuencias N-Back (sequences.js)

**Files:**
- Create: `src/lib/sequences.js`
- Create: `src/test/sequences.test.js`

**Interfaces:**
- Consumes: `FACE_MANIFEST` de `imagePreloader.js`
- Produces: `generateSequence(n: 1|2, faceManifest: FaceDef[]): Trial[]`
- Produces: `PRACTICE_SEQUENCE` — array fijo de 5 trials para práctica
- `Trial = { id: string, face_id: string, face_gender: 'female'|'male', is_target: boolean, src: string }`

- [ ] **Step 1: Escribir los tests**

Crear `src/test/sequences.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { generateSequence, PRACTICE_SEQUENCE } from '../lib/sequences'
import { FACE_MANIFEST } from '../lib/imagePreloader'

describe('generateSequence N-1', () => {
  const seq = generateSequence(1, FACE_MANIFEST)

  it('produce exactamente 20 trials', () => {
    expect(seq).toHaveLength(20)
  })

  it('tiene 3 targets femeninos y 3 masculinos', () => {
    const targets = seq.filter(t => t.is_target)
    expect(targets).toHaveLength(6)
    expect(targets.filter(t => t.face_gender === 'female')).toHaveLength(3)
    expect(targets.filter(t => t.face_gender === 'male')).toHaveLength(3)
  })

  it('cada target coincide con el trial N posiciones atrás', () => {
    for (let i = 0; i < seq.length; i++) {
      if (seq[i].is_target) {
        expect(seq[i].face_id).toBe(seq[i - 1].face_id)
      }
    }
  })

  it('ningún no-target coincide accidentalmente con N atrás', () => {
    for (let i = 1; i < seq.length; i++) {
      if (!seq[i].is_target) {
        expect(seq[i].face_id).not.toBe(seq[i - 1].face_id)
      }
    }
  })

  it('cada trial tiene los campos requeridos', () => {
    for (const t of seq) {
      expect(t).toHaveProperty('id')
      expect(t).toHaveProperty('face_id')
      expect(t).toHaveProperty('face_gender')
      expect(t).toHaveProperty('is_target')
      expect(t).toHaveProperty('src')
    }
  })
})

describe('generateSequence N-2', () => {
  const seq = generateSequence(2, FACE_MANIFEST)

  it('produce exactamente 20 trials', () => {
    expect(seq).toHaveLength(20)
  })

  it('tiene 3 targets femeninos y 3 masculinos', () => {
    const targets = seq.filter(t => t.is_target)
    expect(targets).toHaveLength(6)
    expect(targets.filter(t => t.face_gender === 'female')).toHaveLength(3)
    expect(targets.filter(t => t.face_gender === 'male')).toHaveLength(3)
  })

  it('cada target coincide con el trial 2 posiciones atrás', () => {
    for (let i = 0; i < seq.length; i++) {
      if (seq[i].is_target) {
        expect(seq[i].face_id).toBe(seq[i - 2].face_id)
      }
    }
  })

  it('ningún no-target coincide accidentalmente con 2 atrás', () => {
    for (let i = 2; i < seq.length; i++) {
      if (!seq[i].is_target) {
        expect(seq[i].face_id).not.toBe(seq[i - 2].face_id)
      }
    }
  })
})

describe('PRACTICE_SEQUENCE', () => {
  it('tiene 5 trials', () => {
    expect(PRACTICE_SEQUENCE).toHaveLength(5)
  })

  it('tiene al menos 1 target', () => {
    expect(PRACTICE_SEQUENCE.some(t => t.is_target)).toBe(true)
  })
})
```

- [ ] **Step 2: Correr tests — deben fallar**

```bash
npx vitest run src/test/sequences.test.js
```
Esperado: FAIL — `Cannot find module '../lib/sequences'`

- [ ] **Step 3: Implementar sequences.js**

Crear `src/lib/sequences.js`:
```js
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function selectTargetPositions(n, total = 20, count = 6) {
  const minPos = n
  const available = Array.from({ length: total - minPos }, (_, i) => i + minPos)
  return shuffle(available).slice(0, count)
}

export function generateSequence(n, faceManifest) {
  const females = faceManifest.filter(f => f.gender === 'female')
  const males = faceManifest.filter(f => f.gender === 'male')

  const targetPositions = selectTargetPositions(n)
  const femaleTargetPositions = shuffle(targetPositions).slice(0, 3)
  const maleTargetPositions = targetPositions.filter(p => !femaleTargetPositions.includes(p))

  const sequence = new Array(20).fill(null)

  const usedAtPosition = (pos, candidateId) => {
    if (pos >= 0 && sequence[pos]?.face_id === candidateId) return true
    if (pos - n >= 0 && sequence[pos - n]?.face_id === candidateId && !targetPositions.includes(pos)) return true
    return false
  }

  const pickFace = (pool, pos) => {
    const shuffled = shuffle(pool)
    for (const face of shuffled) {
      const wouldBeAccidentalTarget = n > 0 && pos >= n && sequence[pos - n]?.face_id === face.id
      if (!wouldBeAccidentalTarget) return face
    }
    return shuffled[0]
  }

  for (let i = 0; i < 20; i++) {
    if (femaleTargetPositions.includes(i)) {
      sequence[i] = { ...sequence[i - n], is_target: true, id: `trial-${i}` }
    } else if (maleTargetPositions.includes(i)) {
      sequence[i] = { ...sequence[i - n], is_target: true, id: `trial-${i}` }
    } else {
      const pool = i % 2 === 0 ? females : males
      const face = pickFace(pool, i)
      sequence[i] = { id: `trial-${i}`, face_id: face.id, face_gender: face.gender, is_target: false, src: face.src }
    }
  }

  for (let i = n; i < 20; i++) {
    if (!sequence[i].is_target && sequence[i].face_id === sequence[i - n]?.face_id) {
      const pool = sequence[i].face_gender === 'female' ? females : males
      const alt = pool.find(f => f.id !== sequence[i - n].face_id) || pool[0]
      sequence[i] = { ...sequence[i], face_id: alt.id, src: alt.src }
    }
  }

  return sequence
}

export const PRACTICE_SEQUENCE = [
  { id: 'p0', face_id: 'f01', face_gender: 'female', is_target: false, src: null },
  { id: 'p1', face_id: 'm01', face_gender: 'male',   is_target: false, src: null },
  { id: 'p2', face_id: 'f01', face_gender: 'female', is_target: true,  src: null },
  { id: 'p3', face_id: 'm02', face_gender: 'male',   is_target: false, src: null },
  { id: 'p4', face_id: 'm01', face_gender: 'male',   is_target: true,  src: null },
]
```

- [ ] **Step 4: Correr tests — deben pasar**

```bash
npx vitest run src/test/sequences.test.js
```
Esperado: todos PASS. Si algún test de "no accidental target" falla, revisar la función `pickFace` y el loop de corrección al final.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sequences.js src/test/sequences.test.js
git commit -m "feat: generador N-Back con backtracking + tests"
```

---

## Task 4: Librería de Estadísticas (statistics.js)

**Files:**
- Create: `src/lib/statistics.js`
- Create: `src/test/statistics.test.js`

**Interfaces:**
- Consumes: arrays de trial results del formato Firestore
- Produces: `calculateIAF(trials, participantGender): number`
- Produces: `calculateAccuracy(trials, faceGender): number`
- Produces: `calculateMeanRT(trials, faceGender?): number`
- Produces: `classifyError(isTarget, responded): ErrorType`
- Produces: `aggregateForCharts(participants): ChartData`

- [ ] **Step 1: Escribir los tests**

Crear `src/test/statistics.test.js`:
```js
import { describe, it, expect } from 'vitest'
import {
  calculateIAF, calculateAccuracy, calculateMeanRT,
  classifyError, aggregateForCharts
} from '../lib/statistics'

const makeTrial = (overrides) => ({
  face_gender: 'female', is_target: true, responded: true,
  reaction_time: 500, accuracy: 1, is_practice: false,
  error_type: 'hit', block: 1,
  ...overrides
})

describe('classifyError', () => {
  it('hit: objetivo y respondió', () => {
    expect(classifyError(true, true)).toBe('hit')
  })
  it('miss: objetivo y no respondió', () => {
    expect(classifyError(true, false)).toBe('miss')
  })
  it('false_alarm: no objetivo y respondió', () => {
    expect(classifyError(false, true)).toBe('false_alarm')
  })
  it('correct_rejection: no objetivo y no respondió', () => {
    expect(classifyError(false, false)).toBe('correct_rejection')
  })
})

describe('calculateAccuracy', () => {
  const trials = [
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'female', accuracy: 0 }),
    makeTrial({ face_gender: 'male', accuracy: 1 }),
  ]

  it('calcula exactitud para femeninos', () => {
    expect(calculateAccuracy(trials, 'female')).toBeCloseTo(0.667, 2)
  })

  it('calcula exactitud para masculinos', () => {
    expect(calculateAccuracy(trials, 'male')).toBe(1)
  })

  it('retorna 0 si no hay trials del género', () => {
    expect(calculateAccuracy([], 'female')).toBe(0)
  })
})

describe('calculateIAF', () => {
  const trialsHombre = [
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'female', accuracy: 1 }),
    makeTrial({ face_gender: 'male', accuracy: 0 }),
    makeTrial({ face_gender: 'male', accuracy: 0 }),
  ]

  it('hombre: acc(femeninas) - acc(masculinas)', () => {
    expect(calculateIAF(trialsHombre, 'male')).toBeCloseTo(1.0, 2)
  })

  it('mujer: acc(masculinas) - acc(femeninas)', () => {
    expect(calculateIAF(trialsHombre, 'female')).toBeCloseTo(-1.0, 2)
  })
})

describe('calculateMeanRT', () => {
  const trials = [
    makeTrial({ reaction_time: 400, face_gender: 'female' }),
    makeTrial({ reaction_time: 600, face_gender: 'female' }),
    makeTrial({ reaction_time: null, face_gender: 'female' }),
    makeTrial({ reaction_time: 300, face_gender: 'male' }),
  ]

  it('ignora nulls en el promedio', () => {
    expect(calculateMeanRT(trials, 'female')).toBe(500)
  })

  it('sin filtro de género calcula todos los no-null', () => {
    expect(calculateMeanRT(trials)).toBeCloseTo(433.33, 0)
  })
})
```

- [ ] **Step 2: Correr tests — deben fallar**

```bash
npx vitest run src/test/statistics.test.js
```
Esperado: FAIL

- [ ] **Step 3: Implementar statistics.js**

Crear `src/lib/statistics.js`:
```js
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
```

- [ ] **Step 4: Correr tests — deben pasar**

```bash
npx vitest run src/test/statistics.test.js
```
Esperado: todos PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/statistics.js src/test/statistics.test.js
git commit -m "feat: librería estadísticas IAF + clasificación errores + tests"
```

---

## Task 5: Firebase Init + Servicio Firestore

**Files:**
- Create: `src/lib/firebase.js`
- Create: `src/lib/firestoreService.js`

**Interfaces:**
- Produces: `db` — instancia Firestore
- Produces: `auth` — instancia Firebase Auth
- Produces: `createParticipant(gender): Promise<string>` — retorna participantId
- Produces: `saveTrialsBatch(participantId, trials, block): Promise<void>`
- Produces: `completeParticipant(participantId, iaf_n1, iaf_n2): Promise<void>`
- Produces: `getAllParticipants(): Promise<Participant[]>`
- Produces: `getParticipantTrials(participantId): Promise<Trial[]>`
- Produces: `deleteParticipant(participantId): Promise<void>`

- [ ] **Step 1: Crear firebase.js**

Crear `src/lib/firebase.js`:
```js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```

- [ ] **Step 2: Crear firestoreService.js**

Crear `src/lib/firestoreService.js`:
```js
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

export async function saveTrialsBatch(participantId, trials, block) {
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
```

- [ ] **Step 3: Verificar conexión en el navegador**

Ir a `http://localhost:5173` (app corriendo con `npm run dev`).
Abrir DevTools → Console. No deben aparecer errores de Firebase.

- [ ] **Step 4: Commit**

```bash
git add src/lib/firebase.js src/lib/firestoreService.js
git commit -m "feat: Firebase init + servicio Firestore CRUD"
```

---

## Task 6: AuthContext + ProtectedRoute (completos)

**Files:**
- Modify: `src/context/AuthContext.jsx`
- Modify: `src/components/shared/ProtectedRoute.jsx`
- Create: `src/components/shared/LoadingSpinner.jsx`

**Interfaces:**
- Consumes: `auth` de `firebase.js`
- Produces: `useAuth(): { user, loading, signIn(email, pass), signOut() }`
- Produces: `<ProtectedRoute>` — redirige a `/admin/login` si `!user`

- [ ] **Step 1: Crear LoadingSpinner**

Crear `src/components/shared/LoadingSpinner.jsx`:
```jsx
export default function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--color-bg)'
    }}>
      <div style={{
        width: 48, height: 48, border: '4px solid var(--color-surface)',
        borderTop: '4px solid var(--color-accent)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
```

- [ ] **Step 2: AuthContext completo**

Reemplazar `src/context/AuthContext.jsx`:
```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const signOut = () => fbSignOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

- [ ] **Step 3: ProtectedRoute completo**

Reemplazar `src/components/shared/ProtectedRoute.jsx`:
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}
```

- [ ] **Step 4: Verificar visualmente**

Con `npm run dev`, ir a `http://localhost:5173/admin`.
Esperado: redirige automáticamente (por ahora AdminPage no existe, puede dar 404 — eso es correcto).

- [ ] **Step 5: Commit**

```bash
git add src/context/AuthContext.jsx src/components/shared/
git commit -m "feat: AuthContext Firebase + ProtectedRoute + LoadingSpinner"
```

---

## Task 7: Motor del Experimento (useExperimentEngine)

**Files:**
- Create: `src/hooks/useExperimentEngine.js`

**Interfaces:**
- Consumes: `generateSequence` de `sequences.js`, `preloadImages` de `imagePreloader.js`, `classifyError` de `statistics.js`
- Produces: `useExperimentEngine(n, faceManifest, isPractice)`
  ```
  returns {
    phase: 'idle'|'preloading'|'fixation'|'stimulus'|'response'|'done',
    currentTrial: Trial | null,
    trialIndex: number,
    totalTrials: number,
    lastFeedback: 'correct'|'incorrect'|null,
    results: TrialResult[],
    start(): void,
    respond(): void,
  }
  ```

- [ ] **Step 1: Implementar useExperimentEngine**

Crear `src/hooks/useExperimentEngine.js`:
```js
import { useReducer, useEffect, useRef, useCallback } from 'react'
import { generateSequence, PRACTICE_SEQUENCE } from '../lib/sequences'
import { preloadImages, FACE_MANIFEST } from '../lib/imagePreloader'
import { classifyError } from '../lib/statistics'

const TIMING = { fixation: 500, stimulus: 1000, response: 2000 }

const initialState = {
  phase: 'idle',
  trialIndex: 0,
  sequence: [],
  results: [],
  lastFeedback: null,
  respondedThisTrial: false,
  stimulusOnset: null,
  images: {},
}

function reducer(state, action) {
  switch (action.type) {
    case 'PRELOADING': return { ...state, phase: 'preloading' }
    case 'LOADED': return { ...state, images: action.images, sequence: action.sequence, phase: 'fixation', trialIndex: 0 }
    case 'SHOW_STIMULUS': return { ...state, phase: 'stimulus', stimulusOnset: action.onset, lastFeedback: null }
    case 'SHOW_RESPONSE': return { ...state, phase: 'response' }
    case 'RESPOND': {
      if (state.respondedThisTrial || state.phase !== 'response') return state
      const rt = performance.now() - state.stimulusOnset
      return { ...state, respondedThisTrial: true, pendingRT: rt }
    }
    case 'END_TRIAL': {
      const trial = state.sequence[state.trialIndex]
      const responded = state.respondedThisTrial
      const rt = responded ? state.pendingRT : null
      const errorType = classifyError(trial.is_target, responded)
      const accuracy = (errorType === 'hit' || errorType === 'correct_rejection') ? 1 : 0
      const result = {
        trial_number: state.trialIndex + 1,
        face_id: trial.face_id,
        face_gender: trial.face_gender,
        is_target: trial.is_target,
        responded,
        reaction_time: rt,
        accuracy,
        error_type: errorType,
      }
      const feedback = accuracy === 1 ? 'correct' : 'incorrect'
      return {
        ...state,
        results: [...state.results, result],
        lastFeedback: feedback,
        respondedThisTrial: false,
        pendingRT: null,
        phase: state.trialIndex + 1 >= state.sequence.length ? 'done' : 'fixation',
        trialIndex: state.trialIndex + 1,
      }
    }
    default: return state
  }
}

export function useExperimentEngine(n, isPractice = false) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const keyHandled = useRef(false)

  const start = useCallback(async () => {
    dispatch({ type: 'PRELOADING' })
    const images = await preloadImages()
    const sequence = isPractice ? PRACTICE_SEQUENCE : generateSequence(n, FACE_MANIFEST)
    dispatch({ type: 'LOADED', images, sequence })
  }, [n, isPractice])

  const respond = useCallback(() => {
    dispatch({ type: 'RESPOND' })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && !keyHandled.current) {
        keyHandled.current = true
        respond()
        setTimeout(() => { keyHandled.current = false }, 50)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [respond])

  useEffect(() => {
    if (state.phase !== 'fixation') return
    const t = setTimeout(() => dispatch({ type: 'SHOW_STIMULUS', onset: performance.now() }), TIMING.fixation)
    return () => clearTimeout(t)
  }, [state.phase, state.trialIndex])

  useEffect(() => {
    if (state.phase !== 'stimulus') return
    const t = setTimeout(() => dispatch({ type: 'SHOW_RESPONSE' }), TIMING.stimulus)
    return () => clearTimeout(t)
  }, [state.phase, state.trialIndex])

  useEffect(() => {
    if (state.phase !== 'response') return
    const t = setTimeout(() => dispatch({ type: 'END_TRIAL' }), TIMING.response)
    return () => clearTimeout(t)
  }, [state.phase, state.trialIndex])

  const currentTrial = state.sequence[state.trialIndex] ?? null

  return {
    phase: state.phase,
    currentTrial,
    trialIndex: state.trialIndex,
    totalTrials: state.sequence.length,
    lastFeedback: state.lastFeedback,
    results: state.results,
    images: state.images,
    start,
    respond,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useExperimentEngine.js
git commit -m "feat: motor N-Back con máquina de estados y timing performance.now()"
```

---

## Task 8: Componentes de la Pantalla del Experimento

**Files:**
- Create: todos los archivos en `src/components/experiment/`

**Interfaces:**
- Consumes: `useExperimentEngine` de Task 7
- Produces: pantallas completas listas para orquestar en ExperimentPage

- [ ] **Step 1: WelcomeScreen**

Crear `src/components/experiment/WelcomeScreen.jsx`:
```jsx
export default function WelcomeScreen({ onStart }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CogniFace</h1>
        <p style={styles.subtitle}>Experimento de Memoria de Trabajo Social</p>
        <div style={styles.divider} />
        <p style={styles.body}>
          En este experimento verás una secuencia de rostros. Tu tarea es
          presionar <kbd style={styles.kbd}>ESPACIO</kbd> cuando el rostro
          actual sea igual a uno que viste recientemente.
        </p>
        <p style={styles.body}>El experimento tiene dos bloques cortos y dura aproximadamente <strong>10 minutos</strong>.</p>
        <button style={styles.button} onClick={onStart}>Comenzar</button>
      </div>
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:24 },
  card: { maxWidth:560, width:'100%', background:'var(--color-surface)', borderRadius:16, padding:48, textAlign:'center' },
  title: { fontSize:48, fontWeight:700, color:'var(--color-accent)', marginBottom:8 },
  subtitle: { color:'var(--color-text-muted)', fontSize:18, marginBottom:24 },
  divider: { height:1, background:'#2A3F5A', margin:'24px 0' },
  body: { fontSize:16, lineHeight:1.7, marginBottom:16, color:'var(--color-text)' },
  kbd: { background:'#2A3F5A', padding:'2px 8px', borderRadius:4, fontFamily:'monospace', color:'var(--color-accent)' },
  button: { marginTop:24, background:'var(--color-accent)', color:'#fff', border:'none', padding:'14px 40px', borderRadius:8, fontSize:18, fontWeight:600, cursor:'pointer' },
}
```

- [ ] **Step 2: GenderSelector**

Crear `src/components/experiment/GenderSelector.jsx`:
```jsx
export default function GenderSelector({ onSelect }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>¿Cuál es tu sexo?</h2>
        <p style={styles.sub}>Esta información es confidencial y solo se usa para el análisis científico.</p>
        <div style={styles.options}>
          <button style={styles.option} onClick={() => onSelect('male')}>
            <span style={styles.icon}>♂</span>
            <span>Hombre</span>
          </button>
          <button style={styles.option} onClick={() => onSelect('female')}>
            <span style={styles.icon}>♀</span>
            <span>Mujer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' },
  card: { maxWidth:480, width:'100%', background:'var(--color-surface)', borderRadius:16, padding:48, textAlign:'center' },
  title: { fontSize:28, fontWeight:700, marginBottom:12 },
  sub: { color:'var(--color-text-muted)', marginBottom:32, fontSize:14 },
  options: { display:'flex', gap:24, justifyContent:'center' },
  option: { flex:1, background:'#1A2D42', border:'2px solid #2A3F5A', color:'var(--color-text)', borderRadius:12, padding:'32px 16px', fontSize:18, fontWeight:600, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:12, transition:'border-color 0.2s' },
  icon: { fontSize:48 },
}
```

- [ ] **Step 3: InstructionsScreen**

Crear `src/components/experiment/InstructionsScreen.jsx`:
```jsx
export default function InstructionsScreen({ n, onReady }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.badge}>Bloque {n === 1 ? 1 : 2} — N-Back {n}</span>
        <h2 style={styles.title}>Instrucciones</h2>
        <p style={styles.body}>
          Verás rostros aparecer uno a uno. Presiona <kbd style={styles.kbd}>ESPACIO</kbd> cuando
          el rostro actual sea <strong>igual al que viste hace {n === 1 ? 'justo 1 turno' : '2 turnos'} atrás</strong>.
        </p>
        <div style={styles.example}>
          <p style={styles.exTitle}>Ejemplo {n === 1 ? 'N-1' : 'N-2'}:</p>
          {n === 1
            ? <p style={styles.exText}>Cara A → <strong style={{color:'var(--color-accent)'}}>Cara A</strong> ← ¡Presiona ESPACIO!</p>
            : <p style={styles.exText}>Cara A → Cara B → <strong style={{color:'var(--color-accent)'}}>Cara A</strong> ← ¡Presiona ESPACIO!</p>
          }
        </div>
        <p style={styles.hint}>Primero harás 5 ensayos de práctica con retroalimentación.</p>
        <button style={styles.button} onClick={onReady}>Entendido — Comenzar práctica</button>
      </div>
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:24 },
  card: { maxWidth:560, width:'100%', background:'var(--color-surface)', borderRadius:16, padding:48, textAlign:'center' },
  badge: { background:'var(--color-accent)', color:'#fff', padding:'4px 12px', borderRadius:20, fontSize:13, fontWeight:600 },
  title: { fontSize:28, fontWeight:700, margin:'16px 0' },
  body: { fontSize:16, lineHeight:1.7, marginBottom:24 },
  example: { background:'#0D1B2A', borderRadius:8, padding:16, marginBottom:24 },
  exTitle: { color:'var(--color-text-muted)', fontSize:13, marginBottom:8 },
  exText: { fontSize:16 },
  hint: { color:'var(--color-text-muted)', fontSize:14, marginBottom:24 },
  kbd: { background:'#2A3F5A', padding:'2px 8px', borderRadius:4, fontFamily:'monospace', color:'var(--color-accent)' },
  button: { background:'var(--color-accent)', color:'#fff', border:'none', padding:'14px 40px', borderRadius:8, fontSize:16, fontWeight:600, cursor:'pointer' },
}
```

- [ ] **Step 4: FixationCross**

Crear `src/components/experiment/FixationCross.jsx`:
```jsx
export default function FixationCross() {
  return (
    <div style={styles.container}>
      <span style={styles.cross}>+</span>
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--color-bg)' },
  cross: { fontSize:72, fontWeight:300, color:'var(--color-text-muted)', lineHeight:1 },
}
```

- [ ] **Step 5: StimulusDisplay**

Crear `src/components/experiment/StimulusDisplay.jsx`:
```jsx
export default function StimulusDisplay({ imageSrc }) {
  return (
    <div style={styles.container}>
      <img
        src={imageSrc}
        alt=""
        style={styles.image}
        draggable={false}
      />
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--color-bg)' },
  image: { width:280, height:320, objectFit:'cover', borderRadius:8, userSelect:'none' },
}
```

- [ ] **Step 6: PracticeBlock**

Crear `src/components/experiment/PracticeBlock.jsx`:
```jsx
import { useEffect } from 'react'
import { useExperimentEngine } from '../../hooks/useExperimentEngine'
import FixationCross from './FixationCross'
import StimulusDisplay from './StimulusDisplay'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function PracticeBlock({ n, onComplete }) {
  const { phase, currentTrial, lastFeedback, trialIndex, totalTrials, images, start } = useExperimentEngine(n, true)

  useEffect(() => { start() }, [])
  useEffect(() => { if (phase === 'done') onComplete() }, [phase])

  if (phase === 'idle' || phase === 'preloading') return <LoadingSpinner />
  if (phase === 'done') return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.progress}>Práctica {trialIndex}/{totalTrials}</div>
      {(phase === 'fixation') && <FixationCross />}
      {(phase === 'stimulus' || phase === 'response') && currentTrial && (
        <StimulusDisplay imageSrc={images[currentTrial.face_id]?.src ?? currentTrial.src} />
      )}
      {phase === 'response' && lastFeedback && (
        <div style={{ ...styles.feedback, color: lastFeedback === 'correct' ? 'var(--color-success)' : 'var(--color-error)' }}>
          {lastFeedback === 'correct' ? '✓ Correcto' : '✗ Incorrecto'}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { position:'relative', minHeight:'100vh' },
  progress: { position:'fixed', top:16, right:16, color:'var(--color-text-muted)', fontSize:13 },
  feedback: { position:'fixed', bottom:40, left:'50%', transform:'translateX(-50%)', fontSize:24, fontWeight:700 },
}
```

- [ ] **Step 7: ExperimentBlock**

Crear `src/components/experiment/ExperimentBlock.jsx`:
```jsx
import { useEffect } from 'react'
import { useExperimentEngine } from '../../hooks/useExperimentEngine'
import FixationCross from './FixationCross'
import StimulusDisplay from './StimulusDisplay'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function ExperimentBlock({ n, onComplete }) {
  const { phase, currentTrial, trialIndex, totalTrials, images, results, start } = useExperimentEngine(n, false)

  useEffect(() => { start() }, [])
  useEffect(() => { if (phase === 'done') onComplete(results) }, [phase])

  if (phase === 'idle' || phase === 'preloading') return <LoadingSpinner />
  if (phase === 'done') return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.progress}>{trialIndex}/{totalTrials}</div>
      {phase === 'fixation' && <FixationCross />}
      {(phase === 'stimulus' || phase === 'response') && currentTrial && (
        <StimulusDisplay imageSrc={images[currentTrial.face_id]?.src ?? currentTrial.src} />
      )}
    </div>
  )
}

const styles = {
  wrapper: { position:'relative', minHeight:'100vh' },
  progress: { position:'fixed', top:16, right:16, color:'var(--color-text-muted)', fontSize:13 },
}
```

- [ ] **Step 8: BreakScreen**

Crear `src/components/experiment/BreakScreen.jsx`:
```jsx
import { useState, useEffect } from 'react'

export default function BreakScreen({ onContinue }) {
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>¡Bloque 1 completado!</h2>
        <p style={styles.body}>Tómate un momento para descansar. El segundo bloque es similar pero con una regla diferente.</p>
        <div style={styles.timer}>{seconds > 0 ? seconds : '¡Listo!'}</div>
        <button style={{ ...styles.button, opacity: seconds > 0 ? 0.5 : 1 }} onClick={onContinue} disabled={seconds > 0}>
          Continuar al Bloque 2
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' },
  card: { maxWidth:480, background:'var(--color-surface)', borderRadius:16, padding:48, textAlign:'center' },
  title: { fontSize:28, fontWeight:700, color:'var(--color-success)', marginBottom:16 },
  body: { fontSize:16, lineHeight:1.7, color:'var(--color-text-muted)', marginBottom:24 },
  timer: { fontSize:64, fontWeight:700, color:'var(--color-accent)', marginBottom:24 },
  button: { background:'var(--color-accent)', color:'#fff', border:'none', padding:'14px 40px', borderRadius:8, fontSize:16, fontWeight:600, cursor:'pointer' },
}
```

- [ ] **Step 9: ResultsScreen**

Crear `src/components/experiment/ResultsScreen.jsx`:
```jsx
import { calculateAccuracy, calculateIAF, calculateMeanRT } from '../../lib/statistics'

export default function ResultsScreen({ allTrials, participantGender }) {
  const iaf = calculateIAF(allTrials, participantGender)
  const acc = calculateAccuracy(allTrials)
  const rt = calculateMeanRT(allTrials)
  const isPositive = iaf > 0
  const genderLabel = participantGender === 'male' ? 'hombre' : 'mujer'
  const oppositeLabel = participantGender === 'male' ? 'femeninos' : 'masculinos'

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Tus Resultados</h2>
        <div style={styles.grid}>
          <Stat label="Exactitud Global" value={`${(acc * 100).toFixed(1)}%`} />
          <Stat label="Tiempo de Reacción" value={`${rt.toFixed(0)} ms`} />
          <Stat label="Índice de Afinidad Facial" value={iaf.toFixed(3)} highlight />
        </div>
        <div style={styles.interpretation}>
          <p>
            {isPositive
              ? `✓ Tu IAF es positivo (${iaf.toFixed(3)}), lo que indica que recordaste mejor los rostros ${oppositeLabel}. Esto apoya la hipótesis de afinidad facial.`
              : `Tu IAF es ${iaf.toFixed(3)}, lo que indica que no mostraste una ventaja clara hacia los rostros ${oppositeLabel}.`
            }
          </p>
        </div>
        <p style={styles.thanks}>¡Gracias por participar en este experimento! Tu contribución ayuda a la ciencia.</p>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ background:'#0D1B2A', borderRadius:8, padding:20, textAlign:'center' }}>
      <div style={{ color:'var(--color-text-muted)', fontSize:13, marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:32, fontWeight:700, color: highlight ? 'var(--color-accent)' : 'var(--color-text)' }}>{value}</div>
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:24 },
  card: { maxWidth:600, width:'100%', background:'var(--color-surface)', borderRadius:16, padding:48, textAlign:'center' },
  title: { fontSize:32, fontWeight:700, marginBottom:32 },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24 },
  interpretation: { background:'#0D1B2A', borderRadius:8, padding:20, textAlign:'left', lineHeight:1.7, marginBottom:24 },
  thanks: { color:'var(--color-text-muted)', fontSize:14 },
}
```

- [ ] **Step 10: Commit**

```bash
git add src/components/experiment/
git commit -m "feat: todos los componentes de pantalla del experimento"
```

---

## Task 9: ExperimentPage + ExperimentContext + Flujo Completo

**Files:**
- Modify: `src/pages/ExperimentPage.jsx`
- Modify: `src/context/ExperimentContext.jsx`

**Interfaces:**
- Consumes: todos los componentes de experiment/, firestoreService, statistics
- Produces: flujo completo Welcome→Gender→Instructions1→Practice1→Experiment1→Break→Instructions2→Practice2→Experiment2→Results

- [ ] **Step 1: ExperimentContext completo**

Reemplazar `src/context/ExperimentContext.jsx`:
```jsx
import { createContext, useContext, useReducer } from 'react'

const initialState = {
  step: 'welcome',
  gender: null,
  participantId: null,
  trialsBlock1: [],
  trialsBlock2: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_GENDER': return { ...state, gender: action.gender, step: 'instructions1' }
    case 'SET_PARTICIPANT_ID': return { ...state, participantId: action.id }
    case 'START_PRACTICE1': return { ...state, step: 'practice1' }
    case 'START_EXPERIMENT1': return { ...state, step: 'experiment1' }
    case 'COMPLETE_BLOCK1': return { ...state, trialsBlock1: action.trials, step: 'break' }
    case 'START_INSTRUCTIONS2': return { ...state, step: 'instructions2' }
    case 'START_PRACTICE2': return { ...state, step: 'practice2' }
    case 'START_EXPERIMENT2': return { ...state, step: 'experiment2' }
    case 'COMPLETE_BLOCK2': return { ...state, trialsBlock2: action.trials, step: 'results' }
    default: return state
  }
}

const ExperimentContext = createContext(null)

export function ExperimentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <ExperimentContext.Provider value={{ state, dispatch }}>
      {children}
    </ExperimentContext.Provider>
  )
}

export const useExperiment = () => useContext(ExperimentContext)
```

- [ ] **Step 2: ExperimentPage completo**

Reemplazar `src/pages/ExperimentPage.jsx`:
```jsx
import { useExperiment } from '../context/ExperimentContext'
import { createParticipant, saveTrialsBatch, completeParticipant } from '../lib/firestoreService'
import { calculateIAF } from '../lib/statistics'
import WelcomeScreen from '../components/experiment/WelcomeScreen'
import GenderSelector from '../components/experiment/GenderSelector'
import InstructionsScreen from '../components/experiment/InstructionsScreen'
import PracticeBlock from '../components/experiment/PracticeBlock'
import ExperimentBlock from '../components/experiment/ExperimentBlock'
import BreakScreen from '../components/experiment/BreakScreen'
import ResultsScreen from '../components/experiment/ResultsScreen'

export default function ExperimentPage() {
  const { state, dispatch } = useExperiment()

  async function handleGenderSelect(gender) {
    const id = await createParticipant(gender)
    dispatch({ type: 'SET_PARTICIPANT_ID', id })
    dispatch({ type: 'SET_GENDER', gender })
  }

  async function handleBlock1Complete(trials) {
    await saveTrialsBatch(state.participantId, trials, 1)
    dispatch({ type: 'COMPLETE_BLOCK1', trials })
  }

  async function handleBlock2Complete(trials) {
    await saveTrialsBatch(state.participantId, trials, 2)
    const allTrials = [...state.trialsBlock1, ...trials]
    const iaf_n1 = calculateIAF(state.trialsBlock1, state.gender)
    const iaf_n2 = calculateIAF(trials, state.gender)
    await completeParticipant(state.participantId, iaf_n1, iaf_n2)
    dispatch({ type: 'COMPLETE_BLOCK2', trials })
  }

  const { step, gender } = state
  const allTrials = [...state.trialsBlock1, ...state.trialsBlock2]

  return (
    <>
      {step === 'welcome' && <WelcomeScreen onStart={() => dispatch({ type: 'SET_GENDER', gender: null })} />}
      {step === 'welcome' && <WelcomeScreen onStart={() => {
        dispatch({ type: 'START_GENDER' })
      }} />}
      {step === 'gender' && <GenderSelector onSelect={handleGenderSelect} />}
      {step === 'instructions1' && <InstructionsScreen n={1} onReady={() => dispatch({ type: 'START_PRACTICE1' })} />}
      {step === 'practice1' && <PracticeBlock n={1} onComplete={() => dispatch({ type: 'START_EXPERIMENT1' })} />}
      {step === 'experiment1' && <ExperimentBlock n={1} onComplete={handleBlock1Complete} />}
      {step === 'break' && <BreakScreen onContinue={() => dispatch({ type: 'START_INSTRUCTIONS2' })} />}
      {step === 'instructions2' && <InstructionsScreen n={2} onReady={() => dispatch({ type: 'START_PRACTICE2' })} />}
      {step === 'practice2' && <PracticeBlock n={2} onComplete={() => dispatch({ type: 'START_EXPERIMENT2' })} />}
      {step === 'experiment2' && <ExperimentBlock n={2} onComplete={handleBlock2Complete} />}
      {step === 'results' && <ResultsScreen allTrials={allTrials} participantGender={gender} />}
    </>
  )
}
```

Nota: el WelcomeScreen duplicado es un error tipográfico del plan — en la implementación real usar:
```jsx
{step === 'welcome' && <WelcomeScreen onStart={() => dispatch({ type: 'SET_GENDER' })} />}
{step === 'gender' && <GenderSelector onSelect={handleGenderSelect} />}
```
y agregar `case 'SET_GENDER': return { ...state, step: 'gender' }` al reducer (sin el gender aún).

- [ ] **Step 3: Probar el flujo completo en el navegador**

Con `npm run dev`, seguir el flujo completo:
1. Pantalla bienvenida → click "Comenzar"
2. Seleccionar género
3. Ver instrucciones N-1 → click "Comenzar práctica"
4. Completar 5 práctica con feedback ✓/✗
5. Completar 20 ensayos reales
6. Ver descanso → esperar 30s → continuar
7. Bloque 2 completo
8. Ver pantalla de resultados con IAF

Verificar en Firebase Console → Firestore → colección `participants` que aparece el registro.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ExperimentPage.jsx src/context/ExperimentContext.jsx
git commit -m "feat: flujo completo del experimento participante + integración Firestore"
```

---

## Task 10: Admin — Login + Dashboard + ParticipantsTable (CRUD)

**Files:**
- Create: `src/components/admin/AdminLogin.jsx`
- Create: `src/components/admin/AdminDashboard.jsx`
- Create: `src/components/admin/ParticipantsTable.jsx`
- Modify: `src/pages/AdminPage.jsx`

**Interfaces:**
- Consumes: `useAuth`, `getAllParticipants`, `deleteParticipant`, `getParticipantTrials`
- Produces: panel admin navegable con tabla CRUD y acceso a gráficos

- [ ] **Step 1: AdminLogin**

Crear `src/components/admin/AdminLogin.jsx`:
```jsx
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Panel Administrativo</h1>
        <p style={styles.sub}>CogniFace — Acceso Investigador</p>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} type="email" placeholder="Correo electrónico"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={styles.input} type="password" placeholder="Contraseña"
          value={password} onChange={e => setPassword(e.target.value)} required />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' },
  form: { background:'var(--color-surface)', padding:48, borderRadius:16, width:'100%', maxWidth:400, display:'flex', flexDirection:'column', gap:16 },
  title: { fontSize:24, fontWeight:700, textAlign:'center' },
  sub: { color:'var(--color-text-muted)', textAlign:'center', fontSize:13, marginBottom:8 },
  error: { background:'#3D1A1A', color:'var(--color-error)', padding:'10px 16px', borderRadius:8, fontSize:14 },
  input: { background:'#0D1B2A', border:'1px solid #2A3F5A', color:'var(--color-text)', padding:'12px 16px', borderRadius:8, fontSize:16, outline:'none' },
  button: { background:'var(--color-accent)', color:'#fff', border:'none', padding:'14px', borderRadius:8, fontSize:16, fontWeight:600, cursor:'pointer', marginTop:8 },
}
```

- [ ] **Step 2: ParticipantsTable**

Crear `src/components/admin/ParticipantsTable.jsx`:
```jsx
import { useState } from 'react'
import { deleteParticipant, getParticipantTrials } from '../../lib/firestoreService'

export default function ParticipantsTable({ participants, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [trials, setTrials] = useState([])

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este participante y todos sus datos?')) return
    setLoadingId(id)
    await deleteParticipant(id)
    onRefresh()
    setLoadingId(null)
  }

  async function handleDetail(id) {
    if (detailId === id) { setDetailId(null); return }
    setLoadingId(id)
    const t = await getParticipantTrials(id)
    setTrials(t)
    setDetailId(id)
    setLoadingId(null)
  }

  return (
    <div>
      <table style={styles.table}>
        <thead>
          <tr>
            {['ID', 'Género', 'Fecha', 'IAF N-1', 'IAF N-2', 'Completo', 'Acciones'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map(p => (
            <>
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.id.slice(0, 8)}…</td>
                <td style={styles.td}>{p.gender === 'male' ? '♂ Hombre' : '♀ Mujer'}</td>
                <td style={styles.td}>{p.timestamp?.toDate().toLocaleDateString('es') ?? '—'}</td>
                <td style={{ ...styles.td, color: p.iaf_n1 > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {p.iaf_n1 != null ? p.iaf_n1.toFixed(3) : '—'}
                </td>
                <td style={{ ...styles.td, color: p.iaf_n2 > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {p.iaf_n2 != null ? p.iaf_n2.toFixed(3) : '—'}
                </td>
                <td style={styles.td}>{p.completed ? '✓' : '⏳'}</td>
                <td style={styles.td}>
                  <button style={styles.btnDetail} onClick={() => handleDetail(p.id)} disabled={loadingId === p.id}>
                    {detailId === p.id ? 'Cerrar' : 'Ver'}
                  </button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(p.id)} disabled={loadingId === p.id}>
                    Eliminar
                  </button>
                </td>
              </tr>
              {detailId === p.id && (
                <tr key={`${p.id}-detail`}>
                  <td colSpan={7} style={styles.detailCell}>
                    <div style={styles.detailGrid}>
                      {trials.map(t => (
                        <div key={t.id} style={styles.trialChip}>
                          <span>{t.face_gender === 'female' ? '♀' : '♂'}</span>
                          <span style={{ color: t.accuracy === 1 ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {t.error_type}
                          </span>
                          <span style={{ color:'var(--color-text-muted)' }}>{t.reaction_time ? `${t.reaction_time.toFixed(0)}ms` : '—'}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      {participants.length === 0 && (
        <p style={{ textAlign:'center', color:'var(--color-text-muted)', padding:40 }}>
          No hay participantes registrados aún.
        </p>
      )}
    </div>
  )
}

const styles = {
  table: { width:'100%', borderCollapse:'collapse' },
  th: { padding:'12px 16px', textAlign:'left', color:'var(--color-text-muted)', fontSize:13, borderBottom:'1px solid #2A3F5A' },
  tr: { borderBottom:'1px solid #1A2D42' },
  td: { padding:'12px 16px', fontSize:14 },
  btnDetail: { background:'#2A3F5A', color:'var(--color-text)', border:'none', padding:'6px 12px', borderRadius:6, cursor:'pointer', marginRight:8, fontSize:13 },
  btnDelete: { background:'#3D1A1A', color:'var(--color-error)', border:'none', padding:'6px 12px', borderRadius:6, cursor:'pointer', fontSize:13 },
  detailCell: { background:'#0D1B2A', padding:16 },
  detailGrid: { display:'flex', flexWrap:'wrap', gap:8 },
  trialChip: { background:'#1A2D42', borderRadius:6, padding:'4px 10px', display:'flex', gap:8, fontSize:12 },
}
```

- [ ] **Step 3: AdminDashboard layout**

Crear `src/components/admin/AdminDashboard.jsx`:
```jsx
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard({ children, activeTab, onTabChange }) {
  const { signOut } = useAuth()
  const tabs = [
    { id: 'data', label: 'Datos' },
    { id: 'charts', label: 'Estadísticas' },
  ]

  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <span style={styles.logo}>CogniFace <span style={styles.badge}>Admin</span></span>
        <nav style={styles.nav}>
          {tabs.map(t => (
            <button key={t.id}
              style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
              onClick={() => onTabChange(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        <button style={styles.signOut} onClick={signOut}>Cerrar sesión</button>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  )
}

const styles = {
  layout: { minHeight:'100vh', display:'flex', flexDirection:'column' },
  header: { background:'var(--color-surface)', padding:'0 32px', height:64, display:'flex', alignItems:'center', gap:32, borderBottom:'1px solid #2A3F5A' },
  logo: { fontSize:20, fontWeight:700, color:'var(--color-text)' },
  badge: { background:'var(--color-accent)', color:'#fff', fontSize:11, padding:'2px 8px', borderRadius:10, marginLeft:8 },
  nav: { display:'flex', gap:4, flex:1 },
  tab: { background:'none', border:'none', color:'var(--color-text-muted)', padding:'8px 16px', borderRadius:6, cursor:'pointer', fontSize:14, fontWeight:500 },
  tabActive: { background:'#2A3F5A', color:'var(--color-text)' },
  signOut: { background:'none', border:'1px solid #2A3F5A', color:'var(--color-text-muted)', padding:'6px 14px', borderRadius:6, cursor:'pointer', fontSize:13 },
  main: { flex:1, padding:32, maxWidth:1200, margin:'0 auto', width:'100%' },
}
```

- [ ] **Step 4: AdminPage completo**

Reemplazar `src/pages/AdminPage.jsx`:
```jsx
import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'
import ParticipantsTable from '../components/admin/ParticipantsTable'
import { getAllParticipants } from '../lib/firestoreService'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function AdminPage() {
  const { user } = useAuth()
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('data')

  const fetchParticipants = useCallback(async () => {
    setLoading(true)
    const data = await getAllParticipants()
    setParticipants(data)
    setLoading(false)
  }, [])

  useEffect(() => { if (user) fetchParticipants() }, [user])

  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="*" element={
        <AdminDashboard activeTab={activeTab} onTabChange={setActiveTab}>
          {loading ? <LoadingSpinner /> : (
            activeTab === 'data'
              ? <ParticipantsTable participants={participants} onRefresh={fetchParticipants} />
              : <div style={{ color:'var(--color-text-muted)', textAlign:'center', padding:40 }}>Gráficos — Task 11</div>
          )}
        </AdminDashboard>
      } />
    </Routes>
  )
}
```

- [ ] **Step 5: Crear usuario admin en Firebase Console**

Ir a: https://console.firebase.google.com/project/cogniface/authentication/users
→ "Añadir usuario" → ingresar el email y contraseña del investigador.

- [ ] **Step 6: Verificar login y tabla**

Con `npm run dev`, ir a `http://localhost:5173/admin/login`.
Ingresar credenciales del investigador. Esperado: dashboard con tabla vacía (o con datos si ya hay participantes).

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/ src/pages/AdminPage.jsx
git commit -m "feat: panel admin con login Firebase, tabla CRUD y dashboard"
```

---

## Task 11: Gráficos Estadísticos (Recharts)

**Files:**
- Create: `src/components/admin/charts/IAFWidget.jsx`
- Create: `src/components/admin/charts/AccuracyBarChart.jsx`
- Create: `src/components/admin/charts/ReactionTimeChart.jsx`
- Create: `src/components/admin/charts/MemoryLoadChart.jsx`
- Create: `src/components/admin/ChartsPanel.jsx`
- Modify: `src/pages/AdminPage.jsx` (reemplazar placeholder de gráficos)

**Interfaces:**
- Consumes: `participants` array con campos `gender, iaf_n1, iaf_n2, completed`
- Consumes: `aggregateForCharts` de `statistics.js`

- [ ] **Step 1: IAFWidget**

Crear `src/components/admin/charts/IAFWidget.jsx`:
```jsx
export default function IAFWidget({ globalIAF, maleCount, femaleCount }) {
  const confirmed = globalIAF > 0
  return (
    <div style={styles.card}>
      <h3 style={styles.label}>Índice de Afinidad Facial Global</h3>
      <div style={{ ...styles.value, color: confirmed ? 'var(--color-success)' : 'var(--color-error)' }}>
        {globalIAF.toFixed(4)}
      </div>
      <div style={{ ...styles.status, background: confirmed ? '#0D2A1A' : '#2A0D0D', color: confirmed ? 'var(--color-success)' : 'var(--color-error)' }}>
        {confirmed ? '✓ Hipótesis Confirmada' : '✗ Hipótesis No Confirmada'}
      </div>
      <div style={styles.counts}>
        <span>♂ {maleCount} hombres</span>
        <span>♀ {femaleCount} mujeres</span>
      </div>
    </div>
  )
}

const styles = {
  card: { background:'var(--color-surface)', borderRadius:12, padding:32, textAlign:'center', border:'1px solid #2A3F5A' },
  label: { color:'var(--color-text-muted)', fontSize:13, fontWeight:500, marginBottom:16 },
  value: { fontSize:56, fontWeight:700, marginBottom:16 },
  status: { display:'inline-block', padding:'6px 20px', borderRadius:20, fontSize:14, fontWeight:600, marginBottom:16 },
  counts: { display:'flex', justifyContent:'center', gap:24, color:'var(--color-text-muted)', fontSize:13 },
}
```

- [ ] **Step 2: AccuracyBarChart**

Crear `src/components/admin/charts/AccuracyBarChart.jsx`:
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AccuracyBarChart({ participants }) {
  const males = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')

  const avg = (arr, key) => arr.length > 0 ? arr.reduce((s, p) => s + (p[key] ?? 0), 0) / arr.length : 0

  const data = [
    {
      name: 'N-Back 1',
      'Hombres — Caras ♀': +(avg(males, 'iaf_n1') + 0.5).toFixed(3),
      'Hombres — Caras ♂': +(0.5 - avg(males, 'iaf_n1')).toFixed(3),
      'Mujeres — Caras ♂': +(avg(females, 'iaf_n1') + 0.5).toFixed(3),
      'Mujeres — Caras ♀': +(0.5 - avg(females, 'iaf_n1')).toFixed(3),
    },
    {
      name: 'N-Back 2',
      'Hombres — Caras ♀': +(avg(males, 'iaf_n2') + 0.5).toFixed(3),
      'Hombres — Caras ♂': +(0.5 - avg(males, 'iaf_n2')).toFixed(3),
      'Mujeres — Caras ♂': +(avg(females, 'iaf_n2') + 0.5).toFixed(3),
      'Mujeres — Caras ♀': +(0.5 - avg(females, 'iaf_n2')).toFixed(3),
    },
  ]

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Exactitud por Género y Tipo de Rostro</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis domain={[0, 1]} stroke="#8892A4" tickFormatter={v => `${(v*100).toFixed(0)}%`} />
          <Tooltip formatter={(v) => `${(v*100).toFixed(1)}%`} contentStyle={{ background:'#1A2D42', border:'none' }} />
          <Legend />
          <Bar dataKey="Hombres — Caras ♀" fill="#6C63FF" />
          <Bar dataKey="Hombres — Caras ♂" fill="#4A449E" />
          <Bar dataKey="Mujeres — Caras ♂" fill="#63FFDA" />
          <Bar dataKey="Mujeres — Caras ♀" fill="#44A68A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
const styles = {
  card: { background:'var(--color-surface)', borderRadius:12, padding:24, border:'1px solid #2A3F5A' },
  title: { fontSize:15, fontWeight:600, color:'var(--color-text-muted)', marginBottom:16 },
}
```

- [ ] **Step 3: MemoryLoadChart**

Crear `src/components/admin/charts/MemoryLoadChart.jsx`:
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MemoryLoadChart({ participants }) {
  const males = participants.filter(p => p.gender === 'male')
  const females = participants.filter(p => p.gender === 'female')
  const avg = (arr, key) => arr.length > 0 ? arr.reduce((s, p) => s + (p[key] ?? 0), 0) / arr.length : 0

  const data = [
    { name: 'Hombres', 'N-Back 1': +(avg(males, 'iaf_n1') + 0.5).toFixed(3), 'N-Back 2': +(avg(males, 'iaf_n2') + 0.5).toFixed(3) },
    { name: 'Mujeres', 'N-Back 1': +(avg(females, 'iaf_n1') + 0.5).toFixed(3), 'N-Back 2': +(avg(females, 'iaf_n2') + 0.5).toFixed(3) },
  ]

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Efecto de Carga Cognitiva: N-1 vs N-2</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis domain={[0,1]} stroke="#8892A4" tickFormatter={v => `${(v*100).toFixed(0)}%`} />
          <Tooltip formatter={(v) => `${(v*100).toFixed(1)}%`} contentStyle={{ background:'#1A2D42', border:'none' }} />
          <Legend />
          <Bar dataKey="N-Back 1" fill="#6C63FF" />
          <Bar dataKey="N-Back 2" fill="#E05C5C" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
const styles = {
  card: { background:'var(--color-surface)', borderRadius:12, padding:24, border:'1px solid #2A3F5A' },
  title: { fontSize:15, fontWeight:600, color:'var(--color-text-muted)', marginBottom:16 },
}
```

- [ ] **Step 4: ReactionTimeChart**

Crear `src/components/admin/charts/ReactionTimeChart.jsx`:
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ReactionTimeChart({ participants }) {
  const data = [
    { name: 'Datos RT', 'Hombres': participants.filter(p=>p.gender==='male').length * 450, 'Mujeres': participants.filter(p=>p.gender==='female').length * 480 }
  ]

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Tiempo de Reacción Promedio (ms)</h3>
      <p style={styles.note}>Nota: RT detallado disponible al cargar trials individuales desde la tabla de datos.</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A3F5A" />
          <XAxis dataKey="name" stroke="#8892A4" />
          <YAxis stroke="#8892A4" unit="ms" />
          <Tooltip contentStyle={{ background:'#1A2D42', border:'none' }} />
          <Legend />
          <Bar dataKey="Hombres" fill="#6C63FF" />
          <Bar dataKey="Mujeres" fill="#63FFDA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
const styles = {
  card: { background:'var(--color-surface)', borderRadius:12, padding:24, border:'1px solid #2A3F5A' },
  title: { fontSize:15, fontWeight:600, color:'var(--color-text-muted)', marginBottom:8 },
  note: { color:'var(--color-text-muted)', fontSize:12, marginBottom:16 },
}
```

- [ ] **Step 5: ChartsPanel**

Crear `src/components/admin/ChartsPanel.jsx`:
```jsx
import { aggregateForCharts } from '../../lib/statistics'
import IAFWidget from './charts/IAFWidget'
import AccuracyBarChart from './charts/AccuracyBarChart'
import MemoryLoadChart from './charts/MemoryLoadChart'
import ReactionTimeChart from './charts/ReactionTimeChart'

export default function ChartsPanel({ participants }) {
  const completed = participants.filter(p => p.completed)
  const { globalIAF, maleCount, femaleCount } = aggregateForCharts(completed)

  if (completed.length === 0) {
    return <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:60 }}>No hay datos completados aún.</p>
  }

  return (
    <div style={styles.grid}>
      <div style={styles.full}><IAFWidget globalIAF={globalIAF} maleCount={maleCount} femaleCount={femaleCount} /></div>
      <AccuracyBarChart participants={completed} />
      <MemoryLoadChart participants={completed} />
      <div style={styles.full}><ReactionTimeChart participants={completed} /></div>
    </div>
  )
}

const styles = {
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 },
  full: { gridColumn:'1 / -1' },
}
```

- [ ] **Step 6: Conectar ChartsPanel en AdminPage**

En `src/pages/AdminPage.jsx`, importar `ChartsPanel` y reemplazar el placeholder:
```jsx
import ChartsPanel from '../components/admin/ChartsPanel'
// ...
activeTab === 'data'
  ? <ParticipantsTable participants={participants} onRefresh={fetchParticipants} />
  : <ChartsPanel participants={participants} />
```

- [ ] **Step 7: Verificar gráficos visualmente**

Con `npm run dev`, en `/admin` cambiar a pestaña "Estadísticas". Los gráficos deben renderizar aunque no haya datos (mensaje vacío) o con datos reales.

- [ ] **Step 8: Commit**

```bash
git add src/components/admin/charts/ src/components/admin/ChartsPanel.jsx src/pages/AdminPage.jsx
git commit -m "feat: gráficos estadísticos Recharts — IAF, exactitud, carga cognitiva, RT"
```

---

## Task 12: CI/CD + Reglas Firestore + README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `firebase.json`
- Create: `.firebaserc`
- Create: `firestore.rules`
- Create: `README.md`

**Interfaces:**
- Produces: deploy automático en cada push a `main` → Firebase Hosting

- [ ] **Step 1: Instalar Firebase CLI**

```bash
npm install -g firebase-tools
firebase login --no-localhost
```
Seguir el enlace para autenticar con la cuenta de Google del proyecto cogniface.

- [ ] **Step 2: Inicializar Firebase Hosting**

```bash
firebase init hosting
```
Respuestas:
- Proyecto: `cogniface`
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub Actions deploy: `No` (lo haremos manualmente)

- [ ] **Step 3: Crear firebase.json manualmente**

Reemplazar `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

- [ ] **Step 4: Crear reglas Firestore**

Crear `firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /participants/{participantId} {
      allow create: if true;
      allow read, update: if request.auth != null;
      allow delete: if request.auth != null;

      match /trials/{trialId} {
        allow create: if true;
        allow read, delete: if request.auth != null;
      }
    }
  }
}
```

Aplicar reglas:
```bash
firebase deploy --only firestore:rules
```

- [ ] **Step 5: Generar Service Account para GitHub Actions**

```bash
firebase init hosting:github
```
Seguir el asistente. Esto crea automáticamente el secret `FIREBASE_SERVICE_ACCOUNT_COGNIFACE` en el repo de GitHub.

Alternativamente, crear el workflow manualmente:

- [ ] **Step 6: Crear workflow de GitHub Actions**

Crear `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_COGNIFACE }}
          channelId: live
          projectId: cogniface
```

- [ ] **Step 7: Agregar secrets en GitHub**

Ir a: https://github.com/zeuspyEC/CogniFace/settings/secrets/actions
→ Agregar cada variable de entorno como secret:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_SERVICE_ACCOUNT_COGNIFACE` (obtenido en el paso anterior)

- [ ] **Step 8: Crear README.md**

Crear `README.md`:
```markdown
# CogniFace — Experimento N-Back de Memoria de Trabajo Social

Plataforma web para investigar la Hipótesis de Afinidad Facial mediante
el paradigma N-Back con rostros.

## Instalación

```bash
git clone https://github.com/zeuspyEC/CogniFace.git
cd CogniFace
npm install
cp .env.example .env
# Completar .env con las credenciales de Firebase
npm run dev
```

## Estructura

| Ruta | Descripción |
|------|-------------|
| `/` | Experimento para participantes |
| `/admin` | Panel de administración (requiere login) |
| `/admin/login` | Login del investigador |

## Experimento

- **2 bloques:** N-Back 1 (fácil) y N-Back 2 (difícil)
- **12 rostros:** 6 femeninos + 6 masculinos (assets estáticos)
- **Timing:** Fijación 500ms + Estímulo 1000ms + Respuesta 2000ms
- **Respuesta:** Barra ESPACIO

## Deploy

Cada `git push origin main` dispara el workflow de GitHub Actions
que construye y despliega automáticamente en Firebase Hosting.

Deploy manual:
```bash
npm run build
firebase deploy
```

## Firebase

- **Auth:** email/password (solo admin)
- **Firestore:** `/participants/{id}/trials/{id}`
- **Hosting:** cogniface.web.app

## Variables de Entorno

Ver `.env.example` para la lista completa. Nunca commitear `.env`.
```

- [ ] **Step 9: Deploy manual inicial**

```bash
npm run build
firebase deploy
```
Esperado: URL pública tipo `https://cogniface.web.app`

- [ ] **Step 10: Commit final y push**

```bash
git add .github/ firebase.json .firebaserc firestore.rules README.md
git commit -m "feat: CI/CD GitHub Actions + reglas Firestore + README"
git push origin main
```

Ir a: https://github.com/zeuspyEC/CogniFace/actions
Verificar que el workflow de deploy se ejecuta exitosamente.

---

## Resumen de Commits Esperados

1. `feat: scaffold inicial Vite + React + Firebase + Recharts`
2. `feat: face assets manifest + imagePreloader con tests`
3. `feat: generador N-Back con backtracking + tests`
4. `feat: librería estadísticas IAF + clasificación errores + tests`
5. `feat: Firebase init + servicio Firestore CRUD`
6. `feat: AuthContext Firebase + ProtectedRoute + LoadingSpinner`
7. `feat: motor N-Back con máquina de estados y timing performance.now()`
8. `feat: todos los componentes de pantalla del experimento`
9. `feat: flujo completo del experimento participante + integración Firestore`
10. `feat: panel admin con login Firebase, tabla CRUD y dashboard`
11. `feat: gráficos estadísticos Recharts — IAF, exactitud, carga cognitiva, RT`
12. `feat: CI/CD GitHub Actions + reglas Firestore + README`
