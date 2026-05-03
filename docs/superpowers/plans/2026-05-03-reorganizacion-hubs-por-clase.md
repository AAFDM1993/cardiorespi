# Reorganización FisioResp — Hubs por Clase

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el índice de módulos sueltos con 12 tarjetas de clase (C1–C12) y crear 11 hub pages (`modules/clase-2.html` a `modules/clase-12.html`) que agrupan módulos con objetivos de aprendizaje.

**Architecture:** `index.html` muestra una card por clase; cada card abre el hub correspondiente en el iframe viewer existente; el hub lista sus módulos y llama a `window.parent.openModule()` para abrirlos en el mismo iframe. Sin cambios a módulos existentes, `fisioresp.css` ni `ui.js`.

**Tech Stack:** HTML/CSS vanilla, `fisioresp.css` (variables CSS existentes), sin build system, sin emojis.

---

## Archivos

| Acción | Archivo |
|--------|---------|
| Modificar | `index.html` |
| Crear | `modules/clase-2.html` … `modules/clase-12.html` (11 archivos) |
| Sin cambios | `modules/*.html` existentes, `assets/`, `data/` |

---

## Task 1: Actualizar index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Actualizar hero stats**

Localizar en `index.html` (aprox. líneas 149–154):
```html
<div class="hero-stats">
  <div class="stat"><div class="stat-num">9</div><div class="stat-lbl">Módulos</div></div>
  <div class="stat"><div class="stat-num">9+</div><div class="stat-lbl">Casos clínicos</div></div>
  <div class="stat"><div class="stat-num">3</div><div class="stat-lbl">Modos de uso</div></div>
  <div class="stat"><div class="stat-num">100%</div><div class="stat-lbl">Sin internet</div></div>
</div>
```

Reemplazar con:
```html
<div class="hero-stats">
  <div class="stat"><div class="stat-num">12</div><div class="stat-lbl">Clases</div></div>
  <div class="stat"><div class="stat-num">11</div><div class="stat-lbl">Módulos</div></div>
  <div class="stat"><div class="stat-num">3</div><div class="stat-lbl">Modos de uso</div></div>
  <div class="stat"><div class="stat-num">100%</div><div class="stat-lbl">Sin internet</div></div>
</div>
```

- [ ] **Step 2: Reemplazar sección Respiratorio**

Eliminar todo entre `<!-- ─── RESPIRATORIO ─── -->` y `</div><!-- /section respiratorio -->` (inclusive el cierre) y sustituir con:

