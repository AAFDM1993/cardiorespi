# Riesgo CV — SCORE2, ASSIGN, QRISK, ACSM y Casos Clínicos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir `modules/riesgo_cv.html` de una única calculadora Framingham a un módulo con 5 pestañas de riesgo CV (Framingham, SCORE2, ASSIGN, QRISK, ACSM) más un selector de 10 casos clínicos preconfigurados que rellena las 5 a la vez.

**Architecture:** Refactor del archivo único `modules/riesgo_cv.html` (sin build, sin módulos JS) usando el patrón de tabs ya existente en el proyecto (`.ntab`/`.panel`/`.panel.active`, definidos globalmente en `assets/css/fisioresp.css`, con función local `showTab(id, el)` igual que en `modules/calculadoras.html`). Cada escala tiene su propio estado (`state.fram`, `state.score2`, etc.), su propia función de cálculo pura `calcXxx(s)`, y su propio gauge/desglose en el DOM. Killip-Kimball y FITT quedan fuera de las pestañas, compartidos, y leen el riesgo de la pestaña activa vía `getActiveRisk()`. Se crea `data/cases-riesgo-cv.js` con 10 perfiles, cargados con `<script src>` y mapeados a las 5 pestañas con `applyCaseToScales()`.

**Tech Stack:** HTML/CSS/JavaScript vanilla, sin npm ni build. Verificación manual en navegador (`python -m http.server 8000`) + scripts Node.js desechables para validar las funciones de cálculo puras (no hay framework de tests en este proyecto) + scripts Python desechables para verificar presencia de estructura HTML/JS en el archivo.

## Global Constraints

- No usar `import`/`export` — scope global, igual que el resto del proyecto (CLAUDE.md).
- Todo el texto de UI en español.
- Framingham y ACSM siguen sus tablas/criterios oficiales reales (sin aproximar). SCORE2, ASSIGN y QRISK son aproximaciones educativas calibradas (no el algoritmo clínico oficial) — esto debe quedar visible en la UI (Task 7).
- Los 10 casos clínicos asumen prevención primaria (sin ECV establecida): `knownDisease`/`symptoms` siempre `false`.
- Edades de los 10 casos entre 42–68 años (caen dentro del rango de slider de las 5 escalas sin necesidad de clamping).
- Commits frecuentes, uno por tarea. Spec completo en `docs/superpowers/specs/2026-06-18-riesgo-cv-4-escalas-design.md`.

---

## File Map

| Archivo | Acción | Responsabilidad |
|---------|--------|------------------|
| `modules/riesgo_cv.html` | Modificar (Tasks 1–9) | Único archivo del módulo: tabs, 5 calculadoras, casos clínicos, Killip/FITT |
| `data/cases-riesgo-cv.js` | Crear (Task 8) | 10 perfiles clínicos preconfigurados (`RIESGO_CV_CASES`) |
| `modules/clase-11.html` | Modificar (Task 10) | Descripción de la tarjeta del módulo |

---

### Task 1: Infraestructura de tabs + migrar Framingham a `tab-fram`

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Produces: `state.fram` (`{sex,age,tc,hdl,sbp,bpTreated,smoking}`), `state.activeScale` (string), `state.lastNumericRisk` (number|null), `calcFram(s)` → `{pts,bd,risk}`, `updateFram()`, `setSexFram(s)`, `updFram(key,val,lblId,txt)`, `showTab(id,el)` (también fija `state.activeScale` y llama `renderFITT()`), `renderFITT()` (sin cambios de comportamiento todavía — sigue usando solo Framingham).
- Consumes: nada (es la base).

- [ ] **Step 1: Eliminar el CSS que rompe el mecanismo de tabs**

`assets/css/fisioresp.css` ya define globalmente `.panel{display:none} .panel.active{display:block}` y `.ntab`/`.ntab.active` (usado por todos los módulos multi-tab del proyecto, ej. `modules/calculadoras.html`). `riesgo_cv.html` tiene una regla local que anula esto para cualquier `.panel` futuro.

Localizar en el `<style>` (línea 9):
```css
section .panel { display: block; }
```
Eliminar esa línea completa.

- [ ] **Step 2: Agregar pestañas al `<nav>` y quitar la clase `panel` del wrapper exterior**

Localizar:
```html
<nav>
  <div class="nav-logo">🫁 Fisio<span>Resp</span></div>
  <div class="nav-pill">C11–C12 · Riesgo Cardiovascular</div>
</nav>

<section>
<div class="wrap panel">
```
Reemplazar con:
```html
<nav>
  <div class="nav-logo">🫁 Fisio<span>Resp</span></div>
  <div class="ntab active" onclick="showTab('fram',this)">Framingham</div>
  <div class="ntab" onclick="showTab('score2',this)">SCORE2</div>
  <div class="ntab" onclick="showTab('assign',this)">ASSIGN</div>
  <div class="ntab" onclick="showTab('qrisk',this)">QRISK</div>
  <div class="ntab" onclick="showTab('acsm',this)">ACSM</div>
  <div class="nav-pill">C11–C12 · Riesgo Cardiovascular</div>
</nav>

<section>
<div class="wrap">
```

- [ ] **Step 3: Envolver la calculadora Framingham en `<div class="panel active" id="tab-fram">` y renombrar sus ids con prefijo `fram-`**

Localizar el bloque completo (empieza en el comentario `<!-- ── CALCULADORA FRAMINGHAM ── -->`, termina en `</div><!-- /calc-wrap -->`):
```html
  <!-- ── CALCULADORA FRAMINGHAM ── -->
  <div class="group-label" style="margin-top:.5rem">Calculadora Framingham — Score de riesgo a 10 años</div>

  <div class="calc-wrap">

    <!-- form -->
    <div class="form-col">

      <div class="toggle-group">
        <button class="tbtn on" id="btn-M" onclick="setSex('M')">♂ Hombre</button>
        <button class="tbtn" id="btn-F" onclick="setSex('F')">♀ Mujer</button>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">Edad</span>
          <span class="sl-val" id="v-age">52 años</span>
        </div>
        <input type="range" id="sl-age" min="20" max="79" value="52" oninput="upd('age',+this.value,'v-age',this.value+' años')">
        <div class="sl-ticks"><span>20</span><span>40</span><span>60</span><span>79</span></div>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">Colesterol Total</span>
          <span class="sl-val" id="v-tc">215 mg/dL</span>
        </div>
        <input type="range" id="sl-tc" min="100" max="320" value="215" oninput="upd('tc',+this.value,'v-tc',this.value+' mg/dL')">
        <div class="sl-ticks"><span>100</span><span class="sl-ref">Óptimo &lt;200</span><span>240 ↑alto</span><span>320</span></div>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">HDL Colesterol</span>
          <span class="sl-val" id="v-hdl">42 mg/dL</span>
        </div>
        <input type="range" id="sl-hdl" min="20" max="100" value="42" oninput="upd('hdl',+this.value,'v-hdl',this.value+' mg/dL')">
        <div class="sl-ticks"><span>20</span><span class="sl-ref">Bajo &lt;40</span><span>60 óptimo</span><span>100</span></div>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">Presión Arterial Sistólica</span>
          <span class="sl-val" id="v-sbp">145 mmHg</span>
        </div>
        <input type="range" id="sl-sbp" min="90" max="200" value="145" oninput="upd('sbp',+this.value,'v-sbp',this.value+' mmHg')">
        <div class="sl-ticks"><span>90</span><span class="sl-ref">&lt;120 normal</span><span>140 ↑HTA</span><span>200</span></div>
      </div>

      <label class="check-row">
        <input type="checkbox" id="ck-treated" onchange="state.bpTreated=this.checked;update()">
        Hipertensión en tratamiento farmacológico
      </label>
      <label class="check-row">
        <input type="checkbox" id="ck-smoke" onchange="state.smoking=this.checked;update()">
        Fumador/a activo/a
      </label>

    </div><!-- /form-col -->

    <!-- output -->
    <div class="output-col">

      <div id="gauge-wrap">
        <svg id="gauge-svg" viewBox="0 0 200 120" width="200" style="display:block">
          <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="rgba(148,163,184,.12)" stroke-width="14" stroke-linecap="round"/>
          <path id="g-arc" d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="#4ade80" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
          <text id="g-pct" x="100" y="88" text-anchor="middle" font-size="30" font-weight="700" fill="#4ade80" font-family="Space Grotesk,sans-serif">--%</text>
          <text x="100" y="110" text-anchor="middle" font-size="10" fill="rgba(148,163,184,.55)" font-family="Space Grotesk,sans-serif">riesgo a 10 años</text>
          <text x="20" y="115" text-anchor="start" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">BAJO</text>
          <text x="180" y="115" text-anchor="end" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">MUY ALTO</text>
        </svg>
        <div id="g-cat" class="gauge-cat" style="color:#4ade80;border-color:#4ade8044;background:#4ade8010">—</div>
      </div>

      <div class="pts-box">
        <h4>Desglose de puntos</h4>
        <div class="pts-row"><span>Edad</span><span id="bd-age" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Col. Total</span><span id="bd-tc" class="pts-zero">—</span></div>
        <div class="pts-row"><span>HDL Col.</span><span id="bd-hdl" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Presión arterial</span><span id="bd-sbp" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Tabaquismo</span><span id="bd-smoke" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Total</span><span id="bd-total" class="pts-zero">—</span></div>
      </div>

    </div><!-- /output-col -->

  </div><!-- /calc-wrap -->
```
Reemplazar con (mismo contenido, envuelto en el panel y con ids prefijados `fram-`):
```html
  <div class="panel active" id="tab-fram">

  <!-- ── CALCULADORA FRAMINGHAM ── -->
  <div class="group-label" style="margin-top:.5rem">Calculadora Framingham — Score de riesgo a 10 años</div>

  <div class="calc-wrap">

    <!-- form -->
    <div class="form-col">

      <div class="toggle-group">
        <button class="tbtn on" id="fram-btn-M" onclick="setSexFram('M')">♂ Hombre</button>
        <button class="tbtn" id="fram-btn-F" onclick="setSexFram('F')">♀ Mujer</button>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">Edad</span>
          <span class="sl-val" id="fram-v-age">52 años</span>
        </div>
        <input type="range" id="fram-sl-age" min="20" max="79" value="52" oninput="updFram('age',+this.value,'fram-v-age',this.value+' años')">
        <div class="sl-ticks"><span>20</span><span>40</span><span>60</span><span>79</span></div>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">Colesterol Total</span>
          <span class="sl-val" id="fram-v-tc">215 mg/dL</span>
        </div>
        <input type="range" id="fram-sl-tc" min="100" max="320" value="215" oninput="updFram('tc',+this.value,'fram-v-tc',this.value+' mg/dL')">
        <div class="sl-ticks"><span>100</span><span class="sl-ref">Óptimo &lt;200</span><span>240 ↑alto</span><span>320</span></div>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">HDL Colesterol</span>
          <span class="sl-val" id="fram-v-hdl">42 mg/dL</span>
        </div>
        <input type="range" id="fram-sl-hdl" min="20" max="100" value="42" oninput="updFram('hdl',+this.value,'fram-v-hdl',this.value+' mg/dL')">
        <div class="sl-ticks"><span>20</span><span class="sl-ref">Bajo &lt;40</span><span>60 óptimo</span><span>100</span></div>
      </div>

      <div class="sl-row">
        <div class="sl-header">
          <span class="sl-label">Presión Arterial Sistólica</span>
          <span class="sl-val" id="fram-v-sbp">145 mmHg</span>
        </div>
        <input type="range" id="fram-sl-sbp" min="90" max="200" value="145" oninput="updFram('sbp',+this.value,'fram-v-sbp',this.value+' mmHg')">
        <div class="sl-ticks"><span>90</span><span class="sl-ref">&lt;120 normal</span><span>140 ↑HTA</span><span>200</span></div>
      </div>

      <label class="check-row">
        <input type="checkbox" id="fram-ck-treated" onchange="state.fram.bpTreated=this.checked;updateFram()">
        Hipertensión en tratamiento farmacológico
      </label>
      <label class="check-row">
        <input type="checkbox" id="fram-ck-smoke" onchange="state.fram.smoking=this.checked;updateFram()">
        Fumador/a activo/a
      </label>

    </div><!-- /form-col -->

    <!-- output -->
    <div class="output-col">

      <div id="fram-gauge-wrap">
        <svg id="fram-gauge-svg" viewBox="0 0 200 120" width="200" style="display:block">
          <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="rgba(148,163,184,.12)" stroke-width="14" stroke-linecap="round"/>
          <path id="fram-g-arc" d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="#4ade80" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
          <text id="fram-g-pct" x="100" y="88" text-anchor="middle" font-size="30" font-weight="700" fill="#4ade80" font-family="Space Grotesk,sans-serif">--%</text>
          <text x="100" y="110" text-anchor="middle" font-size="10" fill="rgba(148,163,184,.55)" font-family="Space Grotesk,sans-serif">riesgo a 10 años</text>
          <text x="20" y="115" text-anchor="start" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">BAJO</text>
          <text x="180" y="115" text-anchor="end" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">MUY ALTO</text>
        </svg>
        <div id="fram-g-cat" class="gauge-cat" style="color:#4ade80;border-color:#4ade8044;background:#4ade8010">—</div>
      </div>

      <div class="pts-box">
        <h4>Desglose de puntos</h4>
        <div class="pts-row"><span>Edad</span><span id="fram-bd-age" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Col. Total</span><span id="fram-bd-tc" class="pts-zero">—</span></div>
        <div class="pts-row"><span>HDL Col.</span><span id="fram-bd-hdl" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Presión arterial</span><span id="fram-bd-sbp" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Tabaquismo</span><span id="fram-bd-smoke" class="pts-zero">—</span></div>
        <div class="pts-row"><span>Total</span><span id="fram-bd-total" class="pts-zero">—</span></div>
      </div>

    </div><!-- /output-col -->

  </div><!-- /calc-wrap -->
  </div><!-- /tab-fram -->
```

