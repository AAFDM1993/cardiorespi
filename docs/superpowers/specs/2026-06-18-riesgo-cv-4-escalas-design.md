# Diseño: Agregar SCORE2, ASSIGN, QRISK y ACSM a `riesgo_cv.html` (Clase 11)

**Fecha:** 2026-06-18
**Estado:** Aprobado

---

## Objetivo

`modules/riesgo_cv.html` (módulo de Clase 11/12) hoy solo calcula riesgo cardiovascular con **Framingham 2008**. Se agregan 4 escalas adicionales de riesgo CV total — **SCORE2**, **ASSIGN**, **QRISK** y la **estratificación de factores de riesgo ACSM** — como pestañas nuevas dentro del mismo módulo, para que el estudiante pueda comparar cómo distintos sistemas clasifican al mismo paciente.

---

## Archivos a modificar

| Acción | Archivo | Cambios |
|--------|---------|---------|
| Modificar | `modules/riesgo_cv.html` | Agregar selector de pestañas, 4 calculadoras nuevas, refactor de estado, integración FITT |
| Modificar | `modules/clase-11.html` | Actualizar `mod-desc` y footer de la tarjeta del módulo |

`modules/clase-12.html` no se modifica.

---

## Arquitectura general

- Se agrega una barra de pestañas sobre la calculadora, usando el patrón existente `showTab(id, el)` / `.panel` de `assets/js/ui.js`:
  `[ Framingham | SCORE2 | ASSIGN | QRISK | ACSM ]`
- Cada pestaña es **autocontenida**: su propio `.calc-wrap` (form-col + output-col), su propio gauge SVG y su propia caja de desglose (`.pts-box`), reutilizando las clases CSS ya definidas. No hay un gauge único compartido en el DOM — cada escala tiene el suyo, para evitar lógica de reconfiguración de thresholds/colores al cambiar de pestaña.
- **Estado namespaced:**
  ```js
  const state = {
    activeScale: 'fram',     // 'fram' | 'score2' | 'assign' | 'qrisk' | 'acsm'
    lastNumericRisk: null,   // último % calculado por una escala numérica (para fallback FITT)
    fram:   { sex, age, tc, hdl, sbp, bpTreated, smoking },
    score2: { sex, age, sbp, tc, hdl, smoking, region },
    assign: { sex, age, sbp, tc, hdl, smoking, cigsPerDay, famHist, diabetes, ses },
    qrisk:  { sex, age, ethnicity, bmi, sbp, tc, hdl, smokingCat, diabetes, famHist, afib, ckd },
    acsm:   { sex, age, famHist, smoking, sedentary, obesity, htn, dyslipidemia, prediabetes, highHdl, knownDisease, symptoms },
    killip: null,            // sin cambios — compartido entre todas las pestañas
  };
  ```
- Killip-Kimball y el bloque FITT permanecen **debajo de las pestañas, sin cambios visuales**, comunes a todas.
- Se agrega un disclaimer breve y visible (no solo en el texto introductorio) bajo el selector de pestañas: *"SCORE2, ASSIGN y QRISK se calculan con aproximaciones educativas calibradas, no con el algoritmo clínico oficial. Framingham y ACSM siguen sus tablas/criterios reales publicados."*

---

## Pestaña Framingham

Sin cambios funcionales. Se mueve el HTML/JS existente (`calcFram`, gauge, desglose) dentro de `<div class="panel active" id="tab-fram">`, y se renombra el `state` plano actual a `state.fram`.

---

## Pestaña SCORE2

**Inputs:**
- Sexo (toggle, igual estilo que Framingham)
- Edad — slider 40–69
- PAS — slider 90–200
- Colesterol total — slider 100–320 mg/dL
- HDL — slider 20–100 mg/dL (se deriva `noHDL = tc - hdl`, mostrado como valor calculado, no editable)
- Tabaquismo actual — toggle sí/no
- Región de riesgo — 4 botones: Bajo / Moderado / Alto / Muy alto (España = Bajo, marcado por defecto)

