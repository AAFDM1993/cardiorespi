# Diseño: Módulo C1 — Anatomía y Fisiología del Sistema Respiratorio

**Fecha:** 2026-05-04  
**Estado:** Aprobado

---

## Objetivo

Crear el módulo C1 de FisioResp con contenido completo de anatomía y fisiología del sistema respiratorio, basado en las clases del docente (notebook `fisioresp`) y la bibliografía clínica (notebook `cardiorespi`). El módulo es una referencia detallada con 5 tabs temáticos y tablas de valores al pie de cada uno.

---

## Archivos a crear / modificar

| Acción | Archivo | Propósito |
|--------|---------|-----------|
| Crear | `modules/anatomia_resp.html` | Módulo principal con 5 tabs y todo el contenido |
| Crear | `modules/clase-1.html` | Hub de C1 que enlaza a `anatomia_resp.html` |
| Modificar | `index.html` | Activar card C1 (quitar `pointer-events:none` y `opacity:.45`, agregar `href` y `onclick`) |

---

## Módulo principal: `anatomia_resp.html`

### Estructura general

HTML autocontenido con estilos embebidos. Usa `showTab(id)` de `ui.js` para navegación entre tabs. Sigue el patrón de los módulos existentes (tema oscuro, variables CSS de `fisioresp.css`). Sin emojis.

### Tabs

#### Tab 1 — Anatomía

**Contenido textual:**
- Vías Aéreas Superiores: nariz (calentamiento, humidificación, filtración), faringe (naso-, oro-, laringofaringe), laringe
- Vías Aéreas Inferiores: tráquea → bronquios principales (derecho más vertical) → bronquios lobares y segmentarios → bronquiolos terminales y respiratorios → conductos alveolares → alvéolos
- Pulmones y Pleura: lóbulos (2 izquierdo, 3 derecho), cisuras, pleura visceral y parietal, espacio pleural
- Unidad Respiratoria (Acino): bronquiolos respiratorios + conductos alveolares + sacos alveolares + alvéolos — unidad funcional del intercambio gaseoso
- Circulación pulmonar (arterias y venas pulmonares) y circulación bronquial

**Tabla de referencia:**

| Músculo | Fase | Función |
|---------|------|---------|
| Diafragma | Inspiración | Principal músculo inspiratorio — desciende y aumenta volumen torácico |
| Intercostales externos | Inspiración | Elevan costillas, amplían caja torácica |
| Escalenos, ECM, pectorales | Inspiración forzada | Músculos accesorios |
| Retroceso elástico | Espiración normal | Pasivo — no requiere contracción muscular |
| Intercostales internos + abdominales | Espiración forzada | Reducen activamente el volumen torácico |

---

#### Tab 2 — Volúmenes y Capacidades

**Contenido textual:**
- Volumen Corriente (VT): volumen de aire movilizado en una respiración normal en reposo
- Volumen de Reserva Inspiratoria (VRI): volumen adicional inspirable sobre el VT
- Volumen de Reserva Espiratoria (VRE): volumen adicional espirable tras espiración normal
- Volumen Residual (VR): volumen que queda en pulmones tras espiración máxima — no medible por espirometría simple
- Capacidad Pulmonar Total (CPT): suma de todos los volúmenes (VT + VRI + VRE + VR)
- Capacidad Vital (CV): volumen máximo movilizable en una sola espiración (VT + VRI + VRE)
- Capacidad Residual Funcional (CRF): volumen al final de una espiración normal (VRE + VR) — medible por dilución de gases
- Capacidad Inspiratoria (CI): volumen máximo inspirado desde CRF (VT + VRI)
- Espacio muerto anatómico: vías de conducción que no participan en intercambio gaseoso (~150 mL)
- Espacio muerto alveolar: alvéolos ventilados pero no perfundidos
- Espacio muerto fisiológico: anatómico + alveolar
- Ventilación alveolar: VA = FR × (VT − VD), donde VD es el volumen del espacio muerto

**Tabla de referencia:**

