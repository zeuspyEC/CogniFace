# CogniFace — Experimento N-Back de Memoria de Trabajo Social

Plataforma web para investigar la **Hipótesis de Afinidad Facial (IAF)** mediante el paradigma N-Back con rostros. Mide si existe ventaja de memoria hacia el sexo opuesto.

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
| `/` | Experimento para participantes (público) |
| `/admin` | Panel de administración (requiere login) |
| `/admin/login` | Login del investigador (email/password) |

## El Experimento

- **2 bloques:** N-Back 1 (fácil, compara con 1 cara atrás) y N-Back 2 (difícil, compara con 2 caras atrás)
- **12 rostros:** 6 femeninos + 6 masculinos (assets estáticos en `src/assets/faces/`)
- **Por bloque:** 5 ensayos de práctica + 20 ensayos reales
- **Targets:** 6 de 20 ensayos (3 femeninos + 3 masculinos por bloque)
- **Timing exacto por ensayo (3500ms total):**
  - Cruz fijación (+): 500ms
  - Rostro: 1000ms
  - Ventana respuesta (ESPACIO): 2000ms
- **Respuesta:** Barra espaciadora (ESPACIO)
- **Medición:** Reaction Time con `performance.now()` (sub-milisegundo) y precisión de respuesta

## Fórmula IAF

```
Hombre:  iaf = acc(caras_femeninas) - acc(caras_masculinas)
Mujer:   iaf = acc(caras_masculinas) - acc(caras_femeninas)
iaf > 0 → ventaja hacia sexo opuesto → hipótesis confirmada
```

## Deploy

Cada `git push origin main` dispara el workflow de GitHub Actions que construye y despliega automáticamente en Firebase Hosting.

### Deploy automático (CI/CD)

El workflow `.github/workflows/deploy.yml` se ejecuta automáticamente en cada push a `main`:
1. Descarga dependencias
2. Ejecuta `npm run build`
3. Despliega a Firebase Hosting

**Requisitos:** Los secrets de GitHub deben estar configurados en el repositorio:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_SERVICE_ACCOUNT_COGNIFACE` (service account JSON)

### Deploy manual

```bash
npm run build
firebase deploy
```

## Firebase

- **Proyecto:** cogniface
- **Auth:** email/password (solo investigador/admin)
- **Firestore:** Base de datos `/participants/{id}` con subcollection `/trials/{id}`
- **Hosting:** https://cogniface.web.app
- **Reglas:** Defined in `firestore.rules` — participantes pueden crear datos, solo auth puede leer/actualizar

## Variables de Entorno

Ver `.env.example` para la lista completa. **Nunca commitear `.env`.**

Las variables en Vite deben llevar prefijo `VITE_`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/lib/firebase.js` | Inicialización Firebase SDK |
| `src/lib/sequences.js` | Generador de secuencias N-Back con backtracking |
| `src/lib/statistics.js` | Cálculo IAF y métricas estadísticas |
| `src/lib/imagePreloader.js` | Precarga 12 imágenes antes del experimento |
| `src/hooks/useExperimentEngine.js` | Máquina de estados del experimento |
| `src/context/AuthContext.jsx` | Firebase Auth global |
| `src/components/shared/ProtectedRoute.jsx` | Guard para `/admin` |
| `.github/workflows/deploy.yml` | Workflow CI/CD |
| `firestore.rules` | Reglas de seguridad Firestore |

## Stack Técnico

- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **UI:** CSS puro + Recharts para gráficos
- **Backend:** Firebase (Auth + Firestore + Hosting)
- **Testing:** Vitest
- **Linting:** ESLint

## Recursos

- Especificación completa: `docs/superpowers/specs/2026-06-22-cogniface-design.md`
- GitHub: https://github.com/zeuspyEC/CogniFace
