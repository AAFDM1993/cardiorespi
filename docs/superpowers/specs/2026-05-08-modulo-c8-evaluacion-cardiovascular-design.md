# Diseño: Módulo C8 — Evaluación Cardiovascular (actualizaciones)

**Fecha:** 2026-05-08
**Estado:** Aprobado

---

## Objetivo

Agregar una sección de Referencia al módulo `modules/casos_cardiovascular.html` con 4 tarjetas de conceptos clave para el fisioterapeuta cardiovascular (perfil hemodinámico ICC, fases de RC, precauciones farmacológicas, oxígeno en IAM). Eliminar emojis del archivo de datos `data/cases-cardiovascular.js`.

---

## Archivos a modificar

| Acción | Archivo | Cambios |
|--------|---------|---------|
| Modificar | `modules/casos_cardiovascular.html` | Botón "Referencia" en nav, sección `#sec-ref` estática, función `toggleRef()` |
| Modificar | `data/cases-cardiovascular.js` | Eliminar emojis de los campos `icon` de cada técnica |
| Commit + push | ambos | Ya están en git |

---

## Cambio 1 — Botón "Referencia" en el nav

### Botón en el nav HTML

Localizar en el nav el separador `<div class="nav-sep"></div>`. Insertar el botón ANTES de ese separador:

```html
<button id="refBtn" onclick="toggleRef()" style="padding:5px 14px;border-radius:var(--rs);background:rgba(244,114,182,.1);border:1px solid rgba(244,114,182,.25);color:#f472b6;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--fb);transition:all .2s;margin-right:.5rem">Referencia</button>
```

### Función `toggleRef()` en el script

Insertar DESPUÉS de `'use strict';` y antes del comentario `/* ═══ CASE DATA ═══ */`:

```js
function toggleRef(){
  const showing = document.getElementById('sec-ref').style.display !== 'none';
  document.getElementById('appRoot').style.display = showing ? '' : 'none';
  document.getElementById('sec-ref').style.display = showing ? 'none' : 'block';
  document.getElementById('refBtn').textContent = showing ? 'Referencia' : '← Casos';
}
```

---

## Cambio 2 — Sección `#sec-ref` con 4 tarjetas

### Punto de inserción

Insertar DESPUÉS de `<div class="wrap" id="appRoot"><!-- Content rendered by JS --></div>` y ANTES de `<script>`:

```html
<!-- ══════════════════════════════════════════════════════
     REFERENCIA RÁPIDA CV
══════════════════════════════════════════════════════ -->
<div id="sec-ref" class="wrap" style="display:none;padding-top:1.5rem">
  <div style="margin-bottom:1.25rem">
    <h2 style="font-family:var(--fh);font-size:1.3rem;margin-bottom:.35rem">Referencia Cardiovascular</h2>
    <p style="color:var(--text2);font-size:13px;max-width:700px;line-height:1.7">Conceptos clave para la evaluación y tratamiento fisioterapéutico cardiovascular en fase hospitalaria.</p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px">

    <!-- Tarjeta 1: Perfil hemodinámico ICC -->
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.1rem">
      <div style="font-family:var(--fh);font-size:1rem;color:#f472b6;margin-bottom:.75rem">Perfil Hemodinámico — ICC</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:.6rem;line-height:1.5">Clasificación por congestión (húmedo/seco) × perfusión (caliente/frío). Determina la estrategia terapéutica.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <div style="background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.25);border-radius:var(--rs);padding:.65rem .75rem">
          <div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:.35rem">Caliente-Seco</div>
          <div style="font-size:11.5px;color:var(--text2);line-height:1.5">Compensado. Buena perfusión, sin congestión. RC segura. Optimizar tratamiento oral.</div>
        </div>
        <div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.25);border-radius:var(--rs);padding:.65rem .75rem">
          <div style="font-size:11px;font-weight:700;color:var(--amber);margin-bottom:.35rem">Caliente-Húmedo</div>
          <div style="font-size:11.5px;color:var(--text2);line-height:1.5">Congestión activa, perfusión conservada. Diuréticos IV. Posición sentada 90°. Fisioterapia respiratoria.</div>
        </div>
        <div style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.25);border-radius:var(--rs);padding:.65rem .75rem">
          <div style="font-size:11px;font-weight:700;color:var(--amber);margin-bottom:.35rem">Frío-Seco</div>
          <div style="font-size:11.5px;color:var(--text2);line-height:1.5">Bajo gasto puro sin congestión. Inotrópicos. Estabilizar antes de cualquier movilización.</div>
        </div>
        <div style="background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.25);border-radius:var(--rs);padding:.65rem .75rem">
          <div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:.35rem">Frío-Húmedo</div>
          <div style="font-size:11.5px;color:var(--text2);line-height:1.5">Congestión + hipoperfusión. Perfil de mayor gravedad. Inotrópicos + diuréticos. No ejercicio hasta estabilización.</div>
        </div>
      </div>
    </div>

    <!-- Tarjeta 2: Fases de RC + Protocolo Fase I -->
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.1rem">
      <div style="font-family:var(--fh);font-size:1rem;color:#f472b6;margin-bottom:.75rem">Rehabilitación Cardíaca — Fases</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:.75rem;line-height:1.5">
        <span style="font-weight:600;color:var(--text)">Fase I</span> (hospitalaria) · <span style="font-weight:600;color:var(--text)">Fase II</span> (ambulatoria supervisada, 6–12 sem) · <span style="font-weight:600;color:var(--text)">Fase III</span> (mantenimiento indefinido)
      </div>
      <div style="font-size:11.5px;font-weight:700;color:#f472b6;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.4px">Protocolo Fase I — Progresión post-IAM</div>
      <div style="font-size:11.5px;color:var(--text2);line-height:1.55">
        Inicio: 12–24h si Killip I-II, hemodinámicamente estable.<br>
        <div style="margin-top:.5rem;display:flex;flex-direction:column;gap:4px">
          <div style="display:flex;gap:6px"><span style="background:rgba(244,114,182,.15);color:#f472b6;border-radius:100px;padding:1px 8px;font-size:10.5px;font-weight:700;flex-shrink:0">Niv 1</span><span>Ejercicios activos en cama, respiración diafragmática</span></div>
          <div style="display:flex;gap:6px"><span style="background:rgba(244,114,182,.15);color:#f472b6;border-radius:100px;padding:1px 8px;font-size:10.5px;font-weight:700;flex-shrink:0">Niv 2</span><span>Sedestación al borde de cama</span></div>
          <div style="display:flex;gap:6px"><span style="background:rgba(244,114,182,.15);color:#f472b6;border-radius:100px;padding:1px 8px;font-size:10.5px;font-weight:700;flex-shrink:0">Niv 3</span><span>Bipedestación y marcha breve en habitación</span></div>
          <div style="display:flex;gap:6px"><span style="background:rgba(244,114,182,.15);color:#f472b6;border-radius:100px;padding:1px 8px;font-size:10.5px;font-weight:700;flex-shrink:0">Niv 4</span><span>Marcha en corredor (50–100 m)</span></div>
          <div style="display:flex;gap:6px"><span style="background:rgba(244,114,182,.15);color:#f472b6;border-radius:100px;padding:1px 8px;font-size:10.5px;font-weight:700;flex-shrink:0">Niv 5</span><span>Subir un tramo de escaleras — criterio de alta</span></div>
        </div>
        <div style="margin-top:.6rem;background:var(--bg3);border-radius:var(--rs);padding:.5rem .7rem;font-size:11px;color:var(--text3)">
          Progresar si: FC basal +20–30 lpm, Borg ≤3, SpO2 &gt;90%, sin angina, sin arritmias nuevas.
        </div>
      </div>
    </div>

    <!-- Tarjeta 3: Precauciones farmacológicas -->
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.1rem">
      <div style="font-family:var(--fh);font-size:1rem;color:#f472b6;margin-bottom:.75rem">Precauciones Farmacológicas</div>
      <div style="display:flex;flex-direction:column;gap:.55rem">
        <div style="display:flex;gap:8px;font-size:12.5px">
          <span style="color:#f472b6;flex-shrink:0;margin-top:1px">▹</span>
          <div><strong style="color:var(--text)">Beta-bloqueantes:</strong> <span style="color:var(--text2)">Atenúan la respuesta cronotrópica. No usar FCmáx (220−edad) para calcular FC de entrenamiento. Usar escala de Borg o % FC de Reserva.</span></div>
        </div>
        <div style="display:flex;gap:8px;font-size:12.5px">
          <span style="color:#f472b6;flex-shrink:0;margin-top:1px">▹</span>
          <div><strong style="color:var(--text)">IECA / ARA-II:</strong> <span style="color:var(--text2)">Riesgo de hipotensión ortostática. Cambios de posición lentos y vigilados, especialmente en la primera bipedestación del día.</span></div>
        </div>
        <div style="display:flex;gap:8px;font-size:12.5px">
          <span style="color:#f472b6;flex-shrink:0;margin-top:1px">▹</span>
          <div><strong style="color:var(--text)">Diuréticos:</strong> <span style="color:var(--text2)">Riesgo de deshidratación y calambres durante el ejercicio. Asegurar hidratación adecuada. Monitorizar presión arterial.</span></div>
        </div>
        <div style="display:flex;gap:8px;font-size:12.5px">
          <span style="color:#f472b6;flex-shrink:0;margin-top:1px">▹</span>
          <div><strong style="color:var(--text)">Anticoagulantes (HBPM, NACO, warfarina):</strong> <span style="color:var(--text2)">Precaución en técnicas manuales y movilizaciones vigorosas. Verificar INR o tiempo de infusión de HBPM antes de técnicas con riesgo de sangrado.</span></div>
        </div>
      </div>
    </div>

    <!-- Tarjeta 4: Oxígeno en IAM agudo -->
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:1.1rem">
      <div style="font-family:var(--fh);font-size:1rem;color:#f472b6;margin-bottom:.75rem">Oxígeno en IAM Agudo</div>
      <div style="background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.25);border-radius:var(--rs);padding:.7rem .875rem;margin-bottom:.75rem">
        <div style="font-size:12px;font-weight:700;color:var(--red);margin-bottom:.3rem">No administrar O₂ de rutina</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.55">La hiperoxia causa vasoconstricción coronaria y puede aumentar el área de infarto. Solo indicado si SpO₂ &lt; 94%.</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.45rem">
        <div style="display:flex;gap:8px;font-size:12.5px">
          <span style="color:var(--green);flex-shrink:0;margin-top:1px">▸</span>
          <div><strong style="color:var(--text)">Indicar O₂</strong> <span style="color:var(--text2)">si SpO₂ &lt;94% o distress respiratorio activo. FiO₂ mínima necesaria para mantener SpO₂ 94–98%.</span></div>
        </div>
        <div style="display:flex;gap:8px;font-size:12.5px">
          <span style="color:var(--amber);flex-shrink:0;margin-top:1px">▸</span>
          <div><strong style="color:var(--text)">ICC con edema pulmonar:</strong> <span style="color:var(--text2)">Sí requiere O₂ suplementario o CPAP/BiPAP. No confundir con el IAM sin desaturación.</span></div>
        </div>
        <div style="display:flex;gap:8px;font-size:12.5px">
          <span style="color:var(--blue);flex-shrink:0;margin-top:1px">▸</span>
          <div><strong style="color:var(--text)">EPOC concomitante:</strong> <span style="color:var(--text2)">Objetivo SpO₂ 88–92%. Evitar suprimir el estímulo hipóxico ventilatorio.</span></div>
        </div>
      </div>
    </div>

  </div>
</div>
```