```html
<!-- ─── RESPIRATORIO ─── -->
<div class="section">
  <div class="area-title" style="--area-color:rgba(56,189,248,.5);color:var(--blue)">
    Respiratorio — Clases 1 a 6
  </div>
  <div class="modules-grid">

    <div class="mod-card" style="pointer-events:none;opacity:.45">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(56,189,248,.12);color:var(--blue);font-size:.85rem;font-weight:700">C1</div>
        <div class="mod-phase" style="color:var(--blue);border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.08)">Próximamente</div>
      </div>
      <div class="mod-title">Anatomía y Fisiología del Sistema Respiratorio</div>
      <div class="mod-desc">Anatomía del aparato respiratorio, mecánica ventilatoria y fisiología del intercambio gaseoso.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot" style="background:var(--text3)"></div>
          <span style="font-size:11px;color:var(--text3)">En desarrollo</span>
        </div>
      </div>
    </div>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-2.html','Clase 2 — Evaluación del Sistema Respiratorio');return false;"
       style="--card-color:rgba(56,189,248,.4);--card-accent:rgba(56,189,248,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(56,189,248,.12);color:var(--blue);font-size:.85rem;font-weight:700">C2</div>
        <div class="mod-phase" style="color:var(--blue);border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.08)">Respiratorio</div>
      </div>
      <div class="mod-title">Evaluación del Sistema Respiratorio</div>
      <div class="mod-desc">Patrones respiratorios, evaluación clínica ABCDE y casos clínicos integrados.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">2 módulos</span>
        </div>
        <div class="mod-open" style="color:var(--blue)">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-3.html','Clase 3 — Procedimientos y Pruebas de Diagnóstico');return false;"
       style="--card-color:rgba(248,113,113,.4);--card-accent:rgba(248,113,113,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(248,113,113,.12);color:var(--red);font-size:.85rem;font-weight:700">C3</div>
        <div class="mod-phase" style="color:var(--red);border-color:rgba(248,113,113,.3);background:rgba(248,113,113,.08)">Respiratorio</div>
      </div>
      <div class="mod-title">Procedimientos y Pruebas de Diagnóstico</div>
      <div class="mod-desc">Gasometría arterial, interpretación ácido-base y diagrama de Davenport.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">1 módulo</span>
        </div>
        <div class="mod-open" style="color:var(--red)">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-4.html','Clase 4 — Evaluación y Tratamiento Fisioterapéutico');return false;"
       style="--card-color:rgba(167,139,250,.4);--card-accent:rgba(167,139,250,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(167,139,250,.12);color:var(--purple);font-size:.85rem;font-weight:700">C4</div>
        <div class="mod-phase" style="color:var(--purple);border-color:rgba(167,139,250,.3);background:rgba(167,139,250,.08)">Respiratorio</div>
      </div>
      <div class="mod-title">Evaluación y Tratamiento Fisioterapéutico</div>
      <div class="mod-desc">Seguimiento longitudinal en rehabilitación pulmonar y técnicas de aclaramiento bronquial.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">2 módulos</span>
        </div>
        <div class="mod-open" style="color:var(--purple)">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-5.html','Clase 5 — Rehabilitación Pulmonar');return false;"
       style="--card-color:rgba(74,222,128,.4);--card-accent:rgba(74,222,128,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(74,222,128,.12);color:var(--green);font-size:.85rem;font-weight:700">C5</div>
        <div class="mod-phase" style="color:var(--green);border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.08)">Respiratorio</div>
      </div>
      <div class="mod-title">Rehabilitación Pulmonar</div>
      <div class="mod-desc">Test de marcha de 6 minutos y simulador de fisiopatología respiratoria con técnicas de rehabilitación.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">2 módulos</span>
        </div>
        <div class="mod-open" style="color:var(--green)">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-6.html','Clase 6 — Enfermedades Obstructivas y Restrictivas');return false;"
       style="--card-color:rgba(251,191,36,.4);--card-accent:rgba(251,191,36,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(251,191,36,.12);color:var(--amber);font-size:.85rem;font-weight:700">C6</div>
        <div class="mod-phase" style="color:var(--amber);border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.08)">Respiratorio</div>
      </div>
      <div class="mod-title">Enfermedades Obstructivas y Restrictivas</div>
      <div class="mod-desc">Simulador paramétrico, espirometría, índice BODE, GOLD 2024 y predichos GLI 2012.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">2 módulos</span>
        </div>
        <div class="mod-open" style="color:var(--amber)">Abrir →</div>
      </div>
    </a>

  </div>
</div><!-- /section respiratorio -->
```

- [ ] **Step 3: Reemplazar sección Cardiovascular**

Eliminar todo entre `<!-- ─── CARDIOVASCULAR ─── -->` y `</div><!-- /section cardiovascular -->` (inclusive) y sustituir con:

```html
<!-- ─── CARDIOVASCULAR ─── -->
<div class="section">
  <div class="area-title" style="--area-color:rgba(244,114,182,.5);color:#f472b6">
    Cardiovascular — Clases 7 a 12
  </div>
  <div class="modules-grid">

    <a class="mod-card" href="#" onclick="openModule('modules/clase-7.html','Clase 7 — Anatomía y Fisiología Cardíaca');return false;"
       style="--card-color:rgba(74,158,255,.4);--card-accent:rgba(74,158,255,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(74,158,255,.12);color:#4a9eff;font-size:.85rem;font-weight:700">C7</div>
        <div class="mod-phase" style="color:#4a9eff;border-color:rgba(74,158,255,.3);background:rgba(74,158,255,.08)">Cardiovascular</div>
      </div>
      <div class="mod-title">Anatomía y Fisiología Cardíaca</div>
      <div class="mod-desc">Simulador ECG con 16 ritmos, diagrama de Wiggers, ciclo cardíaco y ruidos S1–S4.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">1 módulo</span>
        </div>
        <div class="mod-open" style="color:#4a9eff">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-8.html','Clase 8 — Evaluación Cardiovascular');return false;"
       style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.85rem;font-weight:700">C8</div>
        <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">Cardiovascular</div>
      </div>
      <div class="mod-title">Evaluación Cardiovascular</div>
      <div class="mod-desc">Anamnesis cardiovascular, evaluación ABCDE en IAM e ICC y monitorización hemodinámica.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">1 módulo</span>
        </div>
        <div class="mod-open" style="color:#f472b6">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-9.html','Clase 9 — Rehabilitación Cardíaca');return false;"
       style="--card-color:rgba(74,222,128,.4);--card-accent:rgba(74,222,128,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(74,222,128,.12);color:var(--green);font-size:.85rem;font-weight:700">C9</div>
        <div class="mod-phase" style="color:var(--green);border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.08)">Cardiovascular</div>
      </div>
      <div class="mod-title">Rehabilitación Cardíaca</div>
      <div class="mod-desc">Test de marcha de 6 minutos en pacientes post-IAM e ICC con criterios de parada cardiovasculares.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">1 módulo</span>
        </div>
        <div class="mod-open" style="color:var(--green)">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-10.html','Clase 10 — Enfermedades Cardíacas');return false;"
       style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.75rem;font-weight:700">C10</div>
        <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">Cardiovascular</div>
      </div>
      <div class="mod-title">Enfermedades Cardíacas</div>
      <div class="mod-desc">Aterosclerosis, HTA, fisiopatología de las cardiopatías y razonamiento clínico integrado.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">1 módulo</span>
        </div>
        <div class="mod-open" style="color:#f472b6">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-11.html','Clase 11 — Riesgo Cardiovascular');return false;"
       style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.75rem;font-weight:700">C11</div>
        <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">Cardiovascular</div>
      </div>
      <div class="mod-title">Riesgo Cardiovascular</div>
      <div class="mod-desc">Escala de Framingham 2008, gauge de riesgo a 10 años y factores de riesgo modificables y no modificables.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">1 módulo</span>
        </div>
        <div class="mod-open" style="color:#f472b6">Abrir →</div>
      </div>
    </a>

    <a class="mod-card" href="#" onclick="openModule('modules/clase-12.html','Clase 12 — Prescripción del Ejercicio');return false;"
       style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
      <div class="mod-top">
        <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.75rem;font-weight:700">C12</div>
        <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">Cardiovascular</div>
      </div>
      <div class="mod-title">Prescripción del Ejercicio</div>
      <div class="mod-desc">Modelo FITT, método de Karvonen, escala de Borg y METs para prescripción en cardiopatías.</div>
      <div class="mod-footer">
        <div style="display:flex;align-items:center;gap:.4rem">
          <div class="mod-dot"></div>
          <span style="font-size:11px;color:var(--text3)">1 módulo</span>
        </div>
        <div class="mod-open" style="color:#f472b6">Abrir →</div>
      </div>
    </a>

  </div>
</div><!-- /section cardiovascular -->
```

- [ ] **Step 4: Verificar en navegador**

Abrir `http://localhost:8000/`. Confirmar:
- 12 tarjetas visibles (6 azul/rojo/violeta/verde/ámbar para resp, 6 rosa/azul para cardio)
- C1 aparece opaco y no es clickeable
- C2–C12 abren el iframe viewer (aunque el hub aún no existe, debe verse el error de carga — normal en este paso)

- [ ] **Step 5: Commit**

```
git add index.html
git commit -m "feat: reorganizar index.html con 12 tarjetas de clase (C1-C12)"
```

---

## Task 2: Crear hubs C2 y C3

**Files:**
- Create: `modules/clase-2.html`
- Create: `modules/clase-3.html`