- [ ] **Step 4: Refactorizar el JS — estado namespaced, `calcFram(s)` parametrizada, `showTab`**

Localizar:
```javascript
// ── State ─────────────────────────────────────────────────────────────
const state = { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false, killip:null };

function setSex(s){
  state.sex=s;
  document.getElementById('btn-M').className='tbtn'+(s==='M'?' on':'');
  document.getElementById('btn-F').className='tbtn'+(s==='F'?' on-pink':'');
  update();
}

function upd(key, val, lblId, txt){
  state[key]=val;
  document.getElementById(lblId).textContent=txt;
  update();
}

// ── Framingham 2008 ───────────────────────────────────────────────────
function calcFram(){
  const {sex,age,tc,hdl,sbp,bpTreated,smoking} = state;
```
Reemplazar con:
```javascript
// ── State ─────────────────────────────────────────────────────────────
const state = {
  activeScale: 'fram',
  lastNumericRisk: null,
  fram: { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false },
  killip: null,
};

function showTab(id, el){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  el.classList.add('active');
  state.activeScale = id;
  renderFITT();
}

function setSexFram(s){
  state.fram.sex=s;
  document.getElementById('fram-btn-M').className='tbtn'+(s==='M'?' on':'');
  document.getElementById('fram-btn-F').className='tbtn'+(s==='F'?' on-pink':'');
  updateFram();
}

function updFram(key, val, lblId, txt){
  state.fram[key]=val;
  document.getElementById(lblId).textContent=txt;
  updateFram();
}

// ── Framingham 2008 ───────────────────────────────────────────────────
function calcFram(s){
  const {sex,age,tc,hdl,sbp,bpTreated,smoking} = s;
```

- [ ] **Step 5: Actualizar `updateGauge`, `update` y `renderFITT` para usar ids `fram-` y la firma parametrizada**

Localizar:
```javascript
// ── Gauge ─────────────────────────────────────────────────────────────
function updateGauge(risk){
  const arc=document.getElementById('g-arc');
  const txt=document.getElementById('g-pct');
  const cat=document.getElementById('g-cat');
```
Reemplazar con:
```javascript
// ── Gauge ─────────────────────────────────────────────────────────────
function updateGaugeFram(risk){
  const arc=document.getElementById('fram-g-arc');
  const txt=document.getElementById('fram-g-pct');
  const cat=document.getElementById('fram-g-cat');
```

Localizar:
```javascript
function renderFITT(){
  const {risk}=calcFram();
  document.getElementById('fitt-output').innerHTML=fittHTML(getFITT(risk,state.killip), !!state.killip);
}

function update(){
  const {pts,bd,risk}=calcFram();
  updateGauge(risk);
  // breakdown
  for(const k of['age','tc','hdl','sbp','smoke']){
    const el=document.getElementById('bd-'+k);
    if(!el) return;
    const n=bd[k];
    el.className=n>0?'pts-pos':n<0?'pts-neg':'pts-zero';
    el.textContent=n>0?'+'+n:n;
  }
  const tot=document.getElementById('bd-total');
  if(tot){ tot.textContent=pts+' pts → '+(risk<1?'<1':risk>=30?'≥30':risk)+'%'; }
  renderFITT();
}

// ── Init ──────────────────────────────────────────────────────────────
renderKillip();
update();
```
Reemplazar con:
```javascript
function renderFITT(){
  const {risk}=calcFram(state.fram);
  document.getElementById('fitt-output').innerHTML=fittHTML(getFITT(risk,state.killip), !!state.killip);
}

function updateFram(){
  const {pts,bd,risk}=calcFram(state.fram);
  updateGaugeFram(risk);
  // breakdown
  for(const k of['age','tc','hdl','sbp','smoke']){
    const el=document.getElementById('fram-bd-'+k);
    if(!el) return;
    const n=bd[k];
    el.className=n>0?'pts-pos':n<0?'pts-neg':'pts-zero';
    el.textContent=n>0?'+'+n:n;
  }
  const tot=document.getElementById('fram-bd-total');
  if(tot){ tot.textContent=pts+' pts → '+(risk<1?'<1':risk>=30?'≥30':risk)+'%'; }
  renderFITT();
}

// ── Init ──────────────────────────────────────────────────────────────
renderKillip();
updateFram();
```

