# EPOC + Bronquiectasias — Sesión 2: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar 4 casos clínicos nuevos (id:13–16) al array CASES en `modules/casos_resp.html` y actualizar el badge a "17 Casos Integrados".

**Architecture:** Edición directa del array `CASES` en `modules/casos_resp.html`. Cada caso es un objeto JS literal con campos fijos idénticos a los casos existentes (id:0–12). No hay build system — archivo vanilla HTML/JS abierto en browser.

**Tech Stack:** HTML/CSS/JavaScript vanilla. Sin npm. Sin transpilación. Verificación de sintaxis con `node -e "eval(...)"`. Preview con `python3 -m http.server 8000` o `npx http-server`.

---

## File Map

| Archivo | Acción | Qué cambia |
|---------|--------|-----------|
| `modules/casos_resp.html` | Modificar | Badge 13→17, insertar casos id:13–16 antes de `];` |

---

### Task 1: Actualizar badge a "17 Casos Integrados"

**Files:**
- Modify: `modules/casos_resp.html` (badge en home, ~línea 168)

- [ ] **Step 1: Actualizar el badge**

En `modules/casos_resp.html`, busca:
```html
<span class="badge a">13 Casos Integrados</span>
```
Reemplázalo por:
```html
<span class="badge a">17 Casos Integrados</span>
```

- [ ] **Step 2: Verificar el fin actual del array**

Busca el final del array CASES. Después de la Sesión 1 debe terminar así:
```javascript
  interventions:['Ejercicio aeróbico 20-30 min, Borg 3-4, 3 sesiones/semana con progresión gradual','6MWT inicial y cada 8 semanas como medida de seguimiento','Psicoeducación sobre seguridad del ejercicio y mecanismos de beneficio','Educación: automonitoreo de FC, Borg y síntomas en ejercicio domiciliario','Coordinación con cardiología para ajuste de betabloqueante si FC pico <80 lpm limita la sesión']
},
];
```
El `},` es el cierre de id:12 y `];` cierra el array. Los nuevos casos se insertan entre estos dos.

- [ ] **Step 3: Commit**

```bash
git add modules/casos_resp.html
git commit -m "feat: actualizar badge a 17 casos — preparar sesion 2"
```

---

### Task 2: Agregar Case id:13 — EPOC Post-Exacerbación / Rehabilitación Pulmonar

**Files:**
- Modify: `modules/casos_resp.html` (insertar antes de `];`, después de id:12)

- [ ] **Step 1: Insertar el objeto del caso id:13 antes del `];`**

Localiza el `];` final y reemplázalo con el siguiente bloque + `];`:

