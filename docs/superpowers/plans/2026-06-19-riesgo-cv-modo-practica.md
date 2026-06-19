# Modo Práctica para Casos Clínicos de Riesgo CV — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Modo práctica" to the case selector in `modules/riesgo_cv.html` so a student can select one of the 10 preconfigured cases, see its full clinical data, manually set the controls on each scale themselves, and verify their answers field-by-field against the case's real values — without changing the existing "Modo demostración" (autofill) behavior at all.

**Architecture:** Extract the existing case→scale mapping logic (`applyCaseToScales`) into a pure function `deriveCaseFields(c)` reused by both modes. Add a `state.caseMode` toggle that branches `loadCase()` between autofill (demo) and reset-to-neutral (practice). Add a self-contained field-by-field comparison engine (`compareCaseFields`, pure logic) plus DOM-marking helpers (`verifyActiveTab`, `markField`) that compare the student's current inputs against `deriveCaseFields(c)` for the active tab only.

**Tech Stack:** Vanilla HTML/CSS/JS, no build step, no framework. Single file modified: `modules/riesgo_cv.html`.

## Global Constraints

- No `import`/`export` anywhere — plain global-scope function declarations, consistent with the rest of the file.
- All new UI text in Spanish.
- Only `modules/riesgo_cv.html` is modified. `data/cases-riesgo-cv.js` and `modules/clase-11.html` are NOT touched — the ficha clínica reuses fields already present in `RIESGO_CV_CASES`.
- `applyCaseToScales(c)`'s behavior in "Modo demostración" must remain byte-for-byte identical to its current shipped behavior — every refactor step is regression-tested against the current logic before being trusted.
- SCORE2's `region` field is never part of `deriveCaseFields(c)`'s output and is never reset/overwritten by either `applyCaseToScales` or `resetAllScalesToDefault` — it is a population/context choice, not patient data (existing rule, must keep holding).
- ASSIGN's `cigsPerDay` is excluded from field-by-field verification whenever the case's correct `smoking` value is `false` (the slider is disabled and irrelevant to the calculation in that state).
- ACSM has no sliders for its graded fields except `age` — all other graded fields are checkboxes.
- Switching case-mode or selecting a different case always clears the current case selection state cleanly (no leftover ficha, marks, or stale chip highlighting from a previous case).

---

### Task 1: Refactor de inicialización de estado (`DEFAULT_SCALE_STATE`, `caseMode`, `activeCaseId`)

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: ninguno nuevo.
- Produces: `DEFAULT_SCALE_STATE` (objeto global con los 5 slices de estado por defecto), `state.caseMode` ('demo'|'practice'), `state.activeCaseId` (number|null).

- [ ] **Step 1: Extraer los valores por defecto a `DEFAULT_SCALE_STATE`**

Localizar:
```js
// ── State ─────────────────────────────────────────────────────────────
const state = {
  activeScale: 'fram',
  lastNumericRisk: null,
  fram: { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false },
  score2: { sex:'M', age:55, sbp:140, tc:200, hdl:50, smoking:false, region:'low' },
  assign: { sex:'M', age:50, sbp:135, tc:210, hdl:48, smoking:false, cigsPerDay:10, famHist:false, diabetes:false, ses:4 },
  qrisk: { sex:'M', age:55, ethnicity:'white', bmi:26, sbp:135, tc:200, hdl:50, smokingCat:0, diabetes:'none', famHist:false, afib:false, ckd:false },
  acsm: { sex:'M', age:50, famHist:false, smoking:false, sedentary:false, obesity:false, htn:false, dyslipidemia:false, prediabetes:false, highHdl:false, knownDisease:false, symptoms:false },
  killip: null,
};
```
Reemplazar:
```js
// ── State ─────────────────────────────────────────────────────────────
const DEFAULT_SCALE_STATE = {
  fram: { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false },
  score2: { sex:'M', age:55, sbp:140, tc:200, hdl:50, smoking:false, region:'low' },
  assign: { sex:'M', age:50, sbp:135, tc:210, hdl:48, smoking:false, cigsPerDay:10, famHist:false, diabetes:false, ses:4 },
  qrisk: { sex:'M', age:55, ethnicity:'white', bmi:26, sbp:135, tc:200, hdl:50, smokingCat:0, diabetes:'none', famHist:false, afib:false, ckd:false },
  acsm: { sex:'M', age:50, famHist:false, smoking:false, sedentary:false, obesity:false, htn:false, dyslipidemia:false, prediabetes:false, highHdl:false, knownDisease:false, symptoms:false },
};

const state = {
  activeScale: 'fram',
  lastNumericRisk: null,
  caseMode: 'demo',
  activeCaseId: null,
  fram: { ...DEFAULT_SCALE_STATE.fram },
  score2: { ...DEFAULT_SCALE_STATE.score2 },
  assign: { ...DEFAULT_SCALE_STATE.assign },
  qrisk: { ...DEFAULT_SCALE_STATE.qrisk },
  acsm: { ...DEFAULT_SCALE_STATE.acsm },
  killip: null,
};
```

