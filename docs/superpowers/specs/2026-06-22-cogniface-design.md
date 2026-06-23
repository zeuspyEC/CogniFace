# CogniFace — Design Spec
**Fecha:** 2026-06-22  
**Stack:** React (Vite) + Firebase (Auth + Firestore + Hosting) — Plan Spark gratuito  
**Repo:** https://github.com/zeuspyEC/CogniFace.git

---

## 1. Objetivo

Plataforma web que implementa un paradigma N-Back con rostros para investigar si existe ventaja de memoria hacia el sexo opuesto (Hipótesis de Afinidad Facial). Dos entornos:

- **Participante** (`/`): Experimento cronometrado a nivel de milisegundos.
- **Administrador** (`/admin`): Panel con Firebase Auth para gestión y estadísticas.

---

## 2. Arquitectura

```
React SPA (Vite + React Router v6)
├── /           → Motor N-Back (cliente puro)
└── /admin      → Dashboard investigador (Auth guard)

Firebase Spark (gratuito):
├── Authentication  → email/password para admin
├── Firestore       → participantes + ensayos
└── Hosting         → deploy de la SPA

Sin Cloud Functions. Sin Firebase Storage.
Imágenes: assets estáticos en /src/assets/faces/ (quemadas en el bundle).
IAF y estadísticas calculados en cliente del admin.
```

---

## 3. Estructura del Proyecto

```
CogniFace/
├── public/
├── src/
│   ├── assets/faces/
│   │   ├── female/   f01.jpg … f06.jpg
│   │   └── male/     m01.jpg … m06.jpg
│   ├── components/
│   │   ├── experiment/
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── GenderSelector.jsx
│   │   │   ├── InstructionsScreen.jsx
│   │   │   ├── PracticeBlock.jsx
│   │   │   ├── ExperimentBlock.jsx
│   │   │   ├── FixationCross.jsx
│   │   │   ├── StimulusDisplay.jsx
│   │   │   ├── BreakScreen.jsx
│   │   │   └── ResultsScreen.jsx
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ParticipantsTable.jsx
│   │   │   └── charts/
│   │   │       ├── AccuracyBarChart.jsx
│   │   │       ├── ReactionTimeChart.jsx
│   │   │       ├── IAFWidget.jsx
│   │   │       └── MemoryLoadChart.jsx
│   │   └── shared/
│   │       ├── ProtectedRoute.jsx
│   │       └── LoadingSpinner.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ExperimentContext.jsx
│   ├── hooks/
│   │   ├── useExperimentEngine.js
│   │   └── useParticipantData.js
│   ├── lib/
│   │   ├── firebase.js          ← init Firebase SDK (usa VITE_ env vars)
│   │   ├── sequences.js         ← generador de secuencias N-Back
│   │   ├── statistics.js        ← cálculo IAF y métricas
│   │   └── imagePreloader.js    ← precarga 12 rostros antes del experimento
│   ├── pages/
│   │   ├── ExperimentPage.jsx
│   │   └── AdminPage.jsx
│   └── App.jsx
├── .github/workflows/deploy.yml
├── .env                         ← gitignored (credenciales Firebase)
├── .env.example                 ← plantilla pública sin valores
├── .gitignore
├── README.md
├── vite.config.js
└── package.json
```

---

## 4. Flujo del Participante

```
[Bienvenida + Instrucciones generales]
        ↓
[Selector de Género: ♂ Hombre / ♀ Mujer]
        ↓  → crea participantId en Firestore (completed: false)
[BLOQUE 1 — N-Back 1]
  ├─ Instrucciones + ejemplo animado
  ├─ 5 ensayos práctica (feedback ✓/✗ visible)
  └─ 20 ensayos reales (sin feedback)
        ↓  → batch write bloque 1 a Firestore
[Pantalla de descanso]
        ↓
[BLOQUE 2 — N-Back 2]
  ├─ Instrucciones + ejemplo animado
  ├─ 5 ensayos práctica (feedback ✓/✗ visible)
  └─ 20 ensayos reales (sin feedback)
        ↓  → batch write bloque 2 + IAF calculado + completed: true
[RESULTADOS PERSONALES]
  ├─ % aciertos global
  ├─ Tiempo de reacción promedio (ms)
  ├─ IAF individual con interpretación textual
  └─ Agradecimiento
```

