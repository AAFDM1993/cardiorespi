# ECG Pause + Zoom — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar botones Pause y Zoom (3 niveles: 1×/2×/4×) a los tabs Simulador y Aprendizaje del ECG para facilitar la enseñanza en clase.

**Architecture:** Modificación de un único archivo `modules/ecg.html`. El Zoom hace a `PPS` una propiedad de instancia del `ECGRenderer` en lugar de constante global. El Pause usa los métodos `start()`/`stop()` ya existentes. Los botones van en el `ecg-hud` de cada canvas.

**Tech Stack:** HTML/CSS/JavaScript vanilla. Sin npm. Sin build. Verificación con Python. Git en PowerShell.

---

## File Map

| Archivo | Acción |
|---------|--------|
| `modules/ecg.html` | Único archivo — 4 cambios: CSS, HTML botones, ECGRenderer.setZoom(), JS funciones + setMode() reset |

---

### Task 1: CSS + IDs en ecg-meta + botones HTML en los HUDs

**Files:**
- Modify: `modules/ecg.html`

- [ ] **Step 1: Agregar CSS `.hud-btn` y `.hud-controls` al bloque `<style>`**

Localizar el final del bloque `<style>`, justo antes de `</style>` (actualmente alrededor de línea 302, después del CSS de `@media (min-width:920px)`). Insertar:

```css
/* ════════════════════════════════
   HUD CONTROLS (Pause / Zoom)
════════════════════════════════ */
.hud-controls{display:flex;align-items:center;gap:5px;margin:0 .5rem}
.hud-btn{
  padding:3px 10px;
  border-radius:var(--rs);
  background:rgba(74,158,255,.1);
  border:1px solid rgba(74,158,255,.25);
  color:#4a9eff;
  font-size:11px;
  font-weight:600;
  cursor:pointer;
  font-family:var(--fh);
  transition:all .2s;
  white-space:nowrap;
}
.hud-btn:hover{background:rgba(74,158,255,.2)}
.hud-btn.active{background:rgba(74,158,255,.25);border-color:rgba(74,158,255,.5)}
```

- [ ] **Step 2: Agregar id a los ecg-meta del Simulador y Aprendizaje**

En `sec-sim` (línea ~393), localizar:
```html
            <div class="ecg-meta">DII &nbsp;·&nbsp; 25 mm/s &nbsp;·&nbsp; 10 mm/mV</div>
            <div class="ecg-rhythm-name" id="sim-rhythm-label">
```
Reemplazar la línea del ecg-meta del simulador con:
```html
            <div class="ecg-meta" id="sim-ecg-meta">DII &nbsp;·&nbsp; 25 mm/s &nbsp;·&nbsp; 10 mm/mV</div>
            <div class="ecg-rhythm-name" id="sim-rhythm-label">
```

En `sec-learn` (línea ~474), localizar:
```html
            <div class="ecg-meta">DII &nbsp;·&nbsp; 25 mm/s &nbsp;·&nbsp; 10 mm/mV</div>
```
Reemplazar con:
```html
            <div class="ecg-meta" id="learn-ecg-meta">DII &nbsp;·&nbsp; 25 mm/s &nbsp;·&nbsp; 10 mm/mV</div>
```

- [ ] **Step 3: Insertar botones en el HUD del Simulador**

En `sec-sim`, localizar:
```html
          <div class="ecg-bpm-display" id="sim-hr-badge">72<sub>lpm</sub></div>
```
Reemplazar con:
```html
          <div class="hud-controls">
            <button class="hud-btn" id="simPauseBtn" onclick="toggleSimPause()">⏸ Pausar</button>
            <button class="hud-btn" id="simZoomBtn" onclick="cycleSimZoom()">1×</button>
          </div>
          <div class="ecg-bpm-display" id="sim-hr-badge">72<sub>lpm</sub></div>
```

- [ ] **Step 4: Insertar botones en el HUD del Aprendizaje**

En `sec-learn`, localizar:
```html
          <div class="ecg-meta" style="font-size:.65rem">Modo estudio</div>
```
Reemplazar con:
```html
          <div class="hud-controls">
            <button class="hud-btn" id="learnPauseBtn" onclick="toggleLearnPause()">⏸</button>
            <button class="hud-btn" id="learnZoomBtn" onclick="cycleLearnZoom()">1×</button>
          </div>
          <div class="ecg-meta" style="font-size:.65rem">Modo estudio</div>
```