- [ ] **Step 1: Crear `modules/clase-2.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 2 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--blue);margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C2 · Respiratorio</div>
  <div class="ht">Evaluación del Sistema Respiratorio</div>
  <div class="ha">Área Respiratoria — Clase 2 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Identificar y describir los principales patrones respiratorios normales y patológicos</li>
      <li>Aplicar el enfoque ABCDE en la evaluación clínica del paciente respiratorio</li>
      <li>Interpretar los hallazgos de la exploración física respiratoria en casos clínicos</li>
      <li>Relacionar los patrones respiratorios alterados con sus causas fisiopatológicas</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/patrones_resp.html','Patrones Respiratorios');return false;"
         style="--card-color:rgba(56,189,248,.4);--card-accent:rgba(56,189,248,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(56,189,248,.12);color:var(--blue);font-size:.8rem;font-weight:700">PR</div>
          <div class="mod-phase" style="color:var(--blue);border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.08)">C2</div>
        </div>
        <div class="mod-title">Patrones Respiratorios</div>
        <div class="mod-desc">11 patrones con waveforms animadas en tiempo real. Contexto clínico y fisiopatología de cada uno.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Regulares · Irregulares · Centrales</span>
          </div>
          <div class="mod-open" style="color:var(--blue)">Abrir →</div>
        </div>
      </a>

      <a class="mod-card" href="#" onclick="openMod('modules/casos_resp.html','Casos Clínicos Respiratorios');return false;"
         style="--card-color:rgba(56,189,248,.4);--card-accent:rgba(56,189,248,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(56,189,248,.12);color:var(--blue);font-size:.8rem;font-weight:700">CC</div>
          <div class="mod-phase" style="color:var(--blue);border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.08)">C2</div>
        </div>
        <div class="mod-title">Casos Clínicos Respiratorios</div>
        <div class="mod-desc">Casos integrados con ABCDE interactivo, laboratorio, espirometría y banco de preguntas.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">EPOC · Asma · Fibrosis · Post-COVID</span>
          </div>
          <div class="mod-open" style="color:var(--blue)">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 2: Crear `modules/clase-3.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 3 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--red);margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C3 · Respiratorio</div>
  <div class="ht">Procedimientos y Pruebas de Diagnóstico</div>
  <div class="ha">Área Respiratoria — Clase 3 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Interpretar los valores de una gasometría arterial (pH, PaO₂, PaCO₂, HCO₃⁻, SatO₂)</li>
      <li>Clasificar los trastornos ácido-base: acidosis o alcalosis, respiratoria o metabólica</li>
      <li>Aplicar las fórmulas de compensación y determinar si la compensación es adecuada</li>
      <li>Utilizar el diagrama de Davenport para representación gráfica del estado ácido-base</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/gasometria.html','Gasometría Arterial Interactiva');return false;"
         style="--card-color:rgba(248,113,113,.4);--card-accent:rgba(248,113,113,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(248,113,113,.12);color:var(--red);font-size:.8rem;font-weight:700">GA</div>
          <div class="mod-phase" style="color:var(--red);border-color:rgba(248,113,113,.3);background:rgba(248,113,113,.08)">C3</div>
        </div>
        <div class="mod-title">Gasometría Arterial Interactiva</div>
        <div class="mod-desc">Interpretación paso a paso con 9 casos clínicos, simulador de diales y diagrama de Davenport.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Acidosis · Alcalosis · Compensación</span>
          </div>
          <div class="mod-open" style="color:var(--red)">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 3: Verificar en navegador**

Abrir `http://localhost:8000/`, clic en C2 → debe cargar el hub con 2 módulos. Clic en "Patrones Respiratorios" → debe abrir el módulo en el mismo iframe. Repetir con C3 → 1 módulo visible.

- [ ] **Step 4: Commit**

```
git add modules/clase-2.html modules/clase-3.html
git commit -m "feat: crear hubs de clase C2 y C3"
```

---

## Task 3: Crear hubs C4 y C5

**Files:**
- Create: `modules/clase-4.html`
- Create: `modules/clase-5.html`

