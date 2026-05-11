# Diseño: C9 — Completar tab "Rehab Cardíaca" en 6mwt.html

**Fecha:** 2026-05-11
**Estado:** Aprobado

---

## Objetivo

Completar el tab `#mode-rehab` de `modules/6mwt.html` con las 3 tarjetas de contenido clínico faltantes y limpiar los emojis de los encabezados existentes.

---

## Archivos a modificar

| Acción | Archivo | Cambios |
|--------|---------|---------|
| Modificar | `modules/6mwt.html` | Agregar 3 cards al final de `#mode-rehab` + eliminar emojis ❤️ de encabezados |

---

## Contexto del archivo

`modules/6mwt.html` tiene un `mode-bar` con 5 tabs:
- `mode-sim` — Simulador en tiempo real
- `mode-calc` — Calculadora de predichos
- `mode-interp` — Interpretación clínica
- `mode-ref` — Protocolo ATS, clasificación por % predicho
- `mode-rehab` — **Tab objetivo**: ya tiene Fases RC, Prescripción, Fármacos, Patologías CV

El punto de inserción es ANTES de `</div><!-- /mode-rehab -->` (línea 509).

---

## Cambio 1 — Limpiar emojis ❤️ en sección "Patologías CV"

En `#mode-rehab`, la sección "Patologías CV — Consideraciones para Fisioterapia" tiene 4 encabezados con ❤️:

| Antes | Después |
|-------|---------|
| `❤️ Insuficiencia Cardíaca (ICC)` | `Insuficiencia Cardíaca (ICC)` |
| `❤️ Cardiopatía Isquémica / Post-IAM` | `Cardiopatía Isquémica / Post-IAM` |
| `❤️ Hipertensión Arterial` | `Hipertensión Arterial` |
| `❤️ Fibrilación Auricular` | `Fibrilación Auricular` |

---

## Cambio 2 — Tarjeta: Clasificación NYHA

Insertar antes de `</div><!-- /mode-rehab -->`:

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
```

---

## Cambio 3 — Tarjeta: Estratificación de riesgo AHA para RC

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
```

---

## Cambio 4 — Tarjeta: Criterios de parada AHA en RC

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
```

---

## Commit esperado

```
git add modules/6mwt.html
git commit -m "feat: completar tab Rehab Cardiaca C9 — NYHA, riesgo AHA, criterios parada"
git push origin master
```
