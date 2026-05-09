# Spec: EPOC + Bronquiectasias — Sesión 2 de 3

**Fecha:** 2026-05-09  
**Módulo:** `modules/casos_resp.html`  
**Sesión:** 2 de 3 — le sigue Asma+FQ+Hiperventilación (Sesión 3)

---

## Objetivo

Agregar 4 casos nuevos al array `CASES`: 1 nuevo caso EPOC (completando las 3 etapas) y 3 nuevos casos de Bronquiectasias con perfiles clínicamente distintos. Badge actualizado de "13" a "17 Casos Integrados".

---

## Estado actual del array CASES

| ID | Nombre | Estado |
|----|--------|--------|
| 0 | EPOC Moderado (GOLD II, estable) | Existente |
| 1–9 | Otros casos respiratorios | Existente |
| 8 | EPOC Exacerbación + VMNI (GOLD III, aguda) | Existente |
| 10–12 | ICC (3 etapas) | Sesión 1 |
| **13** | **EPOC Post-Exacerbación / RP** | **Nuevo** |
| **14** | **Bronquiectasias Post-infecciosas Estable** | **Nuevo** |
| **15** | **Bronquiectasias FQ Adulto en Exacerbación** | **Nuevo** |
| **16** | **Bronquiectasias Post-tuberculosis Avanzadas** | **Nuevo** |

---

## Cambios técnicos

1. Insertar casos id:13–16 antes del `];` final del array `CASES`
2. Actualizar badge: `'13 Casos Integrados'` → `'17 Casos Integrados'`
3. Ningún caso existente (id:0–12) se modifica

---

## Caso id:13 — EPOC Post-Exacerbación / Rehabilitación Pulmonar

**Nombre:** `'EPOC Post-Exacerbación — Rehabilitación Pulmonar'`  
**Perfil:** Mujer, 71 años | GOLD III en recuperación | `sev:'mod'`  
**Contexto:** 2 semanas post-alta tras exacerbación con VMNI. Candidata a programa de Rehabilitación Pulmonar (RP). Misma paciente base que id:8.

### Vitales base
| FC | FR | SpO₂ | PA | Borg | Temp |
|----|----|------|-----|------|------|
| 82 | 18 | 92% AA | 128/76 | 3 | 36.7°C |

### Labs
**GSA:** pH 7.42, PaO₂ 68 mmHg, PaCO₂ 44 mmHg, HCO₃⁻ 28 mEq/L, SaO₂ 92%  
**Espirometría:** FEV₁ 38% pred, CVF 52% pred, FEV₁/CVF 0.56 — obstructivo severo  
**Funcional:** 6MWT 280m (predicho para edad/sexo: 520m — reducción 46%)  
**Patrón espirométrico:** `obstructive-sev`

### Escenarios ABCDE
- **A:** Tos productiva escasa residual. VA permeable. Sin uso de musculatura accesoria en reposo. Diferencia clave vs. fase aguda: ahora puede hablar en frases completas. Punto: monitorizar si tos se hace más productiva durante el ejercicio (normal en EPOC en RP).
- **B:** Sibilancias espiratorias leves, hiperinflación residual, expansión reducida. FR 18 en reposo — mejoría respecto a la exacerbación. Técnicas de control respiratorio ya indicadas (labios fruncidos, respiración diafragmática). Aclaramiento bronquial como rutina de mantenimiento.
- **C:** Sin signos de cor pulmonale activo. FC 82 controlada. Sin edema periférico. SpO₂ 92% AA — en límite para ejercicio (umbral habitual ≥88%). 6MWT como herramienta de prescripción de intensidad.
- **D:** Ansiedad anticipatoria intensa: "la última vez que hice esfuerzo tuve la exacerbación". Kinesofobia post-exacerbación. Intervención: diferencia entre disnea de esfuerzo normal (esperada en RP) vs. disnea patológica (criterio de parada). Borg como herramienta de autocontrol.
- **E:** LABA+LAMA (indacaterol/glicopirronio), ICS (budesonida), prednisona 10mg en pauta descendente (día 14). Punto clave: prednisona residual — vigilar hiperglucemia con ejercicio. Sin O₂ domiciliario (SpO₂ 92% no cumple criterio <88%).