---

## 5. Timing del Motor (crítico — milisegundos)

```
┌──────────────────┬──────────────────┬──────────────────┐
│  Fijación (+)    │  Rostro visible  │  Ventana resp.   │
│    500 ms        │    1000 ms       │    2000 ms       │
└──────────────────┴──────────────────┴──────────────────┘
Total: 3500 ms/ensayo  |  RT medido con performance.now()
```

**Implementación:** `useExperimentEngine` usa `useReducer` como máquina de estados:
`idle → fixation → stimulus → response → iti`

`setTimeout` encadenados en `useEffect` con cleanup para evitar memory leaks.
Las 12 imágenes se precargan en objetos `Image` ANTES del primer ensayo.

---

## 6. Generación de Secuencias N-Back

Por bloque (20 ensayos reales):
- 3 targets femeninos + 3 targets masculinos
- 14 no-targets (verificados para no crear targets accidentales)

Banco: f01–f06, m01–m06. Algoritmo en `sequences.js` con backtracking.

Para los 5 ensayos de práctica: secuencia fija, no aleatoria.

---

## 7. Esquema Firestore

```
/participants/{participantId}
  gender:      "male" | "female"
  timestamp:   Timestamp
  completed:   boolean
  iaf_n1:      number
  iaf_n2:      number

  /trials/{trialId}
    block:          1 | 2
    trial_number:   1–20
    is_practice:    false
    face_id:        "f01" | "m03" ...
    face_gender:    "female" | "male"
    is_target:      boolean
    responded:      boolean
    reaction_time:  number | null  (ms, null = no respondió)
    accuracy:       1 | 0
    error_type:     "hit"|"miss"|"false_alarm"|"correct_rejection"
```

**Fórmula IAF:**
```
Hombre:  iaf = acc(caras_femeninas) − acc(caras_masculinas)
Mujer:   iaf = acc(caras_masculinas) − acc(caras_femeninas)
iaf > 0  →  ventaja hacia sexo opuesto  →  hipótesis confirmada ✓
```

Escritura en batch al finalizar cada bloque (nunca trial-a-trial durante el juego).

---

## 8. Dashboard Admin (/admin)

- **Auth:** Firebase email/password. `ProtectedRoute` redirige a `/admin/login` si no hay sesión.
- **Tabla CRUD:** ID, Género, Fecha, IAF N-1, IAF N-2, Completado, Acciones (detalle / eliminar).
- **Eliminar:** batch delete documento padre + subcolección trials.

**Gráficos (Recharts):**
1. `AccuracyBarChart` — exactitud (%) por [género_participante × género_rostro × bloque]
2. `ReactionTimeChart` — RT promedio (ms) por [género_participante × género_rostro]
3. `IAFWidget` — IAF global promedio + semáforo verde/rojo
4. `MemoryLoadChart` — rendimiento N-1 vs N-2 (efecto carga cognitiva)

---

## 9. Despliegue CI/CD

```yaml
# .github/workflows/deploy.yml
on: push (branches: [main])
steps:
  - npm ci && npm run build
  - FirebaseExtended/action-hosting-deploy@v0
    secrets: FIREBASE_SERVICE_ACCOUNT
```

Cada `git push origin main` → build → deploy automático en Firebase Hosting.

---

## 10. Visual Design

- **Paleta:** `#0D1B2A` azul oscuro + blanco roto + `#6C63FF` violeta científico
- **Tipografía:** Inter
- **Modo oscuro** por defecto
- **Responsive:** mobile-first, breakpoints 768px / 1024px
- **Accesibilidad:** WCAG AA mínimo
