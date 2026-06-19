# Diseño: Modo práctica para los casos clínicos de `riesgo_cv.html`

**Fecha:** 2026-06-19
**Estado:** Aprobado
**Continúa de:** `docs/superpowers/specs/2026-06-18-riesgo-cv-4-escalas-design.md`

---

## Objetivo

Hoy, seleccionar uno de los 10 casos clínicos preconfigurados autocompleta automáticamente los inputs de las 5 escalas (`applyCaseToScales`). Esto es útil para demostración en clase, pero no exige nada al alumno: nunca tiene que pensar qué dato va en qué control.

Se agrega un **modo práctica**: al activarlo, seleccionar un caso muestra su ficha clínica completa (cifras reales) pero **no** rellena los controles — el alumno los ajusta él mismo en cada pestaña, y puede pedir una **verificación campo por campo** contra los valores reales del caso.

El modo demostración actual no cambia en absoluto.

---

## Archivos a modificar

| Acción | Archivo | Cambios |
|--------|---------|---------|
| Modificar | `modules/riesgo_cv.html` | Toggle de modo, ficha clínica, refactor `applyCaseToScales`→`deriveCaseFields`, mecanismo de verificación |

No se modifica `data/cases-riesgo-cv.js` (la ficha clínica reutiliza campos que ya existen en `RIESGO_CV_CASES`) ni `modules/clase-11.html`.

---

## Estado nuevo

```js
const DEFAULT_SCALE_STATE = {
  fram:   { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false },
  score2: { sex:'M', age:55, sbp:140, tc:200, hdl:50, smoking:false, region:'low' },
  assign: { sex:'M', age:50, sbp:135, tc:210, hdl:48, smoking:false, cigsPerDay:10, famHist:false, diabetes:false, ses:4 },
  qrisk:  { sex:'M', age:55, ethnicity:'white', bmi:26, sbp:135, tc:200, hdl:50, smokingCat:0, diabetes:'none', famHist:false, afib:false, ckd:false },
  acsm:   { sex:'M', age:50, famHist:false, smoking:false, sedentary:false, obesity:false, htn:false, dyslipidemia:false, prediabetes:false, highHdl:false, knownDisease:false, symptoms:false },
};

const state = {
  activeScale: 'fram',
  lastNumericRisk: null,
  caseMode: 'demo',        // 'demo' | 'practice' — nuevo
  activeCaseId: null,      // id del caso cargado actualmente, o null — nuevo
  fram:   { ...DEFAULT_SCALE_STATE.fram },
  score2: { ...DEFAULT_SCALE_STATE.score2 },
  assign: { ...DEFAULT_SCALE_STATE.assign },
  qrisk:  { ...DEFAULT_SCALE_STATE.qrisk },
  acsm:   { ...DEFAULT_SCALE_STATE.acsm },
  killip: null,
};
```

`DEFAULT_SCALE_STATE` extrae los literales que hoy están inline en `state`, para poder reutilizarlos como "valores neutros" al resetear en modo práctica, sin duplicar los números.

---

## Refactor: `applyCaseToScales` → `deriveCaseFields` (sin cambiar el resultado actual)

Se extrae la lógica de mapeo caso→escalas a una función **pura** (sin efectos secundarios), que tanto el modo demostración como el mecanismo de verificación consumen. Es la única fuente de verdad sobre "cuál es el valor correcto de cada campo para este caso".