- [ ] **Step 1: Crear `modules/clase-4.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 4 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--purple);margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C4 · Respiratorio</div>
  <div class="ht">Evaluación y Tratamiento Fisioterapéutico</div>
  <div class="ha">Área Respiratoria — Clase 4 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Realizar el seguimiento longitudinal de un paciente durante la rehabilitación pulmonar</li>
      <li>Seleccionar y aplicar técnicas de aclaramiento bronquial según el escenario clínico</li>
      <li>Evaluar la respuesta al tratamiento con indicadores funcionales y de calidad de vida</li>
      <li>Documentar la evolución clínica a lo largo de múltiples semanas de intervención</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/historial.html','Historial Longitudinal del Paciente');return false;"
         style="--card-color:rgba(167,139,250,.4);--card-accent:rgba(167,139,250,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(167,139,250,.12);color:var(--purple);font-size:.8rem;font-weight:700">HL</div>
          <div class="mod-phase" style="color:var(--purple);border-color:rgba(167,139,250,.3);background:rgba(167,139,250,.08)">C4</div>
        </div>
        <div class="mod-title">Historial Longitudinal del Paciente</div>
        <div class="mod-desc">Sigue 4 pacientes durante 12 semanas de rehabilitación pulmonar con puntos de decisión clínica.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">EPOC · FQ · Post-COVID · Post-UCI</span>
          </div>
          <div class="mod-open" style="color:var(--purple)">Abrir →</div>
        </div>
      </a>

      <a class="mod-card" href="#" onclick="openMod('modules/aclaramiento.html','Técnicas de Aclaramiento Bronquial');return false;"
         style="--card-color:rgba(45,212,191,.4);--card-accent:rgba(45,212,191,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(45,212,191,.12);color:var(--teal);font-size:.8rem;font-weight:700">AB</div>
          <div class="mod-phase" style="color:var(--teal);border-color:rgba(45,212,191,.3);background:rgba(45,212,191,.08)">C4</div>
        </div>
        <div class="mod-title">Aclaramiento Bronquial</div>
        <div class="mod-desc">8 técnicas con animaciones SVG, comparador lado a lado y selector clínico por escenario.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">DA · CATR · Flutter · PEP · ELTGOL</span>
          </div>
          <div class="mod-open" style="color:var(--teal)">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 2: Crear `modules/clase-5.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 5 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--green);margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C5 · Respiratorio</div>
  <div class="ht">Rehabilitación Pulmonar</div>
  <div class="ha">Área Respiratoria — Clase 5 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Administrar e interpretar el Test de Marcha de 6 Minutos según protocolo ATS</li>
      <li>Calcular valores predichos de distancia e identificar criterios de parada</li>
      <li>Analizar la mecánica ventilatoria en patologías obstructivas y restrictivas</li>
      <li>Aplicar técnicas fisioterapéuticas y evaluar su impacto sobre SpO₂, FC y trabajo respiratorio</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/6mwt.html','Test de Marcha 6 Minutos');return false;"
         style="--card-color:rgba(74,222,128,.4);--card-accent:rgba(74,222,128,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(74,222,128,.12);color:var(--green);font-size:.8rem;font-weight:700">6M</div>
          <div class="mod-phase" style="color:var(--green);border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.08)">C5</div>
        </div>
        <div class="mod-title">Test de Marcha 6 Minutos</div>
        <div class="mod-desc">Simulador en tiempo real con 5 perfiles EPOC y FP, protocolo ATS y criterios de parada.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">SpO₂ · FC · Borg · Predichos</span>
          </div>
          <div class="mod-open" style="color:var(--green)">Abrir →</div>
        </div>
      </a>

      <a class="mod-card" href="#" onclick="openMod('modules/fisio_resp_sim.html','Fisiopatología Respiratoria — Simulador');return false;"
         style="--card-color:rgba(56,189,248,.4);--card-accent:rgba(56,189,248,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(56,189,248,.12);color:var(--blue);font-size:.8rem;font-weight:700">FP</div>
          <div class="mod-phase" style="color:var(--blue);border-color:rgba(56,189,248,.3);background:rgba(56,189,248,.08)">C5</div>
        </div>
        <div class="mod-title">Fisiopatología Respiratoria</div>
        <div class="mod-desc">Simulador paramétrico de 11 patologías. Aplica técnicas fisioterapéuticas y evalúa su efecto en tiempo real.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">FVC · FEV₁ · Compliance · Resistencia</span>
          </div>
          <div class="mod-open" style="color:var(--blue)">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 3: Verificar en navegador**

C4 → 2 módulos (Historial + Aclaramiento). C5 → 2 módulos (6MWT + Fisiopatología). Verificar que al hacer clic en cada módulo se abre correctamente en el iframe.

- [ ] **Step 4: Commit**

```
git add modules/clase-4.html modules/clase-5.html
git commit -m "feat: crear hubs de clase C4 y C5"
```