**Cálculo (aproximación educativa):**
```js
function calcScore2(s) {
  const { sex, age, sbp, tc, hdl, smoking, region } = s;
  const noHdl = tc - hdl; // mg/dL
  const cAge = (age - 60) / 5;
  // Predictor lineal con interacciones edad×factor (pesos relativos realistas,
  // mayor efecto de tabaquismo/PAS en jóvenes, decreciente con la edad)
  let x = 0.32*cAge
        + (smoking ? 0.62 - 0.20*cAge : 0)
        + 0.025*(sbp-120) - 0.003*cAge*(sbp-120)
        + 0.018*(noHdl-130) - 0.002*cAge*(noHdl-130);
  if (sex === 'F') x *= 0.85; // mujeres: curva más plana a igual edad, como en el modelo real
  const baseline = { low: 0.018, moderate: 0.028, high: 0.042, veryhigh: 0.06 }[region];
  let risk = 100 * (1 - Math.pow(1 - baseline, Math.exp(x)));
  risk = Math.max(0.5, Math.min(50, risk));
  const bd = {
    age:    Math.round(0.32*cAge * 10) / 10,
    smoke:  smoking ? Math.round((0.62 - 0.20*cAge) * 10) / 10 : 0,
    sbp:    Math.round((0.025*(sbp-120) - 0.003*cAge*(sbp-120)) * 10) / 10,
    nonHdl: Math.round((0.018*(noHdl-130) - 0.002*cAge*(noHdl-130)) * 10) / 10,
  };
  return { risk, bd };
}
```
- Categorías de gauge dependientes de edad (guía ESC 2021):
  - `age < 50`: Bajo &lt;2.5% · Moderado 2.5–&lt;7.5% · Alto ≥7.5%
  - `age >= 50`: Bajo &lt;5% · Moderado 5–&lt;10% · Alto ≥10%
- Desglose (`.pts-box`): filas **Edad** (`bd.age`), **Tabaquismo** (`bd.smoke`), **PAS** (`bd.sbp`), **No-HDL** (`bd.nonHdl`) — valores en puntos relativos de contribución (no en mg/dL), mismo estilo `pts-pos`/`pts-neg`/`pts-zero` que Framingham. La región no tiene fila propia: se muestra como badge junto al gauge, no en el desglose (es un multiplicador de calibración, no una contribución aditiva).

---

## Pestaña ASSIGN

**Inputs:**
- Sexo (toggle)
- Edad — slider 30–74
- PAS — slider 90–200
- Colesterol total — slider 100–320 mg/dL, HDL — slider 20–100 mg/dL (ratio TC/HDL mostrado)
- Tabaquismo — toggle sí/no + slider cigarrillos/día 0–40 (solo activo si toggle = sí)
- Historia familiar CV &lt;60 años — checkbox
- Diabetes — checkbox
- Nivel socioeconómico — slider 1 (más favorecido) – 7 (más desfavorecido), con nota: *"Sustituye al índice de privación SIMD (Reino Unido); 4 = nivel medio."*, valor por defecto 4

**Cálculo (aproximación educativa):**
```js
function calcAssign(s) {
  const { sex, age, sbp, tc, hdl, smoking, cigsPerDay, famHist, diabetes, ses } = s;
  const ratio = tc / hdl;
  let pts = (age - 30) * 0.9
          + Math.max(0, sbp - 120) * 0.12
          + Math.max(0, ratio - 4) * 2.5
          + (smoking ? 4 + cigsPerDay * 0.15 : 0)
          + (famHist ? 4 : 0)
          + (diabetes ? 6 : 0)
          + (ses - 4) * 1.2;
  if (sex === 'F') pts *= 0.9;
  const risk = Math.max(0.5, Math.min(50, pts * 0.55));
  const bd = {
    age:     Math.round((age - 30) * 0.9 * 10) / 10,
    sbp:     Math.round(Math.max(0, sbp - 120) * 0.12 * 10) / 10,
    lipids:  Math.round(Math.max(0, ratio - 4) * 2.5 * 10) / 10,
    smoke:   smoking ? Math.round((4 + cigsPerDay * 0.15) * 10) / 10 : 0,
    famHist: famHist ? 4 : 0,
    diabetes: diabetes ? 6 : 0,
    ses:     Math.round((ses - 4) * 1.2 * 10) / 10,
  };
  return { risk, bd };
}
```
- Categorías de gauge: Bajo &lt;10% · Moderado 10–20% · Alto ≥20% (convención JBS3/Reino Unido).
- Desglose (`.pts-box`): filas **Edad**, **PA**, **Lípidos**, **Tabaquismo**, **Hist. familiar**, **Diabetes**, **Nivel socioeconómico** — una fila por campo de `bd`, mismo estilo `pts-pos`/`pts-neg`/`pts-zero`.