```js
function deriveCaseFields(c) {
  const isCurrent = c.smoking.status === 'current';
  const acsmSmoking = isCurrent || (c.smoking.status === 'ex' && c.smoking.quitMonthsAgo != null && c.smoking.quitMonthsAgo < 6);
  return {
    fram:   { sex:c.sex, age:c.age, tc:c.tc, hdl:c.hdl, sbp:c.sbp, bpTreated:c.bpTreated, smoking:isCurrent },
    score2: { sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent },
    assign: { sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent,
      cigsPerDay:c.smoking.cigsPerDay||0, famHist:c.famHist, diabetes:c.diabetes!=='none', ses:c.ses },
    qrisk:  { sex:c.sex, age:c.age, ethnicity:c.ethnicity, bmi:c.bmi, sbp:c.sbp, tc:c.tc, hdl:c.hdl,
      smokingCat:smokingCatFor(c.smoking), diabetes:c.diabetes, famHist:c.famHist, afib:c.afib, ckd:c.ckd },
    acsm:   { sex:c.sex, age:c.age, famHist:c.famHist, smoking:acsmSmoking, sedentary:c.sedentary,
      obesity:c.bmi>=30, htn:c.sbp>=130||c.bpTreated, dyslipidemia:c.hdl<40||c.dyslipidemiaTx||c.tc>=200,
      prediabetes:!!c.prediabetic, highHdl:c.hdl>=60,
      knownDisease:(c.diabetes!=='none')||c.ckd, symptoms:false },
  };
}

function applyCaseToScales(c) {
  const fields = deriveCaseFields(c);
  state.fram   = fields.fram;
  state.score2 = { ...state.score2, ...fields.score2 };   // region NO se sobreescribe (sin cambios)
  state.assign = fields.assign;
  state.qrisk  = fields.qrisk;
  state.acsm   = fields.acsm;
  syncAllInputsFromState();
  updateFram(); updateScore2(); updateAssign(); updateQrisk(); updateAcsm();
  renderFITT();
}
```

`applyCaseToScales` queda funcionalmente idéntica a la actual — mismo resultado para el modo demostración, ya verificado en la implementación anterior. Solo cambia de dónde saca los valores.

---

## Toggle de modo + selección de caso

UI: dos botones tipo `.tbtn` ("Demostración" / "Práctica") junto a la etiqueta "Casos clínicos preconfigurados", reutilizando el mismo estilo que los toggles de sexo/Killip/región — sin CSS nuevo.

```js
function setCaseMode(mode) {
  if (state.caseMode === mode) return;
  state.caseMode = mode;
  document.getElementById('mode-btn-demo').className     = 'tbtn'+(mode==='demo'?' on':'');
  document.getElementById('mode-btn-practice').className = 'tbtn'+(mode==='practice'?' on':'');
  clearCase();   // cambiar de modo siempre limpia el caso activo
}

function loadCase(id) {
  const c = RIESGO_CV_CASES.find(x => x.id === id);
  if (!c) return;
  state.activeCaseId = id;
  document.querySelectorAll('.case-chip').forEach(ch => ch.classList.remove('on'));
  document.getElementById('case-chip-'+id).classList.add('on');

  if (state.caseMode === 'demo') {
    applyCaseToScales(c);
  } else {
    resetAllScalesToDefault();   // el alumno parte de cero, no del caso anterior
  }
  renderCaseVignette(c);
}

function resetAllScalesToDefault() {
  state.fram   = { ...DEFAULT_SCALE_STATE.fram };
  state.score2 = { ...DEFAULT_SCALE_STATE.score2, region: state.score2.region }; // region tampoco se resetea
  state.assign = { ...DEFAULT_SCALE_STATE.assign };
  state.qrisk  = { ...DEFAULT_SCALE_STATE.qrisk };
  state.acsm   = { ...DEFAULT_SCALE_STATE.acsm };
  syncAllInputsFromState();
  updateFram(); updateScore2(); updateAssign(); updateQrisk(); updateAcsm();
  renderFITT();
}

function clearCase() {
  state.activeCaseId = null;
  document.querySelectorAll('.case-chip').forEach(ch => ch.classList.remove('on'));
  document.getElementById('case-vignette').style.display = 'none';
  // sin cambios de state.fram/score2/... — igual que hoy, no borra lo que el alumno ya puso
}
```

`clearVerifyMarks()` (definida en la sección de verificación) se llama desde dentro de `updateFram/Score2/Assign/Qrisk/Acsm()`, así que se invoca automáticamente cada vez que cualquiera de estas tres funciones (`loadCase`, `resetAllScalesToDefault`, `applyCaseToScales`) corre — no hace falta llamarla aparte.

---

## Ficha clínica (solo modo práctica)