---

## Task 4: Crear hubs C6 y C7

**Files:**
- Create: `modules/clase-6.html`
- Create: `modules/clase-7.html`

- [ ] **Step 1: Crear `modules/clase-6.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 6 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--amber);margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C6 · Respiratorio</div>
  <div class="ht">Enfermedades Obstructivas y Restrictivas</div>
  <div class="ha">Área Respiratoria — Clase 6 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Diferenciar patrones obstructivos y restrictivos mediante espirometría y mecánica ventilatoria</li>
      <li>Interpretar el índice BODE, la clasificación GOLD 2024 y los puntajes CAT y MRC</li>
      <li>Calcular predichos espirométricos con la ecuación GLI 2012 (puntaje z y LIN)</li>
      <li>Relacionar las patologías respiratorias con su impacto funcional y pronóstico clínico</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/fisio_resp_sim.html','Fisiopatología Respiratoria — Simulador');return false;"
         style="--card-color:rgba(251,191,36,.4);--card-accent:rgba(251,191,36,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(251,191,36,.12);color:var(--amber);font-size:.8rem;font-weight:700">FP</div>
          <div class="mod-phase" style="color:var(--amber);border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.08)">C6</div>
        </div>
        <div class="mod-title">Fisiopatología Respiratoria</div>
        <div class="mod-desc">Simulador de 11 patologías obstructivas y restrictivas con curvas FVC/FEV₁ en tiempo real.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Obstructivo · Restrictivo · Mixto</span>
          </div>
          <div class="mod-open" style="color:var(--amber)">Abrir →</div>
        </div>
      </a>

      <a class="mod-card" href="#" onclick="openMod('modules/calculadoras.html','Calculadoras Clínicas Respiratorias');return false;"
         style="--card-color:rgba(251,191,36,.4);--card-accent:rgba(251,191,36,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(251,191,36,.12);color:var(--amber);font-size:.8rem;font-weight:700">CL</div>
          <div class="mod-phase" style="color:var(--amber);border-color:rgba(251,191,36,.3);background:rgba(251,191,36,.08)">C6</div>
        </div>
        <div class="mod-title">Calculadoras Clínicas Respiratorias</div>
        <div class="mod-desc">Índice BODE con curva de supervivencia, GOLD 2024, CAT, MRC visual y predichos GLI 2012.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">BODE · GOLD · CAT · MRC · GLI</span>
          </div>
          <div class="mod-open" style="color:var(--amber)">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 2: Crear `modules/clase-7.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 7 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#4a9eff;margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C7 · Cardiovascular</div>
  <div class="ht">Anatomía y Fisiología Cardíaca</div>
  <div class="ha">Área Cardiovascular — Clase 7 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Interpretar un ECG básico e identificar los 16 ritmos cardíacos más frecuentes</li>
      <li>Comprender el ciclo cardíaco mediante el diagrama de Wiggers (presiones, volúmenes, ECG)</li>
      <li>Describir las 5 fases del ciclo cardíaco y los ruidos cardíacos S1–S4</li>
      <li>Aplicar la ley de Frank-Starling y los principios del gasto cardíaco en la práctica clínica</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

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

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 3: Verificar en navegador**

C6 → 2 módulos (Fisiopatología + Calculadoras). C7 → 1 módulo (ECG). Clic en ECG → abre el módulo en iframe.

- [ ] **Step 4: Commit**

```
git add modules/clase-6.html modules/clase-7.html
git commit -m "feat: crear hubs de clase C6 y C7"
```

---

## Task 5: Crear hubs C8, C9 y C10

**Files:**
- Create: `modules/clase-8.html`
- Create: `modules/clase-9.html`
- Create: `modules/clase-10.html`