```javascript
/* ============================================================
   CASO 13 — EPOC Post-Exacerbación: Rehabilitación Pulmonar
   Nivel: Intermedio — Fisioterapia respiratoria
============================================================*/
{
  id:13, name:'EPOC Post-Exacerbación — Rehabilitación Pulmonar', age:71, sex:'Femenino', sev:'mod',
  dx:'EPOC estadio III GOLD — Post-exacerbación grave con VMNI — Candidata a Rehabilitación Pulmonar',
  chief:'2 semanas post-alta tras exacerbación con VMNI. Disnea con esfuerzos moderados, tos productiva escasa residual. No requiere VMNI domiciliaria actualmente.',
  hx:'Misma paciente que caso EPOC Exacerbación + VMNI. Fumadora 55 paq/año, exfumadora hace 2 años. VMNI domiciliaria nocturna hasta el ingreso, suspendida al alta por mejoría gasométrica. FEV₁ basal 38% predicho. 2ª exacerbación grave en 12 meses. Derivada a programa de Rehabilitación Pulmonar (RP). Recibe: indacaterol/glicopirronio, budesonida/formoterol, prednisona 10mg en pauta descendente (día 14 post-alta).',
  baseVitals:{fc:82,fr:18,spo2:92,pas:128,pad:76,temp:36.7,borg:3},
  spiroPattern:'obstructive-sev',
  labs:{
    gsa:[
      {name:'pH',val:'7.42',ref:'7.35–7.45',status:'ok'},
      {name:'PaCO₂',val:'44 mmHg',ref:'35–45 mmHg',status:'ok'},
      {name:'PaO₂',val:'68 mmHg',ref:'80–100 mmHg',status:'lo'},
      {name:'HCO₃⁻',val:'28 mEq/L',ref:'22–26 mEq/L',status:'hi'},
      {name:'SaO₂',val:'92%',ref:'>95%',status:'lo'},
      {name:'FiO₂',val:'0.21 (aire ambiente)',ref:'—',status:'ok'}
    ],
    hem:[
      {name:'FEV₁',val:'38% predicho',ref:'>80%',status:'lo'},
      {name:'CVF',val:'52% predicho',ref:'>80%',status:'lo'},
      {name:'FEV₁/CVF',val:'0.56',ref:'>0.70',status:'lo'},
      {name:'6MWT',val:'280m',ref:'520m (predicho)',status:'lo'}
    ]
  },
  abcdeScenarios:[
    {
      letter:'A', color:'#f87171', bg:'rgba(248,113,113,.15)',
      context:'Paciente en consulta de RP. Tos productiva escasa matutina. Sin uso de musculatura accesoria en reposo. Habla en frases completas. FR 18 rpm. ¿Evaluación de A y diferencia con la fase aguda?',
      opts:[
        {txt:'A permeable con tos productiva residual de baja intensidad. La diferencia clave con la fase aguda: ahora puede hablar en frases completas sin pausas, sin uso de musculatura accesoria en reposo. La tos productiva matutina en EPOC es normal — mecanismo de aclaramiento. Monitorizar si aumenta en volumen o cambia de características (señal de nueva exacerbación).',correct:true,
          fb:'✓ Correcto. La tos productiva crónica en EPOC no es una alarma — es parte del fenotipo bronquítico. La diferencia con la fase aguda es cualitativa: menos frecuente, esputo blanquecino o mucoso (vs. purulento en exacerbación), sin trabajo respiratorio visible. El punto de alerta es el cambio: si el esputo se vuelve purulento, aumenta en volumen o cambia de color → posible nueva exacerbación. Educar a la paciente en automonitoreo de las características del esputo.',cls:'good'},
        {txt:'Tos productiva = exacerbación activa. Posponer inicio de RP hasta tos completamente resuelta.',correct:false,
          fb:'✗ Incorrecto. La tos productiva crónica es un síntoma permanente del fenotipo bronquítico del EPOC — no desaparece entre exacerbaciones. Esperar a que desaparezca la tos para iniciar la RP privaría a la paciente de la intervención más efectiva para reducir el riesgo de reexacerbación. El criterio de inicio de RP post-exacerbación es la estabilidad clínica (ausencia de fiebre, esputo no purulento, FR y SpO₂ en valores basales), no la ausencia de tos.',cls:'bad'},
        {txt:'Habla en frases completas = sin limitación de A. Inicio de RP sin restricciones de intensidad.',correct:false,
          fb:'⚠ Incompleto. Aunque A no tiene limitaciones activas, la capacidad de hablar en frases completas no determina la intensidad del ejercicio — eso lo determinan B y C. SpO₂ 92% AA, FEV₁ 38% y 6MWT 280m son los que condicionan la prescripción. La evaluación de A es favorable, pero la intensidad se decide con el cuadro completo.',cls:'warn'}
      ]
    },
    {
      letter:'B', color:'#fbbf24', bg:'rgba(251,191,36,.15)',
      context:'FR 18 rpm, SpO₂ 92% AA. Sibilancias espiratorias leves. Hiperinflación residual (tórax en tonel). Expansión torácica reducida. Espiración prolongada espontánea (cociente I:E 1:3). ¿Plan fisioterapéutico para B al inicio de la RP?',
      opts:[
        {txt:'B estable con limitación obstructiva crónica. Intervención: (1) Técnicas de control respiratorio: respiración con labios fruncidos (alarga la espiración, reduce atrapamiento aéreo), respiración diafragmática con retroalimentación; (2) Aclaramiento bronquial de mantenimiento: ELTGOL o drenaje autógeno 1×/día; (3) El ejercicio aeróbico de la RP mejora la tolerancia al esfuerzo sin modificar el FEV₁ — el objetivo no es "curar" la obstrucción sino mejorar la eficiencia ventilatoria.',correct:true,
          fb:'✓ Correcto. La respiración con labios fruncidos en EPOC tiene evidencia sólida: aumenta la presión intrabronquial durante la espiración, retrasa el colapso dinámico de la vía aérea y reduce el atrapamiento aéreo. No cambia el FEV₁ (la obstrucción es fija) pero mejora la mecánica ventilatoria durante el esfuerzo. El aclaramiento de mantenimiento está indicado en el fenotipo bronquítico (esputo crónico) — no en todos los EPOC. La RP mejora el VO₂ pico, la capacidad funcional y la calidad de vida en EPOC severo a través de adaptaciones musculares periféricas, no por cambios en la función pulmonar.',cls:'good'},
        {txt:'Sibilancias = broncoespasmo activo. Inicias sesión con salbutamol nebulizado antes de cualquier técnica.',correct:false,
          fb:'⚠ Parcialmente válido como rutina pero no como respuesta a las sibilancias per se. Las sibilancias leves en EPOC severo son parte del fenotipo crónico — no indican broncoespasmo agudo que requiera rescate. El salbutamol pre-ejercicio en RP es una práctica habitual (mejora el FEV₁ transitoriamente para la sesión), pero no es una "respuesta a las sibilancias" sino parte del protocolo estándar de RP. La indicación clínica de salbutamol de rescate es el empeoramiento agudo de las sibilancias con disnea súbita, no las sibilancias basales crónicas.',cls:'warn'},
        {txt:'Hiperinflación + FEV₁ 38% = contraindicación de ejercicio aeróbico. Solo técnicas respiratorias pasivas.',correct:false,
          fb:'✗ Incorrecto. La hiperinflación y el FEV₁ 38% son precisamente las indicaciones más fuertes para la RP, no contraindicaciones. Los ensayos de RP en EPOC severo (FEV₁ <50%) demuestran los mayores beneficios en reducción de disnea, mejora del 6MWT y calidad de vida. El ejercicio aeróbico supervisado es seguro con SpO₂ ≥88% y monitorización continua. Las "técnicas pasivas" no tienen evidencia en EPOC estable.',cls:'bad'}
      ]
    },
    {
      letter:'C', color:'#4ade80', bg:'rgba(74,222,128,.15)',
      context:'FC 82 lpm, PA 128/76. Sin edema periférico. Sin ingurgitación yugular. SpO₂ 92% AA en reposo. 6MWT 280m con SpO₂ nadir 88%. ¿Qué determinas en C y cómo prescripes el ejercicio?',
      opts:[
        {txt:'C sin cor pulmonale activo. SpO₂ 92% AA — en límite inferior para RP sin O₂ suplementario (umbral ≥88%). 6MWT 280m como línea de base. Prescripción: caminata al 80% de la velocidad del 6MWT, Borg 4-5 como guía de intensidad. Si SpO₂ cae <88% durante el ejercicio: añadir O₂ de esfuerzo 2L/min. FC no es guía fiable (betabloqueantes ausentes, pero LABA puede elevarla).',correct:true,
          fb:'✓ Correcto. El 6MWT es la herramienta estándar para prescribir el ejercicio en RP: la velocidad de caminata al 80% de la prueba correlaciona con la intensidad del umbral anaeróbico. El Borg 4-5 (disnea moderada, tolerable) es el target habitual en RP para EPOC. La SpO₂ nadir 88% en el 6MWT indica que la paciente puede necesitar O₂ suplementario durante el ejercicio — esto se evalúa sesión a sesión. La ausencia de edema e IY descarta cor pulmonale activo.',cls:'good'},
        {txt:'SpO₂ 92% AA = insuficiencia respiratoria en reposo. Contraindicada la RP sin O₂ domiciliario prescrito.',correct:false,
          fb:'✗ Incorrecto. El criterio de O₂ domiciliario largo plazo (LTOT) en EPOC es PaO₂ ≤55 mmHg en reposo (o ≤60 mmHg con cor pulmonale). Esta paciente tiene PaO₂ 68 mmHg — no cumple criterios de LTOT. La RP puede iniciarse con SpO₂ 92% en reposo. Si durante el ejercicio cae <88%, se añade O₂ de esfuerzo sin que ello implique necesitar O₂ domiciliario permanente.',cls:'bad'},
        {txt:'6MWT 280m = capacidad funcional muy reducida. Posponer RP hasta mejorar el 6MWT con fisioterapia domiciliaria previa.',correct:false,
          fb:'⚠ Razonamiento circular. El 6MWT 280m (46% del predicho) es el resultado de la enfermedad y el desacondicionamiento — es la razón para iniciar la RP, no un prerequisito. Esperar a que mejore el 6MWT antes de la RP es esperar a que la situación mejore sola, lo que no sucederá sin intervención. La RP es la intervención que mejora el 6MWT.',cls:'warn'}
      ]
    },
    {
      letter:'D', color:'#a78bfa', bg:'rgba(167,139,250,.15)',
      context:'Alerta, orientada. Ansiosa: "Después de lo que pasé, tengo miedo de hacer esfuerzo — la última vez que me fatigué tuve la exacerbación." Evita actividades físicas por miedo. ¿Cómo manejas D?',
      opts:[
        {txt:'Kinesofobia post-exacerbación. Intervención: (1) Diferenciar disnea de esfuerzo normal (esperada en RP, Borg 4-5) vs. señales de alarma reales (SpO₂ <88%, Borg >7, dolor torácico, cianosis); (2) La exacerbación no fue causada por el ejercicio — fue una infección respiratoria (correlación ≠ causalidad); (3) La RP reduce en un 25-30% el riesgo de nueva exacerbación — el ejercicio es protector, no desencadenante.',correct:true,
          fb:'✓ Excelente. La kinesofobia post-exacerbación es una barrera terapéutica mayor en EPOC y uno de los predictores más potentes de abandono de la RP. El error cognitivo del paciente es la correlación temporal: "hice esfuerzo → tuve exacerbación". La exacerbación fue causada por la infección, no por el ejercicio. Corregir este error con psicoeducación basada en evidencia (la RP reduce exacerbaciones) y con exposición gradual y monitorizada al ejercicio es la intervención de D más efectiva.',cls:'good'},
        {txt:'El miedo es comprensible. Reducir la intensidad del programa al 50% para no generar más ansiedad.',correct:false,
          fb:'⚠ Inadecuado. Reducir la intensidad por el miedo valida la kinesofobia como señal real de peligro, reforzando el ciclo de evitación. La evidencia en fisioterapia del miedo al movimiento muestra que la exposición gradual y monitoriada (no la evitación) es la intervención efectiva. La intensidad se prescribe según la capacidad funcional (80% velocidad 6MWT, Borg 4-5), no según el nivel de ansiedad.',cls:'warn'},
        {txt:'La ansiedad interfiere con la RP. Derivar a psiquiatría para manejo farmacológico antes de iniciar el programa.',correct:false,
          fb:'✗ Excesivo como primera respuesta. La ansiedad anticipatoria en EPOC post-exacerbación es una respuesta adaptativa — no un trastorno psiquiátrico que requiera medicación. La intervención del fisioterapeuta (psicoeducación, exposición gradual, monitorización visible) es suficiente en la mayoría de los casos. Si persiste ansiedad grave que impide la participación tras varias sesiones, entonces la derivación a psicología (no psiquiatría) sería el paso siguiente.',cls:'bad'}
      ]
    },
    {
      letter:'E', color:'#38bdf8', bg:'rgba(56,189,248,.15)',
      context:'Recibe: indacaterol/glicopirronio (LABA+LAMA), budesonida/formoterol (ICS+LABA), prednisona 10mg/día en pauta descendente (día 14 post-alta). Sin O₂ domiciliario. ¿Qué condiciona E a la prescripción de RP?',
      opts:[
        {txt:'Triple terapia inhalada + prednisona residual: (1) LABA puede elevar FC en reposo y durante ejercicio — usar Borg como guía primaria de intensidad; (2) Prednisona 10mg — riesgo de hiperglucemia durante ejercicio (monitorizar si DM concomitante), miopatía esteroidea con uso prolongado (relevante en exacerbaciones frecuentes); (3) Budesonida/formoterol como rescate en RP: tener disponible en sala; (4) Sin O₂ domiciliario — evaluar necesidad de O₂ de esfuerzo si SpO₂ <88% durante sesión.',correct:true,
          fb:'✓ Correcto y completo. La miopatía esteroidea es un efecto secundario frecuentemente olvidado: el uso crónico de corticoides sistémicos (no inhalados) deteriora la masa y función muscular periférica — en EPOC exacerbadora frecuente, esto puede ser un factor limitante del 6MWT independiente de la obstrucción. El LABA (formoterol, indacaterol) puede generar taquicardia y temblor — la paciente puede sentir palpitaciones durante el ejercicio, que son secundarias al LABA y no a una arritmia. El Borg como guía de intensidad compensa la FC alterada por el LABA.',cls:'good'},
        {txt:'Prednisona 10mg = corticoide sistémico. Contraindicado el ejercicio de fuerza por riesgo de fractura ósea.',correct:false,
          fb:'⚠ Excesivo. La prednisona 10mg en pauta descendente (14 días) no contraindica el ejercicio de fuerza. La osteoporosis esteroidea se desarrolla con uso crónico (>3 meses) de dosis ≥7.5mg/día. Una pauta de 2-3 semanas post-exacerbación no genera riesgo de fractura inmediato. Si la paciente tiene uso crónico de corticoides sistémicos (historial de múltiples exacerbaciones), se debería evaluar la DMO, pero no es contraindicación del programa de RP.',cls:'warn'},
        {txt:'Triple terapia inhalada = máximo tratamiento broncodilatador. No añadir salbutamol pre-ejercicio (ya está broncodilatada).',correct:false,
          fb:'⚠ Incompleto. La triple terapia de mantenimiento (LABA+LAMA+ICS) no sustituye al salbutamol de acción corta pre-ejercicio. El salbutamol pre-RP tiene un efecto broncodilatador adicional y rápido que mejora el FEV₁ para la sesión. Las guías de RP recomiendan el broncodilatador de acción corta 15-20 min antes del ejercicio en EPOC severo, independientemente de la terapia de mantenimiento.',cls:'warn'}
      ]
    }
  ],
  exerciseParams:{
    vo2peak:14,
    restVitals:{fc:82,fr:18,spo2:92,borg:3,pas:128},
    phases:[
      {name:'Calentamiento',pct:10,fc:86,fr:19,spo2:92,borg:3,pas:130,log:'Calentamiento 5 min — FC 86 lpm · FR 19 rpm · SpO₂ 92% · Borg 3 · PAS 130 mmHg · Respiración con labios fruncidos'},
      {name:'Caminata 80% 6MWT',pct:30,fc:94,fr:21,spo2:90,borg:4,pas:134,log:'Caminata al 80% velocidad 6MWT — FC 94 lpm · FR 21 rpm · SpO₂ 90% · Borg 4 · PAS 134 mmHg · Intensidad objetivo'},
      {name:'Pico tolerado',pct:50,fc:100,fr:23,spo2:88,borg:5,pas:138,log:'Pico tolerado — FC 100 lpm · FR 23 rpm · SpO₂ 88% · Borg 5 · PAS 138 mmHg · Límite — añadir O₂ si <88%'},
      {name:'Vuelta a calma',pct:20,fc:90,fr:20,spo2:90,borg:4,pas:132,log:'Vuelta a calma — FC 90 lpm · FR 20 rpm · SpO₂ 90% · Borg 4 · PAS 132 mmHg · Respiración con labios fruncidos'},
      {name:'Recuperación',pct:5,fc:84,fr:18,spo2:92,borg:3,pas:129,log:'Recuperación — FC 84 lpm · FR 18 rpm · SpO₂ 92% · Borg 3 · PAS 129 mmHg · Retorno a valores basales'}
    ],
    physiologyNotes:'En EPOC severo (FEV₁ 38%), la limitación al ejercicio es mixta: ventilatoria (hiperinflación dinámica → atrapamiento aéreo → aumento de la carga elástica inspiratoria) + muscular periférica (disfunción del músculo cuádriceps por desacondicionamiento y miopatía esteroidea). La RP actúa principalmente sobre el componente muscular periférico (no modifica el FEV₁) mejorando la eficiencia oxidativa muscular, reduciendo el lactato para el mismo nivel de esfuerzo y disminuyendo la ventilación requerida. Resultado: menor disnea para la misma carga de trabajo.'
  },
  goals:['Completar 8 semanas de RP (24 sesiones)','Mejorar 6MWT de 280m a ≥350m','Reducir kinesofobia post-exacerbación','Establecer programa domiciliario de aclaramiento y ejercicio autónomo'],
  interventions:['Ejercicio aeróbico: caminata 80% velocidad 6MWT, Borg 4-5, 30-40 min, 3×/semana','Aclaramiento bronquial domiciliario: ELTGOL o drenaje autógeno 1×/día','Salbutamol 2 puff 15 min antes de cada sesión de RP','Educación: reconocimiento precoz de exacerbación (cambio color/volumen esputo, aumento disnea basal)','Plan de acción escrito: qué hacer si SpO₂ baja de 88% o Borg supera 7 en reposo']
},
```

