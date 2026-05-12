# Diseño: ECG — Botones Pause y Zoom para enseñanza

**Fecha:** 2026-05-11
**Estado:** Aprobado

---

## Objetivo

Agregar botones **Pause** y **Zoom** al simulador ECG en los tabs Simulador y Aprendizaje de `modules/ecg.html`, para facilitar la enseñanza clínica en clase.

---

## Archivo a modificar

| Archivo | Cambios |
|---------|---------|
| `modules/ecg.html` | HUD de sec-sim + HUD de sec-learn + JS renderer + CSS |

---

## Funcionalidad

### Botón Pause
- Toggle ⏸ / ▶ en el HUD del canvas
- `⏸ Pausar` → llama `renderer.stop()`, cambia a `▶ Reanudar`
- `▶ Reanudar` → llama `renderer.start(engine)`, cambia a `⏸ Pausar`
- Estado independiente por tab: pausar Simulador no afecta Aprendizaje
- Variables de estado: `let simPaused = false` / `let learnPaused = false`

### Botón Zoom (ciclo 3 niveles)
- Cicla: `1×` → `2×` → `4×` → `1×`
- Ajusta `renderer.pps` (pixels per sample):
  - `1×` → `pps = 0.5` → velocidad 25 mm/s (normal)
  - `2×` → `pps = 1.0` → velocidad 12.5 mm/s
  - `4×` → `pps = 2.0` → velocidad 6.25 mm/s
- Actualiza el `ecg-meta` label: `DII · {speed} mm/s · 10 mm/mV`
- Estado independiente por tab: `let simZoom = 1` / `let learnZoom = 1`

---

## Cambios técnicos en ECGRenderer

### Antes (PPS global)
```javascript
const PPS = 0.5;   // px per sample — global constant
// En draw():
const samplesOnScreen = Math.ceil(W / PPS);
```

### Después (pps por instancia)
```javascript
const PPS = 0.5;   // valor base, se mantiene como default

class ECGRenderer {
  constructor(canvasId, h = 200) {
    // ...existing...
    this.pps = PPS;   // nueva propiedad, por defecto igual al global
    this.bufLen = Math.round(this.canvas.width / this.pps) + 10;
    // ...
  }

  setZoom(multiplier) {
    this.pps = PPS * multiplier;
    this.bufLen = Math.round((this.canvas.width || 760) / this.pps) + 10;
    this.buf = new Float32Array(this.bufLen).fill(0);
    this.writePos = 0;
    this.readPos = 0;
  }

  // En draw(), reemplazar PPS por this.pps:
  draw() {
    const samplesOnScreen = Math.ceil(W / this.pps);
    // sIdx cálculo también usa this.pps
    const sIdx = Math.floor((total - 1) - (W - 1 - px) / this.pps);
  }
}
```

---

## Layout del HUD

### Simulador (sec-sim)
```
ecg-hud (flex row)
  ├── ecg-hud-left
  │     ├── ecg-meta  "DII · 25 mm/s · 10 mm/mV"   ← se actualiza con zoom
  │     └── ecg-rhythm-name  "Ritmo Sinusal Normal"
  ├── hud-controls (nuevo div flex gap)
  │     ├── button#simPauseBtn  "⏸ Pausar"
  │     └── button#simZoomBtn   "1×"
  └── ecg-bpm-display  "72 lpm"
```

### Aprendizaje (sec-learn)
```
ecg-hud (flex row)
  ├── ecg-hud-left
  │     ├── ecg-meta  "DII · 25 mm/s · 10 mm/mV"   ← se actualiza con zoom
  │     └── ecg-rhythm-name  "Ritmo Sinusal Normal"
  ├── hud-controls (nuevo div flex gap)
  │     ├── button#learnPauseBtn  "⏸"
  │     └── button#learnZoomBtn   "1×"
  └── ecg-meta style  "Modo estudio"
```

---

## CSS nuevo: `.hud-btn`

```css
.hud-btn {
  padding: 3px 10px;
  border-radius: var(--rs);
  background: rgba(74,158,255,.1);
  border: 1px solid rgba(74,158,255,.25);
  color: #4a9eff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--fh);
  transition: all .2s;
  white-space: nowrap;
}
.hud-btn:hover { background: rgba(74,158,255,.2); }
.hud-btn.active { background: rgba(74,158,255,.25); border-color: rgba(74,158,255,.5); }
.hud-controls { display: flex; align-items: center; gap: 5px; }
```

---

## Funciones JS

```javascript
// PAUSE
let simPaused = false;
function toggleSimPause() {
  simPaused = !simPaused;
  const btn = document.getElementById('simPauseBtn');
  if (simPaused) {
    simRenderer.stop();
    btn.textContent = '▶ Reanudar';
    btn.classList.add('active');
  } else {
    simRenderer.start(engine);
    btn.textContent = '⏸ Pausar';
    btn.classList.remove('active');
  }
}

let learnPaused = false;
function toggleLearnPause() {
  learnPaused = !learnPaused;
  const btn = document.getElementById('learnPauseBtn');
  if (learnPaused) {
    learnRenderer.stop();
    btn.textContent = '▶';
    btn.classList.add('active');
  } else {
    const r = RHYTHMS.find(r => r.id === learnRhythmId) || RHYTHMS[0];
    learnRenderer.start(engine);
    btn.textContent = '⏸';
    btn.classList.remove('active');
  }
}

// ZOOM
const ZOOM_LEVELS = [1, 2, 4];
const ZOOM_SPEEDS = ['25 mm/s', '12.5 mm/s', '6.25 mm/s'];
let simZoomIdx = 0;
function cycleSimZoom() {
  simZoomIdx = (simZoomIdx + 1) % ZOOM_LEVELS.length;
  const n = ZOOM_LEVELS[simZoomIdx];
  simRenderer.setZoom(n);
  document.getElementById('simZoomBtn').textContent = n + '×';
  document.getElementById('sim-ecg-meta').textContent =
    'DII · ' + ZOOM_SPEEDS[simZoomIdx] + ' · 10 mm/mV';
}

let learnZoomIdx = 0;
function cycleLearnZoom() {
  learnZoomIdx = (learnZoomIdx + 1) % ZOOM_LEVELS.length;
  const n = ZOOM_LEVELS[learnZoomIdx];
  learnRenderer.setZoom(n);
  document.getElementById('learnZoomBtn').textContent = n + '×';
  document.getElementById('learn-ecg-meta').textContent =
    'DII · ' + ZOOM_SPEEDS[learnZoomIdx] + ' · 10 mm/mV';
}
```

**Nota:** Al cambiar de tab con `setMode()`, resetear zoom y pause a valores por defecto para el tab que se activa.

---

## Reset al cambiar de tab

En `setMode()`, agregar al activar `sim` o `learn`:

```javascript
if (m === 'sim') {
  // reset pause
  simPaused = false;
  const pb = document.getElementById('simPauseBtn');
  if (pb) { pb.textContent = '⏸ Pausar'; pb.classList.remove('active'); }
  // reset zoom
  simZoomIdx = 0;
  simRenderer.setZoom(1);
  const zb = document.getElementById('simZoomBtn');
  if (zb) { zb.textContent = '1×'; }
  document.getElementById('sim-ecg-meta').textContent = 'DII · 25 mm/s · 10 mm/mV';
  // ...existing start logic
}
// similar para 'learn'
```

---

## Commit esperado

```
git add modules/ecg.html
git commit -m "feat: agregar pause y zoom al simulador ECG — enseñanza interactiva"
git push origin master
```