---

## Pestaña QRISK (simplificada)

**Inputs:**
- Sexo (toggle), Edad — slider 25–84
- Etnia — select: Blanca/no registrada · Asiática del sur · Negra africana/caribeña · Asiática del este · Mixta/otra
- IMC — slider 15–45 (directo, sin altura/peso separados)
- PAS — slider 90–200
- Colesterol total + HDL — sliders (ratio TC/HDL mostrado)
- Tabaquismo — select 5 categorías: Nunca / Ex-fumador / Ligero (&lt;10/día) / Moderado (10-19/día) / Intenso (≥20/día)
- Diabetes — select: Ninguna / Tipo 1 / Tipo 2
- Historia familiar CV &lt;60 años — checkbox
- Fibrilación auricular conocida — checkbox
- Enfermedad renal crónica (estadio 4-5) — checkbox

**Cálculo (aproximación log-lística educativa):**
```js
function calcQrisk(s) {
  const { sex, age, ethnicity, bmi, sbp, tc, hdl, smokingCat, diabetes, famHist, afib, ckd } = s;
  const ratio = tc / hdl;
  const ethMult = { white:1, southAsian:1.4, black:0.7, eastAsian:0.6, mixed:1.1 }[ethnicity];
  const smokeMult = [0, 1.3, 1.8, 2.3, 3.0][smokingCat]; // nunca..intenso
  let x = (age - 50) * 0.085
        + Math.max(0, sbp - 120) * 0.018
        + Math.max(0, ratio - 4) * 0.22
        + Math.max(0, bmi - 25) * 0.04
        + Math.log(ethMult) + Math.log(smokeMult || 1)
        + (diabetes === 'type2' ? 1.0 : diabetes === 'type1' ? 1.4 : 0)
        + (famHist ? 0.45 : 0)
        + (afib ? 1.1 : 0)
        + (ckd ? 1.0 : 0);
  if (sex === 'F') x *= 0.9;
  let risk = 100 * (1 - Math.pow(0.98, Math.exp(x)));
  risk = Math.max(0.5, Math.min(60, risk));
  const bd = {
    age:      Math.round((age - 50) * 0.085 * 10) / 10,
    ethnicity: Math.round(Math.log(ethMult) * 10) / 10,
    bmi:      Math.round(Math.max(0, bmi - 25) * 0.04 * 10) / 10,
    sbp:      Math.round(Math.max(0, sbp - 120) * 0.018 * 10) / 10,
    lipids:   Math.round(Math.max(0, ratio - 4) * 0.22 * 10) / 10,
    smoke:    Math.round(Math.log(smokeMult || 1) * 10) / 10,
    diabetes: diabetes === 'type2' ? 1.0 : diabetes === 'type1' ? 1.4 : 0,
    famHist:  famHist ? 0.45 : 0,
    afib:     afib ? 1.1 : 0,
    ckd:      ckd ? 1.0 : 0,
  };
  return { risk, bd };
}
```
- Categorías de gauge: Bajo &lt;10% · Moderado 10–20% · Alto ≥20% (NICE).
- Desglose (`.pts-box`): una fila por campo de `bd` — **Edad, Etnia, IMC, PA, Lípidos, Tabaquismo, Diabetes, Hist. familiar, FA, ERC** — mismo estilo `pts-pos`/`pts-neg`/`pts-zero`.

---

## Pestaña ACSM (estratificación de factores de riesgo)

**No produce %.** Produce una categoría: Bajo / Moderado / Alto.

