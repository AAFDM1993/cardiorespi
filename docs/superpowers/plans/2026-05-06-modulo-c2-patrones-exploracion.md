# C2 — Patrones Respiratorios + Exploración Física

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Actualizar `modules/patrones_resp.html` — corregir navegación de tabs (showTab no estaba definida), agregar 3 patrones nuevos (Respiración Paradójica, Ortopnea, Apnea del Sueño) con waveforms animadas, agregar tab "Exploración Física" con inspección/palpación/percusión/auscultación y tabla de hallazgos por patología; eliminar emojis en ambos módulos de C2 y confirmarlos en git.

**Architecture:** `patrones_resp.html` es vanilla HTML autocontenido que carga solo `fisioresp.css` (sin `ui.js`). Los tabs usan `.p-tabpanel`/`.p-tabbtn` con clase `.active`. La función `showTab` no estaba definida en el archivo, por lo que los tabs no funcionaban. Se define localmente. Los patrones usan Canvas 2D animado por `requestAnimationFrame`. Los estilos están embebidos en `<style>`.

**Tech Stack:** HTML/CSS vanilla, Canvas 2D API, `fisioresp.css` (variables CSS), sin build system, sin emojis, todo en español.

---

## Archivos

| Acción | Archivo |
|--------|---------|
| Modificar | `modules/patrones_resp.html` |
| Modificar | `modules/casos_resp.html` |
| Commit | ambos (actualmente sin versionar) |

---

## Task 1: patrones_resp.html — showTab + 3 patrones nuevos + quitar emoji nav

**Files:**
- Modify: `modules/patrones_resp.html`

- [ ] **Step 1: Agregar `type="button"` y `data-tab` a los botones de tab existentes, agregar botón nuevo y quitar emoji del nav**

Localizar el bloque `<nav>` y `.p-tabbar` en el archivo. Reemplazar:

```html
<nav>
  <div class="nav-logo">🫁 Fisio<span>Resp</span></div>
  <div class="nav-pill">C2 · Evaluación Respiratoria</div>
</nav>
```

por:

```html
<nav>
  <div class="nav-logo">Fisio<span>Resp</span></div>
  <div class="nav-pill">C2 · Evaluación Respiratoria</div>
</nav>
```

Reemplazar el bloque `.p-tabbar`:

```html
<div class="p-tabbar">
  <button class="p-tabbtn active" onclick="showTab('patrones')">Patrones Respiratorios</button>
  <button class="p-tabbtn" onclick="showTab('apta')">Evaluación APTA</button>
  <button class="p-tabbtn" onclick="showTab('abcde')">ABCDE Ref</button>
</div>
```

por:

```html
<div class="p-tabbar">
  <button type="button" class="p-tabbtn active" data-tab="patrones" onclick="showTab('patrones')">Patrones Respiratorios</button>
  <button type="button" class="p-tabbtn" data-tab="apta" onclick="showTab('apta')">Evaluación APTA</button>
  <button type="button" class="p-tabbtn" data-tab="abcde" onclick="showTab('abcde')">ABCDE Ref</button>
  <button type="button" class="p-tabbtn" data-tab="exploracion" onclick="showTab('exploracion')">Exploración Física</button>
</div>
```

- [ ] **Step 2: Agregar grupo "Otros patrones clínicos" en el HTML del tab patrones**

Localizar:

```html
  <div class="group-label">Patrones irregulares / de lesión central</div>
  <div class="pattern-grid" id="grid-irregular"></div>

</div><!-- /tab-patrones -->
```

Reemplazar por:

```html
  <div class="group-label">Patrones irregulares / de lesión central</div>
  <div class="pattern-grid" id="grid-irregular"></div>

  <div class="group-label">Otros patrones clínicos</div>
  <div class="pattern-grid" id="grid-otros"></div>

</div><!-- /tab-patrones -->
```

- [ ] **Step 3: Agregar los 3 patrones nuevos al array P en el `<script>`**

Localizar el cierre del array `P` justo antes del último `];`. El array termina con la entrada `apneustica`. Insertar después de la llave de cierre de `apneustica` y antes de `];`:

```js
  ,
  // ── Otros patrones clínicos ────────────────────────────────────────
  { id:'paradojica', g:'otros', name:'Respiración Paradójica', sub:'Movimiento torácico invertido al esperado', color:'#f43f5e',
    rr:'Variable', vt:'Reducido', rhy:'Variable',
    noteRed:'Signo de fatiga muscular grave o tórax inestable — evaluar soporte ventilatorio',
    ctx:'Fatiga del diafragma, tórax batiente (múltiples fracturas costales), parálisis diafragmática. El tórax se retrae durante la inspiración en lugar de expandirse. Signo de trabajo respiratorio extremo.',
    period:4.0, vis:2.5,
    fn(t){ return 20*Math.sin(2*Math.PI*t); }
  },
  { id:'ortopnea', g:'otros', name:'Ortopnea', sub:'Disnea en decúbito supino · mejora al sentarse', color:'#818cf8',
    rr:'Aumentada en decúbito', vt:'Superficial', rhy:'Regular',
    note:'Marcador de ICC, derrame pleural bilateral o ascitis masiva',
    ctx:'En decúbito, el retorno venoso aumenta → sobrecarga del ventrículo izquierdo → redistribución de líquido al pulmón. Al sentarse, el diafragma desciende y mejora la mecánica ventilatoria. Se cuantifica en "almohadas" (1–3).',
    period:6.0, vis:2.5,
    fn(t){ return -10*Math.sin(2*Math.PI*t); }
  },
  { id:'apnea_sueno', g:'otros', name:'Apnea del Sueño', sub:'Central (falla neural) u Obstructiva (colapso de VAS)', color:'#fb923c',
    rr:'Variable (episodios de 0 rpm)', vt:'Ausente durante pausa', rhy:'Periódico irregular',
    note:'Cese del flujo aéreo ≥ 10 s — activa quimiorreceptores e interrumpe el sueño',
    ctx:'Central: falla del estímulo neural del bulbo (ICC, opiáceos). Obstructiva: colapso de la vía aérea superior a pesar del esfuerzo respiratorio — obesidad, macroglosia, anomalías craneofaciales. Episodios de hipoxemia e hipercapnia. Tratamiento: CPAP/BiPAP.',
    period:8.0, vis:1.5,
    fn(t){
      const p=(t%1);
      if(p>0.40 && p<0.72) return 0;
      return -18*Math.sin(2*Math.PI*t);
    }
  },
```

- [ ] **Step 4: Actualizar la función `render()` para incluir el grupo 'otros'**

Localizar en el `<script>` la función `render()`. Busca la línea:

```js
  ['regular','irregular'].forEach(grp=>{
```

Reemplazar por:

```js
  ['regular','irregular','otros'].forEach(grp=>{
```

- [ ] **Step 5: Agregar la función `showTab` al bloque `<script>`**

Localizar el inicio del bloque `<script>` (justo después de `<script>`). Insertar la función `showTab` al principio del bloque, antes de `const P = [`:

```js
function showTab(id) {
  document.querySelectorAll('.p-tabpanel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.p-tabbtn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + id);
  if (panel) panel.classList.add('active');
  const btn = document.querySelector(`.p-tabbtn[data-tab="${id}"]`);
  if (btn) btn.classList.add('active');
}

```

- [ ] **Step 6: Verificar en navegador**

Abrir `http://localhost:8000/modules/patrones_resp.html`. Confirmar:
- Sin emoji en el nav logo
- 4 botones de tab: Patrones Respiratorios, Evaluación APTA, ABCDE Ref, Exploración Física
- Clic en cada tab: el contenido cambia correctamente (antes estaba roto)
- Tab Patrones muestra 3 grupos: "Patrones con ritmo regular", "Patrones irregulares / de lesión central", "Otros patrones clínicos"
- Las 3 tarjetas nuevas muestran canvas animado y texto clínico correcto
- Respiración Paradójica: onda invertida (va hacia arriba en inspiración)
- Ortopnea: onda superficial y lenta
- Apnea del Sueño: respiración normal → pausa plana → reinicio

---