### Simulador de ejercicio
5 fases: Calentamiento → Caminata moderada → Pico 60% FCR → Vuelta a calma → Recuperación  
SpO₂ nadir 88% en pico — en límite pero tolerable con monitorización.

### Objetivo pedagógico
Criterios de entrada a RP post-exacerbación. Prescripción aeróbica con Borg 4-5 (no FC por LABA). Papel del aclaramiento en mantenimiento. Reconocimiento precoz de nueva exacerbación (ABCDE propio del paciente).

---

## Caso id:14 — Bronquiectasias Post-infecciosas Estable

**Nombre:** `'Bronquiectasias Post-infecciosas — Estable'`  
**Perfil:** Mujer, 45 años | Bronquiectasias cilíndricas LID post-Klebsiella | `sev:'mild'`  
**Contexto:** Consulta ambulatoria de seguimiento. Sin exacerbación activa. Colonización crónica Pseudomonas aeruginosa. Aclaramiento domiciliario inconstante.

### Vitales base
| FC | FR | SpO₂ | PA | Borg | Temp |
|----|----|------|-----|------|------|
| 74 | 16 | 95% AA | 118/74 | 1 | 36.5°C |

### Labs
**GSA:** pH 7.41, PaO₂ 78 mmHg, PaCO₂ 38 mmHg, HCO₃⁻ 24 mEq/L, SaO₂ 95%  
**Espirometría:** FEV₁ 68% pred, CVF 78% pred, FEV₁/CVF 0.68 — obstructivo leve  
**Microbiología:** Pseudomonas aeruginosa (colonización crónica, sensible a tobramicina nebulizada)  
**Patrón espirométrico:** `obstructive-mild`

### Escenarios ABCDE
- **A:** Tos productiva matutina abundante — adaptación crónica. VA permeable. Punto: la tos crónica en bronquiectasias NO es una alarma — es el mecanismo de aclaramiento natural. Diferencia con EPOC.
- **B:** Crepitantes en LID (lesión principal). Sin sibilancias. Expansión asimétrica (LID reducida). SpO₂ 95% AA aceptable. Intervención: técnicas de aclaramiento localizadas en LID (ELTGOL en decúbito lateral izquierdo, drenaje por gravedad).
- **C:** Sin compromiso CV. FC 74 normal. Ejercicio aeróbico bien tolerado. Punto: el ejercicio aeróbico mejora el aclaramiento mucociliar en bronquiectasias — es una técnica terapéutica, no solo un beneficio colateral.
- **D:** Fatiga de adherencia al aclaramiento domiciliario ("lo hago cuando tengo tiempo"). Intervención: identificar barreras reales (tiempo, comodidad, efectividad percibida). Simplificación del programa: ACBT 2×/día vs. 4 técnicas distintas. App de recordatorio. Impacto de la no-adherencia: colonización progresiva, exacerbaciones.
- **E:** Azitromicina 500mg 3×/semana (profilaxis), salbutamol PRN, tobramicina nebulizada 28 días on/off. Punto: azitromicina — efecto antiinflamatorio + antibacteriano en bronquiectasias. No confundir con tratamiento de exacerbación.

### Simulador de ejercicio
5 fases: Aclaramiento pre-ejercicio → Calentamiento → Fase aeróbica → Vuelta a calma → Evaluación SpO₂  
Ejercicio post-aclaramiento: SpO₂ estable en 95%, Borg 2-3.

### Objetivo pedagógico
Diseño de programa domiciliario de aclaramiento. Técnicas específicas (ELTGOL, Flutter, ACBT) y posicionamiento para LID. Ejercicio aeróbico como adyuvante del aclaramiento. Estrategias de adherencia a largo plazo.

---

## Caso id:15 — Bronquiectasias FQ Adulto en Exacerbación

