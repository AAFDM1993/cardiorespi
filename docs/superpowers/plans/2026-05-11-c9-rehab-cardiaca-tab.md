# C9 Rehab Cardíaca Tab — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar el tab "Rehab Cardíaca" en `modules/6mwt.html` agregando 3 tarjetas clínicas (NYHA, estratificación riesgo AHA, criterios de parada AHA) y eliminando emojis ❤️ de los encabezados existentes.

**Architecture:** Edición directa de `modules/6mwt.html`. El contenido se inserta antes de `</div><!-- /mode-rehab -->` (línea ~509). Sin build system — archivo vanilla HTML/JS abierto en browser. Verificación de sintaxis con Python (node no disponible).

**Tech Stack:** HTML/CSS vanilla. Sin npm. Sin transpilación. Verificación con Python. Preview con `python3 -m http.server 8000`.

---

## File Map

| Archivo | Acción | Qué cambia |
|---------|--------|-----------|
| `modules/6mwt.html` | Modificar | Eliminar ❤️, insertar 3 cards antes de `</div><!-- /mode-rehab -->` |

---

### Task 1: Eliminar emojis ❤️ de sección "Patologías CV"

**Files:**
- Modify: `modules/6mwt.html` (sección `#mode-rehab`, tarjeta "Patologías CV")

- [ ] **Step 1: Localizar los 4 encabezados con emoji**

En `modules/6mwt.html` buscar las 4 ocurrencias:
```
❤️ Insuficiencia Cardíaca (ICC)
❤️ Cardiopatía Isquémica / Post-IAM
❤️ Hipertensión Arterial
❤️ Fibrilación Auricular
```

- [ ] **Step 2: Eliminar los emojis**

Reemplazar cada encabezado quitando solo el emoji y el espacio siguiente:

```
Insuficiencia Cardíaca (ICC)
Cardiopatía Isquémica / Post-IAM
Hipertensión Arterial
Fibrilación Auricular
```

- [ ] **Step 3: Verificar que no quedan emojis en mode-rehab**

```python
import re
with open('modules/6mwt.html', encoding='utf-8') as f:
    html = f.read()
start = html.find('id="mode-rehab"')
end = html.find('/mode-rehab', start)
chunk = html[start:end]
emojis = re.findall(r'[^\x00-\x7F]', chunk)
heart = [e for e in emojis if e == '❤']
print('Emojis corazon restantes:', len(heart))
```
Esperado: `Emojis corazon restantes: 0`

- [ ] **Step 4: Commit**

```bash
git add modules/6mwt.html
git commit -m "fix: eliminar emojis corazon de seccion Patologias CV en mode-rehab"
```

---

### Task 2: Agregar tarjeta Clasificación NYHA

**Files:**
- Modify: `modules/6mwt.html` (insertar antes de `</div><!-- /mode-rehab -->`)

- [ ] **Step 1: Localizar el punto de inserción**

Buscar la línea exacta:
```
  </div><!-- /mode-rehab -->
```
Insertar el bloque HTML ANTES de esa línea.

- [ ] **Step 2: Insertar la tarjeta NYHA**

Reemplazar `  </div><!-- /mode-rehab -->` con:

```html
    <div class="card mb-2">
      <div style="font-family:var(--fh);font-size:1rem;color:var(--red);margin-bottom:.75rem">Clasificación NYHA — Implicaciones para RC</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:12.5px">
          <thead>
            <tr style="border-bottom:1px solid var(--border)">
              <th style="text-align:left;padding:.5rem .75rem;color:var(--text3);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Clase</th>
              <th style="text-align:left;padding:.5rem .75rem;color:var(--text3);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Síntomas</th>
              <th style="text-align:left;padding:.5rem .75rem;color:var(--text3);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">METs</th>
              <th style="text-align:left;padding:.5rem .75rem;color:var(--text3);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px">RC</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border)">
              <td style="padding:.6rem .75rem"><span style="background:rgba(74,222,128,.15);color:var(--green);border-radius:100px;padding:2px 10px;font-weight:700;font-size:11px">I</span></td>
              <td style="padding:.6rem .75rem;color:var(--text2)">Sin limitación. Actividad ordinaria sin síntomas.</td>
              <td style="padding:.6rem .75rem;color:var(--green);font-family:var(--fm)">&gt;7</td>
              <td style="padding:.6rem .75rem;color:var(--text2)">Fase II/III sin restricción de intensidad.</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
              <td style="padding:.6rem .75rem"><span style="background:rgba(74,222,128,.1);color:var(--teal);border-radius:100px;padding:2px 10px;font-weight:700;font-size:11px">II</span></td>
              <td style="padding:.6rem .75rem;color:var(--text2)">Limitación leve. Síntomas con actividad moderada.</td>
              <td style="padding:.6rem .75rem;color:var(--teal);font-family:var(--fm)">5–7</td>
              <td style="padding:.6rem .75rem;color:var(--text2)">Fase II supervisada. Borg 11–13.</td>
            </tr>
            <tr style="border-bottom:1px solid var(--border)">
              <td style="padding:.6rem .75rem"><span style="background:rgba(251,191,36,.15);color:var(--amber);border-radius:100px;padding:2px 10px;font-weight:700;font-size:11px">III</span></td>
              <td style="padding:.6rem .75rem;color:var(--text2)">Limitación marcada. Síntomas con actividad leve.</td>
              <td style="padding:.6rem .75rem;color:var(--amber);font-family:var(--fm)">2–4</td>
              <td style="padding:.6rem .75rem;color:var(--text2)">RC con monitorización ECG. Intensidad baja inicial.</td>
            </tr>
            <tr>
              <td style="padding:.6rem .75rem"><span style="background:rgba(248,113,113,.15);color:var(--red);border-radius:100px;padding:2px 10px;font-weight:700;font-size:11px">IV</span></td>
              <td style="padding:.6rem .75rem;color:var(--text2)">Síntomas en reposo o mínimo esfuerzo.</td>
              <td style="padding:.6rem .75rem;color:var(--red);font-family:var(--fm)">&lt;2</td>
              <td style="padding:.6rem .75rem;color:var(--red)">Contraindicado hasta estabilización.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div><!-- /mode-rehab -->
```