- [ ] **Step 2: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("DEFAULT_SCALE_STATE declarado", "const DEFAULT_SCALE_STATE = {" in html),
    ("state.caseMode default demo", "caseMode: 'demo'," in html),
    ("state.activeCaseId default null", "activeCaseId: null," in html),
    ("state.fram usa spread de DEFAULT_SCALE_STATE", "fram: { ...DEFAULT_SCALE_STATE.fram }," in html),
    ("state.acsm usa spread de DEFAULT_SCALE_STATE", "acsm: { ...DEFAULT_SCALE_STATE.acsm }," in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Verificación de regresión (Node) — los valores por defecto no cambiaron**

```javascript
// D:/modfisioresp/_tmp_verify_task1.js
const fs = require('fs');
const html = fs.readFileSync('D:/modfisioresp/modules/riesgo_cv.html', 'utf-8');
const start = html.indexOf('const DEFAULT_SCALE_STATE');
const end = html.indexOf('function showTab');
const snippet = html.slice(start, end);
const result = eval(snippet + '\n({state, DEFAULT_SCALE_STATE})');
const { state, DEFAULT_SCALE_STATE } = result;

const expectedFram   = { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false };
const expectedScore2 = { sex:'M', age:55, sbp:140, tc:200, hdl:50, smoking:false, region:'low' };
const expectedAssign = { sex:'M', age:50, sbp:135, tc:210, hdl:48, smoking:false, cigsPerDay:10, famHist:false, diabetes:false, ses:4 };
const expectedQrisk  = { sex:'M', age:55, ethnicity:'white', bmi:26, sbp:135, tc:200, hdl:50, smokingCat:0, diabetes:'none', famHist:false, afib:false, ckd:false };
const expectedAcsm   = { sex:'M', age:50, famHist:false, smoking:false, sedentary:false, obesity:false, htn:false, dyslipidemia:false, prediabetes:false, highHdl:false, knownDisease:false, symptoms:false };

const checks = [
  ['DEFAULT_SCALE_STATE.fram sin cambios', JSON.stringify(DEFAULT_SCALE_STATE.fram) === JSON.stringify(expectedFram)],
  ['DEFAULT_SCALE_STATE.score2 sin cambios', JSON.stringify(DEFAULT_SCALE_STATE.score2) === JSON.stringify(expectedScore2)],
  ['DEFAULT_SCALE_STATE.assign sin cambios', JSON.stringify(DEFAULT_SCALE_STATE.assign) === JSON.stringify(expectedAssign)],
  ['DEFAULT_SCALE_STATE.qrisk sin cambios', JSON.stringify(DEFAULT_SCALE_STATE.qrisk) === JSON.stringify(expectedQrisk)],
  ['DEFAULT_SCALE_STATE.acsm sin cambios', JSON.stringify(DEFAULT_SCALE_STATE.acsm) === JSON.stringify(expectedAcsm)],
  ['state.fram clona DEFAULT_SCALE_STATE.fram (no es la misma referencia)', JSON.stringify(state.fram) === JSON.stringify(expectedFram) && state.fram !== DEFAULT_SCALE_STATE.fram],
  ['state.caseMode === "demo"', state.caseMode === 'demo'],
  ['state.activeCaseId === null', state.activeCaseId === null],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task1.js`
Expected: las 8 comparaciones imprimen OK.

- [ ] **Step 4: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task1.js
git add modules/riesgo_cv.html
git commit -m "refactor: extraer DEFAULT_SCALE_STATE y agregar caseMode/activeCaseId al estado"
```

---

### Task 2: Refactor `applyCaseToScales` → `deriveCaseFields` puro (sin cambiar resultado)

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: `DEFAULT_SCALE_STATE` (Task 1, no se usa aquí directamente pero comparte el mismo bloque de estado).
- Produces: `deriveCaseFields(c)` → `{fram, score2, assign, qrisk, acsm}` (función pura, sin efectos secundarios). `applyCaseToScales(c)` mantiene su firma e idéntico efecto observable.

- [ ] **Step 1: Extraer la lógica de mapeo a `deriveCaseFields`**

Localizar:
```js
// ── Casos clinicos preconfigurados ──────────────────────────────────────
function smokingCatFor(s){
  if (s.status === 'never') return 0;
  if (s.status === 'ex') return 1;
  return s.cigsPerDay < 10 ? 2 : s.cigsPerDay < 20 ? 3 : 4;
}

function applyCaseToScales(c){
  const isCurrent = c.smoking.status === 'current';
  const acsmSmoking = isCurrent || (c.smoking.status === 'ex' && c.smoking.quitMonthsAgo != null && c.smoking.quitMonthsAgo < 6);

  state.fram = { sex:c.sex, age:c.age, tc:c.tc, hdl:c.hdl, sbp:c.sbp, bpTreated:c.bpTreated, smoking:isCurrent };

  state.score2 = { ...state.score2, sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent };
  // region NO se sobreescribe — se mantiene la seleccion previa del usuario

  state.assign = { sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent,
    cigsPerDay:c.smoking.cigsPerDay||0, famHist:c.famHist, diabetes:c.diabetes!=='none', ses:c.ses };

  state.qrisk = { sex:c.sex, age:c.age, ethnicity:c.ethnicity, bmi:c.bmi, sbp:c.sbp, tc:c.tc, hdl:c.hdl,
    smokingCat:smokingCatFor(c.smoking), diabetes:c.diabetes, famHist:c.famHist, afib:c.afib, ckd:c.ckd };

  state.acsm = { sex:c.sex, age:c.age, famHist:c.famHist, smoking:acsmSmoking, sedentary:c.sedentary,
    obesity:c.bmi>=30, htn:c.sbp>=130||c.bpTreated, dyslipidemia:c.hdl<40||c.dyslipidemiaTx||c.tc>=200,
    prediabetes:!!c.prediabetic, highHdl:c.hdl>=60,
    knownDisease:(c.diabetes!=='none')||c.ckd, symptoms:false };

  syncAllInputsFromState();
  updateFram(); updateScore2(); updateAssign(); updateQrisk(); updateAcsm();
  renderFITT();
}
```
Reemplazar:
```js
// ── Casos clinicos preconfigurados ──────────────────────────────────────
function smokingCatFor(s){
  if (s.status === 'never') return 0;
  if (s.status === 'ex') return 1;
  return s.cigsPerDay < 10 ? 2 : s.cigsPerDay < 20 ? 3 : 4;
}

function deriveCaseFields(c){
  const isCurrent = c.smoking.status === 'current';
  const acsmSmoking = isCurrent || (c.smoking.status === 'ex' && c.smoking.quitMonthsAgo != null && c.smoking.quitMonthsAgo < 6);
  return {
    fram: { sex:c.sex, age:c.age, tc:c.tc, hdl:c.hdl, sbp:c.sbp, bpTreated:c.bpTreated, smoking:isCurrent },
    score2: { sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent },
    assign: { sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent,
      cigsPerDay:c.smoking.cigsPerDay||0, famHist:c.famHist, diabetes:c.diabetes!=='none', ses:c.ses },
    qrisk: { sex:c.sex, age:c.age, ethnicity:c.ethnicity, bmi:c.bmi, sbp:c.sbp, tc:c.tc, hdl:c.hdl,
      smokingCat:smokingCatFor(c.smoking), diabetes:c.diabetes, famHist:c.famHist, afib:c.afib, ckd:c.ckd },
    acsm: { sex:c.sex, age:c.age, famHist:c.famHist, smoking:acsmSmoking, sedentary:c.sedentary,
      obesity:c.bmi>=30, htn:c.sbp>=130||c.bpTreated, dyslipidemia:c.hdl<40||c.dyslipidemiaTx||c.tc>=200,
      prediabetes:!!c.prediabetic, highHdl:c.hdl>=60,
      knownDisease:(c.diabetes!=='none')||c.ckd, symptoms:false },
  };
}

function applyCaseToScales(c){
  const fields = deriveCaseFields(c);
  state.fram   = fields.fram;
  state.score2 = { ...state.score2, ...fields.score2 };   // region NO se sobreescribe
  state.assign = fields.assign;
  state.qrisk  = fields.qrisk;
  state.acsm   = fields.acsm;
  syncAllInputsFromState();
  updateFram(); updateScore2(); updateAssign(); updateQrisk(); updateAcsm();
  renderFITT();
}
```

- [ ] **Step 2: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("deriveCaseFields function", "function deriveCaseFields(c){" in html),
    ("applyCaseToScales usa deriveCaseFields", "const fields = deriveCaseFields(c);" in html),
    ("region sigue sin sobreescribirse", "state.score2 = { ...state.score2, ...fields.score2 };" in html),
    ("ya no queda el mapeo inline duplicado en applyCaseToScales", "state.fram = { sex:c.sex, age:c.age, tc:c.tc, hdl:c.hdl, sbp:c.sbp, bpTreated:c.bpTreated, smoking:isCurrent };" not in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Verificación de regresión (Node) — `deriveCaseFields` reproduce exactamente el mapeo anterior para los 10 casos**

```javascript
// D:/modfisioresp/_tmp_verify_task2.js
const fs = require('fs');
const html = fs.readFileSync('D:/modfisioresp/modules/riesgo_cv.html', 'utf-8');
const start = html.indexOf('function smokingCatFor');
const end = html.indexOf('function loadCase');
const snippet = html.slice(start, end);
const { smokingCatFor, deriveCaseFields } = eval(snippet + '\n({smokingCatFor, deriveCaseFields})');

const casesCode = fs.readFileSync('D:/modfisioresp/data/cases-riesgo-cv.js', 'utf-8');
const RIESGO_CV_CASES = eval(casesCode + '\nRIESGO_CV_CASES');

// Referencia: el mapeo que applyCaseToScales aplicaba ANTES de este refactor (Tarea 9 del plan anterior).
function oldMapping(c){
  const isCurrent = c.smoking.status === 'current';
  const acsmSmoking = isCurrent || (c.smoking.status === 'ex' && c.smoking.quitMonthsAgo != null && c.smoking.quitMonthsAgo < 6);
  return {
    fram: { sex:c.sex, age:c.age, tc:c.tc, hdl:c.hdl, sbp:c.sbp, bpTreated:c.bpTreated, smoking:isCurrent },
    score2: { sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent },
    assign: { sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent,
      cigsPerDay:c.smoking.cigsPerDay||0, famHist:c.famHist, diabetes:c.diabetes!=='none', ses:c.ses },
    qrisk: { sex:c.sex, age:c.age, ethnicity:c.ethnicity, bmi:c.bmi, sbp:c.sbp, tc:c.tc, hdl:c.hdl,
      smokingCat:smokingCatFor(c.smoking), diabetes:c.diabetes, famHist:c.famHist, afib:c.afib, ckd:c.ckd },
    acsm: { sex:c.sex, age:c.age, famHist:c.famHist, smoking:acsmSmoking, sedentary:c.sedentary,
      obesity:c.bmi>=30, htn:c.sbp>=130||c.bpTreated, dyslipidemia:c.hdl<40||c.dyslipidemiaTx||c.tc>=200,
      prediabetes:!!c.prediabetic, highHdl:c.hdl>=60,
      knownDisease:(c.diabetes!=='none')||c.ckd, symptoms:false },
  };
}

let allOk = true;
const checks = [];
for (const c of RIESGO_CV_CASES) {
  const a = deriveCaseFields(c);
  const b = oldMapping(c);
  checks.push([`caso ${c.id}: fram identico`, JSON.stringify(a.fram) === JSON.stringify(b.fram)]);
  checks.push([`caso ${c.id}: score2 identico`, JSON.stringify(a.score2) === JSON.stringify(b.score2)]);
  checks.push([`caso ${c.id}: assign identico`, JSON.stringify(a.assign) === JSON.stringify(b.assign)]);
  checks.push([`caso ${c.id}: qrisk identico`, JSON.stringify(a.qrisk) === JSON.stringify(b.qrisk)]);
  checks.push([`caso ${c.id}: acsm identico`, JSON.stringify(a.acsm) === JSON.stringify(b.acsm)]);
}
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
console.log(allOk ? 'TODOS OK ('+checks.length+' comparaciones)' : 'HAY FALLOS');
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task2.js`
Expected: las 50 comparaciones (10 casos × 5 escalas) imprimen OK.

- [ ] **Step 4: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task2.js
git add modules/riesgo_cv.html
git commit -m "refactor: extraer deriveCaseFields puro desde applyCaseToScales"
```

---

### Task 3: Motor de verificación campo por campo

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: `deriveCaseFields(c)` (Task 2), `state.activeScale`, `state.activeCaseId` (Task 1), `RIESGO_CV_CASES` (ya cargado).
- Produces: `compareCaseFields(scale, current, correct)` (función pura), `verifyActiveTab()`, `clearVerifyMarks()`, `markField(scale, field, ok, correctValue)`, `formatCorrectValue(scale, field, value)`, `insertMark(afterId, ok, correctText)`. `clearVerifyMarks()` se invoca como primera línea de `updateFram/Score2/Assign/Qrisk/Acsm()`. `showTab()` limpia el contador `#verify-summary` al cambiar de pestaña.

- [ ] **Step 1: Insertar el motor de verificación antes de la sección de casos clínicos**

Localizar:
```js
// ── Casos clinicos preconfigurados ──────────────────────────────────────
function smokingCatFor(s){
```
Reemplazar:
```js
// ── Verificacion modo practica ───────────────────────────────────────────
const VERIFY_FIELDS = {
  fram:   ['sex','age','tc','hdl','sbp','bpTreated','smoking'],
  score2: ['sex','age','sbp','tc','hdl','smoking'],
  assign: ['sex','age','sbp','tc','hdl','smoking','cigsPerDay','famHist','diabetes','ses'],
  qrisk:  ['sex','age','ethnicity','bmi','sbp','tc','hdl','smokingCat','diabetes','famHist','afib','ckd'],
  acsm:   ['sex','age','famHist','smoking','sedentary','obesity','htn','dyslipidemia','prediabetes','highHdl','knownDisease','symptoms'],
};

const VERIFY_FIELD_ID = {
  fram:   { age:'fram-v-age', tc:'fram-v-tc', hdl:'fram-v-hdl', sbp:'fram-v-sbp', bpTreated:'fram-ck-treated', smoking:'fram-ck-smoke' },
  score2: { age:'score2-v-age', sbp:'score2-v-sbp', tc:'score2-v-tc', hdl:'score2-v-hdl', smoking:'score2-ck-smoke' },
  assign: { age:'assign-v-age', sbp:'assign-v-sbp', tc:'assign-v-tc', hdl:'assign-v-hdl', smoking:'assign-ck-smoke',
            cigsPerDay:'assign-v-cigs', famHist:'assign-ck-famhist', diabetes:'assign-ck-diabetes', ses:'assign-v-ses' },
  qrisk:  { age:'qrisk-v-age', ethnicity:'qrisk-sel-ethnicity', bmi:'qrisk-v-bmi', sbp:'qrisk-v-sbp', tc:'qrisk-v-tc', hdl:'qrisk-v-hdl',
            smokingCat:'qrisk-sel-smoking', diabetes:'qrisk-sel-diabetes', famHist:'qrisk-ck-famhist', afib:'qrisk-ck-afib', ckd:'qrisk-ck-ckd' },
  acsm:   { age:'acsm-v-age', famHist:'acsm-ck-famhist', smoking:'acsm-ck-smoke', sedentary:'acsm-ck-sedentary', obesity:'acsm-ck-obesity', htn:'acsm-ck-htn',
            dyslipidemia:'acsm-ck-dyslipidemia', prediabetes:'acsm-ck-prediabetes', highHdl:'acsm-ck-highhdl',
            knownDisease:'acsm-ck-knowndisease', symptoms:'acsm-ck-symptoms' },
};

const VERIFY_BOOL_FIELDS = new Set(['bpTreated','smoking','famHist','afib','ckd','sedentary','obesity','htn','dyslipidemia','prediabetes','highHdl','knownDisease','symptoms']);
const VERIFY_UNIT = { age:' años', tc:' mg/dL', hdl:' mg/dL', sbp:' mmHg', cigsPerDay:' cig/día' };
const VERIFY_SELECT_ID = { ethnicity:'qrisk-sel-ethnicity', smokingCat:'qrisk-sel-smoking', diabetes:'qrisk-sel-diabetes' };

function formatCorrectValue(scale, field, value){
  if (field === 'sex') return value === 'M' ? 'Hombre' : 'Mujer';
  if (scale === 'assign' && field === 'diabetes') return value ? 'sí' : 'no';
  if (scale === 'qrisk' && VERIFY_SELECT_ID[field]){
    const opt = document.querySelector('#'+VERIFY_SELECT_ID[field]+' option[value="'+value+'"]');
    return opt ? opt.textContent : String(value);
  }
  if (VERIFY_BOOL_FIELDS.has(field)) return value ? 'sí' : 'no';
  return value + (VERIFY_UNIT[field] || '');
}

function insertMark(afterId, ok, correctText){
  const el = document.getElementById(afterId);
  if (!el) return;
  const mark = document.createElement('span');
  mark.className = 'verify-mark';
  mark.style.marginLeft = '4px';
  mark.style.fontSize = '12px';
  mark.style.color = ok ? '#4ade80' : '#f87171';
  mark.textContent = ok ? '✅' : '❌ (correcto: '+correctText+')';
  el.insertAdjacentElement('afterend', mark);
}

function markField(scale, field, ok, correctValue){
  if (field === 'sex'){ insertMark(scale+'-btn-F', ok, formatCorrectValue(scale,'sex',correctValue)); return; }
  insertMark(VERIFY_FIELD_ID[scale][field], ok, formatCorrectValue(scale, field, correctValue));
}

function clearVerifyMarks(){
  document.querySelectorAll('.verify-mark').forEach(m => m.remove());
}

function compareCaseFields(scale, current, correct){
  let fields = VERIFY_FIELDS[scale].slice();
  if (scale === 'assign' && !correct.smoking) fields = fields.filter(f => f !== 'cigsPerDay');
  const results = fields.map(f => ({ field:f, ok: current[f] === correct[f], correctValue: correct[f] }));
  const okCount = results.filter(r => r.ok).length;
  return { results, okCount, total: fields.length };
}

function verifyActiveTab(){
  if (state.activeCaseId == null) return;
  const c = RIESGO_CV_CASES.find(x => x.id === state.activeCaseId);
  const scale = state.activeScale;
  const correct = deriveCaseFields(c)[scale];
  const current = state[scale];
  clearVerifyMarks();

  const { results, okCount, total } = compareCaseFields(scale, current, correct);
  results.forEach(r => markField(scale, r.field, r.ok, r.correctValue));

  const summary = document.getElementById('verify-summary');
  if (summary) summary.textContent = okCount+'/'+total+' correctos en esta pestaña';
}

// ── Casos clinicos preconfigurados ──────────────────────────────────────
function smokingCatFor(s){
```

- [ ] **Step 2: Limpiar marcas obsoletas en cada `updateXxx()` y al cambiar de pestaña**

Localizar:
```js
function updateScore2(){
```
Reemplazar:
```js
function updateScore2(){
  clearVerifyMarks();
```

Localizar:
```js
function updateAssign(){
```
Reemplazar:
```js
function updateAssign(){
  clearVerifyMarks();
```

Localizar:
```js
function updateQrisk(){
```
Reemplazar:
```js
function updateQrisk(){
  clearVerifyMarks();
```

Localizar:
```js
function updateAcsm(){
```
Reemplazar:
```js
function updateAcsm(){
  clearVerifyMarks();
```

Localizar:
```js
function updateFram(){
  const {pts,bd,risk}=calcFram(state.fram);
```
Reemplazar:
```js
function updateFram(){
  clearVerifyMarks();
  const {pts,bd,risk}=calcFram(state.fram);
```

Localizar:
```js
function showTab(id, el){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  el.classList.add('active');
  state.activeScale = id;
  renderFITT();
}
```
Reemplazar:
```js
function showTab(id, el){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  el.classList.add('active');
  state.activeScale = id;
  const summary = document.getElementById('verify-summary');
  if (summary) summary.textContent = '';
  renderFITT();
}
```

- [ ] **Step 3: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("VERIFY_FIELDS declarado", "const VERIFY_FIELDS = {" in html),
    ("VERIFY_FIELD_ID declarado", "const VERIFY_FIELD_ID = {" in html),
    ("compareCaseFields function", "function compareCaseFields(scale, current, correct){" in html),
    ("verifyActiveTab function", "function verifyActiveTab(){" in html),
    ("clearVerifyMarks function", "function clearVerifyMarks(){" in html),
    ("markField function", "function markField(scale, field, ok, correctValue){" in html),
    ("formatCorrectValue function", "function formatCorrectValue(scale, field, value){" in html),
    ("clearVerifyMarks invocado al menos 5 veces (uno por updateXxx)", html.count("clearVerifyMarks();") >= 5),
    ("showTab limpia verify-summary", "if (summary) summary.textContent = '';" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 4: Verificación de lógica pura (Node)**

```javascript
// D:/modfisioresp/_tmp_verify_task3.js
const fs = require('fs');
const html = fs.readFileSync('D:/modfisioresp/modules/riesgo_cv.html', 'utf-8');
const start = html.indexOf('const VERIFY_FIELDS');
const end = html.indexOf('// ── Casos clinicos preconfigurados');
const snippet = html.slice(start, end);
const { VERIFY_FIELDS, VERIFY_FIELD_ID, compareCaseFields } = eval(snippet + '\n({VERIFY_FIELDS, VERIFY_FIELD_ID, compareCaseFields})');

const checks = [];

// 1. Todo campo de VERIFY_FIELDS (excepto 'sex') tiene un id mapeado en VERIFY_FIELD_ID
for (const scale of Object.keys(VERIFY_FIELDS)) {
  for (const f of VERIFY_FIELDS[scale]) {
    if (f === 'sex') continue;
    const ok = VERIFY_FIELD_ID[scale] && VERIFY_FIELD_ID[scale][f] != null;
    checks.push([`${scale}.${f} tiene id mapeado en VERIFY_FIELD_ID`, ok]);
  }
}

// 2. compareCaseFields: todo correcto
const r1 = compareCaseFields('fram', {sex:'M',age:58,tc:215,hdl:41,sbp:158,bpTreated:false,smoking:true}, {sex:'M',age:58,tc:215,hdl:41,sbp:158,bpTreated:false,smoking:true});
checks.push(['fram todo correcto -> okCount===total', r1.okCount === r1.total]);

// 3. compareCaseFields: un campo incorrecto
const r2 = compareCaseFields('fram', {sex:'M',age:58,tc:215,hdl:41,sbp:140,bpTreated:false,smoking:true}, {sex:'M',age:58,tc:215,hdl:41,sbp:158,bpTreated:false,smoking:true});
checks.push(['fram un campo incorrecto (sbp) -> okCount===total-1', r2.okCount === r2.total - 1]);

// 4. ASSIGN excluye cigsPerDay si el caso correcto no es fumador
const r3 = compareCaseFields('assign', {sex:'M',age:50,sbp:135,tc:210,hdl:48,smoking:false,cigsPerDay:99,famHist:false,diabetes:false,ses:4}, {sex:'M',age:50,sbp:135,tc:210,hdl:48,smoking:false,cigsPerDay:0,famHist:false,diabetes:false,ses:4});
checks.push(['assign no-fumador excluye cigsPerDay del resultado', !r3.results.some(x => x.field === 'cigsPerDay')]);
checks.push(['assign no-fumador con cigsPerDay distinto da okCount===total', r3.okCount === r3.total]);

// 5. ASSIGN incluye cigsPerDay si el caso correcto es fumador, y lo cuenta como error si no coincide
const r4 = compareCaseFields('assign', {sex:'M',age:50,sbp:135,tc:210,hdl:48,smoking:true,cigsPerDay:5,famHist:false,diabetes:false,ses:4}, {sex:'M',age:50,sbp:135,tc:210,hdl:48,smoking:true,cigsPerDay:20,famHist:false,diabetes:false,ses:4});
checks.push(['assign fumador incluye cigsPerDay en el resultado', r4.results.some(x => x.field === 'cigsPerDay')]);
checks.push(['assign fumador cigsPerDay incorrecto cuenta como error', r4.okCount === r4.total - 1]);

// 6. ACSM: todos los campos coinciden
const acsmCorrect = {sex:'M',age:60,famHist:false,smoking:false,sedentary:true,obesity:true,htn:false,dyslipidemia:false,prediabetes:false,highHdl:false,knownDisease:false,symptoms:false};
const r5 = compareCaseFields('acsm', {...acsmCorrect}, acsmCorrect);
checks.push(['acsm todo correcto -> okCount===total (12 campos)', r5.okCount === r5.total && r5.total === 12]);

let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
console.log(allOk ? 'TODOS OK ('+checks.length+' comparaciones)' : 'HAY FALLOS');
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task3.js`
Expected: todas las comparaciones imprimen OK (la cantidad exacta depende del total de campos en `VERIFY_FIELDS`, son 50 campos repartidos en 5 escalas más 6 comparaciones funcionales).

- [ ] **Step 5: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task3.js
git add modules/riesgo_cv.html
git commit -m "feat: agregar motor de verificacion campo por campo para modo practica"
```

---

### Task 4: Toggle de modo, reset a valores neutros y ficha clínica

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: `DEFAULT_SCALE_STATE` (Task 1), `deriveCaseFields`/`applyCaseToScales` (Task 2), `verifyActiveTab` (Task 3, referenciado desde el HTML generado — debe existir ya).
- Produces: `setCaseMode(mode)`, `resetAllScalesToDefault()`, `renderCaseVignette(c)`, `renderFichaClinica(c)`. `loadCase(id)` y `clearCase()` quedan modificadas; `state.activeCaseId` se actualiza en ambas.

- [ ] **Step 1: Agregar el toggle de modo en el HTML**

Localizar:
```html
  <div class="group-label" style="margin-top:.5rem">Casos clínicos preconfigurados</div>
  <div id="case-chips" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:.75rem"></div>
  <div id="case-vignette" style="display:none;font-size:12.5px;color:var(--text2);background:rgba(244,114,182,.06);border:1px solid rgba(244,114,182,.2);border-radius:var(--rs);padding:.6rem .9rem;margin-bottom:1.25rem;line-height:1.5"></div>
```
Reemplazar:
```html
  <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-top:.5rem">
    <div class="group-label" style="margin:0">Casos clínicos preconfigurados</div>
    <div style="display:flex;gap:4px">
      <button class="tbtn on" id="mode-btn-demo" onclick="setCaseMode('demo')">Demostración</button>
      <button class="tbtn" id="mode-btn-practice" onclick="setCaseMode('practice')">Práctica</button>
    </div>
  </div>
  <div id="case-chips" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:.75rem;margin-top:.5rem"></div>
  <div id="case-vignette" style="display:none;font-size:12.5px;color:var(--text2);background:rgba(244,114,182,.06);border:1px solid rgba(244,114,182,.2);border-radius:var(--rs);padding:.6rem .9rem;margin-bottom:1.25rem;line-height:1.5"></div>
```

- [ ] **Step 2: Reemplazar `loadCase`/`clearCase` y agregar las funciones nuevas**

Localizar:
```js
function loadCase(id){
  const c = RIESGO_CV_CASES.find(x => x.id === id);
  if (!c) return;
  applyCaseToScales(c);
  document.querySelectorAll('.case-chip').forEach(ch => ch.classList.remove('on'));
  document.getElementById('case-chip-'+id).classList.add('on');
  const v = document.getElementById('case-vignette');
  v.style.display='block';
  v.innerHTML = '<strong>'+c.name+'</strong> · '+c.age+' años · '+(c.sex==='M'?'Hombre':'Mujer')+'<br>'+c.vignette;
}

function clearCase(){
  document.querySelectorAll('.case-chip').forEach(ch => ch.classList.remove('on'));
  document.getElementById('case-vignette').style.display='none';
}
```
Reemplazar:
```js
function loadCase(id){
  const c = RIESGO_CV_CASES.find(x => x.id === id);
  if (!c) return;
  state.activeCaseId = id;
  document.querySelectorAll('.case-chip').forEach(ch => ch.classList.remove('on'));
  document.getElementById('case-chip-'+id).classList.add('on');

  if (state.caseMode === 'demo') {
    applyCaseToScales(c);
  } else {
    resetAllScalesToDefault();
  }
  renderCaseVignette(c);
}

function clearCase(){
  state.activeCaseId = null;
  document.querySelectorAll('.case-chip').forEach(ch => ch.classList.remove('on'));
  document.getElementById('case-vignette').style.display='none';
}

function setCaseMode(mode){
  if (state.caseMode === mode) return;
  state.caseMode = mode;
  document.getElementById('mode-btn-demo').className='tbtn'+(mode==='demo'?' on':'');
  document.getElementById('mode-btn-practice').className='tbtn'+(mode==='practice'?' on':'');
  clearCase();
}

function resetAllScalesToDefault(){
  state.fram   = { ...DEFAULT_SCALE_STATE.fram };
  state.score2 = { ...DEFAULT_SCALE_STATE.score2, region: state.score2.region };
  state.assign = { ...DEFAULT_SCALE_STATE.assign };
  state.qrisk  = { ...DEFAULT_SCALE_STATE.qrisk };
  state.acsm   = { ...DEFAULT_SCALE_STATE.acsm };
  syncAllInputsFromState();
  updateFram(); updateScore2(); updateAssign(); updateQrisk(); updateAcsm();
  renderFITT();
}

function renderCaseVignette(c){
  const v = document.getElementById('case-vignette');
  v.style.display = 'block';
  const header = '<strong>'+c.name+'</strong> · '+c.age+' años · '+(c.sex==='M'?'Hombre':'Mujer')+'<br>'+c.vignette;
  if (state.caseMode === 'demo') {
    v.innerHTML = header;
  } else {
    v.innerHTML = header + renderFichaClinica(c)
      + '<div style="margin-top:.6rem">'
      + '<button class="tbtn" onclick="verifyActiveTab()">Verificar</button> '
      + '<span id="verify-summary" style="margin-left:.5rem;font-weight:600"></span>'
      + '</div>';
  }
}

function renderFichaClinica(c){
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

- [ ] **Step 3: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("toggle demo button", 'id="mode-btn-demo"' in html),
    ("toggle practice button", 'id="mode-btn-practice"' in html),
    ("setCaseMode function", "function setCaseMode(mode){" in html),
    ("resetAllScalesToDefault function", "function resetAllScalesToDefault(){" in html),
    ("renderCaseVignette function", "function renderCaseVignette(c){" in html),
    ("renderFichaClinica function", "function renderFichaClinica(c){" in html),
    ("loadCase setea activeCaseId", "state.activeCaseId = id;" in html),
    ("clearCase limpia activeCaseId", "state.activeCaseId = null;" in html),
    ("loadCase rama por modo", "if (state.caseMode === 'demo') {" in html),
    ("region no se resetea en practica", "score2: { ...DEFAULT_SCALE_STATE.score2, region: state.score2.region };" in html),
    ("boton Verificar referenciado", "onclick=\"verifyActiveTab()\"" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 4: Verificación de lógica pura (Node) — `renderFichaClinica` genera el texto esperado**

```javascript
// D:/modfisioresp/_tmp_verify_task4.js
const fs = require('fs');
const html = fs.readFileSync('D:/modfisioresp/modules/riesgo_cv.html', 'utf-8');
const start = html.indexOf('function renderFichaClinica');
const end = html.indexOf('// ── Init');
const snippet = 'function renderFichaClinica' + html.slice(start + 'function renderFichaClinica'.length, end);
const { renderFichaClinica } = eval(snippet + '\n({renderFichaClinica})');

const casesCode = fs.readFileSync('D:/modfisioresp/data/cases-riesgo-cv.js', 'utf-8');
const RIESGO_CV_CASES = eval(casesCode + '\nRIESGO_CV_CASES');

const c1  = RIESGO_CV_CASES.find(c => c.id === 1);  // never
const c2  = RIESGO_CV_CASES.find(c => c.id === 2);  // ex, quitMonthsAgo:60
const c4  = RIESGO_CV_CASES.find(c => c.id === 4);  // current, 20 cig/día
const c10 = RIESGO_CV_CASES.find(c => c.id === 10); // prediabetic:true

const checks = [
  ['caso 1 (never) dice "no fumador"', renderFichaClinica(c1).includes('no fumador')],
  ['caso 2 (ex) dice "exfumador (hace 60 meses)"', renderFichaClinica(c2).includes('exfumador (hace 60 meses)')],
  ['caso 4 (current) dice "fumador activo, 20 cig/día"', renderFichaClinica(c4).includes('fumador activo, 20 cig/día')],
  ['caso 4 incluye PAS 158 mmHg', renderFichaClinica(c4).includes('158 mmHg')],
  ['caso 10 incluye sufijo Prediabético: sí', renderFichaClinica(c10).includes('Prediabético: sí')],
  ['caso 1 NO incluye sufijo Prediabético (no aplica)', !renderFichaClinica(c1).includes('Prediabético')],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task4.js`
Expected: las 6 comparaciones imprimen OK.

- [ ] **Step 5: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task4.js
git add modules/riesgo_cv.html
git commit -m "feat: agregar toggle de modo practica, reset a valores neutros y ficha clinica"
```

---

### Task 5: Verificación manual completa + commit final

**Files:**
- Ninguno (solo verificación end-to-end de lo construido en Tasks 1–4).

- [ ] **Step 1: Levantar el servidor y abrir el módulo**

```bash
python -m http.server 8000
```
Abrir `http://localhost:8000/` → Clase 11 → módulo "Riesgo Cardiovascular y Prescripción FITT".

- [ ] **Step 2: Confirmar que Modo Demostración no cambió**

Con "Demostración" activo (por defecto), cargar 2-3 casos y confirmar que el autocompletado de las 5 pestañas funciona exactamente igual que antes de este plan (sliders se mueven solos, gauges se actualizan, viñeta solo narrativa sin ficha de datos ni botón Verificar).

- [ ] **Step 3: Probar el flujo completo de Modo Práctica**

1. Pulsar "Práctica". Confirmar que la selección de caso anterior se limpia (vigneta oculta, ningún chip marcado).
2. Cargar "Caso 4" (Jorge Paredes). Confirmar que los sliders/checkboxes de las 5 pestañas **no se mueven** — quedan en sus valores por defecto — y que aparece la ficha clínica con las cifras reales (PAS 158 mmHg, fumador activo 20 cig/día, etc.) más el botón "Verificar".
3. En la pestaña Framingham, ajustar manualmente sexo, edad, PAS, colesterol, HDL, HTA tratada y tabaquismo a los valores correctos de la ficha; dejar uno deliberadamente incorrecto (ej. PAS en 140 en vez de 158).
4. Pulsar "Verificar". Confirmar que los campos correctos muestran ✅, el campo incorrecto muestra "❌ (correcto: 158 mmHg)", y el contador dice "6/7 correctos en esta pestaña".
5. Corregir el campo marcado y pulsar "Verificar" de nuevo: debe pasar a "7/7 correctos".
6. Cambiar a la pestaña QRISK sin recargar el caso: el contador debe estar vacío (pestaña distinta), pero si vuelves a Framingham las marcas ✅ de antes deben seguir visibles.
7. Modificar cualquier slider de Framingham: las marcas ✅/❌ de esa pestaña deben desaparecer inmediatamente (quedan obsoletas).
8. Cargar "Caso 9" (Esperanza Molina, ses:7) en la pestaña ASSIGN: confirmar que el campo `cigsPerDay` (deshabilitado, caso no fumador) no aparece marcado al verificar, y que el contador refleja el total correcto (sin contar ese campo).
9. Cambiar la región SCORE2 a "Alto", luego cargar otro caso en modo práctica: confirmar que la región sigue en "Alto" (no se resetea).
10. Pulsar "Entrada manual": la ficha se oculta pero los valores que el alumno ajustó manualmente permanecen.

- [ ] **Step 4: Verificar responsive**

Reducir el viewport a ~380px. Confirmar que el toggle Demostración/Práctica no rompe el layout de la fila de chips (debe hacer wrap).

- [ ] **Step 5: Verificación final de integridad del archivo (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("DEFAULT_SCALE_STATE", "const DEFAULT_SCALE_STATE = {" in html),
    ("state.caseMode", "caseMode: 'demo'," in html),
    ("state.activeCaseId", "activeCaseId: null," in html),
    ("deriveCaseFields", "function deriveCaseFields(c){" in html),
    ("applyCaseToScales", "function applyCaseToScales(c){" in html),
    ("resetAllScalesToDefault", "function resetAllScalesToDefault(){" in html),
    ("setCaseMode", "function setCaseMode(mode){" in html),
    ("renderCaseVignette", "function renderCaseVignette(c){" in html),
    ("renderFichaClinica", "function renderFichaClinica(c){" in html),
    ("VERIFY_FIELDS", "const VERIFY_FIELDS = {" in html),
    ("VERIFY_FIELD_ID", "const VERIFY_FIELD_ID = {" in html),
    ("compareCaseFields", "function compareCaseFields(scale, current, correct){" in html),
    ("verifyActiveTab", "function verifyActiveTab(){" in html),
    ("clearVerifyMarks invocado >= 5 veces", html.count("clearVerifyMarks();") >= 5),
    ("mode-btn-demo", 'id="mode-btn-demo"' in html),
    ("mode-btn-practice", 'id="mode-btn-practice"' in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 6: Commit final (red de seguridad por si quedó algo suelto)**

```bash
git add -A
git status
git commit -m "feat: completar modo practica con verificacion campo por campo en riesgo_cv" || true
git log --oneline -6
```
Nota: si las Tareas 1–4 ya commitearon todo, `git status` debe mostrar el árbol limpio y `git commit` fallará con "nothing to commit" — el `|| true` evita que eso detenga el script. La decisión de fusionar/push a `origin/master` se toma después, vía el flujo de finishing-a-development-branch — este paso NO empuja a ningún remoto.

---
