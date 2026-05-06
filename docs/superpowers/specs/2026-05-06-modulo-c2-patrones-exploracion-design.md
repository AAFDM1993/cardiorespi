# Diseño: Módulo C2 — Patrones Respiratorios + Exploración Física

**Fecha:** 2026-05-06
**Estado:** Aprobado

---

## Objetivo

Actualizar `modules/patrones_resp.html` con tres patrones nuevos y un cuarto tab de Exploración Física completa (inspección, palpación, percusión, auscultación, tabla de hallazgos). Eliminar emojis en `patrones_resp.html` y `casos_resp.html`. Confirmar ambos archivos en git (actualmente sin versionar).

---

## Archivos a modificar

| Acción | Archivo | Cambios |
|--------|---------|---------|
| Modificar | `modules/patrones_resp.html` | Agregar 3 patrones, agregar tab Exploración Física, eliminar emoji del nav |
| Modificar | `modules/casos_resp.html` | Eliminar emojis del home (🩺 📈 🧠) |
| Commit | ambos archivos | Primera versión en git |

---

## Cambio 1 — Tres patrones nuevos en `patrones_resp.html`

### Grupo nuevo: "Otros patrones clínicos"

Se agrega un tercer grupo `g:'otros'` al array `P`. Se renderiza después de los dos grupos existentes con el label:

```
Otros patrones clínicos
```

### Entradas del array P

```js
{ id:'paradojica', g:'otros', name:'Respiración Paradójica', sub:'Movimiento torácico invertido al esperado', color:'#f43f5e',
  rr:'Variable', vt:'Reducido', rhy:'Variable',
  noteRed:'Signo de fatiga muscular grave o tórax inestable — evaluar soporte ventilatorio',
  ctx:'Fatiga del diafragma, tórax batiente (múltiples fracturas costales), parálisis diafragmática. El tórax se retrae durante la inspiración en lugar de expandirse. Signo de trabajo respiratorio extremo.',
  period:4.0, vis:2.5,
  fn(t){ return 20*Math.sin(2*Math.PI*t); }   // onda invertida
},
{ id:'ortopnea', g:'otros', name:'Ortopnea', sub:'Disnea en decúbito supino · mejora al sentarse', color:'#818cf8',
  rr:'Aumentada en decúbito', vt:'Superficial', rhy:'Regular',
  note:'Marcador de ICC, derrame pleural bilateral o ascitis masiva',
  ctx:'En decúbito, el retorno venoso aumenta → sobrecarga del ventrículo izquierdo → redistribución de líquido al pulmón. Al sentarse, el diafragma desciende y mejora la mecánica ventilatoria. Se cuantifica en "almohadas" (1–3).',
  period:6.0, vis:2.5,
  fn(t){ return -10*Math.sin(2*Math.PI*t); }   // superficial lento
},
{ id:'apnea_sueno', g:'otros', name:'Apnea del Sueño', sub:'Central (falla neural) u Obstructiva (colapso de VAS)', color:'#fb923c',
  rr:'Variable (episodios de 0 rpm)', vt:'Ausente durante pausa', rhy:'Periódico irregular',
  note:'Cese del flujo aéreo ≥ 10 s — activa quimiorreceptores e interrumpe el sueño',
  ctx:'Central: falla del estímulo neural del bulbo (ICC, opiáceos). Obstructiva: colapso de la vía aérea superior a pesar del esfuerzo respiratorio — obesidad, macroglosia, anomalías craneofaciales. Episodios de hipoxemia e hipercapnia. Tratamiento: CPAP/BiPAP.',
  period:8.0, vis:1.5,
  fn(t){
    const p=(t%1);
    if(p>0.40 && p<0.72) return 0;    // pausa apneica
    return -18*Math.sin(2*Math.PI*t);
  }
},
```

### Render del tercer grupo

Agregar en el HTML, después del `div#grid-irregular`:

