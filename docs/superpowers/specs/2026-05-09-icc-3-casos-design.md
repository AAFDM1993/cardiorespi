# Spec: ICC — 3 Casos Clínicos Diferenciados (C2 Casos Resp)

**Fecha:** 2026-05-09  
**Módulo:** `modules/casos_resp.html`  
**Sesión:** 1 de 3 (ICC) — le siguen EPOC+Bronquiectasias y Asma+FQ+Hiperventilación

---

## Problema a resolver

Los 3 bloques al final del array `CASES` (líneas ~1250–1551) son copias accidentales del mismo paciente con `id:10`, nombre `'ICC Descompensada'`. Tienen inconsistencias internas (labs distintos, texto con/sin tildes) y ninguno está optimizado para un momento clínico específico. El selector de casos falla con IDs duplicados.

## Solución

Eliminar los 3 bloques duplicados y reemplazarlos por 3 casos clínicamente diferenciados que representan el espectro de la ICC — mismo perfil de paciente base para mostrar la evolución longitudinal.

---

## Paciente base (común a los 3 casos)

Varón, 68 años, Cardiopatía isquémica post-IAM anterior (hace 5 años), ICC con FE reducida (FEr) diagnosticada hace 3 años, HTA, DM2, FA crónica anticoagulada. Medicación de base: carvedilol, enalapril, espironolactona, rivaroxaban.

---

## Caso id:10 — ICC Descompensada Fase Aguda

**Nombre:** `'ICC Descompensada — Fase Aguda'`  
**NYHA:** IV | **Severidad:** `sev` | **Contexto:** Ingreso hospitalario, día 1-2

### Vitales base
| Parámetro | Valor |
|-----------|-------|
| FC | 102 lpm (FA, ritmo irregular) |
| FR | 26 rpm |
| SpO₂ | 89% con O₂ 28% Venturi |
| PA | 152/96 mmHg |
| Borg | 7 |
| Temp | 37.1°C |

### Labs
**GSA:** pH 7.42, PaO₂ 58 mmHg (hipoxemia severa), PaCO₂ 33 mmHg, HCO₃⁻ 22 mEq/L, SaO₂ 89%  
**Hemograma/bioquímica:** BNP 2.400 pg/mL, Troponina 0.09 ng/mL, Creatinina 2.0 mg/dL, Na⁺ 130 mEq/L  
**Patrón espirométrico:** `restrictive`

### Escenarios ABCDE
- **A:** Ortopnea + habla en frases de 2-3 palabras + cianosis labial. Clave: VA permeable — cianosis es por hipoxemia, no obstrucción. Posición semiincorporada 45° como intervención inmediata de A.
- **B:** Edema pulmonar cardiogénico. Crepitantes finos bilaterales hasta ápices, Kerley B en RX, cardiomegalia. Intervención: O₂ para SpO₂ 94-96%, Fowler 60-90° + piernas colgando. Técnicas de aclaramiento CONTRAINDICADAS.
- **C:** Congestión sistémica severa. IY ++, edema pretibial grado III, BNP 2.400. Troponina leve = estrés miocárdico, no IAM nuevo. Ejercicio activo CONTRAINDICADO.
- **D:** Angustia severa por disnea + 3 noches sin dormir por ortopnea. Intervención: psicoeducación breve, respiración nasal lenta. Sin ansiolíticos (deprimen drive ventilatorio con SpO₂ 89%).
- **E:** Furosemida EV activa (hipotensión ortostática), carvedilol (atenúa FC — usar Borg), digoxina (monitorizar FC < 50 lpm), hiponatremia 130 mEq/L (riesgo convulsiones), Creatinina 2.0 (función renal comprometida).

### Simulador de ejercicio
Solo posicionamiento y movilización pasiva. SpO₂ cae a 88% en bipedestación — límite clínico visible.

**Fases:** Posicionamiento Fowler → Movilización pasiva MMII → Sedestación borde cama (límite) → Retorno decúbito

### Objetivo pedagógico
Reconocer que el ejercicio activo está contraindicado. Priorizar: O₂, posición, prevención TVP, educación. Análisis farmacológico complejo con polifarmacia.

---

## Caso id:11 — ICC Post-Aguda / Transición al Alta

**Nombre:** `'ICC Post-Aguda — Transición al Alta'`  
**NYHA:** III (mejorando) | **Severidad:** `mod` | **Contexto:** Día 5-7 post-ingreso

### Vitales base
| Parámetro | Valor |
|-----------|-------|
| FC | 88 lpm (FA, controlada) |
| FR | 20 rpm |
| SpO₂ | 94% con O₂ 2 L/min gafas nasales |
| PA | 138/86 mmHg |
| Borg | 4 |
| Temp | 36.8°C |

### Labs
**GSA:** pH 7.43, PaO₂ 72 mmHg, PaCO₂ 36 mmHg, HCO₃⁻ 24 mEq/L, SaO₂ 94%  
**Hemograma/bioquímica:** BNP 680 pg/mL (en descenso desde 2.400), Creatinina 1.5 mg/dL, Na⁺ 136 mEq/L, K⁺ 4.0 mEq/L  
**Patrón espirométrico:** `restrictive`