- [ ] **Step 2: Verificar sintaxis**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('modules/casos_resp.html', 'utf8');
const m = html.match(/const CASES = \[([\s\S]*?)\];/);
const cases = eval('[' + m[1] + ']');
console.log('Casos:', cases.length, '— id:13:', cases.find(c=>c.id===13)?.name);
"
```
Esperado: `Casos: 14 — id:13: EPOC Post-Exacerbación — Rehabilitación Pulmonar`

- [ ] **Step 3: Commit**

```bash
git add modules/casos_resp.html
git commit -m "feat: agregar caso id:13 EPOC post-exacerbacion — candidata RP, kinesofobia, 6MWT 280m"
```

---

### Task 3: Agregar Case id:14 — Bronquiectasias Post-infecciosas Estable

**Files:**
- Modify: `modules/casos_resp.html` (insertar antes de `];`, después de id:13)

- [ ] **Step 1: Insertar el objeto del caso id:14 antes del `];`**

```javascript
/* ============================================================
   CASO 14 — Bronquiectasias Post-infecciosas: Estable
   Nivel: Intermedio — Fisioterapia respiratoria
============================================================*/
{
  id:14, name:'Bronquiectasias Post-infecciosas — Estable', age:45, sex:'Femenino', sev:'mild',
  dx:'Bronquiectasias cilíndricas en LID post-neumonía por Klebsiella — Colonización crónica Pseudomonas aeruginosa — Fase estable',
  chief:'Consulta ambulatoria de seguimiento. Tos productiva matutina crónica con expectoración mucopurulenta escasa. Sin signos de exacerbación activa. Refiere que hace el aclaramiento "cuando se acuerda".',
  hx:'Neumonía grave por Klebsiella pneumoniae hace 3 años con hospitalización en UCI. TC tórax: bronquiectasias cilíndricas en segmentos basales de LID. Cultivos semestrales: Pseudomonas aeruginosa sensible a tobramicina. Sin exacerbaciones en últimos 8 meses. Trabaja media jornada como administrativa. Vive sola. No fuma. Recibe: azitromicina 500mg 3×/semana, salbutamol PRN, tobramicina nebulizada 28 días on/28 días off (actualmente en ciclo ON).',
  baseVitals:{fc:74,fr:16,spo2:95,pas:118,pad:74,temp:36.5,borg:1},
  spiroPattern:'obstructive-mild',
  labs:{
    gsa:[
      {name:'pH',val:'7.41',ref:'7.35–7.45',status:'ok'},
      {name:'PaCO₂',val:'38 mmHg',ref:'35–45 mmHg',status:'ok'},
      {name:'PaO₂',val:'78 mmHg',ref:'80–100 mmHg',status:'lo'},
      {name:'HCO₃⁻',val:'24 mEq/L',ref:'22–26 mEq/L',status:'ok'},
      {name:'SaO₂',val:'95%',ref:'>95%',status:'lo'},
      {name:'FiO₂',val:'0.21 (aire ambiente)',ref:'—',status:'ok'}
    ],
    hem:[
      {name:'FEV₁',val:'68% predicho',ref:'>80%',status:'lo'},
      {name:'CVF',val:'78% predicho',ref:'>80%',status:'lo'},
      {name:'FEV₁/CVF',val:'0.68',ref:'>0.70',status:'lo'},
      {name:'Pseudomonas',val:'Colonización crónica',ref:'Negativo',status:'hi'}
    ]
  },
  abcdeScenarios:[
    {
      letter:'A', color:'#f87171', bg:'rgba(248,113,113,.15)',
      context:'Paciente en consulta. Tos productiva matutina abundante con esputo mucopurulento amarillento escaso (su "normal" crónico). Sin hemoptisis. Sin estridor. ¿Evaluación de A en bronquiectasias estables?',
      opts:[
        {txt:'VA permeable. La tos productiva crónica con esputo mucopurulento escaso es el fenotipo habitual de las bronquiectasias con colonización por Pseudomonas — no indica exacerbación activa. La diferencia entre estable y exacerbación es el CAMBIO: aumento de volumen de esputo, esputo más purulento (verde intenso), aumento de disnea, fiebre. Sin esos cambios, este es el estado estable de la paciente.',correct:true,
          fb:'✓ Correcto. La evaluación de A en bronquiectasias estables es confirmatoria: VA permeable, tos funcional (mecanismo de aclaramiento natural). El concepto clave es que la tos crónica con esputo en bronquiectasias NO es una alarma — es el síntoma cardinal de la enfermedad. La alarma es el CAMBIO respecto al basal: más esputo, más purulento, más disnea, fiebre. Educar a la paciente en reconocer su "normal" vs. una exacerbación es parte de la intervención A.',cls:'good'},
        {txt:'Esputo mucopurulento = infección activa. Suspender tobramicina nebulizada y derivar a neumología urgente.',correct:false,
          fb:'✗ Incorrecto. La tobramicina nebulizada es precisamente el tratamiento para la colonización crónica por Pseudomonas — suspenderla ante esputo crónico sería lo contrario de lo indicado. El esputo mucopurulento en bronquiectasias con Pseudomonas es el estado basal de la paciente con colonización crónica. La derivación urgente no está indicada sin signos de exacerbación (fiebre, aumento brusco de esputo, empeoramiento funcional).',cls:'bad'},
        {txt:'Sin hemoptisis = A sin riesgo. Tos crónica en bronquiectasias no requiere evaluación específica — es el estado normal.',correct:false,
          fb:'⚠ Parcialmente correcto pero incompleto. La ausencia de hemoptisis es un dato tranquilizador, pero "no requiere evaluación específica" es impreciso. A en bronquiectasias sí requiere evaluación: ¿es el esputo el habitual de la paciente (estable) o ha cambiado (exacerbación)? ¿Hay algún grado de hemoptisis que la paciente minimiza? La evaluación de A es rápida pero no trivial en bronquiectasias.',cls:'warn'}
      ]
    },
    {
      letter:'B', color:'#fbbf24', bg:'rgba(251,191,36,.15)',
      context:'FR 16 rpm, SpO₂ 95% AA. Crepitantes en LID (base derecha), leve reducción de murmullo en esa zona. Expansión torácica asimétrica (LID reducida). Espirometría: obstrucción leve. ¿Plan B y diseño del programa de aclaramiento?',
      opts:[
        {txt:'B con afectación localizada en LID. Programa de aclaramiento domiciliario: (1) ELTGOL en decúbito lateral izquierdo (drena LID por gravedad) 10-15 min; (2) Ciclo ACBT (respiración controlada → expansiones torácicas → técnica de espiración forzada TEF); (3) Dispositivo oscilante (Flutter o Aerobika) tras ELTGOL para movilizar secreciones residuales. Secuencia completa: 15-20 min/sesión, 2×/día (mañana obligatoria + tarde opcional).',correct:true,
          fb:'✓ Correcto y clínicamente fundamentado. El ELTGOL (Espiración Lenta Total con Glotis abierta en infralateral) en decúbito lateral izquierdo aprovecha la gravedad para drenar el LID: el pulmón afecto queda en posición inferior, favoreciendo el drenaje por gravedad de las secreciones hacia los bronquios principales. El ACBT es la técnica más versátil y autoadministrable: respiración controlada (relaja los bronquios) + expansiones torácicas (moviliza secreciones periféricas) + TEF (las expulsa a vías proximales). El Flutter/Aerobika añade oscilación a la presión espiratoria, reduciendo la viscosidad del moco.',cls:'good'},
        {txt:'Obstrucción leve en espirometría = poca secreción. El aclaramiento 2×/día es excesivo para una paciente estable. 1×/semana es suficiente.',correct:false,
          fb:'✗ Incorrecto. La frecuencia del aclaramiento no depende del grado de obstrucción espirométrica sino del volumen de secreciones y la colonización bacteriana. Con Pseudomonas aeruginosa en colonización crónica, el aclaramiento 2×/día (mínimo 1×/día) es el estándar para mantener la vía aérea libre y reducir la carga bacteriana. El aclaramiento 1×/semana en bronquiectasias con colonización crónica es insuficiente — la Pseudomonas se reproduce cada 20 minutos en ese entorno.',cls:'bad'},
        {txt:'Crepitantes localizados en LID = posible neumonía sobreañadida. RX tórax urgente antes de iniciar aclaramiento.',correct:false,
          fb:'⚠ Los crepitantes en LID son el hallazgo crónico de las bronquiectasias en esa zona — no indican neumonía sobreañadida en ausencia de fiebre, cambio en el esputo, deterioro funcional o nueva consolidación. La RX tórax está indicada si hay signos de exacerbación o nueva semiología. Pedir una RX urgente ante los crepitantes crónicos en bronquiectasias estables generaría radiaciones innecesarias y demoraría el tratamiento real (inicio del aclaramiento).',cls:'warn'}
      ]
    },
    {
      letter:'C', color:'#4ade80', bg:'rgba(74,222,128,.15)',
      context:'FC 74 lpm, PA 118/74. Sin edema. Sin ingurgitación yugular. SpO₂ 95% AA estable. Sin antecedentes cardiovasculares. ¿Evaluación de C y condicionantes para el ejercicio aeróbico?',
      opts:[
        {txt:'C completamente normal. Sin limitaciones cardiovasculares para el ejercicio aeróbico. Prescripción: ejercicio aeróbico moderado (caminata, bicicleta) 30 min, 3-5×/semana, Borg 3-4. Punto clave: el ejercicio aeróbico mejora el aclaramiento mucociliar en bronquiectasias — es sinérgico con las técnicas de aclaramiento, no alternativo.',correct:true,
          fb:'✓ Correcto. El ejercicio aeróbico en bronquiectasias tiene un doble beneficio: (1) mejora la capacidad funcional general (igual que en cualquier enfermedad respiratoria crónica), (2) la hiperpnea del ejercicio aumenta el flujo espiratorio y la oscilación de la pared bronquial, mejorando el transporte mucociliar. En pacientes con bronquiectasias leves-moderadas (FEV₁ 68%), la prescripción de ejercicio es similar a la población general con enfermedad respiratoria crónica leve.',cls:'good'},
        {txt:'Colonización por Pseudomonas = riesgo de bacteriemia durante ejercicio intenso. Limitar a ejercicio muy leve.',correct:false,
          fb:'✗ Incorrecto. La colonización bronquial crónica por Pseudomonas no aumenta el riesgo de bacteriemia con el ejercicio en bronquiectasias estables. La Pseudomonas en bronquiectasias es un patógeno de colonización de la vía aérea — no una bacteriemia sistémica. El ejercicio moderado es seguro y beneficioso. La restricción del ejercicio por colonización bacteriana no tiene base clínica ni evidencia.',cls:'bad'},
        {txt:'Sin antecedentes CV y SpO₂ 95% = sin restricciones. Puede hacer ejercicio de alta intensidad sin monitorización.',correct:false,
          fb:'⚠ Excesivo en la falta de monitorización. Aunque la capacidad funcional es relativamente conservada (SpO₂ 95%), el ejercicio de alta intensidad sin monitorización en bronquiectasias con obstrucción leve no es prudente. La SpO₂ puede caer con esfuerzo intenso. La monitorización inicial (al menos las primeras sesiones) garantiza que la prescripción es segura. El ejercicio sin supervisión puede indicarse una vez establecida la tolerancia.',cls:'warn'}
      ]
    },
    {
      letter:'D', color:'#a78bfa', bg:'rgba(167,139,250,.15)',
      context:'Alerta, orientada. Verbaliza: "Hago el aclaramiento cuando tengo tiempo, que no es siempre. Además tampoco noto mucha diferencia." ¿Cómo abordas la falta de adherencia al aclaramiento?',
      opts:[
        {txt:'Baja adherencia por fatiga de adherencia y baja efectividad percibida. Intervención: (1) Identificar barreras reales: tiempo (cuánto tarda la técnica actual), comodidad (¿le resulta incómoda alguna posición?), efectividad percibida (¿qué cantidad de esputo produce?); (2) Simplificar: ¿puede sustituir 3 técnicas distintas por 1 técnica eficaz (ACBT + Flutter) en 15 min?; (3) Conectar con beneficio concreto: sin aclaramiento diario, la Pseudomonas acumula biofilm → más riesgo de exacerbación → hospitalización.',correct:true,
          fb:'✓ Correcto. La fatiga de adherencia en bronquiectasias es el problema clínico más prevalente: la enfermedad es crónica, el tratamiento es diario, y la "recompensa" (ausencia de exacerbación) es invisible. Las intervenciones más efectivas son: (1) simplificación del régimen (menos técnicas, mismo resultado), (2) rutinización (anclar el aclaramiento a una actividad existente: ducha matutina → aclaramiento → desayuno), (3) educación sobre el beneficio invisible (la no-exacerbación como resultado positivo). El Flutter o el Aerobika son atractivos porque el paciente ve y oye el efecto inmediatamente.',cls:'good'},
        {txt:'La falta de adherencia es responsabilidad del paciente. Informar de las consecuencias y que ella decida.',correct:false,
          fb:'✗ Reductivo e ineficaz. La adherencia terapéutica en enfermedades crónicas es un proceso multifactorial que el fisioterapeuta puede y debe abordar activamente. "Informar y que decida" ignora las barreras reales (tiempo, complejidad, efectividad percibida) y transfiere toda la responsabilidad a la paciente. La evidencia en cronicidad muestra que la adherencia mejora con simplificación del régimen, rutinización y seguimiento activo — no con información pasiva.',cls:'bad'},
        {txt:'No hace el aclaramiento = pulmón lleno de secreciones. Hospitalización para aclaramiento intensivo urgente.',correct:false,
          fb:'✗ Innecesario y desproporcionado. La paciente está en fase ESTABLE (sin exacerbación en 8 meses, SpO₂ 95%, sin fiebre). La baja adherencia al aclaramiento domiciliario en fase estable requiere intervención educativa y simplificación del régimen — no hospitalización. La hospitalización por aclaramiento se reserva para exacerbaciones que no responden al tratamiento ambulatorio o complicaciones (hemoptisis significativa, deterioro funcional agudo).',cls:'bad'}
      ]
    },
    {
      letter:'E', color:'#38bdf8', bg:'rgba(56,189,248,.15)',
      context:'Azitromicina 500mg 3×/semana (profilaxis), salbutamol PRN, tobramicina nebulizada 28 días on/28 off (actualmente en ciclo ON — día 18). ¿Qué condiciona E al programa de aclaramiento y ejercicio?',
      opts:[
        {txt:'Secuencia farmacológica correcta: (1) Salbutamol 15 min antes del aclaramiento (broncodilata para facilitar la salida de secreciones); (2) Tobramicina nebulizada DESPUÉS del aclaramiento (la vía aérea limpia mejora la penetración del antibiótico hasta las zonas distales); (3) Azitromicina 3×/semana: efecto antiinflamatorio + antibacteriano crónico — no es tratamiento de exacerbación, no subirla ante empeoramiento leve. (4) Ejercicio aeróbico post-aclaramiento completo.',correct:true,
          fb:'✓ Correcto y con el concepto clave: la SECUENCIA de nebulizaciones importa. El orden óptimo es: broncodilatador → aclaramiento → antibiótico nebulizado. La tobramicina aplicada antes del aclaramiento queda parcialmente atrapada en las secreciones y se elimina durante la técnica, reduciendo su eficacia. Aplicada después, penetra en la vía aérea limpia y llega a las zonas colonizadas. Este concepto aplica a cualquier antibiótico nebulizado (colistina, tobramicina, aztreonam). La azitromicina profiláctica 3×/semana en bronquiectasias con colonización por Pseudomonas tiene evidencia de reducción de exacerbaciones.',cls:'good'},
        {txt:'Tobramicina nebulizada = antibiótico activo. El ejercicio está contraindicado durante el ciclo ON para no favorecer la diseminación bacteriana.',correct:false,
          fb:'✗ Incorrecto. La tobramicina nebulizada actúa localmente en la vía aérea — no es una antibioterapia sistémica. No existe riesgo de "diseminación bacteriana" con el ejercicio durante el ciclo ON. El ejercicio aeróbico está indicado durante los ciclos ON y OFF — el tratamiento antibiótico nebulizado no contraindica el ejercicio.',cls:'bad'},
        {txt:'Azitromicina 3×/semana = antibiótico de amplio espectro activo. No añadir salbutamol (ya hay cobertura antibiótica suficiente).',correct:false,
          fb:'✗ Confusión de mecanismos. La azitromicina en bronquiectasias actúa como antiinflamatorio e inmunomodulador (no principalmente como antibiótico ante la Pseudomonas, que es resistente a macrólidos). No tiene efecto broncodilatador. El salbutamol actúa sobre los receptores β2 del músculo liso bronquial — mecanismo completamente distinto. Ambos son complementarios.',cls:'bad'}
      ]
    }
  ],
  exerciseParams:{
    vo2peak:22,
    restVitals:{fc:74,fr:16,spo2:95,borg:1,pas:118},
    phases:[
      {name:'Aclaramiento pre-ejercicio',pct:5,fc:76,fr:17,spo2:95,borg:2,pas:119,log:'Aclaramiento ACBT + Flutter — FC 76 lpm · FR 17 rpm · SpO₂ 95% · Borg 2 · PAS 119 mmHg · Expectoración de secreciones LID'},
      {name:'Calentamiento',pct:10,fc:80,fr:17,spo2:95,borg:2,pas:121,log:'Calentamiento 5 min caminata lenta — FC 80 lpm · FR 17 rpm · SpO₂ 95% · Borg 2 · PAS 121 mmHg'},
      {name:'Fase aeróbica',pct:40,fc:104,fr:20,spo2:94,borg:3,pas:128,log:'Caminata moderada 30 min — FC 104 lpm · FR 20 rpm · SpO₂ 94% · Borg 3 · PAS 128 mmHg · SpO₂ estable'},
      {name:'Vuelta a calma',pct:20,fc:88,fr:18,spo2:95,borg:2,pas:122,log:'Vuelta a calma — FC 88 lpm · FR 18 rpm · SpO₂ 95% · Borg 2 · PAS 122 mmHg'},
      {name:'Evaluación SpO₂ final',pct:5,fc:76,fr:16,spo2:95,borg:1,pas:119,log:'Evaluación SpO₂ post-ejercicio — FC 76 lpm · FR 16 rpm · SpO₂ 95% · Borg 1 · PAS 119 mmHg · Recuperación completa'}
    ],
    physiologyNotes:'En bronquiectasias leves-moderadas (FEV₁ 68%), la capacidad aeróbica está conservada (VO₂ pico estimado ~22 mL/kg/min). La limitación principal no es ventilatoria sino la acumulación de secreciones que aumenta la resistencia de la vía aérea. El aclaramiento pre-ejercicio reduce esta resistencia, permitiendo una sesión de mayor calidad. La hiperpnea del ejercicio aeróbico tiene efecto mucocinético adicional: el flujo espiratorio elevado durante el ejercicio actúa como una "técnica de aclaramiento pasiva" que complementa las técnicas formales.'
  },
  goals:['Establecer programa domiciliario de aclaramiento 2×/día (100% adherencia)','Mejorar capacidad aeróbica (VO₂ pico) con ejercicio regular','Prevenir exacerbaciones mediante aclaramiento + tobramicina nebulizada','Educación en reconocimiento precoz de exacerbación y plan de acción'],
  interventions:['Aclaramiento: ELTGOL en DL izquierdo + ACBT 2×/día (15-20 min/sesión)','Flutter o Aerobika como complemento del ACBT','Secuencia: salbutamol → aclaramiento → tobramicina nebulizada','Ejercicio aeróbico 30 min, Borg 3-4, 3-5×/semana (post-aclaramiento)','Educación en reconocimiento de exacerbación: cambio en esputo, aumento disnea, fiebre']
},
```

- [ ] **Step 2: Verificar sintaxis**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('modules/casos_resp.html', 'utf8');
const m = html.match(/const CASES = \[([\s\S]*?)\];/);
const cases = eval('[' + m[1] + ']');
console.log('Casos:', cases.length, '— id:14:', cases.find(c=>c.id===14)?.name);
"
```
Esperado: `Casos: 15 — id:14: Bronquiectasias Post-infecciosas — Estable`

