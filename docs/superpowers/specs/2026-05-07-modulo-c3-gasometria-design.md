# Diseño: Módulo C3 — Gasometría Arterial (actualizaciones)

**Fecha:** 2026-05-07
**Estado:** Aprobado

---

## Objetivo

Actualizar `modules/gasometria.html` con tres tarjetas nuevas de "Conceptos clave para fisioterapia" en la sección Referencia Rápida, eliminar los emojis de los botones de modo y confirmar el archivo en git (actualmente sin versionar).

---

## Contexto del módulo existente

`gasometria.html` (945 líneas) ya cubre:
- 4 modos: Aprendizaje, Evaluación, Simulador de Diales, Referencia Rápida
- 9 casos clínicos con intérprete paso a paso
- Diagrama de Davenport interactivo
- Referencia Rápida: valores normales, algoritmo 5 pasos, fórmulas de compensación, Anion Gap con MUDPILES + corrección albúmina, gradiente A-a con fórmula e interpretación básica

El archivo **ya tiene** AG+MUDPILES+corrección albúmina y gradiente A-a básico. Los gaps reales son el índice PaO₂/FiO₂, la guía terapéutica del gradiente A-a y la hipercapnia permisiva.

---

## Archivos a modificar

| Acción | Archivo | Cambios |
|--------|---------|---------|
| Modificar | `modules/gasometria.html` | Agregar 3 tarjetas en Referencia Rápida, quitar emojis de botones |
| Commit | `modules/gasometria.html` | Primera versión en git |

---

## Cambio 1 — Tres tarjetas nuevas en Referencia Rápida

### Punto de inserción

La sección Referencia Rápida (`id="mode-ref"`) termina con la tarjeta "Anion Gap y gradiente A-a". Las 3 tarjetas nuevas se insertan **dentro de `#mode-ref`**, inmediatamente después del `</div>` que cierra la tarjeta "Anion Gap y gradiente A-a", antes del `</div>` que cierra el `#mode-ref`.

El localizador exacto para el Edit tool es este bloque que aparece al final de `#mode-ref`:

```html
      </div>
    </div>
  </div>

</div><!-- /wrap -->
```

Reemplazar el primer `</div>\n  </div>` (que cierra la tarjeta AG) por ese mismo cierre más el nuevo bloque insertado antes del cierre de `#mode-ref`.

### Tarjeta 1 — Índice PaO₂/FiO₂ (Horowitz)

```html
<div class="card" style="margin-top:1rem">
  <div style="font-family:var(--fh);font-size:1rem;color:var(--blue);margin-bottom:.75rem">Conceptos clave para fisioterapia</div>
  <div class="grid g2" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">

    <div style="background:var(--bg3);border-radius:var(--rs);padding:.9rem;border-left:3px solid var(--purple)">
      <div style="font-weight:600;font-size:12.5px;color:var(--purple);margin-bottom:.5rem">Índice PaO₂/FiO₂ (Horowitz)</div>
      <div class="formula" style="font-size:12px">PaO₂ (mmHg) ÷ FiO₂ (fracción)</div>
      <div style="font-size:12px;color:var(--text2);margin-top:.5rem;line-height:1.6">
        <span style="color:var(--green)">▸ &gt; 400</span> — Normal<br>
        <span style="color:var(--amber)">▸ 200–300</span> — Lesión pulmonar aguda (ALI)<br>
        <span style="color:var(--red)">▸ &lt; 200</span> — SDRA<br>
        <span style="color:var(--text3);font-size:11px">SDRA grave (&lt;100): candidato a decúbito prono. Evitar técnicas de alta presión torácica.</span>
      </div>
    </div>

    <div style="background:var(--bg3);border-radius:var(--rs);padding:.9rem;border-left:3px solid var(--teal)">
      <div style="font-weight:600;font-size:12.5px;color:var(--teal);margin-bottom:.5rem">Gradiente A-a → Guía terapéutica</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.6">
        <span style="color:var(--green)">▸ A-a normal + hipoxemia</span><br>
        <span style="color:var(--text3);font-size:11px">Hipoventilación pura (membrana intacta). Intervenir con técnicas de expansión pulmonar y control del patrón ventilatorio.</span><br><br>
        <span style="color:var(--amber)">▸ A-a elevado + hipoxemia</span><br>
        <span style="color:var(--text3);font-size:11px">Alteración V/Q, shunt o difusión. Intervenir con posicionamiento (decúbito lateral sobre pulmón sano), reclutamiento alveolar, optimización PEEP.</span>
      </div>
    </div>

    <div style="background:var(--bg3);border-radius:var(--rs);padding:.9rem;border-left:3px solid var(--amber)">
      <div style="font-weight:600;font-size:12.5px;color:var(--amber);margin-bottom:.5rem">Hipercapnia permisiva</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.6">
        Estrategia en VM que acepta PaCO₂ elevada para evitar barotrauma. Se aplica en EPOC grave y SDRA.<br><br>
        <span style="color:var(--red);font-size:11.5px;font-weight:600">No aplicar técnicas de hiperventilación</span><span style="color:var(--text3);font-size:11px"> (ej. IPPB, hiperventilación manual) en pacientes con hipercapnia permisiva prescrita.</span>
      </div>
    </div>

  </div>
</div>
```

---

## Cambio 2 — Eliminar emojis de botones

### Botones de modo (línea ~114)

Reemplazar:
```html
<button class="mode-btn active" onclick="setMode('guiado')">🎓 Modo Aprendizaje</button>
<button class="mode-btn" onclick="setMode('eval')">📝 Modo Evaluación</button>
<button class="mode-btn" onclick="setMode('sim')">⚙️ Simulador de Diales</button>
<button class="mode-btn" onclick="setMode('ref')">📖 Referencia Rápida</button>
```

por:
```html
<button class="mode-btn active" onclick="setMode('guiado')">Modo Aprendizaje</button>
<button class="mode-btn" onclick="setMode('eval')">Modo Evaluación</button>
<button class="mode-btn" onclick="setMode('sim')">Simulador de Diales</button>
<button class="mode-btn" onclick="setMode('ref')">Referencia Rápida</button>
```

### Botón "Ver diagnóstico final" en `renderStep()` (línea ~547)

Reemplazar:
```js
${isLast ? '🏁 Ver diagnóstico final' : 'Siguiente paso →'}
```

por:
```js
${isLast ? 'Ver diagnóstico final' : 'Siguiente paso →'}
```

### Lo que se conserva (NO son emojis)

- `✓` (U+2713) y `✗` (U+2717) en feedback de respuestas — símbolos tipográficos, se conservan
- `→` en botones de navegación — símbolo tipográfico, se conserva

---

## Convenciones

- Sin emojis en ningún elemento de interfaz
- Tema oscuro, variables CSS de `fisioresp.css`
- Todo el texto en español
- Contenido verificado contra notebooks `fisioresp` y `cardiorespi`

---

## Commit esperado

```
git add modules/gasometria.html
git commit -m "feat: agregar conceptos clave fisioterapia en ref rapida C3 — quitar emojis"
```
