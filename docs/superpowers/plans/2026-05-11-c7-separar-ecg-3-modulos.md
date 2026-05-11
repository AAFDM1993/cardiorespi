# C7 Separar ecg.html en 3 módulos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dividir `modules/ecg.html` (6 tabs, 1815 líneas) en 3 archivos HTML autocontenidos y actualizar `modules/clase-7.html` con 3 tarjetas de módulo.

**Architecture:** Extracción de secciones HTML completas a nuevos archivos. Cada archivo es autocontenido: carga `../assets/css/fisioresp.css` + CSS propio en `<style>`. No hay JS compartido entre archivos. El ECG engine completo queda en `ecg.html`. Los nuevos archivos solo tienen HTML estático + `setMode()` simple si tienen tabs.

**Tech Stack:** HTML/CSS vanilla. Sin npm. Sin transpilación. Verificación con Python (node no disponible en Windows). Preview con `python3 -m http.server 8000`.

---

## File Map

| Archivo | Acción | Líneas aprox. |
|---------|--------|---------------|
| `modules/ecg.html` | Modificar — quitar 3 secciones + 3 nav tabs | 1815 → ~1200 |
| `modules/ciclo-cardiaco.html` | Crear — Ciclo Cardíaco + Fisiología CV | ~380 |
| `modules/evaluacion-cv.html` | Crear — Evaluación CV | ~120 |
| `modules/clase-7.html` | Modificar — 1 card → 3 cards | ~65 → ~120 |

---

### Task 1: Crear `modules/ciclo-cardiaco.html`

**Files:**
- Create: `modules/ciclo-cardiaco.html`

- [ ] **Step 1: Crear el archivo con boilerplate + CSS**

Crear `modules/ciclo-cardiaco.html` con el siguiente contenido exacto hasta la etiqueta `</style>`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ciclo Cardíaco — Fisioterapia Cardiorrespiratoria</title>
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.mode-section{display:none}
.mode-section.active{display:block}
.cc-group-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin:1.75rem 0 .85rem;display:flex;align-items:center;gap:.5rem}
.cc-group-label::after{content:'';flex:1;height:1px;background:var(--border)}
.cc-phase-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.85rem}
.cc-phase{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:.85rem 1rem;border-left:3px solid var(--pc,var(--blue))}
.cc-phase-num{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--pc,var(--blue));margin-bottom:.25rem;font-family:var(--fh)}
.cc-phase-name{font-family:var(--fh);font-size:.88rem;color:var(--text1);margin-bottom:.4rem}
.cc-phase-body{font-size:11.5px;color:var(--text2);line-height:1.55}
.cc-two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start}
@media(max-width:680px){.cc-two-col{grid-template-columns:1fr}}
.cc-sound{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:.8rem 1rem;margin-bottom:.6rem;border-left:3px solid var(--sc,var(--blue))}
.cc-sound-hdr{display:flex;align-items:center;gap:.6rem;margin-bottom:.3rem}
.cc-sound-name{font-family:var(--fh);font-size:.92rem;color:var(--sc,var(--blue))}
.cc-sound-tag{font-size:10px;padding:2px 8px;border-radius:100px;border:1px solid var(--sc,var(--blue));color:var(--sc,var(--blue));opacity:.75;font-weight:600}
.cc-sound-body{font-size:11.5px;color:var(--text2);line-height:1.55}
.cc-sound-body b{color:var(--text1)}
</style>
</head>
<body>

<nav class="nav">
  <a href="../index.html" onclick="if(window.parent!==window){window.parent.closeModule();return false;}" class="nav-back">← Inicio</a>
  <span class="nav-title">Ciclo Cardíaco + Fisiología CV</span>
  <div class="nav-tabs">
    <button class="nav-tab active" onclick="setMode('cardio',this)">Ciclo Cardíaco</button>
    <button class="nav-tab" onclick="setMode('fisio-cv',this)">Fisiología CV</button>
  </div>
</nav>

<main class="container" style="padding-top:1.25rem">
```

- [ ] **Step 2: Pegar `sec-cardio` (extraído de ecg.html líneas 584–839)**

Continuar el archivo copiando exactamente desde `<section id="sec-cardio"` hasta `</section>` (fin de la sección ciclo cardíaco, cierra antes del comentario `FISIOLOGÍA CV`):

```html
<!-- ══════════════════════════════════════════════════════
     CICLO CARDÍACO