- [ ] **Step 3: Commit**

```bash
git add modules/casos_resp.html
git commit -m "feat: agregar caso id:14 Bronquiectasias post-infecciosas estable — aclaramiento domiciliario, adherencia"
```

---

### Task 4: Agregar Case id:15 — Bronquiectasias FQ Adulto en Exacerbación

**Files:**
- Modify: `modules/casos_resp.html` (insertar antes de `];`, después de id:14)

- [ ] **Step 1: Insertar el objeto del caso id:15 antes del `];`**

```javascript
/* ============================================================
   CASO 15 — Bronquiectasias FQ Adulto: Exacerbación Aguda
   Nivel: Avanzado — Fisioterapia respiratoria
============================================================*/
{
  id:15, name:'Bronquiectasias FQ — Exacerbación Aguda', age:26, sex:'Masculino', sev:'sev',
  dx:'Fibrosis Quística del adulto (ΔF508/R117H) — Bronquiectasias quísticas bilaterales — Primera exacerbación grave hospitalaria',
  chief:'Primer ingreso hospitalario por exacerbación grave. Aumento de disnea 7 días, esputo purulento verde abundante, fiebre 38.1°C, deterioro funcional significativo.',
  hx:'Diagnóstico de FQ hace 8 meses (edad 25 años) tras investigación por bronquiectasias bilaterales en TC de tórax. Genotipo ΔF508/R117H (heterocigoto compuesto — fenotipo leve, función pancreática conservada). FEV₁ basal 52% predicho. Actualmente en antibióticos EV desde hace 3 días: tobramicina + linezolid (S. aureus MRSA en cultivo reciente; primer aislamiento de Pseudomonas aeruginosa en este ingreso). Recibe: ivacaftor/lumacaftor (modulator CFTR), dornasa alfa nebulizada 2.5mg/día, salbutamol, azitromicina. Soltero, estudiante universitario. Sin pareja.',
  baseVitals:{fc:96,fr:22,spo2:91,pas:118,pad:72,temp:38.1,borg:5},
  spiroPattern:'obstructive-sev',
  labs:{
    gsa:[
      {name:'pH',val:'7.38',ref:'7.35–7.45',status:'ok'},
      {name:'PaCO₂',val:'46 mmHg',ref:'35–45 mmHg',status:'hi'},
      {name:'PaO₂',val:'62 mmHg',ref:'80–100 mmHg',status:'lo'},
      {name:'HCO₃⁻',val:'27 mEq/L',ref:'22–26 mEq/L',status:'hi'},
      {name:'SaO₂',val:'91%',ref:'>95%',status:'lo'},
      {name:'FiO₂',val:'0.24 (2L/min gafas nasales)',ref:'—',status:'ok'}
    ],
    hem:[
      {name:'FEV₁',val:'42% predicho',ref:'>80%',status:'lo'},
      {name:'PCR',val:'48 mg/L',ref:'<5 mg/L',status:'hi'},
      {name:'Leucocitos',val:'14.200/µL',ref:'4.000–11.000',status:'hi'},
      {name:'S. aureus MRSA',val:'Positivo',ref:'Negativo',status:'hi'}
    ]
  },
  abcdeScenarios:[
    {
      letter:'A', color:'#f87171', bg:'rgba(248,113,113,.15)',
      context:'Tos intensa y frecuente con esputo purulento verde abundante. Sin hemoptisis activa (preguntar siempre en FQ). Sin estridor. Tos muy fatigante — el paciente refiere que "tose y tose y no sale nada". ¿Evaluación de A en exacerbación FQ?',
      opts:[
        {txt:'VA permeable con tos ineficaz por secreciones muy viscosas. Preguntar activamente por hemoptisis (frecuente en FQ, contraindicación relativa de algunas técnicas). La tos "improductiva" no es ineficacia del mecanismo de tos — es que las secreciones son tan viscosas (disfunción CFTR) que no se movilizan con la tos sola. La dornasa alfa reduce la viscosidad — clave administrarla ANTES del aclaramiento.',correct:true,
          fb:'✓ Correcto. En FQ, la disfunción del CFTR genera secreciones extremadamente viscosas (alto contenido en ADN de neutrófilos muertos). La tos sola es insuficiente para movilizarlas. La dornasa alfa (DNasa recombinante) rompe el ADN extracelular, reduciendo la viscosidad — su administración 30 min antes del aclaramiento es la clave de la secuencia terapéutica. La hemoptisis en FQ es frecuente (30% tienen episodios a lo largo de su vida) y puede contraindicar temporalmente las técnicas de percusión manual. Preguntar activamente.',cls:'good'},
        {txt:'Tos con esputo purulento verde = traqueobronquitis aguda. Posponer aclaramiento hasta resolución de la infección con antibióticos.',correct:false,
          fb:'✗ Incorrecto y perjudicial. La exacerbación infecciosa en FQ es precisamente cuando MÁS necesario es el aclaramiento — las secreciones infectadas acumuladas en los bronquios dañan el epitelio y perpetúan la infección. El aclaramiento intensivo hospitalario es el tratamiento fisioterapéutico de la exacerbación FQ, no algo a posponer. Los antibióticos y el aclaramiento son sinérgicos: el aclaramiento elimina el biofilm donde se protege la bacteria del antibiótico.',cls:'bad'},
        {txt:'Tos muy frecuente = riesgo de neumotórax. Limitar técnicas de aclaramiento hasta RX tórax de control.',correct:false,
          fb:'⚠ Precaución válida pero desproporcionada como primera respuesta. El neumotórax es una complicación real de la FQ avanzada, pero es infrecuente en FEV₁ 42% y primer ingreso. Si hay dolor pleurítico súbito, enfisema subcutáneo o deterioro brusco de SpO₂ → RX urgente. Sin esos signos, la tos frecuente por exacerbación no requiere RX antes de iniciar el aclaramiento. El riesgo de no hacer aclaramiento (empeoramiento de la infección) supera el riesgo teórico de neumotórax en este caso.',cls:'warn'}
      ]
    },
    {
      letter:'B', color:'#fbbf24', bg:'rgba(251,191,36,.15)',
      context:'FR 22 rpm, SpO₂ 91% con O₂ 2L. Crepitantes bilaterales extensos. Sibilancias espiratorias. Trabajo respiratorio aumentado. FEV₁ 42% (basal 52% — caída del 10%). ¿Plan fisioterapéutico B en exacerbación FQ hospitalaria?',
      opts:[
        {txt:'Aclaramiento intensivo hospitalario: (1) Dornasa alfa nebulizada 30 min antes del aclaramiento; (2) Salbutamol nebulizado inmediatamente antes del aclaramiento (broncodilatación + humidificación); (3) Aclaramiento: VEST (chaleco oscilante) o técnicas manuales ACBT + drenaje postural 3-4×/día; (4) El ejercicio activo está limitado hasta SpO₂ >92% estable — solo movilización activa-asistida. (5) Monitorizar SpO₂ continuo durante el aclaramiento.',correct:true,
          fb:'✓ Correcto y con la secuencia exacta. La secuencia en FQ hospitalaria es: dornasa alfa (30-60 min antes) → salbutamol nebulizado → aclaramiento (VEST o ACBT+drenaje postural) → evaluación SpO₂. El VEST (High Frequency Chest Wall Oscillation) tiene eficacia equivalente a las técnicas manuales pero permite mayor independencia y es menos fatigante para el fisioterapeuta. En España, la mayoría de centros de FQ usan técnicas manuales (ACBT + drenaje postural) como primera opción. La frecuencia de 3-4×/día en exacerbación hospitalaria está basada en evidencia de FQ pediátrica y adulta.',cls:'good'},
        {txt:'MRSA en cultivo = aislamiento estricto. El fisioterapeuta no puede entrar a la habitación sin equipo completo de aislamiento de contacto/aerosoles.',correct:false,
          fb:'⚠ Parcialmente correcto en el procedimiento pero no en la conclusión. El MRSA SÍ requiere precauciones de aislamiento de contacto (bata + guantes) y el fisioterapeuta debe usarlas. PERO eso no impide la fisioterapia — impide hacerla sin EPI. La conclusión correcta es: "entro con equipo de protección adecuado". La fisioterapia con aclaramiento en FQ con MRSA es igualmente necesaria, con las precauciones de aislamiento correctas.',cls:'warn'},
        {txt:'FEV₁ caído de 52% a 42% = deterioro grave. VMNI urgente antes de cualquier aclaramiento.',correct:false,
          fb:'⚠ Prematuro. La VMNI en exacerbación FQ se indica cuando: SpO₂ <88% refractaria a O₂ convencional, hipercapnia progresiva (PaCO₂ >50 mmHg y subiendo), o trabajo respiratorio extremo. Este paciente tiene SpO₂ 91% con O₂ 2L y PaCO₂ 46 mmHg — en el límite pero manejable. La primera intervención es el aclaramiento intensivo + O₂ + antibióticos. Si en 24-48h no hay mejoría, entonces valorar VMNI como adyuvante del aclaramiento.',cls:'warn'}
      ]
    },
    {
      letter:'C', color:'#4ade80', bg:'rgba(74,222,128,.15)',
      context:'FC 96 lpm, PA 118/72 mmHg. Sin ingurgitación yugular. Sin edema periférico. Temperatura 38.1°C. ¿Evaluación cardiovascular y condicionantes para la movilización?',
      opts:[
        {txt:'C con taquicardia reactiva a fiebre e hipoxemia — no arritmia patológica. Sin compromiso hemodinámico. La FC 96 lpm en contexto de fiebre 38.1°C y SpO₂ 91% es una respuesta fisiológica esperada. Ejercicio activo limitado en exacerbación (SpO₂ <92%) — solo movilización activa-asistida en cama y sedestación controlada. El objetivo C en exacerbación FQ es prevenir el desacondicionamiento, no mejorar la capacidad aeróbica.',correct:true,
          fb:'✓ Correcto. La regla general: por cada 1°C de fiebre, la FC sube ~10 lpm. FC 96 con fiebre 38.1°C es esperable (FC "corregida" sin fiebre ~86 lpm). No indica arritmia ni compromiso hemodinámico. La limitación del ejercicio activo en exacerbación FQ se basa en: (1) SpO₂ <92% con O₂ convencional, (2) fiebre activa, (3) trabajo respiratorio aumentado — todos presentes. La movilización activa-asistida (cambios posturales, sedestación) mantiene la masa muscular y previene el desacondicionamiento sin sobrecargar el sistema cardiorrespiratorio.',cls:'good'},
        {txt:'FC 96 = taquicardia sinusal patológica en un paciente de 26 años. ECG urgente antes de cualquier movilización.',correct:false,
          fb:'✗ Incorrecto. La taquicardia sinusal en contexto infeccioso con fiebre 38.1°C e hipoxemia es una respuesta fisiológica completamente esperada y no patológica. Un ECG urgente no está indicado en este contexto — no cambiaría el manejo. La taquicardia se resolverá con el control de la infección (antibióticos), la mejora de la SpO₂ y la defervescencia.',cls:'bad'},
        {txt:'Sin ingurgitación yugular ni edema = C completamente normal. Ejercicio aeróbico completo indicado para combatir el desacondicionamiento del ingreso.',correct:false,
          fb:'✗ Incorrecto. La ausencia de signos de fallo cardíaco derecho (IY, edema) no equivale a "C completamente normal" en el contexto de SpO₂ 91% con O₂, FR 22 rpm y fiebre. El ejercicio aeróbico intenso está contraindicado en exacerbación activa (SpO₂ <92%, fiebre). El riesgo de desaturación brusca durante el ejercicio aeróbico con SpO₂ basal 91% es real y potencialmente peligroso.',cls:'bad'}
      ]
    },
    {
      letter:'D', color:'#a78bfa', bg:'rgba(167,139,250,.15)',
      context:'Alerta, orientado. Muy angustiado: "¿Esto quiere decir que voy a ir empeorando toda mi vida? Nadie me había dicho lo que significa tener FQ de verdad." Diagnóstico hace 8 meses. Primera hospitalización. Sin pareja ni hijos. ¿Cómo manejas D?',
      opts:[
        {txt:'Impacto psicológico del diagnóstico tardío FQ en adulto — proceso de duelo activo. El fisioterapeuta NO es el terapeuta, pero SÍ pasa más tiempo con el paciente que ningún otro profesional. Intervención: (1) Escucha activa sin minimizar; (2) Responder solo lo que se sabe con certeza: "La FQ es crónica, pero su evolución varía mucho según el genotipo — el tuyo es más leve. Los tratamientos actuales han cambiado radicalmente el pronóstico"; (3) Derivación activa a psicólogo especializado en FQ y asociación de pacientes.',correct:true,
          fb:'✓ Correcto y con la actitud apropiada. El diagnóstico tardío de FQ en adulto tiene un impacto psicológico específico y complejo: el paciente ha vivido 25 años sin saber que tenía una enfermedad crónica grave, y de repente toda su historia de síntomas respiratorios cobra un significado nuevo. El proceso de duelo (negación → rabia → negociación → depresión → aceptación) es el mismo que en cualquier diagnóstico de enfermedad crónica. El fisioterapeuta es a menudo el primer interlocutor de confianza — no tiene que resolver el duelo, pero puede contener y derivar activamente.',cls:'good'},
        {txt:'El paciente está muy angustiado. Posponer el aclaramiento para esta sesión — priorizar el apoyo emocional.',correct:false,
          fb:'⚠ Inadecuado. El aclaramiento en exacerbación FQ es la intervención fisioterapéutica más urgente — posponerlo tiene consecuencias clínicas reales (acumulación de secreciones, empeoramiento de la infección). El apoyo emocional y el aclaramiento no son excluyentes: se puede crear un espacio de escucha breve (5-10 min) mientras se preparan los nebulizadores, hacer el aclaramiento, y continuar el diálogo emocional durante la sesión. La técnica de ACBT permite comunicación durante los ciclos de expansión torácica.',cls:'warn'},
        {txt:'El pronóstico de la FQ es grave. Informar con honestidad completa sobre la esperanza de vida y la progresión esperada.',correct:false,
          fb:'✗ Inapropiado en este momento. Una información honesta pero no contextualizada sobre el pronóstico en el momento de la primera hospitalización de un paciente de 26 años con diagnóstico de 8 meses puede ser devastadora y contraproducente. Además, el pronóstico en FQ ha cambiado radicalmente con los moduladores CFTR (ivacaftor/lumacaftor) — este paciente tiene un genotipo leve. La información sobre pronóstico debe darse de forma gradual, contextualizada y con el apoyo del equipo multidisciplinar (neumólogo, psicólogo, trabajador social).',cls:'bad'}
      ]
    },
    {
      letter:'E', color:'#38bdf8', bg:'rgba(56,189,248,.15)',
      context:'Tobramicina EV (monitorizar nefrotoxicidad), linezolid EV (monitorizar trombopenia), dornasa alfa 2.5mg nebulizada/día, ivacaftor/lumacaftor (con alimento graso), azitromicina. ¿Qué condiciona E al plan fisioterapéutico?',
      opts:[
        {txt:'Análisis farmacológico completo: (1) Tobramicina EV — nefrotóxica: monitorizar creatinina y diuresis; si diuresis reducida → consultar antes de la sesión; (2) Linezolid — trombopenia: vigilar petequias, hematomas (si aparecen → avisar); (3) Dornasa alfa — administrar 30-60 min ANTES del aclaramiento (no después); (4) Ivacaftor/lumacaftor — tomar con alimentos grasos para absorción; no condiciona directamente el aclaramiento; (5) Secuencia correcta de nebulizaciones: salbutamol → (30-60 min después: dornasa alfa) → aclaramiento → antibiótico nebulizado si hubiera.',correct:true,
          fb:'✓ Análisis farmacológico correcto. El punto más importante es la secuencia de dornasa alfa: administrada antes del aclaramiento, tiene tiempo de actuar sobre el ADN extracelular y reducir la viscosidad del esputo — el aclaramiento posterior es más eficaz. Administrada después, el moco ya fue movilizado (o no) sin el beneficio de la menor viscosidad. La tobramicina EV es nefrotóxica especialmente en combinación con otros nefrotóxicos — el fisioterapeuta no gestiona el antibiótico, pero debe conocer los signos de toxicidad (reducción de diuresis, confusión, edemas) porque pasa tiempo con el paciente.',cls:'good'},
        {txt:'Tobramicina EV + linezolid = doble antibiótico. Riesgo de sobreinfección por hongos. Suspender el aclaramiento para no diseminar.',correct:false,
          fb:'✗ Incorrecto en mecanismo y conclusión. La sobreinfección fúngica puede ocurrir con antibióticos de amplio espectro, pero no se previene suspendiendo el aclaramiento — al contrario, las secreciones acumuladas favorecen el crecimiento fúngico. El riesgo de sobreinfección fúngica se monitoriza con cultivos periódicos y la decisión de tratamiento antifúngico es médica. El aclaramiento continúa independientemente.',cls:'bad'},
        {txt:'Ivacaftor/lumacaftor = modulator CFTR. Mejora la función del canal de cloro → la dornasa alfa ya no es necesaria durante el tratamiento con moduladores.',correct:false,
          fb:'⚠ Razonamiento parcialmente fundamentado pero incorrecto en la conclusión. Los moduladores CFTR mejoran la función del canal y reducen la producción de secreciones anómalas a largo plazo, pero no eliminan las secreciones ya existentes ni revierten la inflamación bronquial establecida. En exacerbación activa con secreciones abundantes, la dornasa alfa sigue siendo necesaria. A largo plazo (meses-años con moduladores), la cantidad de aclaramiento puede reducirse, pero no se elimina.',cls:'warn'}
      ]
    }
  ],
  exerciseParams:{
    vo2peak:11,
    restVitals:{fc:96,fr:22,spo2:91,borg:5,pas:118},
    phases:[
      {name:'Dornasa alfa + nebulización',pct:5,fc:96,fr:22,spo2:91,borg:5,pas:118,log:'Dornasa alfa + salbutamol nebulizados — FC 96 lpm · FR 22 rpm · SpO₂ 91% · Borg 5 · PAS 118 mmHg · Preparación para aclaramiento'},
      {name:'Aclaramiento ACBT',pct:20,fc:98,fr:23,spo2:90,borg:5,pas:120,log:'Aclaramiento ACBT 20 min — FC 98 lpm · FR 23 rpm · SpO₂ 90% · Borg 5 · PAS 120 mmHg · Expectoración abundante'},
      {name:'Movilización activa-asistida',pct:10,fc:100,fr:23,spo2:90,borg:5,pas:121,log:'Movilización activa-asistida MMII — FC 100 lpm · FR 23 rpm · SpO₂ 90% · Borg 5 · PAS 121 mmHg · Prevención desacondicionamiento'},
      {name:'Sedestación controlada',pct:15,fc:98,fr:22,spo2:91,borg:5,pas:119,log:'Sedestación borde cama 15 min — FC 98 lpm · FR 22 rpm · SpO₂ 91% · Borg 5 · PAS 119 mmHg · Tolerable con O₂ 2L'},
      {name:'Aclaramiento post + reposo',pct:5,fc:96,fr:21,spo2:91,borg:4,pas:118,log:'2° sesión aclaramiento breve + reposo — FC 96 lpm · FR 21 rpm · SpO₂ 91% · Borg 4 · PAS 118 mmHg · Consolidar drenaje'}
    ],
    physiologyNotes:'En exacerbación FQ (FEV₁ caído de 52% a 42%), el VO₂ pico está severamente comprometido (~11 mL/kg/min) por la combinación de hipoxemia, trabajo respiratorio aumentado y fiebre. El objetivo fisioterapéutico no es mejorar el VO₂ pico (imposible en exacerbación activa) sino: (1) aclaramiento máximo para eliminar el biofilm bacteriano, (2) prevenir el desacondicionamiento muscular con movilización mínima. La dornasa alfa reduce la viscosidad del esputo, haciendo el aclaramiento más eficaz: sin ella, la ACBT mueve secreciones de alta viscosidad con mucho mayor esfuerzo ventilatorio.'
  },
  goals:['Aclaramiento intensivo 3-4×/día hasta mejoría clínica (FEV₁ retorno a basal)','Prevenir desacondicionamiento con movilización progresiva','Apoyo psicológico activo — derivación a psicólogo FQ y asociación de pacientes','Educación en secuencia nebulización→aclaramiento para el alta'],
  interventions:['Dornasa alfa 30-60 min antes + salbutamol inmediatamente antes del aclaramiento','Aclaramiento ACBT 3-4×/día (20 min/sesión) con drenaje postural si tolera','Movilización activa-asistida en cama + sedestación progresiva (SpO₂ ≥88%)','Precauciones MRSA: bata + guantes en cada sesión de fisioterapia','Conexión con psicólogo especializado en FQ y Asociación Española de Fibrosis Quística']
},
```