```js
function renderCaseVignette(c) {
  const v = document.getElementById('case-vignette');
  v.style.display = 'block';
  const header = '<strong>'+c.name+'</strong> · '+c.age+' años · '+(c.sex==='M'?'Hombre':'Mujer')+'<br>'+c.vignette;
  if (state.caseMode === 'demo') {
    v.innerHTML = header;                       // sin cambios respecto a hoy
  } else {
    v.innerHTML = header + renderFichaClinica(c)
      + '<div style="margin-top:.6rem">'
      + '<button class="tbtn" onclick="verifyActiveTab()">Verificar</button> '
      + '<span id="verify-summary" style="margin-left:.5rem;font-weight:600"></span>'
      + '</div>';
  }
}

function renderFichaClinica(c) {
  const smokeTxt = c.smoking.status==='never' ? 'no fumador'
    : c.smoking.status==='ex' ? 'exfumador (hace '+c.smoking.quitMonthsAgo+' meses)'
    : 'fumador activo, '+c.smoking.cigsPerDay+' cig/día';
  const ethTxt  = {white:'blanca', southAsian:'surasiática', black:'negra', eastAsian:'asiática oriental', mixed:'mixta'}[c.ethnicity];
  const diabTxt = {none:'no', type1:'tipo 1', type2:'tipo 2'}[c.diabetes];
  return '<div style="margin-top:.5rem;padding-top:.5rem;border-top:1px dashed var(--border)">'
    + '<strong>Datos clínicos:</strong><br>'
    + 'PAS: '+c.sbp+' mmHg · Colesterol total: '+c.tc+' mg/dL · HDL: '+c.hdl+' mg/dL<br>'
    + 'Tabaquismo: '+smokeTxt+' · IMC: '+c.bmi+' kg/m²<br>'
    + 'Etnia: '+ethTxt+' · Diabetes: '+diabTxt+' · HTA tratada: '+(c.bpTreated?'sí':'no')+'<br>'
    + 'Antecedente familiar de ECV prematura: '+(c.famHist?'sí':'no')+' · FA: '+(c.afib?'sí':'no')+' · ERC: '+(c.ckd?'sí':'no')+'<br>'
    + 'Nivel socioeconómico (1-7): '+c.ses+' · Sedentario: '+(c.sedentary?'sí':'no')+' · Tto. dislipidemia: '+(c.dyslipidemiaTx?'sí':'no')
    + (c.prediabetic ? ' · Prediabético: sí' : '')
    + '</div>';
}
```

---

## Mecanismo de verificación

### Campos evaluados por escala

| Escala | Campos evaluados | Excluidos |
|--------|-------------------|-----------|
| Framingham | sex, age, tc, hdl, sbp, bpTreated, smoking | — |
| SCORE2 | sex, age, sbp, tc, hdl, smoking | **region** (no es dato del paciente) |
| ASSIGN | sex, age, sbp, tc, hdl, smoking, cigsPerDay, famHist, diabetes, ses | **cigsPerDay** si el caso correcto no es fumador actual (slider deshabilitado, sin efecto en el cálculo) |
| QRISK | sex, age, ethnicity, bmi, sbp, tc, hdl, smokingCat, diabetes, famHist, afib, ckd | — |
| ACSM | sex, age, famHist, smoking, sedentary, obesity, htn, dyslipidemia, prediabetes, highHdl, knownDisease, symptoms | — |

```js
const VERIFY_FIELDS = {
  fram:   ['sex','age','tc','hdl','sbp','bpTreated','smoking'],
  score2: ['sex','age','sbp','tc','hdl','smoking'],
  assign: ['sex','age','sbp','tc','hdl','smoking','cigsPerDay','famHist','diabetes','ses'],
  qrisk:  ['sex','age','ethnicity','bmi','sbp','tc','hdl','smokingCat','diabetes','famHist','afib','ckd'],
  acsm:   ['sex','age','famHist','smoking','sedentary','obesity','htn','dyslipidemia','prediabetes','highHdl','knownDisease','symptoms'],
};

function verifyActiveTab() {
  if (state.activeCaseId == null) return;
  const c = RIESGO_CV_CASES.find(x => x.id === state.activeCaseId);
  const scale = state.activeScale;
  const correct = deriveCaseFields(c)[scale];
  const current = state[scale];
  clearVerifyMarks();

  let fields = VERIFY_FIELDS[scale].slice();
  if (scale === 'assign' && !correct.smoking) fields = fields.filter(f => f !== 'cigsPerDay');

  let okCount = 0;
  fields.forEach(f => {
    const ok = current[f] === correct[f];
    if (ok) okCount++;
    markField(scale, f, ok, correct[f]);   // 'sex' se marca junto a los botones M/F; el resto junto a su slider/select/checkbox
  });

  const summary = document.getElementById('verify-summary');
  if (summary) summary.textContent = okCount+'/'+fields.length+' correctos en esta pestaña';
}

function clearVerifyMarks() {
  document.querySelectorAll('.verify-mark').forEach(m => m.remove());
  const summary = document.getElementById('verify-summary');
  if (summary) summary.textContent = '';
}
```