## Task 2: patrones_resp.html — Tab Exploración Física

**Files:**
- Modify: `modules/patrones_resp.html`

- [ ] **Step 1: Agregar CSS para la tabla de hallazgos al bloque `<style>`**

Localizar el cierre `</style>` del bloque de estilos en el `<head>`. Insertar antes de `</style>`:

```css
/* ── Exploración Física ── */
.ef-table{width:100%;border-collapse:collapse;font-size:12px;margin-top:.5rem}
.ef-table th{text-align:left;padding:7px 10px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--blue);border-bottom:1px solid rgba(56,189,248,.25);background:rgba(56,189,248,.04)}
.ef-table td{padding:7px 10px;color:var(--text2);border-bottom:1px solid var(--border);vertical-align:top;line-height:1.5}
.ef-table tr:last-child td{border-bottom:none}
.ef-table tr:hover td{background:var(--card2)}
```

- [ ] **Step 2: Agregar el panel `#tab-exploracion` completo en el HTML**

Localizar el comentario `<!-- ABCDE REF TAB -->`. Insertar el panel de Exploración Física DESPUÉS del cierre `</div>` del tab ABCDE (antes de `</div><!-- /panel -->`):

Localizar:

```html
</div>

</div><!-- /panel -->
```

(el `</div>` que cierra `#tab-abcde`)

Insertar el panel completo entre esos dos elementos:

```html
<!-- EXPLORACIÓN FÍSICA TAB -->
<div id="tab-exploracion" class="p-tabpanel">
  <div class="infobox">La exploración física del tórax sigue el orden clásico: <strong>Inspección → Palpación → Percusión → Auscultación</strong>. Siempre comparar simétricamente ambos hemitórax. Finalizar con la evaluación de la <strong>voz transmitida</strong>.</div>

  <div class="apta-step">
    <div class="apta-step-hd">
      <div class="apta-num">1</div>
      <div style="font-family:var(--fh);font-size:1rem;font-weight:700">Inspección</div>
    </div>
    <div class="apta-items">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:.5rem">Estática — morfología torácica</div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Tórax normal</div><div class="apta-item-desc">Diámetro anteroposterior (AP) &lt; diámetro transverso — relación AP:T ≈ 1:2. Ángulo costal (Charpy) &lt; 90°.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Tórax en tonel (barrel chest)</div><div class="apta-item-desc">↑ Diámetro AP hasta igualarse con el transverso. Ángulo costal ≥ 90°. Costillas horizontalizadas. Característico del enfisema/EPOC por hiperinsuflación crónica.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Pectus excavatum</div><div class="apta-item-desc">Hundimiento del esternón. Puede comprimir el corazón y limitar la expansión pulmonar. Restricción en casos graves.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Pectus carinatum</div><div class="apta-item-desc">Prominencia del esternón ("pecho de paloma"). Habitualmente sin repercusión funcional significativa.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Cifoescoliosis</div><div class="apta-item-desc">Curvatura vertebral que deforma la caja torácica → ↓compliance → patrón restrictivo. Grave si ángulo de Cobb &gt; 60°.</div></div></div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin:.9rem 0 .5rem">Dinámica — durante la respiración</div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Uso de músculos accesorios</div><div class="apta-item-desc">Esternocleidomastoideo, escalenos, trapecios activos en reposo → signo de trabajo respiratorio aumentado.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Tiraje</div><div class="apta-item-desc">Retracción de partes blandas durante la inspiración por presión intratorácica muy negativa. <strong>Supraclavicular:</strong> obstrucción alta. <strong>Intercostal:</strong> moderado-grave. <strong>Subcostal/epigástrico:</strong> compromiso diafragmático.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Aleteo nasal</div><div class="apta-item-desc">Ensanchamiento rítmico de las narinas en cada inspiración. Signo de distress respiratorio — especialmente relevante en neonatos y lactantes.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Cianosis</div><div class="apta-item-desc"><strong>Central</strong> (labios, lengua, mucosas): hipoxemia grave — SaO₂ &lt; ~85%. <strong>Periférica</strong> (acra, lechos ungueales): puede deberse a vasoconstricción sin hipoxemia sistémica.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Acropaquia (dedos en palillo de tambor)</div><div class="apta-item-desc">Engrosamiento de las últimas falanges, ángulo de Lovibond &gt; 180°. Asociada a hipoxemia crónica, fibrosis pulmonar, bronquiectasias, cardiopatías cianóticas, neoplasias.</div></div></div>
    </div>
  </div>

  <div class="apta-step">
    <div class="apta-step-hd">
      <div class="apta-num">2</div>
      <div style="font-family:var(--fh);font-size:1rem;font-weight:700">Palpación</div>
    </div>
    <div class="apta-items">
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Expansión torácica</div><div class="apta-item-desc">Manos sobre el tórax inferior, pulgares en la línea media. En inspiración profunda la separación debe ser simétrica (≥ 3–5 cm). <strong>Asimetría</strong> → patología ipsilateral (atelectasia, derrame, consolidación, neumotórax).</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Frémito táctil vocal (FTV)</div><div class="apta-item-desc">Palma sobre el tórax mientras el paciente dice "treinta y tres". Comparar simétricamente. <strong>↑FTV:</strong> consolidación — neumonía. <strong>↓ o ausente:</strong> derrame pleural (líquido), neumotórax (aire), obstrucción bronquial.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Desviación traqueal</div><div class="apta-item-desc">Palpar en escotadura yugular. <strong>Hacia el lado afectado:</strong> atelectasia (tracción). <strong>Contralateral:</strong> derrame masivo o neumotórax a tensión (empuje).</div></div></div>
    </div>
  </div>

  <div class="apta-step">
    <div class="apta-step-hd">
      <div class="apta-num">3</div>
      <div style="font-family:var(--fh);font-size:1rem;font-weight:700">Percusión</div>
    </div>
    <div class="apta-items">
      <div class="infobox" style="margin-bottom:.75rem"><strong>Técnica:</strong> dedo medio de la mano no dominante (plexímetro) sobre el espacio intercostal. Golpear con la punta del dedo medio de la mano dominante (plexor). Comparar simétricamente de arriba a abajo.</div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Sonoro / Claro pulmonar</div><div class="apta-item-desc">Tono grave, resonante, larga duración. Normal en pulmón bien aireado.</div></div></div>
      <div class="apta-item"><span style="color:var(--amber);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Matidez</div><div class="apta-item-desc">Tono apagado, sordo, breve. El aire fue desplazado: <strong>consolidación</strong> (neumonía, atelectasia), <strong>derrame pleural</strong>, masa.</div></div></div>
      <div class="apta-item"><span style="color:var(--red);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Timpanismo / Hiperresonancia</div><div class="apta-item-desc">Tono agudo, hueco, larga duración. Exceso de aire: <strong>neumotórax</strong> (timpanismo), <strong>enfisema / hiperinsuflación</strong> (hiperresonancia).</div></div></div>
      <div class="apta-item"><span style="color:var(--text3);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Matidez hepática</div><div class="apta-item-desc">Referencia anatómica normal en hemitórax derecho inferior. Ascenso → hiperinsuflación. Descenso → derrame, hepatomegalia.</div></div></div>
    </div>
  </div>

  <div class="apta-step">
    <div class="apta-step-hd">
      <div class="apta-num">4</div>
      <div style="font-family:var(--fh);font-size:1rem;font-weight:700">Auscultación</div>
    </div>
    <div class="apta-items">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:.5rem">Ruidos normales</div>
      <div class="apta-item"><span style="color:var(--teal);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Murmullo vesicular</div><div class="apta-item-desc">Suave, tono bajo, predominantemente inspiratorio (I:E ≈ 3:1). Normal en la mayoría de campos. Disminuye en derrame, neumotórax, enfisema.</div></div></div>
      <div class="apta-item"><span style="color:var(--teal);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Ruido broncovesicular</div><div class="apta-item-desc">Tono intermedio, I:E = 1:1. Normal solo en región interescapular y 1er–2º espacio intercostal. En otra localización → condensación.</div></div></div>
      <div class="apta-item"><span style="color:var(--teal);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Ruido traqueal / bronquial</div><div class="apta-item-desc">Alta intensidad, espiración &gt; inspiración (I:E = 1:2). Normal solo sobre tráquea. En parénquima → <strong>soplo tubárico</strong> (signo de consolidación).</div></div></div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin:.9rem 0 .5rem">Ruidos adventicios</div>
      <div class="apta-item"><span style="color:var(--amber);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Crepitantes finos</div><div class="apta-item-desc">Discontinuos, tono alto, al final de la inspiración, no cambian con la tos. Apertura de vías pequeñas colapsadas. Causas: <strong>fibrosis pulmonar</strong> ("velcro" en bases), edema inicial, neumonía temprana.</div></div></div>
      <div class="apta-item"><span style="color:var(--amber);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Crepitantes gruesos</div><div class="apta-item-desc">Discontinuos, tono bajo, en inspiración y espiración, <strong>cambian o desaparecen con la tos</strong>. Secreciones en vía grande. Causas: EPOC, bronquiectasias, ICC avanzada.</div></div></div>
      <div class="apta-item"><span style="color:var(--amber);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Sibilancias (wheezing)</div><div class="apta-item-desc">Continuas, tono alto ("silbido"), predominantemente espiratorias. Broncoespasmo u obstrucción de vías pequeñas. Causas: <strong>asma</strong>, <strong>EPOC agudizado</strong>, "asma cardíaca". Tórax silente en crisis grave = signo de alarma.</div></div></div>
      <div class="apta-item"><span style="color:var(--amber);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Roncus</div><div class="apta-item-desc">Continuos, tono bajo ("ronroneo"), <strong>cambian con la tos</strong>. Secreciones en vía mediana. Causas: EPOC, bronquitis, bronquiectasias.</div></div></div>
      <div class="apta-item"><span style="color:var(--red);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Estridor</div><div class="apta-item-desc">Continuo, tono muy alto, predominantemente <strong>inspiratorio</strong>, audible sin fonendoscopio. Obstrucción de vía aérea superior. Causas: crup, cuerpo extraño, edema de glotis. <strong>Urgencia clínica.</strong></div></div></div>
      <div class="apta-item"><span style="color:var(--text3);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Frote pleural (roce pleural)</div><div class="apta-item-desc">Discontinuo, superficial ("cuero nuevo"), sincrónico con la respiración, no varía con la tos. Fricción entre pleuras inflamadas. Causas: pleuritis seca, TEP con infarto.</div></div></div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin:.9rem 0 .5rem">Voz transmitida</div>
      <div class="infobox" style="margin-bottom:.75rem">El tejido consolidado conduce mejor los sonidos de la voz que el parénquima aireado. Siempre comparar ambos hemitórax.</div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Broncofonía</div><div class="apta-item-desc">Paciente dice "99". Se ausculta con mayor claridad e intensidad de lo normal. <strong>Positivo en consolidación</strong>.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Pectoriloquia áfona</div><div class="apta-item-desc">Paciente susurra "99". Las palabras se escuchan nítidamente. <strong>Signo muy específico de consolidación</strong>.</div></div></div>
      <div class="apta-item"><span style="color:var(--blue);flex-shrink:0;margin-top:1px">▹</span><div><div class="apta-item-name">Egofonía</div><div class="apta-item-desc">Paciente dice "e". Se ausculta como "a" nasal. Positivo en <strong>límite superior de derrame pleural</strong> y condensación.</div></div></div>
    </div>
  </div>

  <div class="ref-box" style="margin-top:1.5rem">
    <h3>Hallazgos integrados por patología</h3>
    <div style="overflow-x:auto;margin-top:.75rem">
      <table class="ef-table">
        <thead>
          <tr>
            <th>Patología</th>
            <th>Inspección</th>
            <th>FTV</th>
            <th>Percusión</th>
            <th>Auscultación</th>
            <th>Voz transmitida</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Neumonía / Consolidación</strong></td>
            <td>↑FR, accesorios, asimetría</td>
            <td>Aumentado</td>
            <td>Matidez</td>
            <td>Crepitantes, soplo tubárico</td>
            <td>Broncofonía, pectoriloquia áfona, egofonía</td>
          </tr>
          <tr>
            <td><strong>Derrame pleural</strong></td>
            <td>Asimetría, ↓expansión</td>
            <td>Disminuido o ausente</td>
            <td>Matidez</td>
            <td>↓ o ausentes; egofonía en borde superior</td>
            <td>Disminuida; egofonía en borde</td>
          </tr>
          <tr>
            <td><strong>Neumotórax</strong></td>
            <td>Asimetría, distress, desv. traqueal contralateral</td>
            <td>Ausente</td>
            <td>Timpanismo</td>
            <td>Ausentes</td>
            <td>Ausente</td>
          </tr>
          <tr>
            <td><strong>EPOC agudizado</strong></td>
            <td>Tórax en tonel, accesorios, tiraje</td>
            <td>Disminuido</td>
            <td>Hiperresonancia</td>
            <td>Sibilancias, roncus, ↓MV</td>
            <td>Disminuida</td>
          </tr>
          <tr>
            <td><strong>Asma aguda</strong></td>
            <td>Accesorios, tiraje, aleteo nasal</td>
            <td>Normal</td>
            <td>Resonante o hiperresonante</td>
            <td>Sibilancias espiratorias (silencio en crisis grave)</td>
            <td>Normal</td>
          </tr>
          <tr>
            <td><strong>Fibrosis pulmonar</strong></td>
            <td>Cianosis, acropaquia, ↑FR</td>
            <td>Normal</td>
            <td>Resonante</td>
            <td>Crepitantes finos bilaterales en bases ("velcro")</td>
            <td>Normal</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</div><!-- /tab-exploracion -->
```