**Nombre:** `'Bronquiectasias FQ — Exacerbación Aguda'`  
**Perfil:** Varón, 26 años | FQ diagnóstico tardío (ΔF508/R117H) | `sev:'sev'`  
**Contexto:** Primer ingreso hospitalario por exacerbación grave. Antibiótico EV activo (tobramicina + linezolid). Diagnóstico de FQ hace 8 meses — paciente en proceso de adaptación.

### Vitales base
| FC | FR | SpO₂ | PA | Borg | Temp |
|----|----|------|-----|------|------|
| 96 | 22 | 91% con O₂ 2L | 118/72 | 5 | 38.1°C |

### Labs
**GSA:** pH 7.38, PaO₂ 62 mmHg, PaCO₂ 46 mmHg, HCO₃⁻ 27 mEq/L, SaO₂ 91%  
**Espirometría:** FEV₁ 42% pred, CVF 60% pred, FEV₁/CVF 0.52 — obstructivo moderado-severo  
**Microbiología:** S. aureus MRSA (+), Pseudomonas aeruginosa (primer aislamiento)  
**Bioquímica:** PCR 48 mg/L, Leucocitos 14.200/μL  
**Patrón espirométrico:** `obstructive-sev`

### Escenarios ABCDE
- **A:** Tos intensa y frecuente con esputo purulento verde abundante. Sin hemoptisis activa (preguntar siempre). VA permeable pero tos muy fatigante. Intervención A: posición semiincorporada, esputo en recipiente para cuantificar, avisar si hemoptisis.
- **B:** Crepitantes bilaterales extensos, sibilancias espiratorias. FR 22 con trabajo respiratorio aumentado. SpO₂ 91% con O₂. Aclaramiento bronquial 3-4×/día como intervención B principal. Dornasa alfa nebulizada 30 min antes del aclaramiento (reduce viscosidad del esputo). VEST vs técnicas manuales: igual eficacia, VEST permite independencia.
- **C:** Taquicardia reactiva a fiebre e hipoxemia — no patológica. Sin compromiso hemodinámico. Ejercicio activo limitado en exacerbación — solo movilización activa-asistida mientras SpO₂ <92%.
- **D:** Impacto psicológico del diagnóstico tardío FQ en adulto: "¿Cómo no me lo detectaron antes?" Rabia, duelo, incertidumbre sobre pronóstico y fertilidad. El fisioterapeuta NO es el terapeuta, pero SÍ es quien pasa más tiempo con el paciente. Intervención: escucha activa, derivación a psicólogo especializado en FQ, conectar con asociación FQ.
- **E:** Tobramicina EV (monitorizar nefrotoxicidad — creatinina, diuresis), linezolid (vigilar trombopenia), dornasa alfa (administrar antes del aclaramiento), ivacaftor/lumacaftor (modulator CFTR — tomar con grasa). Punto: la dornasa alfa es un medicamento respiratorio que el fisioterapeuta debe saber administrar en la secuencia correcta.

### Simulador de ejercicio
5 fases: Aclaramiento con dornasa alfa pre → Movilización activa-asistida → Sedestación sostenida → Aclaramiento post → Recuperación  
SpO₂ cae a 89% con movilización — límite tolerable con O₂.

### Objetivo pedagógico
Secuencia nebulización→aclaramiento en FQ. VEST vs técnicas manuales. Ejercicio limitado en exacerbación. MRSA — precauciones de aislamiento en fisioterapia. Soporte psicológico en diagnóstico tardío.

---

## Caso id:16 — Bronquiectasias Post-tuberculosis Avanzadas

**Nombre:** `'Bronquiectasias Post-TBC — Avanzadas'`  
**Perfil:** Hombre, 67 años | Bronquiectasias saculares bilaterales post-TBC | `sev:'sev'`  
**Contexto:** Consulta ambulatoria. O₂ domiciliario 2L/min. FEV₁ 29%. En lista de trasplante pulmonar. Muy decondicionado. Pseudomonas multirresistente.