- [ ] **Step 2: Verificar sintaxis**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('modules/casos_resp.html', 'utf8');
const m = html.match(/const CASES = \[([\s\S]*?)\];/);
const cases = eval('[' + m[1] + ']');
console.log('Casos:', cases.length, '— id:15:', cases.find(c=>c.id===15)?.name);
"
```
Esperado: `Casos: 16 — id:15: Bronquiectasias FQ — Exacerbación Aguda`

- [ ] **Step 3: Commit**

```bash
git add modules/casos_resp.html
git commit -m "feat: agregar caso id:15 Bronquiectasias FQ exacerbacion — dornasa alfa, MRSA, diagnostico tardio"
```

---

### Task 5: Agregar Case id:16 — Bronquiectasias Post-tuberculosis Avanzadas

**Files:**
- Modify: `modules/casos_resp.html` (insertar antes de `];`, después de id:15)

- [ ] **Step 1: Insertar el objeto del caso id:16 antes del `];`**

```javascript
/* ============================================================
   CASO 16 — Bronquiectasias Post-TBC: Avanzadas
   Nivel: Avanzado — Fisioterapia respiratoria
============================================================*/
{
  id:16, name:'Bronquiectasias Post-TBC — Avanzadas', age:67, sex:'Masculino', sev:'sev',
  dx:'Bronquiectasias saculares bilaterales post-tuberculosis — Insuficiencia respiratoria crónica — O₂ domiciliario — Candidato a trasplante pulmonar',
  chief:'Control ambulatorio mensual. Disnea con mínimos esfuerzos (hablar, vestirse). O₂ domiciliario 2L/min. Muy decondicionado. Colonización Pseudomonas aeruginosa multirresistente. En lista de trasplante pulmonar.',
  hx:'Tuberculosis pulmonar bilateral tratada a los 35 años (tratamiento completo, curación microbiológica). Secuelas: bronquiectasias saculares en lóbulos superiores bilaterales + fibrosis parenquimatosa. Diagnóstico de IR crónica hace 3 años (LTOT). FEV₁ basal 29% predicho. TC: bronquiectasias saculares bilaterales + atrapamiento aéreo + bandas fibrosas en LSI y LSD. Eco: HTP leve (PSAP 38 mmHg), FE 58%, VD dilatado. 6MWT basal: 185m (predicho 550m). En lista de trasplante bipulmonar hace 6 meses. Recibe: tiotropio, formoterol, fluticasona, colistina nebulizada 1 MUI/12h (en sala de aislamiento), O₂ domiciliario 2L/min (aumentar a 4L durante ejercicio). No anticoagulación. 2 episodios de hemoptisis leve (esputos hemoptoicos) en el último año.',
  baseVitals:{fc:88,fr:20,spo2:90,pas:138,pad:84,temp:36.8,borg:4},
  spiroPattern:'obstructive-sev',
  labs:{
    gsa:[
      {name:'pH',val:'7.40',ref:'7.35–7.45',status:'ok'},
      {name:'PaCO₂',val:'50 mmHg',ref:'35–45 mmHg',status:'hi'},
      {name:'PaO₂',val:'60 mmHg',ref:'80–100 mmHg',status:'lo'},
      {name:'HCO₃⁻',val:'31 mEq/L',ref:'22–26 mEq/L',status:'hi'},
      {name:'SaO₂',val:'90%',ref:'>95%',status:'lo'},
      {name:'FiO₂',val:'0.28 (2L/min gafas nasales)',ref:'—',status:'ok'}
    ],
    hem:[
      {name:'FEV₁',val:'29% predicho',ref:'>80%',status:'lo'},
      {name:'6MWT',val:'185m',ref:'550m (predicho)',status:'lo'},
      {name:'PSAP eco',val:'38 mmHg',ref:'<25 mmHg',status:'hi'},
      {name:'Pseudomonas XDR',val:'Multirresistente',ref:'Negativo',status:'hi'}
    ]
  },
  abcdeScenarios:[
    {
      letter:'A', color:'#f87171', bg:'rgba(248,113,113,.15)',
      context:'Tos débil con secreciones espesas difíciles de expectorar. El paciente refiere que "intenta toser pero no tiene fuerza". Antecedente de 2 episodios de hemoptisis leve en el último año. Sin hemoptisis activa hoy. ¿Evaluación de A en bronquiectasias avanzadas?',
      opts:[
        {txt:'VA permeable con tos ineficaz por debilidad muscular respiratoria (músculos espiratorios debilitados por desacondicionamiento y enfermedad crónica). Preguntar activamente por hemoptisis: ¿color?, ¿cantidad?, ¿igual que los episodios anteriores? Sin hemoptisis activa → continuar. Antecedente de hemoptisis → técnicas de percusión manual contraindicadas (usar técnicas de baja presión: ELTGOL, PEP baja, Flutter en posición suave). Tos asistida (compresión abdominal suave) para mejorar eficacia expectorante.',correct:true,
          fb:'✓ Correcto. La tos ineficaz en bronquiectasias avanzadas no es porque el reflejo tusígeno esté ausente — es porque los músculos espiratorios (intercostales, abdominales) están debilitados por el desacondicionamiento y la enfermedad crónica. El pico de flujo espiratorio de la tos (PEF tos) puede estar muy reducido (<160 L/min = tos ineficaz). La tos asistida (compresión abdominal manual en la fase espiratoria) puede duplicar el flujo espiratorio. El antecedente de hemoptisis contraindica la percusión manual (riesgo de desencadenar nuevo episodio) pero no las técnicas de presión positiva espiratoria suave (Flutter, ELTGOL).',cls:'good'},
        {txt:'Antecedente de hemoptisis = contraindicación de toda fisioterapia respiratoria hasta evaluación de broncoscopia.',correct:false,
          fb:'✗ Excesivo. La hemoptisis activa MASIVA contraindica la fisioterapia. El antecedente de hemoptisis leve (esputos hemoptoicos) en los últimos meses NO contraindica el aclaramiento — contraindica las técnicas de percusión manual y el drenaje postural con cabeza baja. Las técnicas de baja presión (ELTGOL, PEP baja, Flutter) son seguras. La broncoscopia se indica para localizar la fuente de hemoptisis activa severa, no como criterio previo al aclaramiento de mantenimiento.',cls:'bad'},
        {txt:'Tos débil = músculos respiratorios débiles. Iniciar entrenamiento muscular inspiratorio (IMT) intensivo para fortalecer los músculos.',correct:false,
          fb:'⚠ El IMT tiene evidencia en EPOC y bronquiectasias, pero no está indicado en fase avanzada con IR crónica y candidato a trasplante como primera intervención. El objetivo del fortalecimiento muscular pre-trasplante en este paciente es el ejercicio aeróbico de baja-moderada intensidad para mantener la masa muscular periférica — no el IMT, que podría fatigar músculos ya comprometidos. Además, la tos débil en este contexto se aborda con tos asistida, no con IMT (que trabaja la inspiración, no la espiración).',cls:'warn'}
      ]
    },
    {
      letter:'B', color:'#fbbf24', bg:'rgba(251,191,36,.15)',
      context:'FR 20 rpm, SpO₂ 90% con O₂ 2L. Crepitantes bilaterales. Matidez en vértices (fibrosis post-TBC). PaCO₂ 50 mmHg (hipercapnia crónica compensada, HCO₃⁻ 31). ¿Intervención B y manejo del O₂ en hipercapnia crónica?',
      opts:[
        {txt:'B con IR crónica hipercápnica. O₂ objetivo 88-92% (NO buscar 95-98% — riesgo de reducir el drive ventilatorio hipóxico en hipercapnicos). Aclaramiento adaptado a baja reserva: sesiones cortas 10-15 min máximo (fatiga muscular), Flutter en decúbito lateral o sentado (no Trendelenburg — empeora la mecánica ventilatoria). PEP baja (5-10 cmH₂O) para evitar atrapamiento aéreo. Aumentar O₂ a 4L durante el aclaramiento si SpO₂ <88%.',correct:true,
          fb:'✓ Correcto y con el matiz crítico del O₂. La hipercapnia crónica compensada (PaCO₂ 50, HCO₃⁻ 31) indica que el centro respiratorio se ha "acostumbrado" a niveles elevados de CO₂ — el principal estímulo ventilatorio es ahora la HIPOXIA (drive hipóxico). Si se administra O₂ en exceso y la SpO₂ sube >95%, se elimina el drive hipóxico y el centro respiratorio "descansa" → hipoventilación → más hipercapnia → narcosis por CO₂. Objetivo SpO₂ 88-92% en hipercapnicos es la recomendación estándar. Las sesiones de aclaramiento cortas evitan la fatiga muscular.',cls:'good'},
        {txt:'SpO₂ 90% con O₂ 2L = hipoxemia activa. Aumentar O₂ a 5L para SpO₂ >95% antes de cualquier intervención.',correct:false,
          fb:'✗ Contraindicado en hipercapnia crónica. Aumentar el O₂ hasta SpO₂ >95% en un paciente con PaCO₂ 50 mmHg y HCO₃⁻ 31 (hipercápnico crónico) puede suprimir el drive hipóxico y precipitar narcosis por CO₂. El objetivo de SpO₂ 88-92% no es una negligencia — es el manejo correcto de la IR hipercápnica crónica. Esta es la diferencia fundamental entre hipoxemia aguda (target SpO₂ >94%) e IR hipercápnica crónica (target SpO₂ 88-92%).',cls:'bad'},
        {txt:'Hipercapnia crónica + bronquiectasias = indicación de VMNI domiciliaria. Derivar urgente a neumología para VMNI antes de continuar la RP.',correct:false,
          fb:'⚠ La VMNI domiciliaria puede estar indicada en hipercapnia crónica con PaCO₂ >55 mmHg o sintomática. PaCO₂ 50 mmHg está en zona gris. PERO la derivación "urgente" no es lo apropiado en un paciente que ya tiene seguimiento neumológico activo (en lista de trasplante). La valoración de VMNI domiciliaria es parte del seguimiento regular de neumología en este paciente — no es una urgencia en la visita de fisioterapia. Lo urgente aquí es no superar el umbral de SpO₂ con O₂ excesivo.',cls:'warn'}
      ]
    },
    {
      letter:'C', color:'#4ade80', bg:'rgba(74,222,128,.15)',
      context:'FC 88 lpm, PA 138/84. Cor pulmonale compensado (PSAP 38 mmHg, VD dilatado en eco). Sin edema activo. SpO₂ 90% con O₂ 2L. 6MWT 185m con SpO₂ nadir 84% sin O₂ suplementario. ¿Qué determinas en C y cómo prescripes el ejercicio pre-trasplante?',
      opts:[
        {txt:'Cor pulmonale compensado. La HTP leve (PSAP 38 mmHg) impone restricciones al ejercicio: evitar esfuerzos isométricos (Valsalva) que aumentan la postcarga del VD. Prescripción pre-trasplante: ejercicio aeróbico de baja-moderada intensidad, Borg 3-4 máximo, SpO₂ objetivo 88-92% (aumentar O₂ a 4L durante ejercicio). 6MWT con O₂ 4L como herramienta de prescripción y seguimiento. Objetivo: mantener la masa muscular periférica para mejorar el pronóstico post-trasplante.',correct:true,
          fb:'✓ Correcto y con la lógica fisiopatológica del trasplante. El estado físico pre-trasplante es uno de los predictores más potentes del resultado post-trasplante. Los pacientes que entran al trasplante con mayor masa muscular y capacidad funcional tienen menor mortalidad post-quirúrgica y mejor recuperación. La prescripción de ejercicio pre-trasplante no busca "curar" la enfermedad — busca que el paciente llegue al trasplante en el mejor estado muscular posible. El Valsalva (levantamiento de pesos con apnea) está contraindicado porque aumenta bruscamente la postcarga del VD ya comprometido.',cls:'good'},
        {txt:'6MWT 185m = capacidad funcional crítica. Contraindicado el ejercicio — riesgo de muerte súbita durante el esfuerzo.',correct:false,
          fb:'✗ Incorrecto. La indicación del ejercicio pre-trasplante es precisamente para pacientes con capacidad funcional muy reducida — no existe un umbral de 6MWT por debajo del cual el ejercicio esté contraindicado. La muerte súbita durante el ejercicio supervisado en programas de RP es extremadamente rara incluso en pacientes con enfermedad avanzada. El riesgo de NO hacer ejercicio (mayor desacondicionamiento, peor pronóstico post-trasplante) supera ampliamente el riesgo del ejercicio supervisado y monitorizado.',cls:'bad'},
        {txt:'PSAP 38 mmHg = HTP significativa. Derivar a cardiología antes de cualquier prescripción de ejercicio.',correct:false,
          fb:'⚠ Excesivo. HTP leve (PSAP 25-40 mmHg) en el contexto de enfermedad pulmonar crónica avanzada es una complicación esperada (HTP del grupo 3 — secundaria a hipoxia crónica). No requiere derivación cardiológica urgente en un paciente ya en seguimiento multidisciplinar para trasplante. La restricción de ejercicio isométrico (Valsalva) y el objetivo de SpO₂ 88-92% son las adaptaciones correctas a la HTP leve en este contexto.',cls:'warn'}
      ]
    },
    {
      letter:'D', color:'#a78bfa', bg:'rgba(167,139,250,.15)',
      context:'Alerta, orientado. Resignado: "Llevo 30 años con esto. Ya no espero mejorar — solo que no empeore." Ha reducido su actividad al mínimo ("para qué si me fatigo con todo"). ¿Cómo abordas D?',
      opts:[
        {txt:'Baja autoeficacia y resignación crónica — barrera terapéutica mayor en enfermedad crónica avanzada. Intervención: (1) Validar la experiencia ("30 años con esta enfermedad es agotador"); (2) Redirigir el objetivo: no "mejorar" sino "llegar al trasplante en el mejor estado posible" — el ejercicio es preparación quirúrgica; (3) El estado físico pre-trasplante predice directamente la supervivencia post-trasplante: "el ejercicio es la preparación para la operación, como un deportista antes de la competición".',correct:true,
          fb:'✓ Excelente. La baja autoeficacia en enfermedad crónica avanzada es comprensible y respetable — el paciente ha tenido razón muchas veces en que las cosas empeoran. La clave no es contradecirlo ("¡claro que puede mejorar!") sino redirigir el objetivo a algo concreto y motivador: el trasplante como horizonte real. El encuadre del ejercicio como "preparación quirúrgica" (comparable a la fisioterapia pre-operatoria) cambia la narrativa de "ejercicio para mejorar la enfermedad" (que él sabe que no es posible) a "prepararse para la operación que sí puede cambiar todo".',cls:'good'},
        {txt:'La resignación es una respuesta adaptativa a la enfermedad crónica. Respetar su actitud y no insistir con el ejercicio.',correct:false,
          fb:'✗ Inadecuado. Respetar la autonomía del paciente es fundamental, pero la resignación que lleva a la inactividad total en un candidato a trasplante es clínicamente perjudicial: el desacondicionamiento progresivo empeora el pronóstico post-trasplante. La intervención del fisioterapeuta no es "insistir" contra su voluntad, sino explorar y modificar la narrativa que le lleva a la inactividad. Si tras una intervención educativa bien hecha el paciente sigue rechazando el ejercicio, entonces sí respetar su autonomía.',cls:'bad'},
        {txt:'Resignación en enfermedad terminal = depresión mayor. Derivar a psiquiatría para tratamiento antes de continuar la RP.',correct:false,
          fb:'⚠ La resignación crónica en enfermedad avanzada no es automáticamente una depresión mayor que requiere psiquiatría. Es una respuesta comprensible a décadas de enfermedad. Los criterios de depresión mayor (anhedonia, insomnio, pérdida de apetito, ideación suicida, llanto frecuente) deben evaluarse activamente — si están presentes, la derivación es apropiada. Pero etiquetar la resignación directamente como depresión mayor e indicar psiquiatría sin evaluación puede medicalizar una respuesta adaptativa.',cls:'warn'}
      ]
    },
    {
      letter:'E', color:'#38bdf8', bg:'rgba(56,189,248,.15)',
      context:'Tiotropio, formoterol/fluticasona, colistina nebulizada 1 MUI/12h (requiere sala de aislamiento), O₂ domiciliario 2L/min (4L durante ejercicio). 2 episodios de hemoptisis leve previos. ¿Qué condiciona E?',
      opts:[
        {txt:'Puntos críticos de E: (1) Colistina nebulizada — requiere sala/cabina de aislamiento para la nebulización (aerosol infeccioso con Pseudomonas XDR — riesgo para otros pacientes y personal); (2) O₂ de ejercicio 4L/min — objetivo SpO₂ 88-92%, NO superar; (3) Antecedente de hemoptisis → contraindicación de percusión manual, Trendelenburg y técnicas de alta presión espiratoria; (4) Sin anticoagulación — no modifica el plan; (5) Tiotropio + formoterol — broncodilatación de mantenimiento, no ajustar.',correct:true,
          fb:'✓ Correcto. El punto más crítico es la colistina nebulizada con Pseudomonas XDR: este antibiótico nebulizado genera aerosoles con la bacteria multirresistente. La administración en sala abierta expone a otros pacientes y al personal sanitario a la Pseudomonas XDR. El protocolo correcto es una sala individual o cabina de aislamiento de presión negativa con filtro HEPA. El fisioterapeuta que realiza fisioterapia inmediatamente después de la nebulización de colistina en la misma habitación sin ventilación adecuada puede estar expuesto. Este es un conocimiento de seguridad laboral que el fisioterapeuta debe tener.',cls:'good'},
        {txt:'Colistina nebulizada = antibiótico tópico. No genera aerosoles infecciosos — no requiere precauciones especiales.',correct:false,
          fb:'✗ Incorrecto y potencialmente peligroso. La colistina nebulizada SÍ genera aerosoles con la bacteria en el esputo del paciente durante y después de la nebulización. Con Pseudomonas aeruginosa XDR (extremadamente resistente), la diseminación aérea a otros pacientes o personal es un riesgo real. Las guías de control de infecciones en FQ (y aplicables a bronquiectasias con Pseudomonas XDR) establecen protocolos de aislamiento específicos para las nebulizaciones.',cls:'bad'},
        {txt:'O₂ 4L durante ejercicio = O₂ alto flujo. Contraindicado en hipercápnico crónico — riesgo de narcosis por CO₂.',correct:false,
          fb:'⚠ El razonamiento sobre el riesgo de narcosis es correcto en general, pero la conclusión de "contraindicado" es incorrecta. El O₂ 4L durante el ejercicio está prescrito por el neumólogo precisamente para compensar la mayor demanda durante el esfuerzo. El objetivo SpO₂ 88-92% se mantiene también con 4L — no se administra O₂ para llevar SpO₂ a 98%. El riesgo de narcosis existe si SpO₂ sube >95% de forma sostenida con el O₂ suplementario, por eso la monitorización continua de SpO₂ durante el ejercicio es obligatoria.',cls:'warn'}
      ]
    }
  ],
  exerciseParams:{
    vo2peak:10,
    restVitals:{fc:88,fr:20,spo2:90,borg:4,pas:138},
    phases:[
      {name:'Aclaramiento adaptado',pct:10,fc:90,fr:21,spo2:89,borg:5,pas:140,log:'Aclaramiento corto 10 min (ELTGOL + Flutter) — FC 90 lpm · FR 21 rpm · SpO₂ 89% · Borg 5 · PAS 140 mmHg · Con O₂ 4L'},
      {name:'Conservación energía',pct:5,fc:88,fr:20,spo2:90,borg:4,pas:138,log:'Técnicas conservación energía — FC 88 lpm · FR 20 rpm · SpO₂ 90% · Borg 4 · PAS 138 mmHg · Descanso activo'},
      {name:'Marcha 50m con O₂ 4L',pct:30,fc:96,fr:22,spo2:88,borg:5,pas:144,log:'Marcha 50m con O₂ 4L/min — FC 96 lpm · FR 22 rpm · SpO₂ 88% · Borg 5 · PAS 144 mmHg · LÍMITE — SpO₂ objetivo 88-92%'},
      {name:'Recuperación sentado',pct:8,fc:90,fr:21,spo2:89,borg:4,pas:140,log:'Recuperación sentado — FC 90 lpm · FR 21 rpm · SpO₂ 89% · Borg 4 · PAS 140 mmHg · Lenta normalización'},
      {name:'Reposo supervisado',pct:5,fc:88,fr:20,spo2:90,borg:4,pas:138,log:'Reposo supervisado — FC 88 lpm · FR 20 rpm · SpO₂ 90% · Borg 4 · PAS 138 mmHg · Retorno a valores basales'}
    ],
    physiologyNotes:'En bronquiectasias avanzadas post-TBC (FEV₁ 29%, HTP leve, O₂ domiciliario), el VO₂ pico está muy severamente reducido (~10 mL/kg/min, similar a NYHA IV). La limitación es mixta: ventilatoria (obstrucción severa + fibrosis + hiperinflación), vascular (HTP reduce el gasto cardíaco en ejercicio) y muscular periférica (desacondicionamiento severo). El objetivo del ejercicio pre-trasplante no es mejorar el VO₂ pico (imposible con esta función pulmonar) sino mantener la masa muscular periférica: los pacientes con mayor masa muscular en el momento del trasplante tienen menor mortalidad a 1 año y menor tiempo en UCI post-trasplante.'
  },
  goals:['Mantener masa muscular periférica pre-trasplante (evitar mayor desacondicionamiento)','Aclaramiento de mantenimiento adaptado a baja reserva (prevenir exacerbaciones)','Educación en técnicas de conservación de energía para actividades de vida diaria','Preparación psicológica para el trasplante: ejercicio como "entrenamiento pre-quirúrgico"'],
  interventions:['Aclaramiento corto 10-15 min: ELTGOL + Flutter en posición suave — 2×/día','Tos asistida (compresión abdominal) — SIN percusión manual (antecedente hemoptisis)','Marcha supervisada con O₂ 4L/min, SpO₂ objetivo 88-92%, Borg máximo 5','Técnicas de conservación de energía: fraccionamiento de tareas, planificación de actividades','Colistina nebulizada en sala de aislamiento — fisioterapia 60 min después de la nebulización']
},
```

- [ ] **Step 2: Verificar sintaxis completa**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('modules/casos_resp.html', 'utf8');
const m = html.match(/const CASES = \[([\s\S]*?)\];/);
const cases = eval('[' + m[1] + ']');
console.log('Total casos:', cases.length);
cases.forEach(c => console.log(' id:' + c.id, '|', c.name, '| sev:', c.sev));
"
```
Esperado: 17 casos, id:0–16 listados sin errores.