**Inputs — Sexo + edad** (mismo estilo toggle/slider que las demás pestañas; esta pestaña tiene su propio `state.acsm.sex`/`state.acsm.age`, independiente de los valores de las otras pestañas, usados solo para autocalcular el factor #1).

**Inputs — checkboxes de 8 factores positivos** (con la regla exacta visible como texto de ayuda):
1. Edad (auto-calculado: ≥45 si sexo=M, ≥55 si sexo=F, a partir de `state.acsm.sex`/`state.acsm.age`)
2. Historia familiar (IAM/revascularización/muerte súbita &lt;55a en familiar 1er grado masculino o &lt;65a femenino)
3. Tabaquismo actual, cesación &lt;6 meses, o exposición pasiva
4. Sedentarismo (&lt;30min actividad moderada ≥3 días/sem, ≥3 meses)
5. Obesidad (IMC ≥30, o perímetro de cintura &gt;102cm H / &gt;88cm M)
6. Hipertensión (PAS ≥130 o PAD ≥80, o tratamiento antihipertensivo)
7. Dislipidemia (LDL ≥130, HDL &lt;40, tratamiento hipolipemiante, o CT ≥200 si no hay LDL)
8. Prediabetes (glucosa ayunas 100-125 mg/dL o HbA1c 5.7-6.4%)

**1 factor negativo:** HDL ≥60 mg/dL (resta 1 del conteo neto, sin bajar de 0)

**2 inputs adicionales (checkbox):**
- Enfermedad cardiovascular/pulmonar/metabólica conocida
- Signos o síntomas sugestivos (dolor torácico, disnea anormal, síncope, ortopnea/DPN, edema de tobillo, palpitaciones, claudicación intermitente, soplo conocido, fatiga inusual) — se presenta como un solo checkbox "Presenta signos/síntomas sugestivos" con la lista en texto de ayuda, no como 9 checkboxes separados

**Categorización:**
```js
function calcAcsm(s) {
  if (s.knownDisease || s.symptoms) return { category: 'alto', count: null };
  const ageFactor = (s.sex === 'M' && s.age >= 45) || (s.sex === 'F' && s.age >= 55);
  let count = [ageFactor, s.famHist, s.smoking, s.sedentary, s.obesity, s.htn, s.dyslipidemia, s.prediabetes]
              .filter(Boolean).length;
  if (s.highHdl) count = Math.max(0, count - 1);
  return { category: count >= 2 ? 'moderado' : 'bajo', count };
}
```

**Salida:** badge de categoría (mismo estilo `.gauge-cat` pero sin gauge de arco) + lista de qué factores se marcaron (reutilizando `.pts-box`) + nota clínica de implicación según categoría (ej. alto → "Requiere evaluación médica y posible prueba de esfuerzo supervisada antes de ejercicio vigoroso").

---

## Integración con Killip + FITT

```js
function getActiveRisk() {
  if (state.activeScale === 'acsm') return state.lastNumericRisk ?? calcFram().risk;
  const calc = { fram: calcFram, score2: calcScore2, assign: calcAssign, qrisk: calcQrisk }[state.activeScale];
  const { risk } = calc(state[state.activeScale]);
  state.lastNumericRisk = risk;
  return risk;
}
```
`renderFITT()` (sin cambios en su lógica de thresholds bajo/moderado/alto ni en `getFITT`) ahora llama a `getActiveRisk()` en vez de `calcFram().risk` directamente.

---

## Cambios en `modules/clase-11.html`

```diff
- <div class="mod-desc">Framingham 2008, gauge de riesgo a 10 años, factores de riesgo modificables y no modificables.</div>
+ <div class="mod-desc">Framingham, SCORE2, ASSIGN, QRISK y estratificación ACSM. Gauge de riesgo a 10 años, factores modificables y no modificables.</div>
  ...
-           <span style="font-size:11px;color:var(--text3)">Framingham · SCORE · Gauge · Factores</span>
+           <span style="font-size:11px;color:var(--text3)">Framingham · SCORE2 · ASSIGN · QRISK · ACSM</span>
```

---

## Testing

Proyecto sin framework de pruebas (vanilla JS, sin build). Verificación manual en navegador:
1. Servir con `python3 -m http.server 8000`, abrir Clase 11 → módulo Riesgo Cardiovascular.
2. Por cada pestaña nueva: mover cada slider/toggle al extremo y verificar que el gauge, categoría y desglose cambian de forma coherente (sin NaN, sin valores fuera de rango).
3. Verificar que cambiar de pestaña no resetea el estado de las otras (volver a Framingham debe mantener los valores que tenía antes).
4. Verificar que el bloque FITT cambia al cambiar de pestaña activa (con Killip sin seleccionar), y que seleccionar Killip sigue mandando sobre el FITT igual que hoy.
5. Verificar la pestaña ACSM: marcar "enfermedad conocida" o "síntomas" debe forzar Alto independientemente del conteo; el fallback de FITT debe seguir mostrando el último % numérico calculado.
6. Responsive: probar en viewport angosto (igual breakpoints `@media(max-width:820px)` ya existentes).

---

## Commit esperado

```
git add modules/riesgo_cv.html modules/clase-11.html
git commit -m "feat: agregar escalas SCORE2, ASSIGN, QRISK y estratificacion ACSM a riesgo_cv"
```