═══════════════════════════════════════════════════════ -->
<section id="sec-cardio" class="mode-section active">
[... contenido completo de sec-cardio de ecg.html líneas 584-839 ...]
</section>
```

El contenido exacto son las líneas 584–839 de `modules/ecg.html`. Usar Read para leerlas y copiarlas sin modificación.

- [ ] **Step 3: Pegar `sec-fisio-cv` (extraído de ecg.html líneas 844–899)**

Continuar el archivo:

```html
<!-- ══════════════════════════════════════════════════════
     FISIOLOGÍA CV
═══════════════════════════════════════════════════════ -->
<section id="sec-fisio-cv" class="mode-section">
[... contenido completo de sec-fisio-cv de ecg.html líneas 844-899 ...]
</section>
```

El contenido exacto son las líneas 844–899 de `modules/ecg.html`.

- [ ] **Step 4: Cerrar el archivo con `</main>` + `<script>`**

```html

</main>

<script src="../assets/js/ui.js"></script>
<script>
function setMode(m, btn) {
  ['cardio','fisio-cv'].forEach(id => {
    document.getElementById('sec-'+id).classList.toggle('active', id===m);
  });
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
</script>
</body>
</html>
```

- [ ] **Step 5: Verificar que el archivo fue creado con las secciones correctas**

```python
with open("modules/ciclo-cardiaco.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("titulo correcto", "Ciclo Card" in html and "Fisioterapia Cardiorrespiratoria" in html),
    ("sec-cardio presente", 'id="sec-cardio"' in html),
    ("sec-fisio-cv presente", 'id="sec-fisio-cv"' in html),
    ("sec-cardio activa", 'id="sec-cardio" class="mode-section active"' in html),
    ("css cc-phase presente", '.cc-phase{' in html),
    ("setMode presente", 'function setMode' in html),
    ("sin sec-sim", 'id="sec-sim"' not in html),
    ("sin ECG engine", 'const RHYTHMS' not in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 6: Commit**

```bash
git add modules/ciclo-cardiaco.html
git commit -m "feat: crear modulo ciclo-cardiaco.html — Wiggers, S1-S4, Fisiologia CV"
```

---

### Task 2: Crear `modules/evaluacion-cv.html`

**Files:**
- Create: `modules/evaluacion-cv.html`

- [ ] **Step 1: Crear el archivo completo**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación CV — Fisioterapia Cardiorrespiratoria</title>
<link rel="stylesheet" href="../assets/css/fisioresp.css">
</head>
<body>

<nav class="nav">
  <a href="../index.html" onclick="if(window.parent!==window){window.parent.closeModule();return false;}" class="nav-back">← Inicio</a>
  <span class="nav-title">Evaluación Cardiovascular</span>
</nav>

<main class="container" style="padding-top:1.25rem">

<!-- ══════════════════════════════════════════════════════
     EVALUACIÓN CV
═══════════════════════════════════════════════════════ -->
[... contenido completo de sec-eval-cv de ecg.html líneas 904-989 ...]

</main>

<script src="../assets/js/ui.js"></script>
</body>
</html>
```

**Nota importante:** El contenido de sec-eval-cv (líneas 904–989 de ecg.html) se copia sin el `<section id="sec-eval-cv" class="mode-section">` ni su `</section>` — el div `<main>` ya sirve como contenedor. Todo el contenido interior va directamente dentro de `<main>`.

- [ ] **Step 2: Verificar**

```python
with open("modules/evaluacion-cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("titulo correcto", "Evaluación CV" in html or "Evaluacion CV" in html),
    ("signos vitales presentes", "Signos Vitales Cardiovasculares" in html),
    ("criterios suspension presentes", "Criterios de Suspensión" in html),
    ("patrones ECG alarma presentes", "Patrones ECG de Alarma" in html),
    ("sin ECG engine", "const RHYTHMS" not in html),
    ("sin mode-section", 'class="mode-section"' not in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Commit**

```bash
git add modules/evaluacion-cv.html
git commit -m "feat: crear modulo evaluacion-cv.html — evaluacion cardiovascular fisioterapia"
```

---

### Task 3: Recortar `modules/ecg.html`

**Files:**
- Modify: `modules/ecg.html`

- [ ] **Step 1: Quitar los 3 tabs del nav**

Localizar en el `<nav>`:
```html
    <button class="nav-tab" onclick="setMode('cardio',this)">Ciclo Cardíaco</button>
    <button class="nav-tab" onclick="setMode('fisio-cv',this)">Fisiología CV</button>
    <button class="nav-tab" onclick="setMode('eval-cv',this)">Evaluación CV</button>
```
Eliminar esas 3 líneas. El nav queda:
```html
  <div class="nav-tabs">
    <button class="nav-tab active" onclick="setMode('sim',this)">Simulador</button>
    <button class="nav-tab" onclick="setMode('learn',this)">Aprendizaje</button>
    <button class="nav-tab" onclick="setMode('eval',this)">Evaluación</button>
  </div>
```

- [ ] **Step 2: Eliminar las 3 secciones del body**

Eliminar desde el comentario `<!-- CICLO CARDÍACO -->` hasta el cierre de `</section>` de `sec-eval-cv` y `</main>`:

Específicamente, eliminar las líneas 840–991 de ecg.html (los comentarios + sec-cardio + sec-fisio-cv + sec-eval-cv + `</main>`).

Reemplazar con solo:
```html

</main>
```

Asegurarse de que `</main>` cierra correctamente después de `sec-eval` (la última sección ECG).

- [ ] **Step 3: Actualizar `setMode()` para solo 3 modos**

Localizar:
```javascript
function setMode(m, btn) {
  ['sim','learn','eval','cardio','fisio-cv','eval-cv'].forEach(id => {
```
Reemplazar con:
```javascript
function setMode(m, btn) {
  ['sim','learn','eval'].forEach(id => {
```

- [ ] **Step 4: Eliminar CSS de ciclo cardíaco (`.cc-*`)**

Localizar y eliminar el bloque CSS de ciclo cardíaco completo:
```css
/* ════════════════════════════════
   CICLO CARDÍACO
════════════════════════════════ */
.cc-group-label{...}
.cc-phase-grid{...}
.cc-phase{...}
.cc-phase-num{...}
.cc-phase-name{...}
.cc-phase-body{...}
.cc-two-col{...}
@media(max-width:680px){.cc-two-col{...}}
.cc-sound{...}
.cc-sound-hdr{...}
.cc-sound-name{...}
.cc-sound-tag{...}
.cc-sound-body{...}
.cc-sound-body b{...}
```
Estas son las líneas 366–383 del ecg.html original.

- [ ] **Step 5: Verificar estructura del ecg.html recortado**

```python
with open("modules/ecg.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("sec-sim presente", 'id="sec-sim"' in html),
    ("sec-learn presente", 'id="sec-learn"' in html),
    ("sec-eval presente", 'id="sec-eval"' in html),
    ("sec-cardio eliminada", 'id="sec-cardio"' not in html),
    ("sec-fisio-cv eliminada", 'id="sec-fisio-cv"' not in html),
    ("sec-eval-cv eliminada", 'id="sec-eval-cv"' not in html),
    ("ECG engine presente", "const RHYTHMS" in html),
    ("setMode actualizado", "['sim','learn','eval']" in html),
    ("tab cardio eliminado", "setMode('cardio'" not in html),
    ("css cc eliminado", ".cc-phase{" not in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 6: Commit**

```bash
git add modules/ecg.html
git commit -m "refactor: recortar ecg.html a 3 tabs ECG — eliminar ciclo cardiaco y eval-cv"
```

---

### Task 4: Actualizar `modules/clase-7.html`

**Files:**
- Modify: `modules/clase-7.html`

- [ ] **Step 1: Reemplazar la tarjeta única por 3 tarjetas**

Localizar el bloque único actual:
```html
      <a class="mod-card" href="#" onclick="openMod('modules/ecg.html','ECG + Ciclo Cardíaco');return false;"
         style="--card-color:rgba(74,158,255,.4);--card-accent:rgba(74,158,255,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(74,158,255,.12);color:#4a9eff;font-size:.8rem;font-weight:700">EC</div>
          <div class="mod-phase" style="color:#4a9eff;border-color:rgba(74,158,255,.3);background:rgba(74,158,255,.08)">C7</div>
        </div>
        <div class="mod-title">ECG + Ciclo Cardíaco</div>
        <div class="mod-desc">Simulador ECG dinámico con 16 ritmos y diagrama de Wiggers con 5 fases, ruidos S1–S4 y focos de auscultación.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Wiggers · Frank-Starling · GC · Arritmias</span>
          </div>
          <div class="mod-open" style="color:#4a9eff">Abrir →</div>
        </div>
      </a>
```

Reemplazar con las 3 tarjetas:

```html
      <a class="mod-card" href="#" onclick="openMod('modules/ecg.html','ECG — Simulador');return false;"
         style="--card-color:rgba(74,158,255,.4);--card-accent:rgba(74,158,255,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(74,158,255,.12);color:#4a9eff;font-size:.8rem;font-weight:700">ECG</div>
          <div class="mod-phase" style="color:#4a9eff;border-color:rgba(74,158,255,.3);background:rgba(74,158,255,.08)">C7</div>
        </div>
        <div class="mod-title">ECG — Simulador</div>
        <div class="mod-desc">Simulador en tiempo real con 16 ritmos cardíacos. Modos Aprendizaje y Evaluación con retroalimentación.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">16 ritmos · Arritmias · Simulador · Evaluación</span>
          </div>
          <div class="mod-open" style="color:#4a9eff">Abrir →</div>
        </div>
      </a>

      <a class="mod-card" href="#" onclick="openMod('modules/ciclo-cardiaco.html','Ciclo Cardíaco + Fisiología CV');return false;"
         style="--card-color:rgba(74,158,255,.4);--card-accent:rgba(74,158,255,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(74,158,255,.12);color:#4a9eff;font-size:.8rem;font-weight:700">CC</div>
          <div class="mod-phase" style="color:#4a9eff;border-color:rgba(74,158,255,.3);background:rgba(74,158,255,.08)">C7</div>
        </div>
        <div class="mod-title">Ciclo Cardíaco + Fisiología CV</div>
        <div class="mod-desc">Diagrama de Wiggers, 5 fases, ruidos S1–S4, focos de auscultación y fisiología cardiovascular aplicada.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Wiggers · Frank-Starling · GC · Ruidos</span>
          </div>
          <div class="mod-open" style="color:#4a9eff">Abrir →</div>
        </div>
      </a>

      <a class="mod-card" href="#" onclick="openMod('modules/evaluacion-cv.html','Evaluación Cardiovascular');return false;"
         style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.8rem;font-weight:700">CV</div>
          <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">C7</div>
        </div>
        <div class="mod-title">Evaluación Cardiovascular</div>
        <div class="mod-desc">Signos vitales CV, criterios de suspensión del ejercicio, NYHA y patrones ECG de alarma para fisioterapeutas.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Monitorización · Seguridad · ECG · NYHA</span>
          </div>
          <div class="mod-open" style="color:#f472b6">Abrir →</div>
        </div>
      </a>
```

- [ ] **Step 2: Actualizar los objetivos de aprendizaje**

Localizar el bloque `<ul>` de objetivos actual y reemplazar con 4 objetivos que reflejen los 3 módulos:

```html
    <ul>
      <li>Identificar los 16 ritmos cardíacos más frecuentes mediante el simulador ECG interactivo</li>
      <li>Describir las 5 fases del ciclo cardíaco y los ruidos S1–S4 mediante el diagrama de Wiggers</li>
      <li>Aplicar la ley de Frank-Starling y los principios del gasto cardíaco en la práctica clínica</li>
      <li>Reconocer patrones ECG de alarma y criterios de suspensión del ejercicio en fisioterapia cardiovascular</li>
    </ul>
```

- [ ] **Step 3: Verificar clase-7.html**

```python
with open("modules/clase-7.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("card ECG presente", "modules/ecg.html" in html),
    ("card ciclo cardiaco presente", "modules/ciclo-cardiaco.html" in html),
    ("card evaluacion-cv presente", "modules/evaluacion-cv.html" in html),
    ("3 mod-card", html.count('class="mod-card"') == 3),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 4: Commit y push final**

```bash
git add modules/clase-7.html
git commit -m "feat: actualizar hub C7 con 3 tarjetas — ECG, Ciclo Cardiaco, Evaluacion CV"
git push origin master
```