### Escenarios ABCDE
- **A:** Tolera decúbito 30° sin ortopnea. Habla en frases completas. Sin cianosis activa. Recuperación parcial de A.
- **B:** Crepitantes basales residuales (mejoría progresiva). FR 20 rpm — trabajo ventilatorio reducido. Técnicas de control respiratorio ya indicadas (no aclaramiento activo todavía).
- **C:** Edema pretibial grado I residual. IY mínima. BNP 680 en descenso confirma respuesta al tratamiento. FC 88 en FA = controlada. Marcha corta en pasillo ya posible con monitorización.
- **D:** Ansioso por el alta — miedo a recaer en casa. Clave: educación sobre automonitoreo (peso diario, signos de alarma). Plan de acción claro reduce la ansiedad de forma más efectiva que la tranquilización verbal.
- **E:** Furosemida pasó de EV a VO (ajuste de dosis post-diuresis). Monitorizar K⁺ y diuresis. Carvedilol: FC atenúa — usar Borg. Rivaroxaban: precaución con caídas en movilización.

### Simulador de ejercicio
Movilización activo-asistida → marcha en pasillo 50m → escalón 1 peldaño.  
Monitorización SpO₂ continua: objetivo >92% durante esfuerzo.

**Fases:** Movilización activa MMII → Sedestación prolongada → Bipedestación sostenida → Marcha corta 50m → Retorno supervisado

### Objetivo pedagógico
Progresión escalonada segura. Criterios de parada (SpO₂ <92%, Borg >6, PAS >180 o <90, síntomas). Educación para el alta como intervención terapéutica.

---

## Caso id:12 — ICC Crónica Estable / Rehabilitación Fase II

**Nombre:** `'ICC Crónica Estable — Rehabilitación'`  
**NYHA:** II | **Severidad:** `mild` | **Contexto:** Ambulatorio, candidato Fase II

### Vitales base
| Parámetro | Valor |
|-----------|-------|
| FC | 68 lpm (FA, bien controlada) |
| FR | 16 rpm |
| SpO₂ | 96% AA |
| PA | 124/78 mmHg |
| Borg | 2 |
| Temp | 36.6°C |

### Labs
**GSA:** No requerida en reposo. SpO₂ 96% AA aceptable.  
**Hemograma/bioquímica:** BNP 145 pg/mL (estable), Creatinina 1.1 mg/dL, Na⁺ 140 mEq/L, K⁺ 4.2 mEq/L  
**Patrón espirométrico:** `restrictive` (leve)

### Escenarios ABCDE
- **A:** Completamente normal. Sin ortopnea, sin disnea en reposo. Habla fluida.
- **B:** Leve reducción del murmullo vesicular en bases. Sin crepitantes activos. Sin sibilancias. SpO₂ 96% AA — aceptable para inicio de ejercicio.
- **C:** Sin edema. Sin IY. BNP 145 = ICC compensada. FC 68 en FA = controlada (carvedilol). FE 32% persiste (disfunción sistólica crónica) pero compensada. Candidato a ejercicio aeróbico supervisado.
- **D:** Motivado pero con kinesofobia post-IAM ("tengo miedo de que el corazón no aguante el ejercicio"). Intervención: psicoeducación sobre beneficios del ejercicio en ICC, evidencia de que el ejercicio REDUCE la mortalidad en ICC compensada.
- **E:** Carvedilol (betabloqueante) — FC no es guía fiable de intensidad → usar Borg. Enalapril + espironolactona: riesgo hipotensión ortostática — calentar gradual. Rivaroxaban: actividades con riesgo de caída con precaución.

### Simulador de ejercicio
Prescripción aeróbica completa: Karvonen 40-60% FCR, objetivo Borg 3-4, duración 20-30 min.  
FCmáx estimada con carvedilol: reducida ~20% → ajuste con fórmula modificada.

**Fases:** Calentamiento 5' → Fase aeróbica 20' (bicicleta estática/marcha) → Vuelta a calma 5' → Evaluación tolerancia

### Objetivo pedagógico
Prescripción de ejercicio en ICC con betabloqueantes (Borg > FC). Karvonen aplicado. 6MWT como medida de base y seguimiento. Kinesofobia como barrera terapéutica real.

---

## Cambios técnicos en el archivo

1. **Eliminar** líneas 1250–1551 (3 bloques `id:10` duplicados)
2. **Agregar** al final del array `CASES` los 3 nuevos objetos antes del `];`
3. **Actualizar badge** en home: `'10 Casos Integrados'` → `'13 Casos Integrados'`
4. **IDs únicos:** 10, 11, 12 — sin duplicados

## Alcance excluido

- Casos id:0–9: sin cambios
- Módulos fuera de `casos_resp.html`: sin cambios
- Sesiones 2 y 3 (EPOC+Bronquiectasias, Asma+FQ+Hiperventilación): spec separado
