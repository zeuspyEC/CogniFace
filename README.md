# CogniFace

**Plataforma de investigación psicológica** — Tarea cognitiva N-Back con rostros para evaluar la Hipótesis de Afinidad Facial (IAF).

Desarrollada en la **Universidad Técnica del Norte**, Facultad de Educación, Ciencia y Tecnología (FECYT), Carrera de Psicología.

---

## ¿Qué mide?

CogniFace evalúa si existe una **ventaja de memoria de trabajo hacia el sexo opuesto** al procesar rostros. La hipótesis (IAF) predice que:

- Los **hombres** recuerdan mejor rostros femeninos
- Las **mujeres** recuerdan mejor rostros masculinos

Esto se mide con el paradigma N-Back: el participante ve una secuencia de rostros y debe presionar ESPACIO cuando el rostro actual coincide con uno visto N posiciones atrás.

---

## Cómo funciona el experimento

### Flujo del participante

```
Bienvenida → Datos (sexo, ID, edad) → Elegir bloque (N-1 o N-2)
→ Instrucciones → 5 ensayos práctica → 20 ensayos reales → Resultados
```

### Bloques disponibles

| Bloque | Dificultad | Regla |
|--------|------------|-------|
| N-Back 1 | Básico | Responde cuando el rostro coincide con el anterior |
| N-Back 2 | Avanzado | Responde cuando el rostro coincide con el de hace 2 turnos |

### Timing por ensayo (3 500 ms total)

| Fase | Duración |
|------|----------|
| Cruz de fijación (+) | 500 ms |
| Rostro | 1 000 ms |
| Ventana de respuesta (ESPACIO) | 2 000 ms |

### Estímulos

- **12 rostros neutrales:** 6 femeninos (`f01–f06`) + 6 masculinos (`m01–m06`)
- Imágenes empaquetadas como assets estáticos (sin carga de red en runtime)
- **6 targets por bloque** (3 femeninos + 3 masculinos de 20 ensayos)

### Retroalimentación en práctica

Durante los 5 ensayos de práctica, el participante recibe feedback inmediato al responder: **¡Correcto!** o **Incorrecto**. En los 20 ensayos reales no hay feedback.

---

## Fórmula IAF

```
Hombre:  IAF = acc(rostros femeninos) − acc(rostros masculinos)
Mujer:   IAF = acc(rostros masculinos) − acc(rostros femeninos)

IAF > 0  →  ventaja hacia el sexo opuesto  →  hipótesis apoyada
IAF ≤ 0  →  sin ventaja diferencial
```

---

## Resultados por participante

Al terminar el bloque, el participante ve:

| Métrica | Descripción |
|---------|-------------|
| Aciertos | Targets correctamente detectados |
| Omisiones | Targets no detectados (miss) |
| Tiempo de Reacción | RT promedio en ms por acierto |
| Errores | Falsas alarmas (respuesta a distractor) |
| Error Emocional | Errores en rostros del sexo opuesto |
| Precisión | % de respuestas correctas |
| IAF | Índice de Afinidad Facial |

---

## Panel de Administración

Accesible en `/admin` con credenciales de investigador.

- **Dashboard** con métricas globales e IAF promedio por grupo
- **Gráficos científicos:** distribución IAF, slope chart N1→N2, lollipop por participante, comparación grupal con error bars
- **Tabla de participantes** con detalle de ensayos expandible
- **Exportar Excel** — descarga `.xlsx` con todos los datos (un clic)

---

## Stack Técnico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| UI | CSS custom properties (dark/light mode) + Recharts |
| Base de datos | Firebase Firestore (Spark, gratuito) |
| Auth | Firebase Auth (email/password, solo admin) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions → Firebase Hosting |
| Export | SheetJS (xlsx, client-side) |

---

## Instalación local

```bash
git clone https://github.com/zeuspyEC/CogniFace.git
cd CogniFace
npm install
cp .env.example .env
# Completar .env con las credenciales Firebase
npm run dev
```

---

## Variables de Entorno

Ver `.env.example`. **Nunca commitear `.env`.**

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

---

## Esquema Firestore

```
/participants/{id}
  gender, participant_code, age, timestamp
  completed, n_back, iaf
  hits, misses, false_alarms, emotional_errors, mean_rt, accuracy

  /trials/{id}
    block, trial_number, is_practice
    face_id, face_gender, is_target
    responded, reaction_time, accuracy, error_type
```

---

## CI/CD

Cada `git push origin main` dispara el workflow en `.github/workflows/deploy.yml`:

1. `npm ci` — instala dependencias
2. `npm run build` — construye con variables de entorno desde GitHub Secrets
3. Despliega Firestore rules vía REST API
4. Despliega a Firebase Hosting

**URL de producción:** https://cogniface.web.app

---

## Seguridad Firestore

Las reglas permiten:
- Participantes (anónimos) → crear datos y actualizar solo sus propios campos `completed`, `iaf_n1`, `iaf_n2`
- Admin (autenticado) → lectura y escritura total
- Nadie más → denegado

---

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/lib/sequences.js` | Generador de secuencias N-Back con backtracking |
| `src/lib/statistics.js` | IAF, Error Emocional, métricas por bloque |
| `src/lib/imagePreloader.js` | Precarga 12 imágenes antes del experimento |
| `src/hooks/useExperimentEngine.js` | Máquina de estados: fixation → stimulus → response |
| `src/context/ExperimentContext.jsx` | Estado global del experimento |
| `src/context/ThemeContext.jsx` | Dark/light mode persistido en localStorage |
| `src/pages/ExperimentPage.jsx` | Orquestador del flujo del participante |
| `src/pages/AdminPage.jsx` | Panel de administración |
| `firestore.rules` | Reglas de seguridad |
| `.github/workflows/deploy.yml` | Pipeline CI/CD |

---

## Referencia

Especificación técnica completa: `docs/superpowers/specs/2026-06-22-cogniface-design.md`