- [ ] **Step 5: Verificar HTML**

```python
with open("D:/modfisioresp/modules/ecg.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("css hud-btn presente", ".hud-btn{" in html),
    ("css hud-controls presente", ".hud-controls{" in html),
    ("id sim-ecg-meta", 'id="sim-ecg-meta"' in html),
    ("id learn-ecg-meta", 'id="learn-ecg-meta"' in html),
    ("simPauseBtn presente", 'id="simPauseBtn"' in html),
    ("simZoomBtn presente", 'id="simZoomBtn"' in html),
    ("learnPauseBtn presente", 'id="learnPauseBtn"' in html),
    ("learnZoomBtn presente", 'id="learnZoomBtn"' in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 6: Commit**

```bash
git -C D:/modfisioresp add modules/ecg.html
git -C D:/modfisioresp commit -m "feat: agregar CSS hud-btn y botones pause/zoom en HUD del ECG"
```

---

### Task 2: Actualizar ECGRenderer — propiedad `pps` y método `setZoom()`

**Files:**
- Modify: `modules/ecg.html` (clase ECGRenderer, líneas ~941–1062)

- [ ] **Step 1: Agregar `this.pps = PPS` al constructor**

Localizar en el constructor (línea ~947):
```javascript
    this.bufLen = Math.round(this.canvas.width / PPS) + 10;
```
Reemplazar con:
```javascript
    this.pps = PPS;
    this.bufLen = Math.round(this.canvas.width / this.pps) + 10;
```

- [ ] **Step 2: Agregar método `setZoom()` después de `resize()`**

Localizar (línea ~960):
```javascript
  resize() {
    this.canvas.width = this.canvas.offsetWidth || 760;
    this.canvas.height = this.h;
    this.baseline = this.h * 0.55;
  }
```
Reemplazar con:
```javascript
  resize() {
    this.canvas.width = this.canvas.offsetWidth || 760;
    this.canvas.height = this.h;
    this.baseline = this.h * 0.55;
  }
  setZoom(multiplier) {
    this.pps = PPS * multiplier;
    this.bufLen = Math.round((this.canvas.width || 760) / this.pps) + 10;
    this.buf = new Float32Array(this.bufLen).fill(0);
    this.writePos = 0;
    this.readPos = 0;
  }
```

- [ ] **Step 3: Actualizar `draw()` — reemplazar las 2 referencias a `PPS` por `this.pps`**

Localizar en `draw()` (línea ~1034):
```javascript
    const samplesOnScreen = Math.ceil(W / PPS);
```
Reemplazar con:
```javascript
    const samplesOnScreen = Math.ceil(W / this.pps);
```

Localizar (línea ~1050):
```javascript
      const sIdx = Math.floor((total - 1) - (W - 1 - px) / PPS);
```
Reemplazar con:
```javascript
      const sIdx = Math.floor((total - 1) - (W - 1 - px) / this.pps);
```

- [ ] **Step 4: Actualizar la referencia a `PPS` en el resize handler de window**

Localizar (línea ~1379):
```javascript
    if (r) { r.resize(); r.bufLen = Math.round(r.canvas.width / PPS) + 10; r.buf = new Float32Array(r.bufLen).fill(0); }
```
Reemplazar con:
```javascript
    if (r) { r.resize(); r.bufLen = Math.round(r.canvas.width / r.pps) + 10; r.buf = new Float32Array(r.bufLen).fill(0); }
```

- [ ] **Step 5: Verificar que no quedan referencias a PPS en draw() ni en resize handler**

```python
with open("D:/modfisioresp/modules/ecg.html", encoding="utf-8") as f:
    lines = f.readlines()

# Encontrar referencias a PPS fuera de la declaración const PPS y dentro de ECGRenderer
renderer_start = next(i for i,l in enumerate(lines) if 'class ECGRenderer' in l)
renderer_end = next(i for i,l in enumerate(lines) if i > renderer_start and l.strip() == '}')
renderer_lines = [(i+1, l.strip()) for i,l in enumerate(lines[renderer_start:renderer_end], renderer_start) if 'PPS' in l and 'this.pps' not in l]
print("Referencias a PPS global dentro de ECGRenderer (deben ser 0):", len(renderer_lines))
for ln, content in renderer_lines:
    print(f"  L{ln}: {content}")

