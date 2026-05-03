# Diseño: Reorganización FisioResp — Hubs por Clase

**Fecha:** 2026-05-03  
**Estado:** Aprobado

---

## Objetivo

Reorganizar la plataforma FisioResp para que el índice muestre una tarjeta por clase (C1–C12) en lugar de una por módulo, y cada clase abra un hub page que agrupa sus módulos con objetivos de aprendizaje. Sin emojis en toda la interfaz.

---

## Arquitectura

### index.html (rediseñado)

- Muestra 12 tarjetas de clase, agrupadas en dos secciones:
  - Respiratorio (C1–C6)
  - Cardiovascular (C7–C12)
- C1 aparece con badge "Próximamente" y no es clickeable
- Cada tarjeta llama a `openModule('modules/clase-N.html', 'Título de Clase')`
- Sin emojis en iconos, títulos ni etiquetas

### modules/clase-N.html (nuevos, uno por clase)

Cada hub es un archivo HTML autocontenido con estilos embebidos, siguiendo el patrón existente del proyecto. Estructura interna:

1. Barra superior: botón "Volver" + título de la plataforma (mismo estilo que el iframe viewer actual)
2. Encabezado de clase: número de clase, título, área (Respiratorio / Cardiovascular)
3. Lista de objetivos de aprendizaje (3–5 puntos)
4. Grid de tarjetas de módulos — cada una llama a `openModule()` para abrir el módulo en iframe overlay
5. No usa emojis en ninguna parte

---

## Mapeo clases → módulos

### Respiratorio

| Clase | Título | Módulos |
|-------|--------|---------|
| C1 | Anatomía y Fisiología del Sistema Respiratorio | *Pendiente* — no clickeable |
| C2 | Evaluación del Sistema Respiratorio | `patrones_resp.html`, `casos_resp.html` |
| C3 | Procedimientos y Pruebas de Diagnóstico | `gasometria.html` |
| C4 | Evaluación y Tratamiento Fisioterapéutico | `historial.html`, `aclaramiento.html` |
| C5 | Rehabilitación Pulmonar / Terapia Respiratoria | `6mwt.html`, `fisio_resp_sim.html` |
| C6 | Enfermedades Obstructivas y Restrictivas | `fisio_resp_sim.html`, `calculadoras.html` |

### Cardiovascular

| Clase | Título | Módulos |
|-------|--------|---------|
| C7 | Anatomía y Fisiología Cardíaca | `ecg.html` |
| C8 | Evaluación Cardiovascular | `casos_cardiovascular.html` |
| C9 | Rehabilitación Cardíaca | `6mwt.html` |
| C10 | Enfermedades Cardíacas | `casos_cardiovascular.html` |
| C11 | Riesgo Cardiovascular | `riesgo_cv.html` |
| C12 | Prescripción del Ejercicio | `riesgo_cv.html` |

Notas:
- `fisio_resp_sim.html` aparece en C5 y C6 con objetivos distintos en cada hub
- `casos_cardiovascular.html` aparece en C8 y C10 con objetivos distintos
- `riesgo_cv.html` aparece en C11 y C12 con objetivos distintos
- `6mwt.html` aparece en C5 (respiratorio) y C9 (cardiovascular)

---

## Módulos que se mueven de clase

| Módulo | Clase anterior (app) | Clase nueva (correcta) | Motivo |
|--------|---------------------|----------------------|--------|
| `aclaramiento.html` | C5 | C4 | Pertenece a Tratamiento FT, no Rehabilitación |
| `fisio_resp_sim.html` | C6 | C5 + C6 | Fisiopatología apoya tanto Rehabilitación como Enfermedades |

---

## Convenciones de diseño

- Sin emojis en ningún archivo (index.html ni hubs)
- Mismo sistema de colores: azul para Respiratorio, rosa/pink para Cardiovascular
- Los hubs siguen el patrón visual de `index.html` (tarjetas `.mod-card`, variables CSS de `fisioresp.css`)
- Los módulos se siguen abriendo vía `openModule()` definido en `ui.js` — sin cambios a los módulos existentes
- C1 usa `pointer-events:none; opacity:.45` inline (sin modificar fisioresp.css) para estado no clickeable

---

## Flujo de trabajo con NotebookLM

Durante el desarrollo de cada hub, consultar el notebook `fisioresp` (ID: `fisioresp`) para:
- Verificar que los objetivos de aprendizaje de cada hub coinciden con el contenido real de las clases
- Identificar contenido presente en las clases que no esté cubierto por los módulos actuales
- Comparar terminología entre el material docente y los módulos

Notebook de bibliografía clínica: `cardiorespi` — para verificar precisión de contenido médico.

---

## Archivos a crear / modificar

### Nuevos
- `modules/clase-2.html`
- `modules/clase-3.html`
- `modules/clase-4.html`
- `modules/clase-5.html`
- `modules/clase-6.html`
- `modules/clase-7.html`
- `modules/clase-8.html`
- `modules/clase-9.html`
- `modules/clase-10.html`
- `modules/clase-11.html`
- `modules/clase-12.html`

### Modificados
- `index.html` — rediseñar sección de módulos para mostrar tarjetas de clase

### Sin cambios
- Todos los módulos existentes (`patrones_resp.html`, `gasometria.html`, etc.)
- `assets/css/fisioresp.css`
- `assets/js/ui.js`
- `data/*.js`