- [ ] **Step 3: Verificar en navegador**

Abrir `http://localhost:8000/modules/patrones_resp.html`. Confirmar:
- Clic en "Exploración Física" → muestra el panel completo
- 4 secciones numeradas (1–4) con contenido clínico
- Al final se ve la tabla de hallazgos con 6 filas y 6 columnas
- El tab activo se resalta en azul
- Los demás tabs siguen funcionando

---

## Task 3: Quitar emojis de casos_resp.html y commit final

**Files:**
- Modify: `modules/casos_resp.html`
- Commit: `modules/patrones_resp.html` + `modules/casos_resp.html`

- [ ] **Step 1: Eliminar emojis de la sección home de casos_resp.html**

Leer el archivo y buscar el bloque home. Los 3 emojis están en los cards de navegación rápida. Localizar y aplicar estos tres reemplazos:

Reemplazar:
```html
      <div style="font-size:24px;margin-bottom:.7rem">🩺</div>
```
por:
```html
      <div style="margin-bottom:.7rem"></div>
```

Reemplazar:
```html
      <div style="font-size:24px;margin-bottom:.7rem">📈</div>
```
por:
```html
      <div style="margin-bottom:.7rem"></div>
```

Reemplazar:
```html
      <div style="font-size:24px;margin-bottom:.7rem">🧠</div>
```
por:
```html
      <div style="margin-bottom:.7rem"></div>
```

- [ ] **Step 2: Verificar que no queden emojis en ninguno de los dos archivos**

Buscar emojis en ambos archivos. En el terminal:

```bash
grep -n "🫁\|🩺\|📈\|🧠\|⚠" modules/patrones_resp.html modules/casos_resp.html
```

Nota: el `⚠` en `patrones_resp.html` (dentro de la cadena del JS de `buildABCDERef`) es texto de contenido clínico generado por JS, no un emoji de interfaz — dejar tal cual.

Resultado esperado: solo líneas de `patrones_resp.html` con `⚠` en el JS de alertas ABCDE. Ningún emoji de nav/UI.

- [ ] **Step 3: Commit de ambos archivos**

```bash
git add modules/patrones_resp.html modules/casos_resp.html
git commit -m "feat: agregar 3 patrones nuevos, tab Exploracion Fisica y fix showTab en C2 — quitar emojis"
```

- [ ] **Step 4: Push a GitHub**

```bash
git push origin master
```