# Verificar setZoom existe
has_zoom = any('setZoom' in l for l in lines)
print("setZoom presente:", "OK" if has_zoom else "ERROR")
# Verificar this.pps en constructor
has_pps = any('this.pps = PPS' in l for l in lines)
print("this.pps = PPS en constructor:", "OK" if has_pps else "ERROR")
```
Esperado: 0 referencias PPS global en ECGRenderer, setZoom OK, this.pps OK.

- [ ] **Step 6: Commit**

```bash
git -C D:/modfisioresp add modules/ecg.html
git -C D:/modfisioresp commit -m "refactor: hacer PPS propiedad de instancia en ECGRenderer — base para zoom"
```

---

### Task 3: Agregar funciones JS de Pause y Zoom

**Files:**
- Modify: `modules/ecg.html` (bloque JS después de `initRenderers`, línea ~1069)

- [ ] **Step 1: Insertar las 4 funciones + constantes de zoom**

Localizar (línea ~1069):
```javascript
function initRenderers() {
```
Insertar ANTES de esa línea:

```javascript
/* ══════════════════════════════════════════════════════
   PAUSE + ZOOM CONTROLS
═══════════════════════════════════════════════════════ */
const ZOOM_LEVELS = [1, 2, 4];
const ZOOM_SPEEDS = ['25 mm/s', '12.5 mm/s', '6.25 mm/s'];

let simPaused = false;
let simZoomIdx = 0;

function toggleSimPause() {
  simPaused = !simPaused;
  const btn = document.getElementById('simPauseBtn');
  if (simPaused) {
    simRenderer.stop();
    btn.textContent = '▶ Reanudar';
    btn.classList.add('active');
  } else {
    const r = RHYTHMS.find(r => r.id === simRhythmId) || RHYTHMS[0];
    engine.reset(r.id, simHR);
    simRenderer.start(engine);
    btn.textContent = '⏸ Pausar';
    btn.classList.remove('active');
  }
}

function cycleSimZoom() {
  simZoomIdx = (simZoomIdx + 1) % ZOOM_LEVELS.length;
  const n = ZOOM_LEVELS[simZoomIdx];
  simRenderer.setZoom(n);
  document.getElementById('simZoomBtn').textContent = n + '×';
  document.getElementById('sim-ecg-meta').textContent =
    'DII  ·  ' + ZOOM_SPEEDS[simZoomIdx] + '  ·  10 mm/mV';
}

let learnPaused = false;
let learnZoomIdx = 0;

function toggleLearnPause() {
  learnPaused = !learnPaused;
  const btn = document.getElementById('learnPauseBtn');
  if (learnPaused) {
    learnRenderer.stop();
    btn.textContent = '▶';
    btn.classList.add('active');
  } else {
    const r = RHYTHMS.find(r => r.id === learnRhythmId) || RHYTHMS[0];
    engine.reset(r.id, r.hrDefault);
    learnRenderer.start(engine);
    btn.textContent = '⏸';
    btn.classList.remove('active');
  }
}

function cycleLearnZoom() {
  learnZoomIdx = (learnZoomIdx + 1) % ZOOM_LEVELS.length;
  const n = ZOOM_LEVELS[learnZoomIdx];
  learnRenderer.setZoom(n);
  document.getElementById('learnZoomBtn').textContent = n + '×';
  document.getElementById('learn-ecg-meta').textContent =
    'DII  ·  ' + ZOOM_SPEEDS[learnZoomIdx] + '  ·  10 mm/mV';
}

```

- [ ] **Step 2: Verificar funciones presentes**

```python
with open("D:/modfisioresp/modules/ecg.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("ZOOM_LEVELS", "const ZOOM_LEVELS" in html),
    ("ZOOM_SPEEDS", "const ZOOM_SPEEDS" in html),
    ("toggleSimPause", "function toggleSimPause" in html),
    ("cycleSimZoom", "function cycleSimZoom" in html),
    ("toggleLearnPause", "function toggleLearnPause" in html),
    ("cycleLearnZoom", "function cycleLearnZoom" in html),
    ("simPaused", "let simPaused" in html),
    ("learnPaused", "let learnPaused" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Commit**

```bash
git -C D:/modfisioresp add modules/ecg.html
git -C D:/modfisioresp commit -m "feat: agregar funciones toggleSimPause, cycleSimZoom, toggleLearnPause, cycleLearnZoom"
```

---

### Task 4: Actualizar `setMode()` — reset de pause y zoom al cambiar tab

**Files:**
- Modify: `modules/ecg.html` (función `setMode`, línea ~1078 después de los 3 tasks anteriores)

- [ ] **Step 1: Agregar reset de simPause/simZoom al activar 'sim'**

Localizar en `setMode()`:
```javascript
  if (m === 'sim') {
    const r = RHYTHMS.find(r => r.id === simRhythmId) || RHYTHMS[0];
    engine.reset(r.id, simHR);
    simRenderer.start(engine);
```
Reemplazar con:
```javascript
  if (m === 'sim') {
    simPaused = false;
    simZoomIdx = 0;
    simRenderer.setZoom(1);
    const pb = document.getElementById('simPauseBtn');
    if (pb) { pb.textContent = '⏸ Pausar'; pb.classList.remove('active'); }
    const zb = document.getElementById('simZoomBtn');
    if (zb) zb.textContent = '1×';
    const mb = document.getElementById('sim-ecg-meta');
    if (mb) mb.textContent = 'DII  ·  25 mm/s  ·  10 mm/mV';
    const r = RHYTHMS.find(r => r.id === simRhythmId) || RHYTHMS[0];
    engine.reset(r.id, simHR);
    simRenderer.start(engine);
```

- [ ] **Step 2: Agregar reset de learnPause/learnZoom al activar 'learn'**

Localizar:
```javascript
  } else if (m === 'learn') {
    const r = RHYTHMS.find(r => r.id === learnRhythmId) || RHYTHMS[0];
    engine.reset(r.id, r.hrDefault);
    learnRenderer.start(engine);
    renderLearnInfo(r);
```
Reemplazar con:
```javascript
  } else if (m === 'learn') {
    learnPaused = false;
    learnZoomIdx = 0;
    learnRenderer.setZoom(1);
    const pb = document.getElementById('learnPauseBtn');
    if (pb) { pb.textContent = '⏸'; pb.classList.remove('active'); }
    const zb = document.getElementById('learnZoomBtn');
    if (zb) zb.textContent = '1×';
    const mb = document.getElementById('learn-ecg-meta');
    if (mb) mb.textContent = 'DII  ·  25 mm/s  ·  10 mm/mV';
    const r = RHYTHMS.find(r => r.id === learnRhythmId) || RHYTHMS[0];
    engine.reset(r.id, r.hrDefault);
    learnRenderer.start(engine);
    renderLearnInfo(r);
```

- [ ] **Step 3: Verificación final completa**

```python
with open("D:/modfisioresp/modules/ecg.html", encoding="utf-8") as f:
    html = f.read()

checks = [
    # CSS
    (".hud-btn CSS", ".hud-btn{" in html),
    (".hud-controls CSS", ".hud-controls{" in html),
    # HTML
    ("simPauseBtn", 'id="simPauseBtn"' in html),
    ("simZoomBtn", 'id="simZoomBtn"' in html),
    ("learnPauseBtn", 'id="learnPauseBtn"' in html),
    ("learnZoomBtn", 'id="learnZoomBtn"' in html),
    ("sim-ecg-meta id", 'id="sim-ecg-meta"' in html),
    ("learn-ecg-meta id", 'id="learn-ecg-meta"' in html),
    # ECGRenderer
    ("this.pps en constructor", "this.pps = PPS" in html),
    ("setZoom method", "setZoom(multiplier)" in html),
    ("draw usa this.pps (samplesOnScreen)", "Math.ceil(W / this.pps)" in html),
    ("draw usa this.pps (sIdx)", "/ this.pps)" in html),
    # Funciones JS
    ("toggleSimPause", "function toggleSimPause" in html),
    ("cycleSimZoom", "function cycleSimZoom" in html),
    ("toggleLearnPause", "function toggleLearnPause" in html),
    ("cycleLearnZoom", "function cycleLearnZoom" in html),
    # setMode reset
    ("simZoomIdx=0 en setMode", "simZoomIdx = 0" in html),
    ("learnZoomIdx=0 en setMode", "learnZoomIdx = 0" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK (18/18).

- [ ] **Step 4: Commit final y push**

```bash
git -C D:/modfisioresp add modules/ecg.html
git -C D:/modfisioresp commit -m "feat: agregar pause y zoom al simulador ECG — enseñanza interactiva"
git -C D:/modfisioresp push origin master
```