| Parámetro | Valor de referencia | Componentes |
|-----------|-------------------|-------------|
| VT | ~500 mL | — |
| VRI | ~3000 mL | — |
| VRE | ~1200 mL | — |
| VR | ~1200 mL | No medible por espirometría |
| CPT | ~6000 mL | VT + VRI + VRE + VR |
| CV | ~4700 mL | VT + VRI + VRE |
| CRF | ~2400 mL | VRE + VR |
| CI | ~3500 mL | VT + VRI |
| Espacio muerto anatómico | ~150 mL | — |

---

#### Tab 3 — Mecánica Ventilatoria

**Contenido textual:**
- Inspiración: proceso activo — diafragma se contrae y desciende, aumenta volumen torácico, reduce presión intratorácica, genera gradiente de presión que impulsa entrada de aire
- Espiración normal: proceso pasivo por retroceso elástico del pulmón y caja torácica
- Compliance (distensibilidad): facilidad con que el pulmón se expande ante cambio de presión. Fórmula: C = ΔV / ΔP. Mayor compliance = pulmón más distensible (ej. enfisema). Menor compliance = pulmón más rígido (ej. fibrosis)
- Resistencia de la vía aérea (Raw): oposición al flujo de aire. Fórmula: R = ΔP / Flujo. Depende del calibre de la vía (ley de Poiseuille: Raw ∝ 1/r⁴), longitud y densidad del gas
- Tensión superficial: fuerza en la interfase aire-líquido dentro de los alvéolos que tiende a colapsarlos
- Ley de Laplace: P = 2T/r — a menor radio alveolar, mayor presión de colapso
- Surfactante pulmonar: producido por neumocitos tipo II — reduce la tensión superficial, previene colapso alveolar, permite expansión pulmonar con menor trabajo
- Presión transpulmonar: diferencia entre presión alveolar y presión pleural — mantiene el pulmón expandido
- Presión pleural (Ppl): normalmente negativa en reposo (~-5 cmH₂O) — evita colapso pulmonar
- Trabajo respiratorio: componente elástico (vencer compliance) + componente resistivo (vencer Raw)

**Tabla de referencia:**

| Concepto | Fórmula | Unidad |
|----------|---------|--------|
| Compliance | C = ΔV / ΔP | L/cmH₂O |
| Resistencia (Raw) | R = ΔP / Flujo | cmH₂O/L/s |
| Ley de Laplace | P = 2T / r | cmH₂O |
| Presión pleural (reposo) | ~−5 cmH₂O | cmH₂O |
| Presión transpulmonar | Palv − Ppl | cmH₂O |

---

#### Tab 4 — Intercambio Gaseoso

**Contenido textual:**
- Difusión: intercambio de O₂ y CO₂ en la membrana alvéolo-capilar por diferencia de presiones parciales
- Ley de Fick: Flujo ∝ (ΔP × A × S) / d — donde A = área de la membrana, S = solubilidad del gas, d = grosor de la membrana
- Ecuación del gas alveolar: PAO₂ = PiO₂ − (PACO₂ / R), donde R = cociente respiratorio (~0,8). Permite calcular la presión alveolar de O₂
- Gradiente alvéolo-arterial (AaDO₂ o P(A-a)O₂): diferencia entre PAO₂ calculada y PaO₂ medida. Valor normal: < 10-15 mmHg. Aumenta en alteraciones de difusión, shunt y V/Q
- Transporte de O₂: 97% unido a hemoglobina (oxihemoglobina), 3% disuelto en plasma. La curva de disociación de la oxihemoglobina se desplaza a la derecha (menor afinidad, mayor liberación de O₂) con: aumento de temperatura, PaCO₂, 2,3-DPG y descenso del pH (efecto Bohr)
- Transporte de CO₂: 70% como bicarbonato (HCO₃⁻, mediado por anhidrasa carbónica), 23% como carbaminohemoglobina, 7% disuelto en plasma. La hemoglobina desoxigenada une más CO₂ (efecto Haldane)
- Relación V/Q: cociente ventilación/perfusión normal ~0,8. Shunt (V/Q = 0): unidades perfundidas pero no ventiladas. Espacio muerto alveolar (V/Q = ∞): unidades ventiladas pero no perfundidas

**Tabla de referencia:**