### Vitales base
| FC | FR | SpO₂ | PA | Borg | Temp |
|----|----|------|-----|------|------|
| 88 | 20 | 90% con O₂ 2L | 138/84 | 4 | 36.8°C |

### Labs
**GSA:** pH 7.40, PaO₂ 60 mmHg (con O₂ 2L), PaCO₂ 50 mmHg, HCO₃⁻ 31 mEq/L, SaO₂ 90%  
**Espirometría:** FEV₁ 29% pred, CVF 45% pred, FEV₁/CVF 0.48 — obstructivo muy severo  
**Funcional:** 6MWT 185m (predicho: 550m — reducción 66%)  
**Eco:** HTP leve (PSAP 38 mmHg), FE 58% (VD dilatado)  
**Microbiología:** Pseudomonas aeruginosa multirresistente  
**Patrón espirométrico:** `obstructive-sev`

### Escenarios ABCDE
- **A:** Tos débil, escasa eficacia expectorante (músculos espiratorios debilitados). Secreciones espesas difíciles de movilizar. Riesgo de hemoptisis (pregunta obligatoria — antecedente TBC). Intervención A: técnica de tos asistida (compresión abdominal), vigilar signos de hemoptisis.
- **B:** Crepitantes bilaterales + matidez en vértices (secuela TBC). FR 20 con esfuerzo mínimo. PaCO₂ 50 — hipercapnia crónica compensada. Aclaramiento adaptado a baja reserva: decúbito lateral, flutter en posición, sesiones cortas 10-15 min máximo para no fatigar.
- **C:** Cor pulmonale compensado (HTP leve, VD dilatado). FC 88. Sin edema activo. SpO₂ 90% con O₂ 2L — SpO₂ objetivo 88-92% (no más, riesgo hipercapnia). Ejercicio muy limitado — umbral de parada bajo.
- **D:** Resignación / baja autoeficacia: "ya nada va a mejorar". Vivir con enfermedad grave crónica desde los 30 años (TBC). La preparación para trasplante es una esperanza concreta — canalizarla. Intervención: objetivos funcionales realistas pre-trasplante (mantener capacidad, no empeorar), explicar que el estado físico en el momento del trasplante impacta directamente en el pronóstico post-trasplante.
- **E:** O₂ domiciliario 2L (aumentar a 4L durante ejercicio si SpO₂ <88%), colistina nebulizada (antibiótico en circuito cerrado — nunca en sala abierta, cabina de aislamiento), broncodilatadores, anticoagulación profiláctica (riesgo trombótico por HTP). Punto crítico: la colistina nebulizada requiere protocolo de aislamiento específico — el fisioterapeuta debe conocerlo.

### Simulador de ejercicio
5 fases: Aclaramiento corto adaptado → Movilización sentado → Marcha 50m con O₂ 4L → Conservación energía → Recuperación  
SpO₂ cae a 86% en marcha sin O₂ suplementario — visible en simulador como señal de alarma.

### Objetivo pedagógico
Aclaramiento con muy baja reserva funcional. Tos asistida. Técnicas de conservación de energía. SpO₂ objetivo en hipercapnia crónica (88-92%, no 95%). Colistina nebulizada — protocolo de aislamiento. Preparación física pre-trasplante como objetivo terapéutico motivador.

---

## Resumen de cambios técnicos

| Acción | Detalle |
|--------|---------|
| Insertar id:13 | EPOC Post-Exacerbación, sev:'mod' |
| Insertar id:14 | Bronquiectasias Post-infecciosas, sev:'mild' |
| Insertar id:15 | Bronquiectasias FQ Exacerbación, sev:'sev' |
| Insertar id:16 | Bronquiectasias Post-TBC Avanzadas, sev:'sev' |
| Actualizar badge | '13 Casos Integrados' → '17 Casos Integrados' |
| Casos existentes | id:0–12 sin modificación |

## Alcance excluido

- Sesión 3 (Asma, FQ completo, Hiperventilación): spec separado
- Módulos fuera de `casos_resp.html`: sin cambios