- [ ] **Step 3: Verificar que la tarjeta NYHA está presente**

```python
with open('modules/6mwt.html', encoding='utf-8') as f:
    html = f.read()
print('NYHA presente:', 'Clasificación NYHA' in html)
print('Tabla NYHA:', html.count('<tr style') >= 4)
```
Esperado: ambos `True`.

- [ ] **Step 4: Commit**

```bash
git add modules/6mwt.html
git commit -m "feat: agregar tabla NYHA con implicaciones para RC en tab Rehab Cardiaca"
```

---

### Task 3: Agregar tarjeta Estratificación de riesgo AHA

**Files:**
- Modify: `modules/6mwt.html` (insertar antes de `</div><!-- /mode-rehab -->`)

- [ ] **Step 1: Insertar la tarjeta de estratificación AHA**

Reemplazar `  </div><!-- /mode-rehab -->` con:

```html
    <div class="card mb-2">
      <div style="font-family:var(--fh);font-size:1rem;color:var(--red);margin-bottom:.75rem">Estratificación de Riesgo AHA — Supervisión en RC</div>
      <div class="grid g3">
        <div style="background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.25);border-radius:var(--r);padding:1rem">
          <div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.6px;margin-bottom:.6rem">Bajo riesgo</div>
          <div style="font-size:12px;color:var(--text2);line-height:1.65;margin-bottom:.75rem">
            FEVI ≥50% · Sin arritmias complejas · IAM/ACTP sin complicaciones · Respuesta hemodinámica normal · Sin angina · CF ≥7 METs
          </div>
          <div style="background:rgba(74,222,128,.1);border-radius:var(--rs);padding:.5rem .7rem;font-size:11.5px;color:var(--green)">
            Sin monitorización ECG continua tras las primeras sesiones.
          </div>
        </div>
        <div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.25);border-radius:var(--r);padding:1rem">
          <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:.6px;margin-bottom:.6rem">Riesgo moderado</div>
          <div style="font-size:12px;color:var(--text2);line-height:1.65;margin-bottom:.75rem">
            FEVI 40–49% · Respuesta hemodinámica levemente anormal · Isquemia solo a alta carga (≥7 METs) · CF 5–6 METs
          </div>
          <div style="background:rgba(251,191,36,.1);border-radius:var(--rs);padding:.5rem .7rem;font-size:11.5px;color:var(--amber)">
            Monitorización ECG las primeras 12 sesiones.
          </div>
        </div>
        <div style="background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.25);border-radius:var(--r);padding:1rem">
          <div style="font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.6px;margin-bottom:.6rem">Alto riesgo</div>
          <div style="font-size:12px;color:var(--text2);line-height:1.65;margin-bottom:.75rem">
            FEVI &lt;40% · Inestabilidad hemodinámica (caída PAS ≥15 mmHg) · Angina en reposo o baja carga · CF &lt;5 METs · Arritmias ventriculares complejas
          </div>
          <div style="background:rgba(248,113,113,.1);border-radius:var(--rs);padding:.5rem .7rem;font-size:11.5px;color:var(--red)">
            ECG continuo. Estabilizar antes de iniciar RC.
          </div>
        </div>
      </div>
    </div>

  </div><!-- /mode-rehab -->
```

- [ ] **Step 2: Verificar**

```python
with open('modules/6mwt.html', encoding='utf-8') as f:
    html = f.read()
print('Riesgo AHA presente:', 'Estratificación de Riesgo AHA' in html)
print('3 niveles:', 'Bajo riesgo' in html and 'Riesgo moderado' in html and 'Alto riesgo' in html)
```
Esperado: ambos `True`.

- [ ] **Step 3: Commit**

```bash
git add modules/6mwt.html
git commit -m "feat: agregar estratificacion riesgo AHA para RC en tab Rehab Cardiaca"
```

---

### Task 4: Agregar tarjeta Criterios de parada AHA