- [ ] **Step 6: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("CSS conflictivo eliminado", "section .panel { display: block; }" not in html),
    ("wrap sin clase panel", '<div class="wrap">' in html),
    ("ntab fram presente", "showTab('fram',this)" in html),
    ("ntab score2 presente", "showTab('score2',this)" in html),
    ("ntab acsm presente", "showTab('acsm',this)" in html),
    ("tab-fram panel", 'id="tab-fram"' in html),
    ("fram-sl-age id", 'id="fram-sl-age"' in html),
    ("fram-gauge-svg id", 'id="fram-gauge-svg"' in html),
    ("fram-bd-total id", 'id="fram-bd-total"' in html),
    ("ids viejos sin prefijo ya no existen", 'id="sl-age"' not in html and 'id="btn-M"' not in html and 'id="bd-total"' not in html),
    ("showTab function", "function showTab(id, el)" in html),
    ("setSexFram function", "function setSexFram(s)" in html),
    ("updFram function", "function updFram(key, val, lblId, txt)" in html),
    ("calcFram parametrizada", "function calcFram(s){" in html),
    ("updateFram function", "function updateFram(){" in html),
    ("renderFITT usa state.fram", "calcFram(state.fram)" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 7: Verificación de regresión numérica (Node) — el refactor no debe cambiar el resultado de Framingham**

```javascript
// D:/modfisioresp/_tmp_verify_task1.js
function calcFram(s){
  const {sex,age,tc,hdl,sbp,bpTreated,smoking} = s;
  let pts=0; const bd={};
  const ageRowM=[[-9,34],[-4,39],[0,44],[3,49],[6,54],[8,59],[10,64],[11,69],[12,74],[13,99]];
  const ageRowF=[[-7,34],[-3,39],[0,44],[3,49],[6,54],[8,59],[10,64],[12,69],[14,74],[16,99]];
  bd.age=(sex==='M'?ageRowM:ageRowF).find(([,max])=>age<=max)[0];
  pts+=bd.age;
  const ag=age<40?0:age<50?1:age<60?2:age<70?3:4;
  const tb=tc<160?0:tc<200?1:tc<240?2:tc<280?3:4;
  const tcM=[[0,4,7,9,11],[0,3,5,6,8],[0,2,3,4,5],[0,1,1,2,3],[0,0,0,1,1]];
  const tcF=[[0,4,8,11,13],[0,3,6,8,10],[0,2,4,5,7],[0,1,2,3,4],[0,1,1,2,2]];
  bd.tc=(sex==='M'?tcM:tcF)[ag][tb];
  pts+=bd.tc;
  bd.hdl=hdl>=60?-1:hdl>=50?0:hdl>=40?1:2;
  pts+=bd.hdl;
  const sb=sbp<120?0:sbp<130?1:sbp<140?2:sbp<160?3:4;
  const sbpM=[[0,0,1,1,2],[0,1,2,2,3]];
  const sbpF=[[0,1,2,3,4],[0,3,4,5,6]];
  bd.sbp=(sex==='M'?sbpM:sbpF)[bpTreated?1:0][sb];
  pts+=bd.sbp;
  const smkArr=[9,7,4,2,1];
  bd.smoke=smoking?smkArr[ag]:0;
  pts+=bd.smoke;
  let risk;
  if(sex==='M'){
    const tM=[0.5,1,1,1,1,2,2,3,4,5,6,8,10,12,16,20,25,30];
    risk=tM[Math.max(0,Math.min(17,pts<=0?0:pts))];
  } else {
    if(pts<=9) risk=0.5;
    else if(pts>=25) risk=30;
    else { const tF=[1,1,1,2,2,3,4,5,6,8,11,14,17,22,27]; risk=tF[pts-10]; }
  }
  return {pts,bd,risk};
}
const r = calcFram({sex:'M',age:52,tc:215,hdl:42,sbp:145,bpTreated:false,smoking:false});
console.log(JSON.stringify(r));
if (r.pts !== 11 || r.risk !== 8) { console.log('FAIL: regresion numerica'); process.exit(1); }
console.log('OK: calcFram(s) parametrizada reproduce el mismo resultado que antes del refactor (pts=11, risk=8)');
```
Run: `node D:/modfisioresp/_tmp_verify_task1.js`
Expected: imprime el JSON, luego `OK: calcFram(s) parametrizada reproduce el mismo resultado...`

- [ ] **Step 8: Borrar el script temporal**

```bash
rm D:/modfisioresp/_tmp_verify_task1.js
```

- [ ] **Step 9: Commit**

```bash
git add modules/riesgo_cv.html
git commit -m "refactor: convertir riesgo_cv en sistema de tabs y namespacear estado Framingham"
```

---

### Task 2: Pestaña SCORE2

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: clase CSS `.panel`/`.tbtn`/`.sl-row`/`.pts-box`/`.gauge-cat` (Task 1, ya globales/existentes); `renderFITT()` (Task 1, sigue llamando solo a `calcFram` hasta Task 6).
- Produces: `state.score2` (`{sex,age,sbp,tc,hdl,smoking,region}`), `calcScore2(s)` → `{risk,bd}`, `updateScore2()`, `setSexScore2(s)`, `updScore2(key,val,lblId,txt)`, `setRegionScore2(r)`.

- [ ] **Step 1: Insertar el panel `tab-score2` después de `tab-fram`**

Localizar (cierre del panel agregado en Task 1):
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-fram -->
```
Reemplazar con:
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-fram -->

  <div class="panel" id="tab-score2">

    <p style="color:var(--text2);font-size:13px;max-width:720px;line-height:1.75;margin-bottom:1rem">
      <strong>SCORE2</strong> (ESC 2021) — estima el riesgo combinado de evento CV fatal y no fatal a <strong>10 años</strong> en población europea de 40 a 69 años, calibrado por región de riesgo.
    </p>

    <div class="calc-wrap">
      <div class="form-col">

        <div class="toggle-group">
          <button class="tbtn on" id="score2-btn-M" onclick="setSexScore2('M')">♂ Hombre</button>
          <button class="tbtn" id="score2-btn-F" onclick="setSexScore2('F')">♀ Mujer</button>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Edad</span><span class="sl-val" id="score2-v-age">55 años</span></div>
          <input type="range" id="score2-sl-age" min="40" max="69" value="55" oninput="updScore2('age',+this.value,'score2-v-age',this.value+' años')">
          <div class="sl-ticks"><span>40</span><span>55</span><span>69</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Presión Arterial Sistólica</span><span class="sl-val" id="score2-v-sbp">140 mmHg</span></div>
          <input type="range" id="score2-sl-sbp" min="90" max="200" value="140" oninput="updScore2('sbp',+this.value,'score2-v-sbp',this.value+' mmHg')">
          <div class="sl-ticks"><span>90</span><span class="sl-ref">&lt;120 normal</span><span>200</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Colesterol Total</span><span class="sl-val" id="score2-v-tc">200 mg/dL</span></div>
          <input type="range" id="score2-sl-tc" min="100" max="320" value="200" oninput="updScore2('tc',+this.value,'score2-v-tc',this.value+' mg/dL')">
          <div class="sl-ticks"><span>100</span><span class="sl-ref">Óptimo &lt;200</span><span>320</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">HDL Colesterol</span><span class="sl-val" id="score2-v-hdl">50 mg/dL</span></div>
          <input type="range" id="score2-sl-hdl" min="20" max="100" value="50" oninput="updScore2('hdl',+this.value,'score2-v-hdl',this.value+' mg/dL')">
          <div class="sl-ticks"><span>20</span><span class="sl-ref">No-HDL: <span id="score2-v-nonhdl">150</span> mg/dL</span><span>100</span></div>
        </div>

        <label class="check-row">
          <input type="checkbox" id="score2-ck-smoke" onchange="state.score2.smoking=this.checked;updateScore2()">
          Fumador/a activo/a
        </label>

        <div class="group-label" style="margin-top:1.25rem">Región de riesgo (calibración SCORE2)</div>
        <div class="toggle-group" style="flex-wrap:wrap">
          <button class="tbtn on" id="score2-region-low" onclick="setRegionScore2('low')">Bajo (España)</button>
          <button class="tbtn" id="score2-region-moderate" onclick="setRegionScore2('moderate')">Moderado</button>
          <button class="tbtn" id="score2-region-high" onclick="setRegionScore2('high')">Alto</button>
          <button class="tbtn" id="score2-region-veryhigh" onclick="setRegionScore2('veryhigh')">Muy alto</button>
        </div>

      </div><!-- /form-col -->

      <div class="output-col">
        <div id="score2-gauge-wrap">
          <svg id="score2-gauge-svg" viewBox="0 0 200 120" width="200" style="display:block">
            <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="rgba(148,163,184,.12)" stroke-width="14" stroke-linecap="round"/>
            <path id="score2-g-arc" d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="#4ade80" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
            <text id="score2-g-pct" x="100" y="88" text-anchor="middle" font-size="30" font-weight="700" fill="#4ade80" font-family="Space Grotesk,sans-serif">--%</text>
            <text x="100" y="110" text-anchor="middle" font-size="10" fill="rgba(148,163,184,.55)" font-family="Space Grotesk,sans-serif">riesgo a 10 años</text>
            <text x="20" y="115" text-anchor="start" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">BAJO</text>
            <text x="180" y="115" text-anchor="end" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">ALTO</text>
          </svg>
          <div id="score2-g-cat" class="gauge-cat" style="color:#4ade80;border-color:#4ade8044;background:#4ade8010">—</div>
        </div>

        <div class="pts-box">
          <h4>Desglose de contribución</h4>
          <div class="pts-row"><span>Edad</span><span id="score2-bd-age" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Tabaquismo</span><span id="score2-bd-smoke" class="pts-zero">—</span></div>
          <div class="pts-row"><span>PAS</span><span id="score2-bd-sbp" class="pts-zero">—</span></div>
          <div class="pts-row"><span>No-HDL</span><span id="score2-bd-nonhdl" class="pts-zero">—</span></div>
        </div>
      </div><!-- /output-col -->
    </div><!-- /calc-wrap -->
  </div><!-- /tab-score2 -->
```

- [ ] **Step 2: Agregar `state.score2` y las funciones JS de SCORE2**

Localizar:
```javascript
  fram: { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false },
  killip: null,
};
```
Reemplazar con:
```javascript
  fram: { sex:'M', age:52, tc:215, hdl:42, sbp:145, bpTreated:false, smoking:false },
  score2: { sex:'M', age:55, sbp:140, tc:200, hdl:50, smoking:false, region:'low' },
  killip: null,
};
```

Localizar (justo antes de `// ── Gauge ──`, donde termina `calcFram`):
```javascript
  return {pts,bd,risk};
}

// ── Gauge ─────────────────────────────────────────────────────────────
```
Reemplazar con:
```javascript
  return {pts,bd,risk};
}

// ── SCORE2 (aproximación educativa) ─────────────────────────────────────
function setSexScore2(s){
  state.score2.sex=s;
  document.getElementById('score2-btn-M').className='tbtn'+(s==='M'?' on':'');
  document.getElementById('score2-btn-F').className='tbtn'+(s==='F'?' on-pink':'');
  updateScore2();
}

function updScore2(key, val, lblId, txt){
  state.score2[key]=val;
  document.getElementById(lblId).textContent=txt;
  document.getElementById('score2-v-nonhdl').textContent = state.score2.tc - state.score2.hdl;
  updateScore2();
}

function setRegionScore2(r){
  state.score2.region=r;
  ['low','moderate','high','veryhigh'].forEach(k=>{
    document.getElementById('score2-region-'+k).className='tbtn'+(k===r?' on':'');
  });
  updateScore2();
}

function calcScore2(s){
  const { sex, age, sbp, tc, hdl, smoking, region } = s;
  const noHdl = tc - hdl;
  const cAge = (age - 60) / 5;
  let x = 0.32*cAge
        + (smoking ? 0.62 - 0.20*cAge : 0)
        + 0.025*(sbp-120) - 0.003*cAge*(sbp-120)
        + 0.018*(noHdl-130) - 0.002*cAge*(noHdl-130);
  if (sex === 'F') x *= 0.85;
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

function updateScore2(){
  const { risk, bd } = calcScore2(state.score2);
  const arc=document.getElementById('score2-g-arc');
  const txt=document.getElementById('score2-g-pct');
  const cat=document.getElementById('score2-g-cat');
  const prog=Math.min(risk/50,1);
  arc.style.strokeDashoffset=251.3*(1-prog);

  const age = state.score2.age;
  const lowMax = age < 50 ? 2.5 : 5;
  const modMax = age < 50 ? 7.5 : 10;
  const {color,label,bg} =
    risk<lowMax ? {color:'#4ade80',label:'Bajo riesgo',bg:'#4ade8010'} :
    risk<modMax ? {color:'#fbbf24',label:'Riesgo moderado',bg:'#fbbf2410'} :
                  {color:'#ef4444',label:'Riesgo alto',bg:'#ef444410'};

  arc.style.stroke=color;
  txt.style.fill=color;
  txt.textContent=risk<1?'<1%':risk>=50?'≥50%':risk.toFixed(1)+'%';
  cat.style.color=color; cat.style.borderColor=color+'44'; cat.style.background=bg; cat.textContent=label;

  for(const k of ['age','smoke','sbp','nonHdl']){
    const elId = 'score2-bd-'+(k==='nonHdl'?'nonhdl':k);
    const el=document.getElementById(elId);
    const n=bd[k];
    el.className=n>0?'pts-pos':n<0?'pts-neg':'pts-zero';
    el.textContent=(n>0?'+':'')+n;
  }
  renderFITT();
}

// ── Gauge ─────────────────────────────────────────────────────────────
```

- [ ] **Step 3: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("tab-score2 panel", 'id="tab-score2"' in html),
    ("score2-sl-age", 'id="score2-sl-age"' in html),
    ("score2-region-low", 'id="score2-region-low"' in html),
    ("score2-gauge-svg", 'id="score2-gauge-svg"' in html),
    ("state.score2", "score2: { sex:'M', age:55" in html),
    ("calcScore2 function", "function calcScore2(s){" in html),
    ("updateScore2 function", "function updateScore2(){" in html),
    ("setRegionScore2 function", "function setRegionScore2(r){" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 4: Verificación numérica (Node) — monotonía y categorías por edad**

```javascript
// D:/modfisioresp/_tmp_verify_task2.js
function calcScore2(s) {
  const { sex, age, sbp, tc, hdl, smoking, region } = s;
  const noHdl = tc - hdl;
  const cAge = (age - 60) / 5;
  let x = 0.32*cAge
        + (smoking ? 0.62 - 0.20*cAge : 0)
        + 0.025*(sbp-120) - 0.003*cAge*(sbp-120)
        + 0.018*(noHdl-130) - 0.002*cAge*(noHdl-130);
  if (sex === 'F') x *= 0.85;
  const baseline = { low: 0.018, moderate: 0.028, high: 0.042, veryhigh: 0.06 }[region];
  let risk = 100 * (1 - Math.pow(1 - baseline, Math.exp(x)));
  return { risk: Math.max(0.5, Math.min(50, risk)) };
}
const base = {sex:'M',age:55,sbp:140,tc:200,hdl:50,smoking:false,region:'low'};
const r0 = calcScore2(base).risk;
const rSmoke = calcScore2({...base, smoking:true}).risk;
const rOlder = calcScore2({...base, age:65}).risk;
const rHighRegion = calcScore2({...base, region:'veryhigh'}).risk;
console.log('base='+r0.toFixed(2)+' smoking='+rSmoke.toFixed(2)+' older='+rOlder.toFixed(2)+' veryhigh-region='+rHighRegion.toFixed(2));
const checks = [
  ['fumar aumenta el riesgo', rSmoke > r0],
  ['mayor edad aumenta el riesgo', rOlder > r0],
  ['region muy alto aumenta el riesgo', rHighRegion > r0],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task2.js`
Expected: las 3 comparaciones imprimen OK.

- [ ] **Step 5: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task2.js
git add modules/riesgo_cv.html
git commit -m "feat: agregar pestana SCORE2 a riesgo_cv"
```

---

### Task 3: Pestaña ASSIGN

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: igual que Task 2 (clases CSS globales, `renderFITT()` sin cambios todavía).
- Produces: `state.assign` (`{sex,age,sbp,tc,hdl,smoking,cigsPerDay,famHist,diabetes,ses}`), `calcAssign(s)` → `{risk,bd}`, `updateAssign()`, `setSexAssign(s)`, `updAssign(key,val,lblId,txt)`.

- [ ] **Step 1: Insertar el panel `tab-assign` después de `tab-score2`**

Localizar:
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-score2 -->
```
Reemplazar con:
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-score2 -->

  <div class="panel" id="tab-assign">

    <p style="color:var(--text2);font-size:13px;max-width:720px;line-height:1.75;margin-bottom:1rem">
      <strong>ASSIGN</strong> (Universidad de Dundee, Escocia) — estima el riesgo de evento CV a <strong>10 años</strong> incorporando, además de los factores clásicos, la <strong>historia familiar</strong> y el <strong>nivel socioeconómico</strong>.
    </p>

    <div class="calc-wrap">
      <div class="form-col">

        <div class="toggle-group">
          <button class="tbtn on" id="assign-btn-M" onclick="setSexAssign('M')">♂ Hombre</button>
          <button class="tbtn" id="assign-btn-F" onclick="setSexAssign('F')">♀ Mujer</button>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Edad</span><span class="sl-val" id="assign-v-age">50 años</span></div>
          <input type="range" id="assign-sl-age" min="30" max="74" value="50" oninput="updAssign('age',+this.value,'assign-v-age',this.value+' años')">
          <div class="sl-ticks"><span>30</span><span>50</span><span>74</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Presión Arterial Sistólica</span><span class="sl-val" id="assign-v-sbp">135 mmHg</span></div>
          <input type="range" id="assign-sl-sbp" min="90" max="200" value="135" oninput="updAssign('sbp',+this.value,'assign-v-sbp',this.value+' mmHg')">
          <div class="sl-ticks"><span>90</span><span class="sl-ref">&lt;120 normal</span><span>200</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Colesterol Total</span><span class="sl-val" id="assign-v-tc">210 mg/dL</span></div>
          <input type="range" id="assign-sl-tc" min="100" max="320" value="210" oninput="updAssign('tc',+this.value,'assign-v-tc',this.value+' mg/dL')">
          <div class="sl-ticks"><span>100</span><span class="sl-ref">Óptimo &lt;200</span><span>320</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">HDL Colesterol</span><span class="sl-val" id="assign-v-hdl">48 mg/dL</span></div>
          <input type="range" id="assign-sl-hdl" min="20" max="100" value="48" oninput="updAssign('hdl',+this.value,'assign-v-hdl',this.value+' mg/dL')">
          <div class="sl-ticks"><span>20</span><span class="sl-ref">Ratio TC/HDL: <span id="assign-v-ratio">4.4</span></span><span>100</span></div>
        </div>

        <label class="check-row">
          <input type="checkbox" id="assign-ck-smoke" onchange="state.assign.smoking=this.checked;document.getElementById('assign-sl-cigs').disabled=!this.checked;updateAssign()">
          Fumador/a activo/a
        </label>
        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Cigarrillos/día</span><span class="sl-val" id="assign-v-cigs">10</span></div>
          <input type="range" id="assign-sl-cigs" min="0" max="40" value="10" disabled oninput="updAssign('cigsPerDay',+this.value,'assign-v-cigs',this.value)">
          <div class="sl-ticks"><span>0</span><span>20</span><span>40</span></div>
        </div>

        <label class="check-row">
          <input type="checkbox" id="assign-ck-famhist" onchange="state.assign.famHist=this.checked;updateAssign()">
          Historia familiar de cardiopatía &lt;60 años
        </label>
        <label class="check-row">
          <input type="checkbox" id="assign-ck-diabetes" onchange="state.assign.diabetes=this.checked;updateAssign()">
          Diabetes
        </label>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Nivel socioeconómico</span><span class="sl-val" id="assign-v-ses">4</span></div>
          <input type="range" id="assign-sl-ses" min="1" max="7" value="4" oninput="updAssign('ses',+this.value,'assign-v-ses',this.value)">
          <div class="sl-ticks"><span>1 favorecido</span><span>4 medio</span><span>7 desfavorecido</span></div>
          <div style="font-size:10.5px;color:var(--text3);margin-top:.3rem">Sustituye al índice de privación SIMD (Reino Unido).</div>
        </div>

      </div><!-- /form-col -->

      <div class="output-col">
        <div id="assign-gauge-wrap">
          <svg id="assign-gauge-svg" viewBox="0 0 200 120" width="200" style="display:block">
            <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="rgba(148,163,184,.12)" stroke-width="14" stroke-linecap="round"/>
            <path id="assign-g-arc" d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="#4ade80" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
            <text id="assign-g-pct" x="100" y="88" text-anchor="middle" font-size="30" font-weight="700" fill="#4ade80" font-family="Space Grotesk,sans-serif">--%</text>
            <text x="100" y="110" text-anchor="middle" font-size="10" fill="rgba(148,163,184,.55)" font-family="Space Grotesk,sans-serif">riesgo a 10 años</text>
            <text x="20" y="115" text-anchor="start" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">BAJO</text>
            <text x="180" y="115" text-anchor="end" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">ALTO</text>
          </svg>
          <div id="assign-g-cat" class="gauge-cat" style="color:#4ade80;border-color:#4ade8044;background:#4ade8010">—</div>
        </div>

        <div class="pts-box">
          <h4>Desglose de contribución</h4>
          <div class="pts-row"><span>Edad</span><span id="assign-bd-age" class="pts-zero">—</span></div>
          <div class="pts-row"><span>PA</span><span id="assign-bd-sbp" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Lípidos</span><span id="assign-bd-lipids" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Tabaquismo</span><span id="assign-bd-smoke" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Hist. familiar</span><span id="assign-bd-famhist" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Diabetes</span><span id="assign-bd-diabetes" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Nivel socioeconómico</span><span id="assign-bd-ses" class="pts-zero">—</span></div>
        </div>
      </div><!-- /output-col -->
    </div><!-- /calc-wrap -->
  </div><!-- /tab-assign -->
```

- [ ] **Step 2: Agregar `state.assign` y las funciones JS de ASSIGN**

Localizar:
```javascript
  score2: { sex:'M', age:55, sbp:140, tc:200, hdl:50, smoking:false, region:'low' },
  killip: null,
};
```
Reemplazar con:
```javascript
  score2: { sex:'M', age:55, sbp:140, tc:200, hdl:50, smoking:false, region:'low' },
  assign: { sex:'M', age:50, sbp:135, tc:210, hdl:48, smoking:false, cigsPerDay:10, famHist:false, diabetes:false, ses:4 },
  killip: null,
};
```

Localizar (justo antes de `// ── Gauge ──`, donde termina `calcScore2`/`updateScore2` de la Task 2):
```javascript
  renderFITT();
}

// ── Gauge ─────────────────────────────────────────────────────────────
```
Reemplazar con:
```javascript
  renderFITT();
}

// ── ASSIGN (aproximación educativa) ─────────────────────────────────────
function setSexAssign(s){
  state.assign.sex=s;
  document.getElementById('assign-btn-M').className='tbtn'+(s==='M'?' on':'');
  document.getElementById('assign-btn-F').className='tbtn'+(s==='F'?' on-pink':'');
  updateAssign();
}

function updAssign(key, val, lblId, txt){
  state.assign[key]=val;
  document.getElementById(lblId).textContent=txt;
  document.getElementById('assign-v-ratio').textContent = (state.assign.tc / state.assign.hdl).toFixed(1);
  updateAssign();
}

function calcAssign(s){
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
    famhist: famHist ? 4 : 0,
    diabetes: diabetes ? 6 : 0,
    ses:     Math.round((ses - 4) * 1.2 * 10) / 10,
  };
  return { risk, bd };
}

function updateAssign(){
  const { risk, bd } = calcAssign(state.assign);
  const arc=document.getElementById('assign-g-arc');
  const txt=document.getElementById('assign-g-pct');
  const cat=document.getElementById('assign-g-cat');
  const prog=Math.min(risk/50,1);
  arc.style.strokeDashoffset=251.3*(1-prog);

  const {color,label,bg} =
    risk<10 ? {color:'#4ade80',label:'Bajo riesgo',bg:'#4ade8010'} :
    risk<20 ? {color:'#fbbf24',label:'Riesgo moderado',bg:'#fbbf2410'} :
              {color:'#ef4444',label:'Riesgo alto',bg:'#ef444410'};

  arc.style.stroke=color;
  txt.style.fill=color;
  txt.textContent=risk<1?'<1%':risk>=50?'≥50%':risk.toFixed(1)+'%';
  cat.style.color=color; cat.style.borderColor=color+'44'; cat.style.background=bg; cat.textContent=label;

  for(const k of ['age','sbp','lipids','smoke','famhist','diabetes','ses']){
    const el=document.getElementById('assign-bd-'+k);
    const n=bd[k];
    el.className=n>0?'pts-pos':n<0?'pts-neg':'pts-zero';
    el.textContent=(n>0?'+':'')+n;
  }
  renderFITT();
}

// ── Gauge ─────────────────────────────────────────────────────────────
```

