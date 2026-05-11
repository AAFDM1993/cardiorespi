# Diseño: C7 — Separar ecg.html en 3 módulos independientes

**Fecha:** 2026-05-11
**Estado:** Aprobado

---

## Objetivo

Dividir `modules/ecg.html` (1815 líneas, 6 tabs) en 3 archivos HTML autocontenidos y actualizar `modules/clase-7.html` para mostrar 3 tarjetas de módulo.

---

## Resultado final

### `modules/clase-7.html` — 3 tarjetas
| Tarjeta | Archivo | Color | Contenido |
|---------|---------|-------|-----------|
| ECG — Simulador | `ecg.html` | `#4a9eff` | Simulador + Aprendizaje + Evaluación ECG |
| Ciclo Cardíaco | `ciclo-cardiaco.html` | `#4a9eff` | Ciclo Cardíaco + Fisiología CV |
| Evaluación CV | `evaluacion-cv.html` | `#f472b6` | Evaluación Cardiovascular |

---

## Estructura actual de ecg.html

| Sección | Líneas | Contenido | Destino |
|---------|--------|-----------|---------|
| CSS + boilerplate | 1–405 | Estilos, nav, head | Distribuir a los 3 archivos |
| `sec-sim` | 406–486 | Simulador ECG canvas | `ecg.html` |
| `sec-learn` | 487–534 | Aprendizaje ECG | `ecg.html` |
| `sec-eval` | 535–583 | Evaluación ECG | `ecg.html` |
| `sec-cardio` | 584–843 | Ciclo Cardíaco (Wiggers, S1-S4) | `ciclo-cardiaco.html` |
| `sec-fisio-cv` | 844–903 | Fisiología CV | `ciclo-cardiaco.html` |
| `sec-eval-cv` | 904–1508 | Evaluación CV | `evaluacion-cv.html` |
| JavaScript | 1509–1815 | ECG engine, renderers, setMode | `ecg.html` (completo) |

---

## Archivo 1: `modules/ecg.html` (recortado)

**Cambios:**
- Nav: quitar tabs "Ciclo Cardíaco", "Fisiología CV", "Evaluación CV"
- Body: eliminar `<section id="sec-cardio">`, `<section id="sec-fisio-cv">`, `<section id="sec-eval-cv">`
- `setMode()`: actualizar array de modos a `['sim','learn','eval']`
- CSS: eliminar clases específicas de ciclo cardíaco (`.cc-*`, `.wiggers-*`) y eval-cv que ya no se usan
- **No tocar**: ECG engine, RHYTHMS, renderers, canvas CSS

**Nav resultante:**
```html
<button class="nav-tab active" onclick="setMode('sim',this)">Simulador</button>
<button class="nav-tab" onclick="setMode('learn',this)">Aprendizaje</button>
<button class="nav-tab" onclick="setMode('eval',this)">Evaluación</button>
```

---

## Archivo 2: `modules/ciclo-cardiaco.html` (nuevo)

**Estructura:**
```
<!DOCTYPE html> + head (Space Grotesk, fisioresp.css)
<style> (mode-section, nav styles, cc-*, wiggers-* copiados de ecg.html)
<nav> (← Inicio + 2 tabs: "Ciclo Cardíaco" | "Fisiología CV")
<main>
  <section id="sec-cardio" class="mode-section active">  [copiado de ecg.html]
  <section id="sec-fisio-cv" class="mode-section">       [copiado de ecg.html]
</main>
<script>
  function setMode(m, btn) { ['cardio','fisio-cv'].forEach(...) }
</script>
```

**Título de página:** `Ciclo Cardíaco — Fisioterapia Cardiorrespiratoria`

---

## Archivo 3: `modules/evaluacion-cv.html` (nuevo)

**Estructura:**
```
<!DOCTYPE html> + head (Space Grotesk, fisioresp.css)
<style> (mode-section, nav styles, eval-cv-* copiados de ecg.html)
<nav> (← Inicio, sin tabs — vista única)
<main>
  <section id="sec-eval-cv" class="mode-section active">  [copiado de ecg.html]
</main>
<script> (funciones JS propias de eval-cv si las hay)
```

**Título de página:** `Evaluación CV — Fisioterapia Cardiorrespiratoria`

---

## Archivo 4: `modules/clase-7.html` (actualizado)

Reemplazar la única tarjeta actual por 3 tarjetas:

```html
<!-- Tarjeta 1: ECG -->
<a onclick="openMod('modules/ecg.html','ECG — Simulador')">
  ECG — Simulador, Aprendizaje y Evaluación
  Tags: Simulador · 16 Ritmos · Arritmias · Evaluación

<!-- Tarjeta 2: Ciclo Cardíaco -->
<a onclick="openMod('modules/ciclo-cardiaco.html','Ciclo Cardíaco + Fisiología CV')">
  Ciclo Cardíaco y Fisiología Cardiovascular
  Tags: Wiggers · Frank-Starling · GC · Ruidos S1-S4

<!-- Tarjeta 3: Evaluación CV -->
<a onclick="openMod('modules/evaluacion-cv.html','Evaluación CV')">
  Evaluación Cardiovascular
  Tags: Monitorización · Seguridad · ECG · Fisioterapia
```

---

## CSS a distribuir

Las clases CSS en `ecg.html` se distribuyen así:

| Clase | Origen (líneas aprox.) | Destino |
|-------|----------------------|---------|
| `.mode-section` | ~10 | los 3 archivos |
| `.ecg-wrap`, `.monitor-*`, `.r-btn`, `.sim-*` | ~15–150 | solo `ecg.html` |
| `.nav`, `.nav-tab`, `.container` | ~150–200 | los 3 archivos (ya en fisioresp.css o copiar) |
| `.cc-*`, `.wiggers-*`, `.cc-phase-*` | ~300–384 | solo `ciclo-cardiaco.html` |
| `.eval-progress`, `.eval-q-*`, `.eval-choice`, `.eval-fb` | ~243–301 | solo `ecg.html` (eval ECG) |

---

## Commits esperados

```
git add modules/ecg.html
git commit -m "refactor: recortar ecg.html a 3 tabs ECG — eliminar ciclo cardiaco y eval-cv"

git add modules/ciclo-cardiaco.html
git commit -m "feat: crear modulo ciclo-cardiaco.html — Wiggers, S1-S4, Fisiologia CV"

git add modules/evaluacion-cv.html
git commit -m "feat: crear modulo evaluacion-cv.html — evaluacion cardiovascular fisioterapia"

git add modules/clase-7.html
git commit -m "feat: actualizar hub C7 con 3 tarjetas — ECG, Ciclo Cardiaco, Evaluacion CV"

git push origin master
```