- [ ] **Step 3: Commit**

```bash
git add modules/casos_resp.html
git commit -m "feat: agregar caso id:16 Bronquiectasias post-TBC avanzadas — colistina XDR, pre-trasplante, hipercapnia"
```

---

### Task 6: Verificación final e integración

**Files:**
- Read: `modules/casos_resp.html`

- [ ] **Step 1: Confirmar badge**

Busca `<span class="badge a">` — debe leer "17 Casos Integrados".

- [ ] **Step 2: Verificar IDs únicos y completos (0-16)**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('modules/casos_resp.html', 'utf8');
const m = html.match(/const CASES = \[([\s\S]*?)\];/);
const cases = eval('[' + m[1] + ']');
const ids = cases.map(c => c.id).sort((a,b) => a-b);
console.log('IDs:', ids.join(', '));
console.log('Sin duplicados:', new Set(ids).size === ids.length);
console.log('Total:', cases.length);
"
```
Esperado: `IDs: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 — Sin duplicados: true — Total: 17`

- [ ] **Step 3: Verificar estructura de los 4 casos nuevos**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('modules/casos_resp.html', 'utf8');
const m = html.match(/const CASES = \[([\s\S]*?)\];/);
const cases = eval('[' + m[1] + ']');
[13,14,15,16].forEach(id => {
  const c = cases.find(x => x.id === id);
  const ok = c && c.abcdeScenarios.length === 5 && c.exerciseParams.phases.length === 5;
  console.log('id:' + id, c.name, '| ABCDE:', c.abcdeScenarios.length, '| Fases:', c.exerciseParams.phases.length, '|', ok ? 'OK' : 'ERROR');
});
"
```
Esperado: todos muestran ABCDE:5, Fases:5, OK.

- [ ] **Step 4: Commit final de sesión**

Solo si hay cambios sin commitear (verificar con `git status` primero):
```bash
git status
# Si hay cambios:
git add modules/casos_resp.html
git commit -m "feat: completar sesion 2 — EPOC post-exacerbacion + Bronquiectasias 3 perfiles diferenciados"
```