- [ ] **Step 3: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("tab-assign panel", 'id="tab-assign"' in html),
    ("assign-sl-ses", 'id="assign-sl-ses"' in html),
    ("assign-sl-cigs disabled by default", 'id="assign-sl-cigs" min="0" max="40" value="10" disabled' in html),
    ("state.assign", "assign: { sex:'M', age:50" in html),
    ("calcAssign function", "function calcAssign(s){" in html),
    ("updateAssign function", "function updateAssign(){" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 4: Verificación numérica (Node) — monotonía y umbrales 10/20%**

```javascript
// D:/modfisioresp/_tmp_verify_task3.js
function calcAssign(s){
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
  return { risk: Math.max(0.5, Math.min(50, pts * 0.55)) };
}
const base = {sex:'M',age:50,sbp:135,tc:210,hdl:48,smoking:false,cigsPerDay:0,famHist:false,diabetes:false,ses:4};
const r0 = calcAssign(base).risk;
const rSmoke = calcAssign({...base, smoking:true, cigsPerDay:20}).risk;
const rDeprived = calcAssign({...base, ses:7}).risk;
const rDiabetes = calcAssign({...base, diabetes:true}).risk;
console.log('base='+r0.toFixed(2)+' smoke20='+rSmoke.toFixed(2)+' ses7='+rDeprived.toFixed(2)+' diabetes='+rDiabetes.toFixed(2));
const checks = [
  ['fumar 20/dia aumenta el riesgo', rSmoke > r0],
  ['privacion (ses=7) aumenta el riesgo', rDeprived > r0],
  ['diabetes aumenta el riesgo', rDiabetes > r0],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task3.js`
Expected: las 3 comparaciones imprimen OK.

- [ ] **Step 5: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task3.js
git add modules/riesgo_cv.html
git commit -m "feat: agregar pestana ASSIGN a riesgo_cv"
```

---

### Task 4: Pestaña QRISK (simplificada)

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: igual que tareas anteriores.
- Produces: `state.qrisk` (`{sex,age,ethnicity,bmi,sbp,tc,hdl,smokingCat,diabetes,famHist,afib,ckd}`), `calcQrisk(s)` → `{risk,bd}`, `updateQrisk()`, `setSexQrisk(s)`, `updQrisk(key,val,lblId,txt)`.

- [ ] **Step 1: Insertar el panel `tab-qrisk` después de `tab-assign`**

Localizar:
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-assign -->
```
Reemplazar con:
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-assign -->

  <div class="panel" id="tab-qrisk">

    <p style="color:var(--text2);font-size:13px;max-width:720px;line-height:1.75;margin-bottom:1rem">
      <strong>QRISK</strong> (versión educativa simplificada) — además de los factores clásicos, incorpora <strong>etnia</strong>, <strong>IMC</strong>, <strong>fibrilación auricular</strong> y <strong>enfermedad renal crónica</strong>, comorbilidades con fuerte impacto en el riesgo real que Framingham/SCORE2/ASSIGN no modelan.
    </p>

    <div class="calc-wrap">
      <div class="form-col">

        <div class="toggle-group">
          <button class="tbtn on" id="qrisk-btn-M" onclick="setSexQrisk('M')">♂ Hombre</button>
          <button class="tbtn" id="qrisk-btn-F" onclick="setSexQrisk('F')">♀ Mujer</button>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Edad</span><span class="sl-val" id="qrisk-v-age">55 años</span></div>
          <input type="range" id="qrisk-sl-age" min="25" max="84" value="55" oninput="updQrisk('age',+this.value,'qrisk-v-age',this.value+' años')">
          <div class="sl-ticks"><span>25</span><span>55</span><span>84</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Etnia</span></div>
          <select id="qrisk-sel-ethnicity" onchange="state.qrisk.ethnicity=this.value;updateQrisk()" style="width:100%;padding:.5rem;border-radius:var(--rs);background:var(--card2);border:1px solid var(--border);color:var(--text)">
            <option value="white">Blanca / no registrada</option>
            <option value="southAsian">Asiática del sur</option>
            <option value="black">Negra africana/caribeña</option>
            <option value="eastAsian">Asiática del este</option>
            <option value="mixed">Mixta/otra</option>
          </select>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">IMC</span><span class="sl-val" id="qrisk-v-bmi">26 kg/m²</span></div>
          <input type="range" id="qrisk-sl-bmi" min="15" max="45" value="26" oninput="updQrisk('bmi',+this.value,'qrisk-v-bmi',this.value+' kg/m²')">
          <div class="sl-ticks"><span>15</span><span class="sl-ref">Normal &lt;25</span><span>45</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Presión Arterial Sistólica</span><span class="sl-val" id="qrisk-v-sbp">135 mmHg</span></div>
          <input type="range" id="qrisk-sl-sbp" min="90" max="200" value="135" oninput="updQrisk('sbp',+this.value,'qrisk-v-sbp',this.value+' mmHg')">
          <div class="sl-ticks"><span>90</span><span>200</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Colesterol Total</span><span class="sl-val" id="qrisk-v-tc">200 mg/dL</span></div>
          <input type="range" id="qrisk-sl-tc" min="100" max="320" value="200" oninput="updQrisk('tc',+this.value,'qrisk-v-tc',this.value+' mg/dL')">
          <div class="sl-ticks"><span>100</span><span>320</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">HDL Colesterol</span><span class="sl-val" id="qrisk-v-hdl">50 mg/dL</span></div>
          <input type="range" id="qrisk-sl-hdl" min="20" max="100" value="50" oninput="updQrisk('hdl',+this.value,'qrisk-v-hdl',this.value+' mg/dL')">
          <div class="sl-ticks"><span>20</span><span class="sl-ref">Ratio TC/HDL: <span id="qrisk-v-ratio">4.0</span></span><span>100</span></div>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Tabaquismo</span></div>
          <select id="qrisk-sel-smoking" onchange="state.qrisk.smokingCat=+this.value;updateQrisk()" style="width:100%;padding:.5rem;border-radius:var(--rs);background:var(--card2);border:1px solid var(--border);color:var(--text)">
            <option value="0">Nunca</option>
            <option value="1">Ex-fumador</option>
            <option value="2">Ligero (&lt;10/día)</option>
            <option value="3">Moderado (10-19/día)</option>
            <option value="4">Intenso (≥20/día)</option>
          </select>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Diabetes</span></div>
          <select id="qrisk-sel-diabetes" onchange="state.qrisk.diabetes=this.value;updateQrisk()" style="width:100%;padding:.5rem;border-radius:var(--rs);background:var(--card2);border:1px solid var(--border);color:var(--text)">
            <option value="none">Ninguna</option>
            <option value="type1">Tipo 1</option>
            <option value="type2">Tipo 2</option>
          </select>
        </div>

        <label class="check-row">
          <input type="checkbox" id="qrisk-ck-famhist" onchange="state.qrisk.famHist=this.checked;updateQrisk()">
          Historia familiar de cardiopatía &lt;60 años
        </label>
        <label class="check-row">
          <input type="checkbox" id="qrisk-ck-afib" onchange="state.qrisk.afib=this.checked;updateQrisk()">
          Fibrilación auricular conocida
        </label>
        <label class="check-row">
          <input type="checkbox" id="qrisk-ck-ckd" onchange="state.qrisk.ckd=this.checked;updateQrisk()">
          Enfermedad renal crónica (estadio 4-5)
        </label>

      </div><!-- /form-col -->

      <div class="output-col">
        <div id="qrisk-gauge-wrap">
          <svg id="qrisk-gauge-svg" viewBox="0 0 200 120" width="200" style="display:block">
            <path d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="rgba(148,163,184,.12)" stroke-width="14" stroke-linecap="round"/>
            <path id="qrisk-g-arc" d="M 20,100 A 80,80 0 0,1 180,100" fill="none" stroke="#4ade80" stroke-width="14" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
            <text id="qrisk-g-pct" x="100" y="88" text-anchor="middle" font-size="30" font-weight="700" fill="#4ade80" font-family="Space Grotesk,sans-serif">--%</text>
            <text x="100" y="110" text-anchor="middle" font-size="10" fill="rgba(148,163,184,.55)" font-family="Space Grotesk,sans-serif">riesgo a 10 años</text>
            <text x="20" y="115" text-anchor="start" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">BAJO</text>
            <text x="180" y="115" text-anchor="end" font-size="8.5" fill="rgba(148,163,184,.4)" font-family="Space Grotesk,sans-serif">ALTO</text>
          </svg>
          <div id="qrisk-g-cat" class="gauge-cat" style="color:#4ade80;border-color:#4ade8044;background:#4ade8010">—</div>
        </div>

        <div class="pts-box">
          <h4>Desglose de contribución</h4>
          <div class="pts-row"><span>Edad</span><span id="qrisk-bd-age" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Etnia</span><span id="qrisk-bd-ethnicity" class="pts-zero">—</span></div>
          <div class="pts-row"><span>IMC</span><span id="qrisk-bd-bmi" class="pts-zero">—</span></div>
          <div class="pts-row"><span>PA</span><span id="qrisk-bd-sbp" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Lípidos</span><span id="qrisk-bd-lipids" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Tabaquismo</span><span id="qrisk-bd-smoke" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Diabetes</span><span id="qrisk-bd-diabetes" class="pts-zero">—</span></div>
          <div class="pts-row"><span>Hist. familiar</span><span id="qrisk-bd-famhist" class="pts-zero">—</span></div>
          <div class="pts-row"><span>FA</span><span id="qrisk-bd-afib" class="pts-zero">—</span></div>
          <div class="pts-row"><span>ERC</span><span id="qrisk-bd-ckd" class="pts-zero">—</span></div>
        </div>
      </div><!-- /output-col -->
    </div><!-- /calc-wrap -->
  </div><!-- /tab-qrisk -->
```

- [ ] **Step 2: Agregar `state.qrisk` y las funciones JS de QRISK**

Localizar:
```javascript
  assign: { sex:'M', age:50, sbp:135, tc:210, hdl:48, smoking:false, cigsPerDay:10, famHist:false, diabetes:false, ses:4 },
  killip: null,
};
```
Reemplazar con:
```javascript
  assign: { sex:'M', age:50, sbp:135, tc:210, hdl:48, smoking:false, cigsPerDay:10, famHist:false, diabetes:false, ses:4 },
  qrisk: { sex:'M', age:55, ethnicity:'white', bmi:26, sbp:135, tc:200, hdl:50, smokingCat:0, diabetes:'none', famHist:false, afib:false, ckd:false },
  killip: null,
};
```

Localizar (justo antes de `// ── Gauge ──`, donde termina `calcAssign`/`updateAssign` de la Task 3):
```javascript
  renderFITT();
}

// ── Gauge ─────────────────────────────────────────────────────────────
```
Reemplazar con:
```javascript
  renderFITT();
}

// ── QRISK (version educativa simplificada) ─────────────────────────────
function setSexQrisk(s){
  state.qrisk.sex=s;
  document.getElementById('qrisk-btn-M').className='tbtn'+(s==='M'?' on':'');
  document.getElementById('qrisk-btn-F').className='tbtn'+(s==='F'?' on-pink':'');
  updateQrisk();
}

function updQrisk(key, val, lblId, txt){
  state.qrisk[key]=val;
  document.getElementById(lblId).textContent=txt;
  document.getElementById('qrisk-v-ratio').textContent = (state.qrisk.tc / state.qrisk.hdl).toFixed(1);
  updateQrisk();
}

function calcQrisk(s){
  const { sex, age, ethnicity, bmi, sbp, tc, hdl, smokingCat, diabetes, famHist, afib, ckd } = s;
  const ratio = tc / hdl;
  const ethMult = { white:1, southAsian:1.4, black:0.7, eastAsian:0.6, mixed:1.1 }[ethnicity];
  const smokeMult = [0, 1.3, 1.8, 2.3, 3.0][smokingCat];
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
    famhist:  famHist ? 0.45 : 0,
    afib:     afib ? 1.1 : 0,
    ckd:      ckd ? 1.0 : 0,
  };
  return { risk, bd };
}

function updateQrisk(){
  const { risk, bd } = calcQrisk(state.qrisk);
  const arc=document.getElementById('qrisk-g-arc');
  const txt=document.getElementById('qrisk-g-pct');
  const cat=document.getElementById('qrisk-g-cat');
  const prog=Math.min(risk/60,1);
  arc.style.strokeDashoffset=251.3*(1-prog);

  const {color,label,bg} =
    risk<10 ? {color:'#4ade80',label:'Bajo riesgo',bg:'#4ade8010'} :
    risk<20 ? {color:'#fbbf24',label:'Riesgo moderado',bg:'#fbbf2410'} :
              {color:'#ef4444',label:'Riesgo alto',bg:'#ef444410'};

  arc.style.stroke=color;
  txt.style.fill=color;
  txt.textContent=risk<1?'<1%':risk>=60?'≥60%':risk.toFixed(1)+'%';
  cat.style.color=color; cat.style.borderColor=color+'44'; cat.style.background=bg; cat.textContent=label;

  for(const k of ['age','ethnicity','bmi','sbp','lipids','smoke','diabetes','famhist','afib','ckd']){
    const el=document.getElementById('qrisk-bd-'+k);
    const n=bd[k];
    el.className=n>0?'pts-pos':n<0?'pts-neg':'pts-zero';
    el.textContent=(n>0?'+':'')+n;
  }
  renderFITT();
}

// ── Gauge ─────────────────────────────────────────────────────────────
```