| Parámetro | Valor normal |
|-----------|-------------|
| PaO₂ arterial | 80–100 mmHg |
| PaCO₂ arterial | 35–45 mmHg |
| SaO₂ | > 95% |
| Gradiente AaDO₂ | < 10–15 mmHg |
| Cociente respiratorio (R) | ~0,8 |
| V/Q normal | ~0,8 |
| Transporte CO₂ como HCO₃⁻ | ~70% |
| Transporte CO₂ como carbaminoHb | ~23% |
| Transporte CO₂ disuelto | ~7% |

---

#### Tab 5 — Control de la Ventilación

**Contenido textual:**
- Centro respiratorio: en el tronco del encéfalo (bulbo raquídeo y protuberancia)
  - Grupo Respiratorio Dorsal (GRD): en el bulbo — controla el ritmo básico inspiratorio
  - Grupo Respiratorio Ventral (GRV): en el bulbo — activo en la espiración forzada y en alta demanda ventilatoria
  - Centro apnéusico (protuberancia): prolonga la inspiración si no es inhibido
  - Centro neumotáxico (protuberancia): inhibe el centro apnéusico, limita la duración de la inspiración
- Quimiorreceptores centrales: ubicados en el bulbo — responden principalmente a cambios en el pH del líquido cefalorraquídeo (que refleja cambios en la PaCO₂). Son el principal mecanismo de regulación a corto plazo
- Quimiorreceptores periféricos: cuerpos carotídeos (bifurcación de la carótida común) y aórticos — responden a descenso de PaO₂ (< 60 mmHg), aumento de PaCO₂ y descenso del pH arterial
- Mecanorreceptores pulmonares:
  - Receptores de estiramiento (fibras A mielínicas): en músculo liso de vías aéreas — activan el reflejo de Hering-Breuer (inhibición inspiratoria al alcanzar volumen umbral, más activo en neonatos)
  - Receptores de irritantes: en epitelio de vías aéreas — responden a humo, polvo, gases irritantes; desencadenan tos y broncoconstricción
  - Receptores J (yuxtacapilares): en parénquima pulmonar — responden a congestión y edema pulmonar; producen taquipnea superficial
- Otros moduladores: ejercicio, emociones, dolor, temperatura corporal, proprioceptores musculares y articulares

**Tabla de referencia:**

| Receptor | Localización | Estímulo principal | Respuesta |
|----------|-------------|-------------------|-----------|
| Quimiorreceptores centrales | Bulbo raquídeo | pH del LCR (↑PaCO₂) | Aumentan ventilación |
| Quimiorreceptores periféricos | Cuerpos carotídeos/aórticos | ↓PaO₂ (< 60 mmHg), ↑PaCO₂, ↓pH | Aumentan ventilación |
| Receptores de estiramiento | Músculo liso bronquial | Distensión pulmonar | Inhiben inspiración (Hering-Breuer) |
| Receptores de irritantes | Epitelio vías aéreas | Irritantes químicos/físicos | Tos, broncoconstricción |
| Receptores J | Parénquima pulmonar | Edema, congestión | Taquipnea superficial |

---

## Hub: `modules/clase-1.html`

Mismo patrón que los hubs clase-2 a clase-12. Color: azul (`--blue`, `rgba(56,189,248,...)`). Objetivos de aprendizaje de la clase. Una card que enlaza a `modules/anatomia_resp.html`.

**Objetivos:**
- Describir las estructuras anatómicas del sistema respiratorio y sus funciones
- Interpretar los volúmenes y capacidades pulmonares y sus valores de referencia
- Explicar los principios de la mecánica ventilatoria (compliance, resistencia, surfactante)
- Comprender el intercambio y transporte de gases en la membrana alvéolo-capilar
- Identificar los mecanismos de control de la ventilación

---

## Activar C1 en `index.html`

Reemplazar el `<div class="mod-card" style="pointer-events:none;opacity:.45">` de C1 por un `<a class="mod-card">` con `onclick="openModule('modules/clase-1.html', 'Clase 1 — Anatomía y Fisiología del Sistema Respiratorio')"`.

---

## Convenciones

- Sin emojis en ningún archivo
- Tema oscuro, variables CSS de `fisioresp.css`
- `showTab(id)` de `ui.js` para navegación entre tabs
- HTML autocontenido con estilos embebidos
- Contenido verificado contra notebooks `fisioresp` y `cardiorespi`
