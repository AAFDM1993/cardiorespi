# C3 — Gasometría Arterial (actualizaciones)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar tres tarjetas "Conceptos clave para fisioterapia" (índice PaO₂/FiO₂, guía terapéutica del gradiente A-a, hipercapnia permisiva) en la sección Referencia Rápida de `gasometria.html`, eliminar los emojis de los botones de modo, y confirmar el archivo en git.

**Architecture:** `gasometria.html` es vanilla HTML autocontenido (945 líneas). La sección Referencia Rápida (`id="mode-ref"`) ya tiene 4 tarjetas. El nuevo bloque se inserta al final de esa sección, antes de que cierre `#mode-ref`. Los botones de modo usan texto inline con emojis; se eliminan los emojis dejando solo el texto. El carácter `🏁` está en una cadena JS dentro de `renderStep()`.

**Tech Stack:** HTML/CSS vanilla, `fisioresp.css` (variables CSS `--purple`, `--teal`, `--amber`, `--green`, `--red`, `--text2`, `--text3`, `--bg3`, `--rs`), sin build system, sin emojis de interfaz, todo en español.

---

## Archivos

| Acción | Archivo |
|--------|---------|
| Modificar | `modules/gasometria.html` |
| Commit | `modules/gasometria.html` (primera versión en git) |

---

## Task 1: Agregar tarjetas de conceptos clave + quitar emojis

**Files:**
- Modify: `modules/gasometria.html`

- [ ] **Step 1: Insertar el bloque de 3 tarjetas en Referencia Rápida**

Localizar el final de la tarjeta "Anion Gap y gradiente A-a". El texto único que termina esa tarjeta es:

```html
<span style="color:var(--text3);font-size:11.5px">Normal con hipoxemia → hipoventilación pura</span></div>
        </div>
      </div>
    </div>
  </div>

</div><!-- /wrap -->
```

Reemplazar por (insertar el nuevo bloque entre el cierre de la tarjeta AG y el cierre de `#mode-ref`):

```html
<span style="color:var(--text3);font-size:11.5px">Normal con hipoxemia → hipoventilación pura</span></div>
        </div>
      </div>
    </div>

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
          <div style="font-weight:600;font-size:12.5px;color:var(--teal);margin-bottom:.5rem">Gradiente A-a — Guía terapéutica</div>
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
  </div>

</div><!-- /wrap -->
```

- [ ] **Step 2: Quitar emojis de los botones de modo**

Localizar el bloque `<div class="mode-bar">`. Reemplazar:

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

- [ ] **Step 3: Quitar emoji del botón de diagnóstico final en renderStep()**

Localizar dentro de la función `renderStep()` en el script la línea:

```js
        ${isLast ? '🏁 Ver diagnóstico final' : 'Siguiente paso →'}
```

Reemplazar por:

```js
        ${isLast ? 'Ver diagnóstico final' : 'Siguiente paso →'}
```

- [ ] **Step 4: Verificar**

Confirma en el archivo:
- `id="mode-ref"` contiene una nueva `.card` con título "Conceptos clave para fisioterapia" y 3 tarjetas interiores
- Los botones de modo NO contienen `🎓`, `📝`, `⚙️`, `📖`
- La cadena JS en `renderStep` NO contiene `🏁`
- Los caracteres `✓` y `✗` en el feedback de respuestas se han conservado intactos

- [ ] **Step 5: Commit y push**

```bash
git add modules/gasometria.html
git commit -m "feat: agregar conceptos clave fisioterapia en ref rapida C3 — quitar emojis"
git push origin master
```