- [ ] **Step 3: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("tab-qrisk panel", 'id="tab-qrisk"' in html),
    ("qrisk-sel-ethnicity", 'id="qrisk-sel-ethnicity"' in html),
    ("qrisk-sel-smoking", 'id="qrisk-sel-smoking"' in html),
    ("qrisk-ck-afib", 'id="qrisk-ck-afib"' in html),
    ("qrisk-ck-ckd", 'id="qrisk-ck-ckd"' in html),
    ("state.qrisk", "qrisk: { sex:'M', age:55, ethnicity:'white'" in html),
    ("calcQrisk function", "function calcQrisk(s){" in html),
    ("updateQrisk function", "function updateQrisk(){" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 4: Verificación numérica (Node) — impacto de FA, ERC y etnia**

```javascript
// D:/modfisioresp/_tmp_verify_task4.js
function calcQrisk(s){
  const { sex, age, ethnicity, bmi, sbp, tc, hdl, smokingCat, diabetes, famHist, afib, ckd } = s;
  const ratio = tc / hdl;
  const ethMult = { white:1, southAsian:1.4, black:0.7, eastAsian:0.6, mixed:1.1 }[ethnicity];
  const smokeMult = [0, 1.3, 1.8, 2.3, 3.0][smokingCat];
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
  return { risk: Math.max(0.5, Math.min(60, risk)) };
}
const base = {sex:'M',age:55,ethnicity:'white',bmi:26,sbp:135,tc:200,hdl:50,smokingCat:0,diabetes:'none',famHist:false,afib:false,ckd:false};
const r0 = calcQrisk(base).risk;
const rAfibCkd = calcQrisk({...base, afib:true, ckd:true}).risk;
const rSouthAsian = calcQrisk({...base, ethnicity:'southAsian'}).risk;
console.log('base='+r0.toFixed(2)+' afib+ckd='+rAfibCkd.toFixed(2)+' southAsian='+rSouthAsian.toFixed(2));
const checks = [
  ['FA+ERC aumenta el riesgo notablemente', rAfibCkd > r0 * 1.5],
  ['etnia surasiatica aumenta el riesgo', rSouthAsian > r0],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task4.js`
Expected: las 2 comparaciones imprimen OK.

- [ ] **Step 5: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task4.js
git add modules/riesgo_cv.html
git commit -m "feat: agregar pestana QRISK simplificada a riesgo_cv"
```

---

### Task 5: Pestaña ACSM (estratificación de factores de riesgo)

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: igual que tareas anteriores.
- Produces: `state.acsm` (`{sex,age,famHist,smoking,sedentary,obesity,htn,dyslipidemia,prediabetes,highHdl,knownDisease,symptoms}`), `calcAcsm(s)` → `{category,count}`, `updateAcsm()`, `setSexAcsm(s)`.

- [ ] **Step 1: Insertar el panel `tab-acsm` después de `tab-qrisk`**

Localizar:
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-qrisk -->
```
Reemplazar con:
```html
  </div><!-- /calc-wrap -->
  </div><!-- /tab-qrisk -->

  <div class="panel" id="tab-acsm">

    <p style="color:var(--text2);font-size:13px;max-width:720px;line-height:1.75;margin-bottom:1rem">
      <strong>Estratificación ACSM</strong> (Guidelines for Exercise Testing and Prescription) — no calcula un % de riesgo, sino una <strong>categoría</strong> (Bajo/Moderado/Alto) según el conteo de factores de riesgo, usada para decidir la necesidad de evaluación médica antes de un programa de ejercicio.
    </p>

    <div class="calc-wrap">
      <div class="form-col">

        <div class="toggle-group">
          <button class="tbtn on" id="acsm-btn-M" onclick="setSexAcsm('M')">♂ Hombre</button>
          <button class="tbtn" id="acsm-btn-F" onclick="setSexAcsm('F')">♀ Mujer</button>
        </div>

        <div class="sl-row">
          <div class="sl-header"><span class="sl-label">Edad</span><span class="sl-val" id="acsm-v-age">50 años</span></div>
          <input type="range" id="acsm-sl-age" min="20" max="79" value="50" oninput="state.acsm.age=+this.value;document.getElementById('acsm-v-age').textContent=this.value+' años';updateAcsm()">
          <div class="sl-ticks"><span>20</span><span>50</span><span>79</span></div>
          <div style="font-size:10.5px;color:var(--text3);margin-top:.3rem">Factor positivo si edad ≥45 (hombre) o ≥55 (mujer) — se calcula automáticamente.</div>
        </div>

        <div class="group-label" style="margin-top:1.25rem">Factores de riesgo positivos</div>

        <label class="check-row">
          <input type="checkbox" id="acsm-ck-famhist" onchange="state.acsm.famHist=this.checked;updateAcsm()">
          Historia familiar: IAM/revascularización/muerte súbita &lt;55a (familiar 1er grado masculino) o &lt;65a (femenino)
        </label>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-smoke" onchange="state.acsm.smoking=this.checked;updateAcsm()">
          Tabaquismo actual, cesación &lt;6 meses, o exposición pasiva
        </label>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-sedentary" onchange="state.acsm.sedentary=this.checked;updateAcsm()">
          Sedentarismo (&lt;30 min actividad moderada ≥3 días/sem, ≥3 meses)
        </label>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-obesity" onchange="state.acsm.obesity=this.checked;updateAcsm()">
          Obesidad (IMC ≥30, o cintura &gt;102cm H / &gt;88cm M)
        </label>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-htn" onchange="state.acsm.htn=this.checked;updateAcsm()">
          Hipertensión (PAS ≥130 o PAD ≥80, o tratamiento antihipertensivo)
        </label>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-dyslipidemia" onchange="state.acsm.dyslipidemia=this.checked;updateAcsm()">
          Dislipidemia (LDL ≥130, HDL &lt;40, tratamiento, o CT ≥200 si no hay LDL)
        </label>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-prediabetes" onchange="state.acsm.prediabetes=this.checked;updateAcsm()">
          Prediabetes (glucosa ayunas 100-125 mg/dL o HbA1c 5.7-6.4%)
        </label>

        <div class="group-label" style="margin-top:1.25rem">Factor negativo</div>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-highhdl" onchange="state.acsm.highHdl=this.checked;updateAcsm()">
          HDL ≥60 mg/dL (resta 1 factor)
        </label>

        <div class="group-label" style="margin-top:1.25rem">Enfermedad o síntomas (anulan el conteo → Alto)</div>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-knowndisease" onchange="state.acsm.knownDisease=this.checked;updateAcsm()">
          Enfermedad cardiovascular/pulmonar/metabólica conocida
        </label>
        <label class="check-row">
          <input type="checkbox" id="acsm-ck-symptoms" onchange="state.acsm.symptoms=this.checked;updateAcsm()">
          Presenta signos/síntomas sugestivos (dolor torácico, disnea anormal, síncope, ortopnea/DPN, edema de tobillo, palpitaciones, claudicación intermitente, soplo conocido, fatiga inusual)
        </label>

      </div><!-- /form-col -->

      <div class="output-col">
        <div id="acsm-cat-wrap" style="text-align:center">
          <div id="acsm-cat-badge" class="gauge-cat" style="color:#4ade80;border-color:#4ade8044;background:#4ade8010;font-size:14px;padding:8px 18px">—</div>
        </div>

        <div class="pts-box">
          <h4>Factores marcados</h4>
          <div id="acsm-factor-list" style="font-size:12px;color:var(--text2);line-height:1.6">Ningún factor marcado.</div>
        </div>
      </div><!-- /output-col -->
    </div><!-- /calc-wrap -->
  </div><!-- /tab-acsm -->
```

- [ ] **Step 2: Agregar `state.acsm` y las funciones JS de ACSM**

Localizar:
```javascript
  qrisk: { sex:'M', age:55, ethnicity:'white', bmi:26, sbp:135, tc:200, hdl:50, smokingCat:0, diabetes:'none', famHist:false, afib:false, ckd:false },
  killip: null,
};
```
Reemplazar con:
```javascript
  qrisk: { sex:'M', age:55, ethnicity:'white', bmi:26, sbp:135, tc:200, hdl:50, smokingCat:0, diabetes:'none', famHist:false, afib:false, ckd:false },
  acsm: { sex:'M', age:50, famHist:false, smoking:false, sedentary:false, obesity:false, htn:false, dyslipidemia:false, prediabetes:false, highHdl:false, knownDisease:false, symptoms:false },
  killip: null,
};
```

Localizar (justo antes de `// ── Gauge ──`, donde termina `calcQrisk`/`updateQrisk` de la Task 4):
```javascript
  renderFITT();
}

// ── Gauge ─────────────────────────────────────────────────────────────
```
Reemplazar con:
```javascript
  renderFITT();
}

// ── ACSM — estratificacion de factores de riesgo ────────────────────────
function setSexAcsm(s){
  state.acsm.sex=s;
  document.getElementById('acsm-btn-M').className='tbtn'+(s==='M'?' on':'');
  document.getElementById('acsm-btn-F').className='tbtn'+(s==='F'?' on-pink':'');
  updateAcsm();
}

function calcAcsm(s){
  if (s.knownDisease || s.symptoms) return { category: 'alto', count: null };
  const ageFactor = (s.sex === 'M' && s.age >= 45) || (s.sex === 'F' && s.age >= 55);
  const labels = ['Edad','Hist. familiar','Tabaquismo','Sedentarismo','Obesidad','Hipertensión','Dislipidemia','Prediabetes'];
  const flags = [ageFactor, s.famHist, s.smoking, s.sedentary, s.obesity, s.htn, s.dyslipidemia, s.prediabetes];
  let count = flags.filter(Boolean).length;
  if (s.highHdl) count = Math.max(0, count - 1);
  const activeLabels = labels.filter((_,i)=>flags[i]);
  return { category: count >= 2 ? 'moderado' : 'bajo', count, activeLabels };
}

function updateAcsm(){
  const { category, activeLabels } = calcAcsm(state.acsm);
  const badge = document.getElementById('acsm-cat-badge');
  const {color,label,bg} =
    category==='bajo'     ? {color:'#4ade80',label:'Riesgo bajo',bg:'#4ade8010'} :
    category==='moderado' ? {color:'#fbbf24',label:'Riesgo moderado',bg:'#fbbf2410'} :
                             {color:'#ef4444',label:'Riesgo alto',bg:'#ef444410'};
  badge.style.color=color; badge.style.borderColor=color+'44'; badge.style.background=bg; badge.textContent=label;

  const list = document.getElementById('acsm-factor-list');
  if (state.acsm.knownDisease || state.acsm.symptoms) {
    list.textContent = 'Enfermedad conocida o síntomas presentes — clasificación Alto independiente del conteo.';
  } else if (!activeLabels || activeLabels.length === 0) {
    list.textContent = 'Ningún factor marcado.';
  } else {
    list.textContent = activeLabels.join(', ') + (state.acsm.highHdl ? ' (HDL alto resta 1 factor)' : '');
  }
  renderFITT();
}

// ── Gauge ─────────────────────────────────────────────────────────────
```

- [ ] **Step 3: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("tab-acsm panel", 'id="tab-acsm"' in html),
    ("acsm-ck-knowndisease", 'id="acsm-ck-knowndisease"' in html),
    ("acsm-ck-symptoms", 'id="acsm-ck-symptoms"' in html),
    ("acsm-cat-badge", 'id="acsm-cat-badge"' in html),
    ("state.acsm", "acsm: { sex:'M', age:50, famHist:false" in html),
    ("calcAcsm function", "function calcAcsm(s){" in html),
    ("updateAcsm function", "function updateAcsm(){" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 4: Verificación lógica (Node) — reglas de categorización**

```javascript
// D:/modfisioresp/_tmp_verify_task5.js
function calcAcsm(s){
  if (s.knownDisease || s.symptoms) return { category: 'alto', count: null };
  const ageFactor = (s.sex === 'M' && s.age >= 45) || (s.sex === 'F' && s.age >= 55);
  const flags = [ageFactor, s.famHist, s.smoking, s.sedentary, s.obesity, s.htn, s.dyslipidemia, s.prediabetes];
  let count = flags.filter(Boolean).length;
  if (s.highHdl) count = Math.max(0, count - 1);
  return { category: count >= 2 ? 'moderado' : 'bajo', count };
}
const base = {sex:'M',age:30,famHist:false,smoking:false,sedentary:false,obesity:false,htn:false,dyslipidemia:false,prediabetes:false,highHdl:false,knownDisease:false,symptoms:false};
const t1 = calcAcsm(base);
const t2 = calcAcsm({...base, htn:true, dyslipidemia:true});
const t3 = calcAcsm({...base, htn:true, dyslipidemia:true, highHdl:true});
const t4 = calcAcsm({...base, symptoms:true});
console.log(JSON.stringify({t1,t2,t3,t4}));
const checks = [
  ['0 factores -> bajo', t1.category === 'bajo' && t1.count === 0],
  ['2 factores -> moderado', t2.category === 'moderado' && t2.count === 2],
  ['HDL alto resta 1 factor (2->1, sigue bajo)', t3.category === 'bajo' && t3.count === 1],
  ['sintomas fuerza alto sin importar conteo', t4.category === 'alto'],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task5.js`
Expected: las 4 comparaciones imprimen OK.

- [ ] **Step 5: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task5.js
git add modules/riesgo_cv.html
git commit -m "feat: agregar pestana ACSM (estratificacion de factores) a riesgo_cv"
```

---

### Task 6: Integración FITT — `getActiveRisk()` dispatcher

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: `calcFram(s)`, `calcScore2(s)`, `calcAssign(s)`, `calcQrisk(s)` (Tasks 1–4), `state.activeScale`, `state.lastNumericRisk` (Task 1).
- Produces: `getActiveRisk()` → number. `renderFITT()` ahora usa `getActiveRisk()` en vez de `calcFram(state.fram).risk` directamente.

- [ ] **Step 1: Reemplazar `renderFITT()` para usar el dispatcher**

Localizar:
```javascript
function renderFITT(){
  const {risk}=calcFram(state.fram);
  document.getElementById('fitt-output').innerHTML=fittHTML(getFITT(risk,state.killip), !!state.killip);
}
```
Reemplazar con:
```javascript
function getActiveRisk(){
  if (state.activeScale === 'acsm') {
    return state.lastNumericRisk ?? calcFram(state.fram).risk;
  }
  const calcMap = { fram: calcFram, score2: calcScore2, assign: calcAssign, qrisk: calcQrisk };
  const calc = calcMap[state.activeScale];
  const { risk } = calc(state[state.activeScale]);
  state.lastNumericRisk = risk;
  return risk;
}

function renderFITT(){
  const risk = getActiveRisk();
  document.getElementById('fitt-output').innerHTML=fittHTML(getFITT(risk,state.killip), !!state.killip);
}
```

- [ ] **Step 2: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("getActiveRisk function", "function getActiveRisk(){" in html),
    ("renderFITT usa getActiveRisk", "const risk = getActiveRisk();" in html),
    ("calcMap incluye las 4 escalas numericas", "{ fram: calcFram, score2: calcScore2, assign: calcAssign, qrisk: calcQrisk }" in html),
    ("fallback acsm a lastNumericRisk", "state.lastNumericRisk ?? calcFram(state.fram).risk" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Verificación manual en navegador**

```bash
python -m http.server 8000
```
Abrir `http://localhost:8000/modules/riesgo_cv.html` directamente (sin iframe) y:
1. En la pestaña Framingham, subir la edad al máximo (79) y la PAS al máximo (200) sin tratar — el bloque FITT debe mostrar la prescripción de riesgo alto.
2. Cambiar a la pestaña QRISK, marcar FA y ERC — el bloque FITT (debajo de las pestañas) debe cambiar para reflejar el riesgo de QRISK, no el de Framingham.
3. Cambiar a la pestaña ACSM sin haber tocado ninguna otra — el bloque FITT debe seguir mostrando el % de la última pestaña numérica visitada (QRISK del paso 2), no resetear a Framingham.
4. Seleccionar un Killip (ej. Killip II) — el FITT debe seguir respondiendo a Killip exactamente igual que antes del refactor, sin importar la pestaña activa.

- [ ] **Step 4: Commit**

```bash
git add modules/riesgo_cv.html
git commit -m "feat: FITT reacciona al riesgo de la pestana activa via getActiveRisk"
```

---

### Task 7: Disclaimer educativo

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: ninguno nuevo (solo HTML estático).
- Produces: bloque visible `#scale-disclaimer` en el HTML.

- [ ] **Step 1: Insertar el disclaimer entre la intro del módulo y el panel `tab-fram`**

Localizar:
```html
  <!-- ── CALCULADORA FRAMINGHAM ── -->
  <div class="panel active" id="tab-fram">
```
Reemplazar con:
```html
  <div id="scale-disclaimer" style="font-size:11.5px;color:var(--text3);background:var(--card2);border:1px solid var(--border);border-radius:var(--rs);padding:.6rem .9rem;margin-bottom:1.25rem;line-height:1.5">
    ℹ SCORE2, ASSIGN y QRISK se calculan con <strong>aproximaciones educativas calibradas</strong>, no con el algoritmo clínico oficial. Framingham y ACSM siguen sus tablas/criterios reales publicados.
  </div>

  <!-- ── CALCULADORA FRAMINGHAM ── -->
  <div class="panel active" id="tab-fram">
```

- [ ] **Step 2: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("disclaimer presente", 'id="scale-disclaimer"' in html),
    ("disclaimer antes de tab-fram", html.index('id="scale-disclaimer"') < html.index('id="tab-fram"')),
    ("menciona aproximaciones educativas", "aproximaciones educativas calibradas" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Commit**

```bash
git add modules/riesgo_cv.html
git commit -m "feat: agregar disclaimer educativo sobre fidelidad de SCORE2/ASSIGN/QRISK"
```

---

### Task 8: Crear `data/cases-riesgo-cv.js` con los 10 casos clínicos

**Files:**
- Create: `data/cases-riesgo-cv.js`

**Interfaces:**
- Produces: global `RIESGO_CV_CASES` (array de 10 objetos `{id,name,age,sex,vignette,sbp,tc,hdl,bpTreated,smoking:{status,cigsPerDay,quitMonthsAgo},bmi,ethnicity,diabetes,famHist,afib,ckd,ses,sedentary,dyslipidemiaTx,prediabetic?}`).
- Consumes: nada (archivo de datos puro, sin dependencias).

- [ ] **Step 1: Crear el archivo con los 10 perfiles**

Crear `data/cases-riesgo-cv.js`:
```javascript
/* ── Riesgo CV: 10 casos clínicos preconfigurados ── */
/* Perfil unificado por caso — applyCaseToScales() en riesgo_cv.html deriva
   de aquí los campos especificos de cada una de las 5 escalas. */

const RIESGO_CV_CASES = [
  { id:1, name:'María Dolores Ruiz', age:45, sex:'F',
    vignette:'45 años, físicamente activa, sin antecedentes. Perfil lipídico óptimo.',
    sbp:112, tc:178, hdl:62, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:23, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:3, sedentary:false, dyslipidemiaTx:false },

  { id:2, name:'Antonio Gómez', age:50, sex:'M',
    vignette:'Hipertensión tratada y controlada. Exfumador desde hace 5 años.',
    sbp:134, tc:205, hdl:45, bpTreated:true,
    smoking:{status:'ex', cigsPerDay:0, quitMonthsAgo:60},
    bmi:26, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:4, sedentary:false, dyslipidemiaTx:true },

  { id:3, name:'Carmen Salas', age:55, sex:'F',
    vignette:'Sedentaria, HDL bajo. Madre con IAM a los 58 años.',
    sbp:128, tc:230, hdl:38, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:27, ethnicity:'white', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:4, sedentary:true, dyslipidemiaTx:false },

  { id:4, name:'Jorge Paredes', age:58, sex:'M',
    vignette:'Fumador activo (20 cig/día), hipertensión sin tratamiento, sedentario.',
    sbp:158, tc:215, hdl:41, bpTreated:false,
    smoking:{status:'current', cigsPerDay:20, quitMonthsAgo:null},
    bmi:28, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:5, sedentary:true, dyslipidemiaTx:false },

  { id:5, name:'Manuel Torres', age:62, sex:'M',
    vignette:'Diabetes tipo 2, obesidad (IMC 32), dislipidemia tratada, sedentario.',
    sbp:148, tc:240, hdl:36, bpTreated:true,
    smoking:{status:'ex', cigsPerDay:0, quitMonthsAgo:24},
    bmi:32, ethnicity:'white', diabetes:'type2', famHist:false, afib:false, ckd:false,
    ses:5, sedentary:true, dyslipidemiaTx:true },

  { id:6, name:'Lucía Fernández', age:60, sex:'F',
    vignette:'Fumadora intensa (25 cig/día). Padre con IAM a los 52 años.',
    sbp:142, tc:225, hdl:44, bpTreated:false,
    smoking:{status:'current', cigsPerDay:25, quitMonthsAgo:null},
    bmi:25, ethnicity:'white', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:4, sedentary:false, dyslipidemiaTx:false },

  { id:7, name:'Ricardo Núñez', age:67, sex:'M',
    vignette:'Fibrilación auricular conocida y enfermedad renal crónica estadio 4. Lípidos y PA bien controlados.',
    sbp:138, tc:198, hdl:48, bpTreated:true,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:27, ethnicity:'white', diabetes:'type2', famHist:false, afib:true, ckd:true,
    ses:4, sedentary:true, dyslipidemiaTx:true },

  { id:8, name:'Suresh Patel', age:48, sex:'M',
    vignette:'Etnia surasiática. Hermano con IAM a los 50 años. Resto del perfil casi óptimo.',
    sbp:124, tc:190, hdl:50, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:24, ethnicity:'southAsian', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:3, sedentary:false, dyslipidemiaTx:false },

  { id:9, name:'Esperanza Molina', age:56, sex:'F',
    vignette:'Nivel socioeconómico muy desfavorecido. Resto de factores moderados.',
    sbp:136, tc:210, hdl:46, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:26, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:7, sedentary:true, dyslipidemiaTx:false },

  { id:10, name:'Felipe Castaño', age:50, sex:'M',
    vignette:'No fumador, PA y lípidos casi normales, pero sedentario, obeso (IMC 31), prediabético y con antecedente familiar.',
    sbp:126, tc:195, hdl:47, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:31, ethnicity:'white', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:4, sedentary:true, dyslipidemiaTx:false, prediabetic:true },
];
```

- [ ] **Step 2: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/data/cases-riesgo-cv.js", encoding="utf-8") as f:
    content = f.read()
checks = [
    ("declara RIESGO_CV_CASES", "const RIESGO_CV_CASES = [" in content),
    ("10 entradas id:", content.count("id:") == 10),
    ("caso 7 tiene afib:true", "afib:true, ckd:true" in content),
    ("caso 8 etnia southAsian", "ethnicity:'southAsian'" in content),
    ("caso 9 ses:7", "ses:7" in content),
    ("caso 10 prediabetic:true", "prediabetic:true" in content),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Verificación de datos (Node) — 10 casos, ids únicos 1-10, edades en rango 42-68**

```javascript
// D:/modfisioresp/_tmp_verify_task8.js
const fs = require('fs');
const code = fs.readFileSync('D:/modfisioresp/data/cases-riesgo-cv.js', 'utf-8');
// "const" no se filtra fuera de un eval() directo — se recupera el valor
// evaluando la referencia final dentro del mismo eval.
const RIESGO_CV_CASES = eval(code + '\nRIESGO_CV_CASES');
console.log('total casos:', RIESGO_CV_CASES.length);
const ids = RIESGO_CV_CASES.map(c => c.id);
const uniqueIds = new Set(ids);
const agesInRange = RIESGO_CV_CASES.every(c => c.age >= 42 && c.age <= 68);
const allHaveVignette = RIESGO_CV_CASES.every(c => typeof c.vignette === 'string' && c.vignette.length > 0);
const allHaveSmokingObj = RIESGO_CV_CASES.every(c => c.smoking && ['never','ex','current'].includes(c.smoking.status));
const checks = [
  ['10 casos', RIESGO_CV_CASES.length === 10],
  ['ids unicos 1-10', uniqueIds.size === 10 && ids.every(id => id >= 1 && id <= 10)],
  ['edades en rango 42-68', agesInRange],
  ['todas tienen vignette', allHaveVignette],
  ['todas tienen smoking.status valido', allHaveSmokingObj],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task8.js`
Expected: las 5 comparaciones imprimen OK.

- [ ] **Step 4: Borrar script temporal y commit**

```bash
rm D:/modfisioresp/_tmp_verify_task8.js
git add data/cases-riesgo-cv.js
git commit -m "feat: agregar 10 casos clinicos preconfigurados para riesgo_cv"
```

---

### Task 9: Selector de casos clínicos — UI + mapeo a las 5 pestañas + sincronización de inputs

**Files:**
- Modify: `modules/riesgo_cv.html`

**Interfaces:**
- Consumes: `RIESGO_CV_CASES` (Task 8, global cargado vía `<script src>`), `state.fram/score2/assign/qrisk/acsm` (Tasks 1–5), `updateFram()/updateScore2()/updateAssign()/updateQrisk()/updateAcsm()` (Tasks 1–5), `renderFITT()` (Task 6).
- Produces: `smokingCatFor(s)`, `applyCaseToScales(c)`, `syncAllInputsFromState()` (+ helpers `syncFram()`, `syncScore2()`, `syncAssign()`, `syncQrisk()`, `syncAcsm()`), `loadCase(id)`, `clearCase()`.

- [ ] **Step 1: Cargar el archivo de datos**

Localizar:
```html
<link rel="stylesheet" href="../assets/css/fisioresp.css">
```
Reemplazar con:
```html
<link rel="stylesheet" href="../assets/css/fisioresp.css">
<script src="../data/cases-riesgo-cv.js"></script>
```

- [ ] **Step 2: Insertar la fila de chips + tarjeta de viñeta, antes del disclaimer**

Localizar:
```html
  <div id="scale-disclaimer" style="font-size:11.5px;color:var(--text3);background:var(--card2);border:1px solid var(--border);border-radius:var(--rs);padding:.6rem .9rem;margin-bottom:1.25rem;line-height:1.5">
```
Reemplazar con:
```html
  <div class="group-label" style="margin-top:.5rem">Casos clínicos preconfigurados</div>
  <div id="case-chips" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:.75rem"></div>
  <div id="case-vignette" style="display:none;font-size:12.5px;color:var(--text2);background:rgba(244,114,182,.06);border:1px solid rgba(244,114,182,.2);border-radius:var(--rs);padding:.6rem .9rem;margin-bottom:1.25rem;line-height:1.5"></div>

  <div id="scale-disclaimer" style="font-size:11.5px;color:var(--text3);background:var(--card2);border:1px solid var(--border);border-radius:var(--rs);padding:.6rem .9rem;margin-bottom:1.25rem;line-height:1.5">
```

- [ ] **Step 3: Agregar las funciones de sincronización por pestaña**

Localizar (justo antes de `// ── Init ──`):
```javascript
// ── Init ──────────────────────────────────────────────────────────────
renderKillip();
updateFram();
```
Reemplazar con:
```javascript
// ── Sincronizacion de inputs DOM a partir del state (para casos clinicos) ──
function syncFram(){
  document.getElementById('fram-btn-M').className='tbtn'+(state.fram.sex==='M'?' on':'');
  document.getElementById('fram-btn-F').className='tbtn'+(state.fram.sex==='F'?' on-pink':'');
  document.getElementById('fram-sl-age').value=state.fram.age;
  document.getElementById('fram-v-age').textContent=state.fram.age+' años';
  document.getElementById('fram-sl-tc').value=state.fram.tc;
  document.getElementById('fram-v-tc').textContent=state.fram.tc+' mg/dL';
  document.getElementById('fram-sl-hdl').value=state.fram.hdl;
  document.getElementById('fram-v-hdl').textContent=state.fram.hdl+' mg/dL';
  document.getElementById('fram-sl-sbp').value=state.fram.sbp;
  document.getElementById('fram-v-sbp').textContent=state.fram.sbp+' mmHg';
  document.getElementById('fram-ck-treated').checked=state.fram.bpTreated;
  document.getElementById('fram-ck-smoke').checked=state.fram.smoking;
}

function syncScore2(){
  document.getElementById('score2-btn-M').className='tbtn'+(state.score2.sex==='M'?' on':'');
  document.getElementById('score2-btn-F').className='tbtn'+(state.score2.sex==='F'?' on-pink':'');
  document.getElementById('score2-sl-age').value=state.score2.age;
  document.getElementById('score2-v-age').textContent=state.score2.age+' años';
  document.getElementById('score2-sl-sbp').value=state.score2.sbp;
  document.getElementById('score2-v-sbp').textContent=state.score2.sbp+' mmHg';
  document.getElementById('score2-sl-tc').value=state.score2.tc;
  document.getElementById('score2-v-tc').textContent=state.score2.tc+' mg/dL';
  document.getElementById('score2-sl-hdl').value=state.score2.hdl;
  document.getElementById('score2-v-hdl').textContent=state.score2.hdl+' mg/dL';
  document.getElementById('score2-v-nonhdl').textContent=state.score2.tc-state.score2.hdl;
  document.getElementById('score2-ck-smoke').checked=state.score2.smoking;
  ['low','moderate','high','veryhigh'].forEach(k=>{
    document.getElementById('score2-region-'+k).className='tbtn'+(k===state.score2.region?' on':'');
  });
}

function syncAssign(){
  document.getElementById('assign-btn-M').className='tbtn'+(state.assign.sex==='M'?' on':'');
  document.getElementById('assign-btn-F').className='tbtn'+(state.assign.sex==='F'?' on-pink':'');
  document.getElementById('assign-sl-age').value=state.assign.age;
  document.getElementById('assign-v-age').textContent=state.assign.age+' años';
  document.getElementById('assign-sl-sbp').value=state.assign.sbp;
  document.getElementById('assign-v-sbp').textContent=state.assign.sbp+' mmHg';
  document.getElementById('assign-sl-tc').value=state.assign.tc;
  document.getElementById('assign-v-tc').textContent=state.assign.tc+' mg/dL';
  document.getElementById('assign-sl-hdl').value=state.assign.hdl;
  document.getElementById('assign-v-hdl').textContent=state.assign.hdl+' mg/dL';
  document.getElementById('assign-v-ratio').textContent=(state.assign.tc/state.assign.hdl).toFixed(1);
  document.getElementById('assign-ck-smoke').checked=state.assign.smoking;
  document.getElementById('assign-sl-cigs').disabled=!state.assign.smoking;
  document.getElementById('assign-sl-cigs').value=state.assign.cigsPerDay;
  document.getElementById('assign-v-cigs').textContent=state.assign.cigsPerDay;
  document.getElementById('assign-ck-famhist').checked=state.assign.famHist;
  document.getElementById('assign-ck-diabetes').checked=state.assign.diabetes;
  document.getElementById('assign-sl-ses').value=state.assign.ses;
  document.getElementById('assign-v-ses').textContent=state.assign.ses;
}

function syncQrisk(){
  document.getElementById('qrisk-btn-M').className='tbtn'+(state.qrisk.sex==='M'?' on':'');
  document.getElementById('qrisk-btn-F').className='tbtn'+(state.qrisk.sex==='F'?' on-pink':'');
  document.getElementById('qrisk-sl-age').value=state.qrisk.age;
  document.getElementById('qrisk-v-age').textContent=state.qrisk.age+' años';
  document.getElementById('qrisk-sel-ethnicity').value=state.qrisk.ethnicity;
  document.getElementById('qrisk-sl-bmi').value=state.qrisk.bmi;
  document.getElementById('qrisk-v-bmi').textContent=state.qrisk.bmi+' kg/m²';
  document.getElementById('qrisk-sl-sbp').value=state.qrisk.sbp;
  document.getElementById('qrisk-v-sbp').textContent=state.qrisk.sbp+' mmHg';
  document.getElementById('qrisk-sl-tc').value=state.qrisk.tc;
  document.getElementById('qrisk-v-tc').textContent=state.qrisk.tc+' mg/dL';
  document.getElementById('qrisk-sl-hdl').value=state.qrisk.hdl;
  document.getElementById('qrisk-v-hdl').textContent=state.qrisk.hdl+' mg/dL';
  document.getElementById('qrisk-v-ratio').textContent=(state.qrisk.tc/state.qrisk.hdl).toFixed(1);
  document.getElementById('qrisk-sel-smoking').value=state.qrisk.smokingCat;
  document.getElementById('qrisk-sel-diabetes').value=state.qrisk.diabetes;
  document.getElementById('qrisk-ck-famhist').checked=state.qrisk.famHist;
  document.getElementById('qrisk-ck-afib').checked=state.qrisk.afib;
  document.getElementById('qrisk-ck-ckd').checked=state.qrisk.ckd;
}

function syncAcsm(){
  document.getElementById('acsm-btn-M').className='tbtn'+(state.acsm.sex==='M'?' on':'');
  document.getElementById('acsm-btn-F').className='tbtn'+(state.acsm.sex==='F'?' on-pink':'');
  document.getElementById('acsm-sl-age').value=state.acsm.age;
  document.getElementById('acsm-v-age').textContent=state.acsm.age+' años';
  document.getElementById('acsm-ck-famhist').checked=state.acsm.famHist;
  document.getElementById('acsm-ck-smoke').checked=state.acsm.smoking;
  document.getElementById('acsm-ck-sedentary').checked=state.acsm.sedentary;
  document.getElementById('acsm-ck-obesity').checked=state.acsm.obesity;
  document.getElementById('acsm-ck-htn').checked=state.acsm.htn;
  document.getElementById('acsm-ck-dyslipidemia').checked=state.acsm.dyslipidemia;
  document.getElementById('acsm-ck-prediabetes').checked=state.acsm.prediabetes;
  document.getElementById('acsm-ck-highhdl').checked=state.acsm.highHdl;
  document.getElementById('acsm-ck-knowndisease').checked=state.acsm.knownDisease;
  document.getElementById('acsm-ck-symptoms').checked=state.acsm.symptoms;
}

function syncAllInputsFromState(){
  syncFram(); syncScore2(); syncAssign(); syncQrisk(); syncAcsm();
}

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

function renderCaseChips(){
  const wrap = document.getElementById('case-chips');
  RIESGO_CV_CASES.forEach(c=>{
    const btn = document.createElement('button');
    btn.className='tbtn case-chip';
    btn.id='case-chip-'+c.id;
    btn.textContent='Caso '+c.id;
    btn.style.flex='none';
    btn.onclick=()=>loadCase(c.id);
    wrap.appendChild(btn);
  });
  const manualBtn = document.createElement('button');
  manualBtn.className='tbtn case-chip';
  manualBtn.textContent='Entrada manual';
  manualBtn.style.flex='none';
  manualBtn.onclick=clearCase;
  wrap.appendChild(manualBtn);
}

// ── Init ──────────────────────────────────────────────────────────────
renderKillip();
renderCaseChips();
updateFram();
```

- [ ] **Step 4: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("script cases-riesgo-cv cargado", 'src="../data/cases-riesgo-cv.js"' in html),
    ("case-chips container", 'id="case-chips"' in html),
    ("case-vignette container", 'id="case-vignette"' in html),
    ("syncAllInputsFromState function", "function syncAllInputsFromState(){" in html),
    ("applyCaseToScales function", "function applyCaseToScales(c){" in html),
    ("region no se sobreescribe", "...state.score2, sex:c.sex" in html),
    ("loadCase function", "function loadCase(id){" in html),
    ("clearCase function", "function clearCase(){" in html),
    ("renderCaseChips llamado en init", "renderCaseChips();" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 5: Verificación numérica (Node) — los 4 casos de contraste producen las divergencias esperadas**

```javascript
// D:/modfisioresp/_tmp_verify_task9.js
const fs = require('fs');
const casesCode = fs.readFileSync('D:/modfisioresp/data/cases-riesgo-cv.js', 'utf-8');
const RIESGO_CV_CASES = eval(casesCode + '\nRIESGO_CV_CASES');

function calcFram(s){
  const {sex,age,tc,hdl,sbp,bpTreated,smoking} = s;
  let pts=0; const bd={};
  const ageRowM=[[-9,34],[-4,39],[0,44],[3,49],[6,54],[8,59],[10,64],[11,69],[12,74],[13,99]];
  const ageRowF=[[-7,34],[-3,39],[0,44],[3,49],[6,54],[8,59],[10,64],[12,69],[14,74],[16,99]];
  bd.age=(sex==='M'?ageRowM:ageRowF).find(([,max])=>age<=max)[0];
  pts+=bd.age;
  const ag=age<40?0:age<50?1:age<60?2:age<70?3:4;
  const tb=tc<160?0:tc<200?1:tc<240?2:tc<280?3:4;
  const tcM=[[0,4,7,9,11],[0,3,5,6,8],[0,2,3,4,5],[0,1,1,2,3],[0,0,0,1,1]];
  const tcF=[[0,4,8,11,13],[0,3,6,8,10],[0,2,4,5,7],[0,1,2,3,4],[0,1,1,2,2]];
  bd.tc=(sex==='M'?tcM:tcF)[ag][tb];
  pts+=bd.tc;
  bd.hdl=hdl>=60?-1:hdl>=50?0:hdl>=40?1:2;
  pts+=bd.hdl;
  const sb=sbp<120?0:sbp<130?1:sbp<140?2:sbp<160?3:4;
  const sbpM=[[0,0,1,1,2],[0,1,2,2,3]];
  const sbpF=[[0,1,2,3,4],[0,3,4,5,6]];
  bd.sbp=(sex==='M'?sbpM:sbpF)[bpTreated?1:0][sb];
  pts+=bd.sbp;
  const smkArr=[9,7,4,2,1];
  bd.smoke=smoking?smkArr[ag]:0;
  pts+=bd.smoke;
  let risk;
  if(sex==='M'){
    const tM=[0.5,1,1,1,1,2,2,3,4,5,6,8,10,12,16,20,25,30];
    risk=tM[Math.max(0,Math.min(17,pts<=0?0:pts))];
  } else {
    if(pts<=9) risk=0.5;
    else if(pts>=25) risk=30;
    else { const tF=[1,1,1,2,2,3,4,5,6,8,11,14,17,22,27]; risk=tF[pts-10]; }
  }
  return {risk};
}
function calcScore2(s){
  const { sex, age, sbp, tc, hdl, smoking, region } = s;
  const noHdl = tc - hdl;
  const cAge = (age - 60) / 5;
  let x = 0.32*cAge + (smoking ? 0.62 - 0.20*cAge : 0)
        + 0.025*(sbp-120) - 0.003*cAge*(sbp-120)
        + 0.018*(noHdl-130) - 0.002*cAge*(noHdl-130);
  if (sex === 'F') x *= 0.85;
  const baseline = { low: 0.018, moderate: 0.028, high: 0.042, veryhigh: 0.06 }[region];
  let risk = 100 * (1 - Math.pow(1 - baseline, Math.exp(x)));
  return { risk: Math.max(0.5, Math.min(50, risk)) };
}
function calcAssign(s){
  const { sex, age, sbp, tc, hdl, smoking, cigsPerDay, famHist, diabetes, ses } = s;
  const ratio = tc / hdl;
  let pts = (age - 30) * 0.9 + Math.max(0, sbp - 120) * 0.12 + Math.max(0, ratio - 4) * 2.5
          + (smoking ? 4 + cigsPerDay * 0.15 : 0) + (famHist ? 4 : 0) + (diabetes ? 6 : 0) + (ses - 4) * 1.2;
  if (sex === 'F') pts *= 0.9;
  return { risk: Math.max(0.5, Math.min(50, pts * 0.55)) };
}
function calcQrisk(s){
  const { sex, age, ethnicity, bmi, sbp, tc, hdl, smokingCat, diabetes, famHist, afib, ckd } = s;
  const ratio = tc / hdl;
  const ethMult = { white:1, southAsian:1.4, black:0.7, eastAsian:0.6, mixed:1.1 }[ethnicity];
  const smokeMult = [0, 1.3, 1.8, 2.3, 3.0][smokingCat];
  let x = (age - 50) * 0.085 + Math.max(0, sbp - 120) * 0.018 + Math.max(0, ratio - 4) * 0.22
        + Math.max(0, bmi - 25) * 0.04 + Math.log(ethMult) + Math.log(smokeMult || 1)
        + (diabetes === 'type2' ? 1.0 : diabetes === 'type1' ? 1.4 : 0)
        + (famHist ? 0.45 : 0) + (afib ? 1.1 : 0) + (ckd ? 1.0 : 0);
  if (sex === 'F') x *= 0.9;
  let risk = 100 * (1 - Math.pow(0.98, Math.exp(x)));
  return { risk: Math.max(0.5, Math.min(60, risk)) };
}
function calcAcsm(s){
  if (s.knownDisease || s.symptoms) return { category: 'alto', count: null };
  const ageFactor = (s.sex === 'M' && s.age >= 45) || (s.sex === 'F' && s.age >= 55);
  let count = [ageFactor, s.famHist, s.smoking, s.sedentary, s.obesity, s.htn, s.dyslipidemia, s.prediabetes].filter(Boolean).length;
  if (s.highHdl) count = Math.max(0, count - 1);
  return { category: count >= 2 ? 'moderado' : 'bajo', count };
}
function smokingCatFor(s){
  if (s.status === 'never') return 0;
  if (s.status === 'ex') return 1;
  return s.cigsPerDay < 10 ? 2 : s.cigsPerDay < 20 ? 3 : 4;
}
function computeAll(c){
  const isCurrent = c.smoking.status === 'current';
  const acsmSmoking = isCurrent || (c.smoking.status === 'ex' && c.smoking.quitMonthsAgo != null && c.smoking.quitMonthsAgo < 6);
  return {
    fram: calcFram({sex:c.sex, age:c.age, tc:c.tc, hdl:c.hdl, sbp:c.sbp, bpTreated:c.bpTreated, smoking:isCurrent}).risk,
    score2: calcScore2({sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent, region:'low'}).risk,
    assign: calcAssign({sex:c.sex, age:c.age, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smoking:isCurrent, cigsPerDay:c.smoking.cigsPerDay||0, famHist:c.famHist, diabetes:c.diabetes!=='none', ses:c.ses}).risk,
    qrisk: calcQrisk({sex:c.sex, age:c.age, ethnicity:c.ethnicity, bmi:c.bmi, sbp:c.sbp, tc:c.tc, hdl:c.hdl, smokingCat:smokingCatFor(c.smoking), diabetes:c.diabetes, famHist:c.famHist, afib:c.afib, ckd:c.ckd}).risk,
    acsm: calcAcsm({sex:c.sex, age:c.age, famHist:c.famHist, smoking:acsmSmoking, sedentary:c.sedentary, obesity:c.bmi>=30, htn:c.sbp>=130||c.bpTreated, dyslipidemia:c.hdl<40||c.dyslipidemiaTx||c.tc>=200, prediabetes:!!c.prediabetic, highHdl:c.hdl>=60, knownDisease:(c.diabetes!=='none')||c.ckd, symptoms:false}),
  };
}

const c7 = computeAll(RIESGO_CV_CASES.find(c=>c.id===7));
const c8 = computeAll(RIESGO_CV_CASES.find(c=>c.id===8));
const c9 = computeAll(RIESGO_CV_CASES.find(c=>c.id===9));
const c10 = computeAll(RIESGO_CV_CASES.find(c=>c.id===10));
console.log('caso7', JSON.stringify(c7));
console.log('caso8', JSON.stringify(c8));
console.log('caso9', JSON.stringify(c9));
console.log('caso10', JSON.stringify(c10));

const checks = [
  ['caso7: QRISK supera a Framingham por >=30 puntos (FA+ERC)', c7.qrisk - c7.fram >= 30],
  ['caso7: QRISK supera a SCORE2 por >=30 puntos', c7.qrisk - c7.score2 >= 30],
  ['caso8: QRISK > Framingham (etnia+hist.familiar)', c8.qrisk > c8.fram],
  ['caso8: QRISK > SCORE2', c8.qrisk > c8.score2],
  ['caso9: ASSIGN es la mas alta de las 4 escalas numericas (privacion)', c9.assign > c9.fram && c9.assign > c9.score2 && c9.assign > c9.qrisk],
  ['caso10: Framingham, SCORE2 y QRISK todas <10% (bajo)', c10.fram < 10 && c10.score2 < 10 && c10.qrisk < 10],
  ['caso10: ACSM es moderado (conteo >=2) mientras las 3 anteriores son bajo', c10.acsm.category === 'moderado'],
];
let allOk = true;
for (const [name, ok] of checks) { console.log(name+':', ok?'OK':'FAIL'); if(!ok) allOk=false; }
if (!allOk) process.exit(1);
```
Run: `node D:/modfisioresp/_tmp_verify_task9.js`
Expected: las 7 comparaciones imprimen OK (verificado manualmente con los mismos coeficientes antes de escribir este plan — ver justificación en el spec).

- [ ] **Step 6: Borrar script temporal**

```bash
rm D:/modfisioresp/_tmp_verify_task9.js
```

- [ ] **Step 7: Verificación manual en navegador**

```bash
python -m http.server 8000
```
Abrir `http://localhost:8000/modules/riesgo_cv.html` y:
1. Hacer clic en "Caso 7" — verificar que aparece la viñeta de Ricardo Núñez, y que las pestañas Framingham/SCORE2/ASSIGN/QRISK/ACSM (revisándolas una por una) ya muestran los valores correctos sin tener que tocar ningún slider.
2. Cambiar la región SCORE2 a "Alto" y luego cargar otro caso — confirmar que la región sigue en "Alto" (no se resetea a "Bajo").
3. Hacer clic en "Entrada manual" — la viñeta debe desaparecer pero los valores de los sliders deben quedar intactos (no resetear a los valores por defecto).

- [ ] **Step 8: Commit**

```bash
git add modules/riesgo_cv.html
git commit -m "feat: agregar selector de 10 casos clinicos a riesgo_cv"
```

---

### Task 10: Actualizar `modules/clase-11.html`

**Files:**
- Modify: `modules/clase-11.html`

**Interfaces:**
- Consumes: ninguno (cambio de texto puro).
- Produces: ninguno (no expone interfaz a otras tareas).

- [ ] **Step 1: Actualizar descripción y footer de la tarjeta del módulo**

Localizar:
```html
        <div class="mod-title">Riesgo Cardiovascular y Prescripción FITT</div>
        <div class="mod-desc">Framingham 2008, gauge de riesgo a 10 años, factores de riesgo modificables y no modificables.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Framingham · SCORE · Gauge · Factores</span>
          </div>
```
Reemplazar con:
```html
        <div class="mod-title">Riesgo Cardiovascular y Prescripción FITT</div>
        <div class="mod-desc">Framingham, SCORE2, ASSIGN, QRISK y estratificación ACSM. Gauge de riesgo a 10 años, factores modificables y no modificables.</div>
        <div class="mod-footer">
          <div style="display:flex;align-items:center;gap:.4rem">
            <div class="mod-dot"></div>
            <span style="font-size:11px;color:var(--text3)">Framingham · SCORE2 · ASSIGN · QRISK · ACSM</span>
          </div>
```

- [ ] **Step 2: Verificación estructural (Python)**

```python
with open("D:/modfisioresp/modules/clase-11.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("mod-desc actualizado", "Framingham, SCORE2, ASSIGN, QRISK y estratificación ACSM" in html),
    ("footer actualizado", "Framingham · SCORE2 · ASSIGN · QRISK · ACSM" in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 3: Commit**

```bash
git add modules/clase-11.html
git commit -m "docs: actualizar tarjeta de modulo en clase-11 con las 5 escalas"
```

---

### Task 11: Verificación manual completa en navegador + commit final

**Files:**
- Ninguno (solo verificación end-to-end de lo construido en Tasks 1–10).

- [ ] **Step 1: Levantar el servidor y abrir el módulo dentro del flujo real (no directo)**

```bash
python -m http.server 8000
```
Abrir `http://localhost:8000/` → Clase 11 → módulo "Riesgo Cardiovascular y Prescripción FITT" (debe abrir en el iframe vía `openModule`, no solo funcionar accedido directamente).

- [ ] **Step 2: Recorrer cada pestaña al extremo de sus controles**

Para Framingham, SCORE2, ASSIGN, QRISK: mover cada slider al mínimo y al máximo, marcar/desmarcar cada checkbox y cambiar cada select. Confirmar en cada caso que:
- El gauge se redibuja (arco y porcentaje cambian, sin quedar en `--%` ni `NaN%`).
- La categoría y color cambian de forma coherente con el riesgo.
- El desglose (`.pts-box`) muestra valores numéricos en cada fila, no `—` después de tocar el control correspondiente.

Para ACSM: marcar y desmarcar cada uno de los 8 factores positivos, el factor negativo (HDL alto) y los 2 disparadores de "Alto" (enfermedad conocida, síntomas). Confirmar que la categoría y la lista de factores se actualizan.

- [ ] **Step 3: Verificar Killip + FITT sin cambios de comportamiento**

Con la pestaña Framingham activa, seleccionar cada uno de los 4 Killip (I-IV) y confirmar que el bloque FITT muestra exactamente las mismas 4 prescripciones que mostraba antes de este cambio (Killip sigue mandando sobre cualquier escala). Deseleccionar Killip y confirmar que el FITT vuelve a basarse en el % de riesgo.

- [ ] **Step 4: Verificar los 10 casos clínicos uno por uno**

Cargar cada uno de los 10 casos (chips "Caso 1" a "Caso 10") y, para cada uno, revisar las 5 pestañas — confirmar visualmente que los valores cargados son razonables y que no hay inputs en blanco o con valores fuera del rango del slider correspondiente. Prestar atención especial a los casos 7, 8, 9 y 10 (los de contraste): confirmar que QRISK se ve claramente más alto que Framingham/SCORE2 en los casos 7 y 8, que ASSIGN se ve más alto que las demás en el caso 9, y que ACSM marca "Riesgo moderado" en el caso 10 mientras Framingham/SCORE2/QRISK muestran porcentajes bajos.

- [ ] **Step 5: Verificar responsive**

Reducir el viewport del navegador a un ancho angosto (ej. 380px, simulando móvil) y confirmar que el layout de `.calc-wrap` pasa a columna única (`flex-direction:column-reverse`) y que las 10 chips de casos clínicos no rompen el layout (deben hacer wrap, no overflow horizontal).

- [ ] **Step 6: Verificación final de integridad del archivo (Python) — todas las funciones e ids de las 5 escalas presentes**

```python
with open("D:/modfisioresp/modules/riesgo_cv.html", encoding="utf-8") as f:
    html = f.read()
checks = [
    ("5 ntabs", html.count("onclick=\"showTab(") == 5),
    ("5 paneles", html.count('class="panel') >= 5),
    ("calcFram", "function calcFram(s){" in html),
    ("calcScore2", "function calcScore2(s){" in html),
    ("calcAssign", "function calcAssign(s){" in html),
    ("calcQrisk", "function calcQrisk(s){" in html),
    ("calcAcsm", "function calcAcsm(s){" in html),
    ("getActiveRisk", "function getActiveRisk(){" in html),
    ("applyCaseToScales", "function applyCaseToScales(c){" in html),
    ("syncAllInputsFromState", "function syncAllInputsFromState(){" in html),
    ("cases-riesgo-cv.js cargado", 'src="../data/cases-riesgo-cv.js"' in html),
    ("disclaimer presente", 'id="scale-disclaimer"' in html),
]
for name, result in checks:
    print(name+":", "OK" if result else "ERROR")
```
Esperado: todos OK.

- [ ] **Step 7: Commit final y push**

```bash
git add -A
git status
git commit -m "feat: completar SCORE2, ASSIGN, QRISK, ACSM y 10 casos clinicos en riesgo_cv" || true
git log --oneline -12
git push origin master
```
Nota: si todas las tareas anteriores ya hicieron su propio commit, `git status` debe mostrar el árbol limpio y `git commit` fallará con "nothing to commit" — el `|| true` evita que eso detenga el script (es solo una red de seguridad para archivos sueltos). Lo importante es que `git push origin master` suba los 10 commits de las tareas anteriores.

---