- [ ] **Step 1: Crear `modules/clase-8.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 8 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#f472b6;margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C8 · Cardiovascular</div>
  <div class="ht">Evaluación Cardiovascular</div>
  <div class="ha">Área Cardiovascular — Clase 8 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Realizar una anamnesis cardiovascular estructurada e identificar factores de riesgo</li>
      <li>Aplicar el enfoque ABCDE en el paciente con IAM e ICC aguda</li>
      <li>Interpretar los parámetros básicos de monitorización hemodinámica</li>
      <li>Clasificar la gravedad del IAM con la escala Killip-Kimball</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/casos_cardiovascular.html','Casos y Evaluación Cardiovascular');return false;"
         style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.8rem;font-weight:700">CV</div>
          <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">C8</div>
        </div>
        <div class="mod-title">Casos y Evaluación Cardiovascular</div>
        <div class="mod-desc">Anamnesis, ABCDE en IAM e ICC, monitorización hemodinámica y estratificación Killip-Kimball.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">IAM · ICC · Anamnesis · Killip</span>
          </div>
          <div class="mod-open" style="color:#f472b6">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 2: Crear `modules/clase-9.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 9 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--green);margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C9 · Cardiovascular</div>
  <div class="ht">Rehabilitación Cardíaca</div>
  <div class="ha">Área Cardiovascular — Clase 9 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Administrar el Test de Marcha de 6 Minutos en pacientes cardiovasculares según protocolo ATS</li>
      <li>Identificar criterios de parada por riesgo cardiovascular durante el ejercicio</li>
      <li>Monitorizar SpO₂, FC y escala de Borg en pacientes post-IAM e ICC</li>
      <li>Evaluar la capacidad funcional como base para la prescripción del ejercicio cardíaco</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/6mwt.html','Test de Marcha 6 Minutos');return false;"
         style="--card-color:rgba(74,222,128,.4);--card-accent:rgba(74,222,128,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(74,222,128,.12);color:var(--green);font-size:.8rem;font-weight:700">6M</div>
          <div class="mod-phase" style="color:var(--green);border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.08)">C9</div>
        </div>
        <div class="mod-title">Test de Marcha 6 Minutos</div>
        <div class="mod-desc">Simulador con perfiles Post-IAM e ICC, monitorización cardiovascular y criterios de parada por riesgo CV.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Post-IAM · ICC · Seguridad · Borg</span>
          </div>
          <div class="mod-open" style="color:var(--green)">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 3: Crear `modules/clase-10.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 10 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#f472b6;margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C10 · Cardiovascular</div>
  <div class="ht">Enfermedades Cardíacas</div>
  <div class="ha">Área Cardiovascular — Clase 10 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Describir los mecanismos fisiopatológicos de la aterosclerosis y la hipertensión arterial</li>
      <li>Relacionar las enfermedades cardíacas con sus manifestaciones clínicas y complicaciones</li>
      <li>Integrar el razonamiento clínico en el manejo fisioterapéutico del paciente cardíaco</li>
      <li>Aplicar la estratificación Killip-Kimball para orientar la intensidad de la intervención</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/casos_cardiovascular.html','Casos y Evaluación Cardiovascular');return false;"
         style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.8rem;font-weight:700">CV</div>
          <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">C10</div>
        </div>
        <div class="mod-title">Casos y Evaluación Cardiovascular</div>
        <div class="mod-desc">Aterosclerosis, HTA, fisiopatología de cardiopatías y razonamiento clínico integrado en casos reales.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Aterosclerosis · HTA · Cardiopatías</span>
          </div>
          <div class="mod-open" style="color:#f472b6">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 4: Verificar en navegador**

C8 → 1 módulo (Casos CV, enfoque evaluación). C9 → 1 módulo (6MWT cardíaco). C10 → 1 módulo (Casos CV, enfoque enfermedades).

- [ ] **Step 5: Commit**

```
git add modules/clase-8.html modules/clase-9.html modules/clase-10.html
git commit -m "feat: crear hubs de clase C8, C9 y C10"
```

---

## Task 6: Crear hubs C11 y C12

**Files:**
- Create: `modules/clase-11.html`
- Create: `modules/clase-12.html`

- [ ] **Step 1: Crear `modules/clase-11.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 11 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#f472b6;margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C11 · Cardiovascular</div>
  <div class="ht">Riesgo Cardiovascular</div>
  <div class="ha">Área Cardiovascular — Clase 11 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Calcular el riesgo cardiovascular a 10 años con la escala de Framingham 2008</li>
      <li>Identificar y clasificar factores de riesgo modificables y no modificables</li>
      <li>Interpretar el gauge de riesgo y comunicar el resultado al paciente</li>
      <li>Relacionar el nivel de riesgo con la indicación y el diseño de la rehabilitación</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/riesgo_cv.html','Riesgo Cardiovascular y Prescripción FITT');return false;"
         style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.8rem;font-weight:700">RC</div>
          <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">C11</div>
        </div>
        <div class="mod-title">Riesgo Cardiovascular y Prescripción FITT</div>
        <div class="mod-desc">Framingham 2008, gauge de riesgo a 10 años, factores de riesgo modificables y no modificables.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Framingham · SCORE · Gauge · Factores</span>
          </div>
          <div class="mod-open" style="color:#f472b6">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 2: Crear `modules/clase-12.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Clase 12 — FisioResp</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<style>
.hw{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem}
.hl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#f472b6;margin-bottom:.4rem}
.ht{font-family:var(--fh);font-size:clamp(1.4rem,4vw,2.2rem);line-height:1.1;letter-spacing:-.5px;margin-bottom:.3rem}
.ha{font-size:12px;color:var(--text3);margin-bottom:2rem}
.ho{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem 1.75rem;margin-bottom:2rem}
.ho h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:.9rem}
.ho ul{margin:0;padding-left:1.2rem;display:flex;flex-direction:column;gap:.45rem}
.ho li{font-size:13.5px;color:var(--text2);line-height:1.5}
.hm h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text3);margin-bottom:1.25rem;display:flex;align-items:center;gap:.5rem}
.hm h2::after{content:'';flex:1;height:1px;background:var(--border)}
</style>
</head>
<body>
<div class="hw">
  <div class="hl">C12 · Cardiovascular</div>
  <div class="ht">Prescripción del Ejercicio</div>
  <div class="ha">Área Cardiovascular — Clase 12 de 12</div>
  <div class="ho">
    <h2>Objetivos de aprendizaje</h2>
    <ul>
      <li>Aplicar el modelo FITT para la prescripción de ejercicio en pacientes con cardiopatía</li>
      <li>Calcular la frecuencia cardíaca de entrenamiento con el método de Karvonen</li>
      <li>Usar la escala de Borg para la regulación del esfuerzo percibido durante el ejercicio</li>
      <li>Adaptar la prescripción del ejercicio según la clasificación Killip y los METs disponibles</li>
    </ul>
  </div>
  <div class="hm">
    <h2>Módulos</h2>
    <div class="modules-grid">

      <a class="mod-card" href="#" onclick="openMod('modules/riesgo_cv.html','Riesgo Cardiovascular y Prescripción FITT');return false;"
         style="--card-color:rgba(244,114,182,.4);--card-accent:rgba(244,114,182,.06)">
        <div class="mod-top">
          <div class="mod-icon" style="background:rgba(244,114,182,.12);color:#f472b6;font-size:.8rem;font-weight:700">RC</div>
          <div class="mod-phase" style="color:#f472b6;border-color:rgba(244,114,182,.3);background:rgba(244,114,182,.08)">C12</div>
        </div>
        <div class="mod-title">Riesgo Cardiovascular y Prescripción FITT</div>
        <div class="mod-desc">Modelo FITT, método de Karvonen, escala de Borg y METs para la prescripción del ejercicio en cardiopatías.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">FITT · Karvonen · Borg · METs · Killip</span>
          </div>
          <div class="mod-open" style="color:#f472b6">Abrir →</div>
        </div>
      </a>

    </div>
  </div>
</div>
<script>
function openMod(url, title) {
  if (window.parent && window.parent.openModule) window.parent.openModule(url, title);
}
</script>
</body>
</html>
```

- [ ] **Step 3: Verificar flujo completo en navegador**

1. Abrir `http://localhost:8000/`
2. Verificar 12 tarjetas: C1 opaco/no clickeable, C2–C12 clickeables
3. Probar cada clase: hub carga correctamente con objetivos y tarjetas de módulo
4. Probar al menos 3 módulos desde sus hubs: confirmar que se abren en iframe
5. Confirmar que el botón "← Volver" del viewer bar cierra el iframe

- [ ] **Step 4: Commit final**

```
git add modules/clase-11.html modules/clase-12.html
git commit -m "feat: crear hubs de clase C11 y C12 — reorganización completada"
```
