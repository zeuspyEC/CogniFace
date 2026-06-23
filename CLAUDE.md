# CogniFace — Conocimiento del Proyecto para Claude

## ¿Qué es este proyecto?
Experimento web N-Back con rostros (psicología cognitiva) que mide si existe ventaja
de memoria hacia el sexo opuesto (Hipótesis de Afinidad Facial / IAF).

## Stack
- **Frontend:** React + Vite + React Router v6
- **Backend:** Firebase Spark gratuito (Auth + Firestore + Hosting)
- **Gráficos:** Recharts
- **Sin:** Cloud Functions, Firebase Storage, backend propio

## Repo
https://github.com/zeuspyEC/CogniFace.git

## Firebase (proyecto: cogniface)
Las credenciales van en `.env` (gitignoreado). Ver `.env.example` para las keys.
Project ID: `cogniface`
Auth domain: `cogniface.firebaseapp.com`

## Dos entornos
| Ruta | Acceso | Propósito |
|------|--------|-----------|
| `/` | Público | Experimento N-Back para participantes |
| `/admin` | Firebase Auth (email/pass) | Dashboard investigador: CRUD + gráficos |

## Experimento N-Back — Reglas Exactas
- **12 rostros:** 6 femeninos (f01–f06) + 6 masculinos (m01–m06) en `src/assets/faces/`
- **2 bloques:** N-1 (fácil) y N-2 (difícil)
- **Por bloque:** 5 ensayos práctica (feedback visible) + 20 ensayos reales (sin feedback)
- **Targets por bloque:** 3 femeninos + 3 masculinos (total 6 de 20)
- **Timing exacto por ensayo (3500ms total):**
  - Cruz fijación (+): 500ms
  - Rostro: 1000ms
  - Ventana respuesta (ESPACIO): 2000ms
- **RT medido con `performance.now()`** (sub-milisegundo)
- **Imágenes quemadas** como assets estáticos (sin red en runtime)
- **Batch write a Firestore** al terminar cada bloque (no trial-a-trial)

## Fórmula IAF
```
Hombre:  iaf = acc(caras_femeninas) - acc(caras_masculinas)
Mujer:   iaf = acc(caras_masculinas) - acc(caras_femeninas)
iaf > 0 → ventaja hacia sexo opuesto → hipótesis confirmada
```

## Esquema Firestore
```
/participants/{id}
  gender, timestamp, completed, iaf_n1, iaf_n2

  /trials/{id}
    block, trial_number, is_practice, face_id, face_gender,
    is_target, responded, reaction_time, accuracy, error_type
```

## Archivos Clave
| Archivo | Propósito |
|---------|-----------|
| `src/lib/firebase.js` | Init Firebase SDK con VITE_ env vars |
| `src/lib/sequences.js` | Generador de secuencias N-Back con backtracking |
| `src/lib/statistics.js` | Cálculo IAF, métricas, agregaciones para admin |
| `src/lib/imagePreloader.js` | Precarga 12 imágenes antes del experimento |
| `src/hooks/useExperimentEngine.js` | Máquina de estados: idle→fixation→stimulus→response→iti |
| `src/context/AuthContext.jsx` | Firebase Auth state global |
| `src/components/shared/ProtectedRoute.jsx` | Guard para /admin |

## Spec Completo
`docs/superpowers/specs/2026-06-22-cogniface-design.md`

## CI/CD
GitHub Actions → Firebase Hosting en cada push a `main`.
Ver `.github/workflows/deploy.yml`.

## Variables de Entorno
Nunca commitear `.env`. Usar `.env.example` como plantilla.
Las variables en Vite deben llevar prefijo `VITE_`.