**Files:**
- Modify: `modules/6mwt.html` (insertar antes de `</div><!-- /mode-rehab -->`)

- [ ] **Step 1: Insertar la tarjeta de criterios de parada**

Reemplazar `  </div><!-- /mode-rehab -->` con:

```html
    <div class="card">
      <div style="font-family:var(--fh);font-size:1rem;color:var(--red);margin-bottom:.75rem">Criterios de Parada AHA — Ejercicio en RC</div>
      <div class="grid g2">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.6px;margin-bottom:.6rem">Absolutas — Parar inmediatamente</div>
          <div style="display:flex;flex-direction:column;gap:.4rem">
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(248,113,113,.07);border-radius:var(--rs)"><span style="color:var(--red);flex-shrink:0">▸</span><span style="color:var(--text2)">Angina moderada-severa (Borg angina ≥3)</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(248,113,113,.07);border-radius:var(--rs)"><span style="color:var(--red);flex-shrink:0">▸</span><span style="color:var(--text2)">Caída PAS ≥10 mmHg con aumento de carga</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(248,113,113,.07);border-radius:var(--rs)"><span style="color:var(--red);flex-shrink:0">▸</span><span style="color:var(--text2)">Hipoperfusión: palidez, cianosis, confusión, náuseas</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(248,113,113,.07);border-radius:var(--rs)"><span style="color:var(--red);flex-shrink:0">▸</span><span style="color:var(--text2)">Arritmia ventricular grave (TV sostenida, FV)</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(248,113,113,.07);border-radius:var(--rs)"><span style="color:var(--red);flex-shrink:0">▸</span><span style="color:var(--text2)">SpO₂ &lt;85%</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(248,113,113,.07);border-radius:var(--rs)"><span style="color:var(--red);flex-shrink:0">▸</span><span style="color:var(--text2)">Bloqueo AV 2°–3° grado nuevo</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(248,113,113,.07);border-radius:var(--rs)"><span style="color:var(--red);flex-shrink:0">▸</span><span style="color:var(--text2)">Paciente solicita parar</span></div>
          </div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--amber);text-transform:uppercase;letter-spacing:.6px;margin-bottom:.6rem">Relativas — Valorar parar</div>
          <div style="display:flex;flex-direction:column;gap:.4rem">
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(251,191,36,.07);border-radius:var(--rs)"><span style="color:var(--amber);flex-shrink:0">▸</span><span style="color:var(--text2)">PAS &gt;250 mmHg o PAD &gt;115 mmHg</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(251,191,36,.07);border-radius:var(--rs)"><span style="color:var(--amber);flex-shrink:0">▸</span><span style="color:var(--text2)">Cambios ST &gt;2mm (depresión horizontal/descendente)</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(251,191,36,.07);border-radius:var(--rs)"><span style="color:var(--amber);flex-shrink:0">▸</span><span style="color:var(--text2)">Disnea severa, fatiga extrema o claudicación ≥3</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(251,191,36,.07);border-radius:var(--rs)"><span style="color:var(--amber);flex-shrink:0">▸</span><span style="color:var(--text2)">Angina leve-moderada en progresión (Borg angina 1–2)</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(251,191,36,.07);border-radius:var(--rs)"><span style="color:var(--amber);flex-shrink:0">▸</span><span style="color:var(--text2)">Incompetencia cronotrópica severa</span></div>
            <div style="display:flex;gap:8px;font-size:12.5px;padding:.45rem .6rem;background:rgba(251,191,36,.07);border-radius:var(--rs)"><span style="color:var(--amber);flex-shrink:0">▸</span><span style="color:var(--text2)">Arritmia supraventricular nueva con síntomas</span></div>
          </div>
        </div>
      </div>
    </div>

  </div><!-- /mode-rehab -->
```

- [ ] **Step 2: Verificar**

```python
with open('modules/6mwt.html', encoding='utf-8') as f:
    html = f.read()
print('Criterios parada presentes:', 'Criterios de Parada AHA' in html)
print('Absolutas:', 'Absolutas' in html and 'Parar inmediatamente' in html)
print('Relativas:', 'Relativas' in html and 'Valorar parar' in html)
```
Esperado: todos `True`.

- [ ] **Step 3: Verificación final de estructura**

```python
with open('modules/6mwt.html', encoding='utf-8') as f:
    html = f.read()
checks = [
    ('NYHA', 'Clasificación NYHA' in html),
    ('Riesgo AHA', 'Estratificación de Riesgo AHA' in html),
    ('Criterios parada', 'Criterios de Parada AHA' in html),
    ('Sin emojis corazon en rehab', '❤️' not in html[html.find('id="mode-rehab"'):html.find('/mode-rehab')]),
    ('mode-rehab cierra', '</div><!-- /mode-rehab -->' in html),
]
for name, result in checks:
    print(name + ':', 'OK' if result else 'ERROR')
```
Esperado: todos `OK`.

- [ ] **Step 4: Commit final y push**

```bash
git add modules/6mwt.html
git commit -m "feat: agregar criterios parada AHA en RC — completar tab Rehab Cardiaca C9"
git push origin master
```