```html
<div class="group-label">Otros patrones clínicos</div>
<div class="pattern-grid" id="grid-otros"></div>
```

Y en la función `render()`, agregar `'otros'` al array de grupos a iterar:

```js
['regular','irregular','otros'].forEach(grp => { ... })
```

---

## Cambio 2 — Tab "Exploración Física" en `patrones_resp.html`

### Botón de tab

Agregar al `.p-tabbar` existente:

```html
<button class="p-tabbtn" onclick="showTab('exploracion')">Exploración Física</button>
```

### Panel `#tab-exploracion`

Estructura de 5 subsecciones con clases existentes (`infobox`, `apta-step`, `apta-items`). Puede usar también `.ref-box` para la tabla final.

#### Subsección 1 — Inspección

**Inspección estática:**
- Morfología torácica normal: diámetro AP < diámetro transverso (relación ~1:2)
- Tórax en tonel (barrel chest): diámetro AP aumentado, ángulo costal > 90° — característico de enfisema/EPOC por hiperinsuflación crónica
- Pectus excavatum: hundimiento del esternón
- Pectus carinatum: prominencia del esternón ("pecho de paloma")
- Cifoescoliosis: curvaturas de la columna que reducen la compliance de la caja torácica

**Inspección dinámica:**
- Frecuencia respiratoria y patrón (ya cubierto en tab Patrones)
- Uso de músculos accesorios: esternocleidomastoideo, escalenos, trapecios → indica aumento del trabajo respiratorio
- Tiraje: supraclavicular, intercostal, subcostal — signo de obstrucción o alta demanda ventilatoria
- Aleteo nasal: ensanchamiento rítmico de las narinas durante la inspiración — signo de distress respiratorio
- Cianosis: central (labios y lengua) vs periférica (acra) — central indica hipoxemia grave (SaO₂ < ~85%)
- Acropaquia (dedos en palillo de tambor): asociada a hipoxemia crónica, fibrosis pulmonar, cardiopatías cianóticas

#### Subsección 2 — Palpación

- **Expansión torácica:** Manos sobre el tórax inferior, pulgares en la línea media. En inspiración profunda, la separación debe ser simétrica (≥ 3–5 cm). Asimetría → patología ipsilateral (consolidación, derrame, atelectasia)
- **Frémito táctil vocal (FTV):** Palmas sobre el tórax mientras el paciente dice "treinta y tres". Evalúa la transmisión de vibraciones de la voz a través del parénquima:
  - Aumentado: consolidación (tejido sólido conduce mejor las vibraciones) — neumonía
  - Disminuido o ausente: derrame pleural, neumotórax, enfisema (el líquido o el aire atenúan las vibraciones)
  - Ausente con obstrucción bronquial: la vibración no llega si el bronquio está ocluido
- **Desviación traqueal:** Con los dedos en la escotadura yugular. Desplazamiento hacia el lado afectado en atelectasia (el pulmón colapsado tracciona). Desplazamiento contralateral en derrame masivo o neumotórax a tensión

#### Subsección 3 — Percusión

Técnica: golpear el dedo medio de una mano (plexímetro) apoyado sobre el tórax con el dedo medio de la otra mano (plexor). Comparar simétricamente.

| Sonido | Características | Causa |
|--------|----------------|-------|
| Sonoro / Claro pulmonar | Tono grave, resonante | Normal en pulmón aireado |
| Matidez | Tono apagado, sordo | Consolidación (neumonía), derrame pleural, atelectasia, masa |
| Timpanismo / Hiperresonancia | Tono muy agudo y hueco | Neumotórax, enfisema, hiperinsuflación |
| Matidez hepática | Borde inferior derecho | Referencia anatómica normal |

#### Subsección 4 — Auscultación

**Ruidos respiratorios normales:**