`markField(scale, field, ok, correctValue)` inserta un `<span class="verify-mark">` inmediatamente después del control correspondiente (slider/select: después de su `-v-*` span de texto; checkbox/sex: después de su label/botón), con "✅" si coincide o "❌ (correcto: <valor formateado>)" si no. El mapeo `scale+field → id de control` y el formateo del valor correcto por campo (unidades, sí/no, etiquetas de `<select>`) se define en el plan de implementación — el comportamiento (qué se compara, qué se excluye, cómo se cuenta) es lo que este spec fija.

`clearVerifyMarks()` se llama al inicio de `updateFram()`, `updateScore2()`, `updateAssign()`, `updateQrisk()` y `updateAcsm()` — como **todo** cambio de estado (manual del alumno, carga de caso, reset) pasa por una de estas cinco funciones, cualquier cambio invalida automáticamente las marcas existentes sin necesitar un hook independiente.

`showTab()` limpia además `#verify-summary` (no las marcas ✅/❌ de los campos, que quedan como registro de la última verificación de esa pestaña) al cambiar de pestaña activa, para no mostrar un contador que ya no corresponde a la pestaña visible.

### Botón "Verificar"

Solo existe en la ficha cuando `state.caseMode === 'practice'` y hay un caso cargado (`renderCaseVignette` no lo genera si `activeCaseId` es `null` o el modo es demo). Es repetible: el alumno puede ajustar valores y volver a pulsarlo cuantas veces quiera.

---

## Casos límite

- Cambiar de pestaña sin recargar el caso: los valores y las marcas de verificación de cada pestaña persisten tal como estaban (solo se limpia el contador `#verify-summary`, no las marcas ✅/❌ de los campos).
- "Entrada manual" en cualquier modo: limpia selección de chip y oculta la ficha, **sin** tocar `state.fram/score2/assign/qrisk/acsm` — comportamiento sin cambios respecto a hoy.
- Cambiar de caso (clic en otra chip) o de modo siempre llama a `clearCase()`/reinicia, así que nunca queda una ficha o marcas de un caso distinto al que está activo.
- "Verificar" sin caso cargado: no debería poder ocurrir porque el botón solo se renderiza con un caso activo; aun así, `verifyActiveTab()` retorna temprano si `activeCaseId` es `null`.
- FITT y Killip-Kimball no cambian de comportamiento en ningún modo.

---

## Fuera de alcance

- No se modifica `data/cases-riesgo-cv.js` ni `modules/clase-11.html`.
- No hay persistencia (localStorage) del modo, del caso activo ni de los resultados de verificación entre recargas de página — todo el módulo ya funciona así (estado en memoria únicamente).
- No hay un "modo examen" con puntaje acumulado entre varios casos ni historial de intentos — el contador es por verificación individual de la pestaña activa, sin guardar nada.
- No se añade validación de rango ni mensajes de error — los controles ya están limitados por sus propios `min`/`max` de slider.

---

## Testing

Proyecto sin framework de pruebas (vanilla JS, sin build). Verificación:
1. Estructural (Python): existencia de `state.caseMode`, `deriveCaseFields`, `resetAllScalesToDefault`, `verifyActiveTab`, `clearVerifyMarks`, botones de modo.
2. Lógica (Node): para 2-3 casos, confirmar que `deriveCaseFields(c)[escala]` coincide exactamente con lo que hoy escribe `applyCaseToScales` en `state` (regresión — el refactor no debe cambiar el resultado del modo demostración).
3. Manual en navegador: activar modo práctica, cargar un caso, confirmar que los sliders NO se mueven y aparece la ficha con cifras; ajustar manualmente algunos valores correctos y otros incorrectos; pulsar "Verificar" y confirmar que cada campo se marca correctamente con ✅/❌ y el contador coincide; cambiar de pestaña y confirmar que el contador se limpia pero las marcas de la pestaña anterior siguen ahí al volver; volver a modo demostración y confirmar que el comportamiento de autocompletado es exactamente el de antes.

---

## Commit esperado

`feat: agregar modo practica a los casos clinicos de riesgo_cv (verificacion campo por campo)`