---

## Cambio 3 — Eliminar emojis de `cases-cardiovascular.js`

Reemplazar los valores del campo `icon` en todas las entradas de técnicas:

| Antes | Después |
|-------|---------|
| `icon:'❤️'` | Eliminar la propiedad `icon` o dejarla vacía `icon:''` |
| `icon:'🌬️'` | `icon:''` |
| `icon:'🦵'` | `icon:''` |
| `icon:'🏃'` | `icon:''` |
| `icon:'🛏️'` | `icon:''` |
| `icon:'📋'` | `icon:''` |
| `icon:'🌊'` | `icon:''` |
| `icon:'📞'` | `icon:''` |
| `icon:'🛋️'` | `icon:''` |
| `icon:'🚴'` | `icon:''` |

También verificar si el campo `icon` es usado en el HTML renderizado. Si el módulo muestra el icono visualmente, dejarlo como cadena vacía `''` para evitar errores en el JS. Si no se usa, se puede eliminar la propiedad.

---

## Convenciones

- Sin emojis en interfaz de usuario
- Color cardiovascular: `#f472b6` (rosa)
- Variables CSS de `fisioresp.css`: `var(--card)`, `var(--border)`, `var(--r)`, `var(--rs)`, `var(--bg3)`, `var(--text)`, `var(--text2)`, `var(--green)`, `var(--amber)`, `var(--red)`, `var(--blue)`
- Todo el texto en español

---

## Commit esperado

```
git add modules/casos_cardiovascular.html data/cases-cardiovascular.js
git commit -m "feat: agregar referencia rapida CV en C8 — perfiles ICC, fases RC, farmacos, oxigeno"
git push origin master
```