| Ruido | Características | Localización normal |
|-------|----------------|---------------------|
| Murmullo vesicular | Suave, tono bajo, predominantemente inspiratorio | Mayoría de campos pulmonares |
| Broncovesicular | Tono intermedio, igual en inspiración y espiración | Región interescapular, 1er espacio intercostal |
| Traqueal / Bronquial | Alta intensidad, espiración > inspiración | Solo sobre tráquea; en parénquima = condensación |

**Ruidos adventicios:**

| Ruido | Tipo | Tono | Mecanismo | Patología típica |
|-------|------|------|-----------|-----------------|
| Crepitantes finos | Discontinuo | Alto | Apertura de vías pequeñas colapsadas en inspiración | Fibrosis, edema pulmonar inicial, neumonía temprana |
| Crepitantes gruesos | Discontinuo | Bajo | Secreciones en vía aérea grande | EPOC, bronquiectasias; cambian con la tos |
| Sibilancias | Continuo | Alto ("silbido") | Broncoespasmo / obstrucción vía pequeña | Asma, EPOC agudizado, "asma cardíaca" |
| Roncus | Continuo | Bajo ("ronroneo") | Secreciones en vía grande | EPOC, bronquitis; cambian con la tos |
| Estridor | Continuo | Muy alto, inspiratorio | Obstrucción vía aérea superior | Crup, cuerpo extraño, edema de glotis |
| Frote pleural | Discontinuo | Superficial ("cuero") | Fricción entre pleuras inflamadas | Pleuritis seca |

**Voz transmitida:** El tejido consolidado conduce mejor los sonidos que el tejido aireado.

| Signo | Técnica | Positivo en |
|-------|---------|-------------|
| Broncofonía | Pedir al paciente que diga "99" — se ausculta más claro | Consolidación |
| Pectoriloquia áfona | Pedir que susurre "99" — se auscultan claramente las palabras | Consolidación |
| Egofonía | Pedir que diga "e" — se ausculta como "a" nasal | Límite superior de derrame pleural |

#### Subsección 5 — Tabla de hallazgos integrados por patología

| Patología | Inspección | FTV (Palpación) | Percusión | Auscultación | Voz transmitida |
|-----------|-----------|-----------------|-----------|--------------|-----------------|
| Neumonía (consolidación) | ↑FR, uso accesorios, asimetría | Aumentado | Matidez | Crepitantes, soplo tubárico | Broncofonía, pectoriloquia áfona, egofonía |
| Derrame pleural | Asimetría, ↓expansión | Disminuido o ausente | Matidez | Disminuidos o ausentes; egofonía en borde superior | Disminuida |
| Neumotórax | Asimetría, distress, desviación traqueal | Ausente | Timpanismo / Hiperresonancia | Ausentes | Ausente |
| EPOC agudizado | Tórax en tonel, uso accesorios | Disminuido | Hiperresonancia | Sibilancias, roncus, ↓MV | Disminuida |
| Asma aguda | Uso accesorios, tiraje | Normal | Resonante o hiperresonante | Sibilancias espiratorias (o silencio en crisis grave) | Normal |
| Fibrosis pulmonar | Cianosis, acropaquia, ↑FR | Normal | Resonante | Crepitantes finos bilaterales en bases ("velcro") | Normal |

---

## Cambio 3 — Eliminar emojis

### `patrones_resp.html`
- Línea ~82: `<div class="nav-logo">🫁 Fisio<span>Resp</span></div>` → `<div class="nav-logo">Fisio<span>Resp</span></div>`

### `casos_resp.html`
- Home section: eliminar `🩺`, `📈`, `🧠` de los tres cards de navegación rápida

---

## Convenciones

- Sin emojis en ningún archivo
- Tema oscuro, variables CSS de `fisioresp.css`
- Funciones JS globales sin ES modules
- Todo el texto en español
- Contenido verificado contra notebooks `fisioresp` y `cardiorespi`

---

## Commits esperados

```
git add modules/patrones_resp.html modules/casos_resp.html
git commit -m "feat: agregar 3 patrones nuevos y tab Exploracion Fisica a C2 — quitar emojis"
```
