/* ── Historial Longitudinal: Patient rehabilitation cases ── */

const PATIENTS = [
  {
    id:0, name:'Carlos M.', age:64, sex:'M', diag:'EPOC Severo (GOLD 3, Grupo B)',
    emoji:'👨‍🦳', color:'var(--orange)', badgeClass:'badge-orange',
    bg:'Tabaquismo 40 paquetes/año. Suspendió tabaco hace 2 años. Derivado por disnea MRC 3 y 2 exacerbaciones en el último año.',
    snapshots:[
      { // Basal
        label:'Basal', week:0, icon:'🔵',
        vitals:{spo2:91,fc:88,fr:22,tas:138,imc:23.1,borg:7},
        spiro:{fev1:42,fvc:68,ratio:52},
        smwt:238, bode:6, mrc:3, cat:24,
        gsa:{ph:7.38,pco2:46,hco3:26,pao2:62},
        notes:'Paciente con disnea de reposo leve. Tolerancia al ejercicio muy reducida. Inicia programa de rehabilitación pulmonar 3 sesiones/semana.',
        plan:'Entrenamiento de miembros inferiores en cicloergómetro al 60% de frecuencia cardíaca máxima. Entrenamiento muscular inspiratorio (EMI) al 30% de presión inspiratoria máxima. Técnica de aclaramiento con Flutter.',
      },
      { // Semana 4
        label:'Semana 4', week:4, icon:'🟡',
        vitals:{spo2:92,fc:84,fr:20,tas:135,imc:23.0,borg:6},
        spiro:{fev1:44,fvc:69,ratio:53},
        smwt:268, bode:5, mrc:3, cat:21,
        gsa:{ph:7.39,pco2:45,hco3:26,pao2:64},
        notes:'Mejora discreta en tolerancia. Refiere menos disnea en actividades del hogar. Distancia en test de marcha aumentó 30 m (= diferencia mínima clínicamente significativa).',
        decision:{
          q:'VEF₁ mejoró solo 2 puntos porcentuales (42%→44%). La distancia en el test de marcha aumentó 30 m. ¿Qué ajuste realizas al programa?',
          opts:[
            {txt:'Mantener la misma carga e intensidad — el cambio ya alcanzó la diferencia mínima clínicamente significativa', right:false, fb:'Aunque se alcanzó la diferencia mínima clínicamente significativa en el test de marcha, con VEF₁ estancado y MRC aún en 3, escalar la intensidad es la decisión correcta. Ese umbral es un mínimo, no un techo.'},
            {txt:'Escalar carga al 70-75% de frecuencia cardíaca máxima y aumentar entrenamiento muscular inspiratorio al 40% de presión inspiratoria máxima', right:true, fb:'✓ Correcto. La semana 4 es el momento de progresar la carga si la tolerancia lo permite. Incrementar al 70-75% de la frecuencia cardíaca máxima y 40% de la presión inspiratoria máxima es la progresión estándar basada en evidencia (Troosters et al. 2005).'},
            {txt:'Suspender el entrenamiento muscular inspiratorio — el paciente ya mejoró suficiente', right:false, fb:'El entrenamiento muscular inspiratorio solo se suspende si el paciente alcanza una presión inspiratoria máxima > 80% del predicho o desarrolla fatiga muscular excesiva. Ninguna de esas condiciones se cumple aquí.'},
            {txt:'Derivar a ventilación mecánica no invasiva nocturna — PaCO₂ de 45 mmHg indica hipercapnia', right:false, fb:'PaCO₂ de 45 mmHg está en el límite superior de la normalidad, no constituye hipercapnia. La ventilación no invasiva se considera con PaCO₂ > 55 mmHg o síntomas de hipoventilación nocturna.'},
          ]
        }
      },
      { // Semana 8
        label:'Semana 8', week:8, icon:'🟢',
        vitals:{spo2:93,fc:80,fr:19,tas:132,imc:23.2,borg:5},
        spiro:{fev1:46,fvc:71,ratio:54},
        smwt:298, bode:4, mrc:2, cat:18,
        gsa:{ph:7.40,pco2:44,hco3:25,pao2:67},
        notes:'Mejoría significativa. MRC descendió de 3 a 2. BODE bajó 2 puntos (beneficio pronóstico). Refiere retomar actividades sociales.',
        plan:'Continuar con cicloergómetro al 75% de frecuencia cardíaca máxima. Incorporar ejercicio de miembros superiores con pesas libres 0.5 kg. Revisar técnica inhalatoria.',
      },
      { // Semana 12
        label:'Semana 12', week:12, icon:'⭐',
        vitals:{spo2:94,fc:77,fr:18,tas:128,imc:23.5,borg:4},
        spiro:{fev1:48,fvc:72,ratio:55},
        smwt:325, bode:3, mrc:2, cat:15,
        gsa:{ph:7.41,pco2:43,hco3:25,pao2:70},
        notes:'Resultados excelentes. Test de marcha +87 m (3 veces la diferencia mínima significativa). Índice BODE redujo 3 puntos. Puntaje CAT pasó de impacto alto a moderado. Plan de mantenimiento domiciliario.',
        plan:'Alta de programa formal. Plan de mantenimiento: 30 min bicicleta estática diaria + grupo de caminata 2×/semana. Control en 3 meses.',
      }
    ]
  },
  {
    id:1, name:'Sofía R.', age:19, sex:'F', diag:'Fibrosis Quística — FEV₁ 52%',
    emoji:'👩', color:'var(--teal)', badgeClass:'badge-teal',
    bg:'Fibrosis quística diagnosticada a los 3 años. Mutación F508del homocigoto. Colonización por P. aeruginosa. Inicia rehabilitación pulmonar tras exacerbación tratada con antibióticos endovenosos.',
    snapshots:[
      {
        label:'Basal', week:0, icon:'🔵',
        vitals:{spo2:94,fc:92,fr:20,tas:112,imc:18.2,borg:6},
        spiro:{fev1:52,fvc:74,ratio:58},
        smwt:410, bode:null, mrc:2, cat:null,
        gsa:{ph:7.41,pco2:38,hco3:23,pao2:78},
        notes:'Post-exacerbación grave (14 días con antibióticos endovenosos). Capacidad funcional muy reducida para su edad. Inicio de rehabilitación pulmonar + aclaramiento bronquial 2 veces al día.',
        plan:'Ciclo activo de técnicas respiratorias (CATR) 2×/día + máscara de presión espiratoria positiva (PEP) durante nebulización. Caminata progresiva → cicloergómetro. Soporte nutricional.',
      },
      {
        label:'Semana 4', week:4, icon:'🟡',
        vitals:{spo2:95,fc:88,fr:19,tas:110,imc:18.5,borg:5},
        spiro:{fev1:56,fvc:77,ratio:60},
        smwt:445, bode:null, mrc:2, cat:null,
        gsa:{ph:7.42,pco2:37,hco3:23,pao2:81},
        notes:'VEF₁ +4 puntos porcentuales. Distancia 6MWT +35 m. Mejor adherencia a técnicas de aclaramiento. IMC mejoró.',
        decision:{
          q:'Sofía refiere que el ciclo activo de técnicas respiratorias le lleva 40 minutos y en días de cansancio lo omite. ¿Cómo adaptas el plan de aclaramiento?',
          opts:[
            {txt:'Mantener ciclo activo de técnicas respiratorias 2×/día — la adherencia mejorará con el tiempo', right:false, fb:'La no adherencia por carga de tiempo es la causa más frecuente de fracaso en el manejo de fibrosis quística. Insistir sin adaptar es ineficaz e ignora la preferencia del paciente.'},
            {txt:'Simplificar a 1 sesión diaria con Acapella — menos tiempo, misma eficacia', right:false, fb:'Reducir a 1 sesión no es recomendable en colonización activa. La Acapella puede ser una alternativa, pero la frecuencia debe mantenerse.'},
            {txt:'Combinar presión espiratoria positiva con oscilación (Acapella) y reducir tiempo por sesión a 20 min, mantener 2×/día', right:true, fb:'✓ Correcto. La Acapella/Flutter combinada con presión espiratoria positiva puede lograr el mismo aclaramiento en menor tiempo. Mantener 2 sesiones diarias es esencial en fibrosis quística con colonización. La preferencia del paciente es clave para la adherencia a largo plazo.'},
            {txt:'Derivar a fisioterapia hospitalaria — fibrosis quística con no adherencia siempre se maneja en hospital', right:false, fb:'La no adherencia en domicilio es común en fibrosis quística y no requiere hospitalización. Se maneja con educación, simplificación del régimen y negociación de metas con el paciente.'},
          ]
        }
      },
      {
        label:'Semana 8', week:8, icon:'🟢',
        vitals:{spo2:96,fc:85,fr:18,tas:108,imc:18.9,borg:4},
        spiro:{fev1:60,fvc:80,ratio:63},
        smwt:478, bode:null, mrc:1, cat:null,
        gsa:{ph:7.42,pco2:36,hco3:23,pao2:84},
        notes:'VEF₁ recuperó niveles pre-exacerbación. Excelente adherencia con nuevo protocolo. IMC en rango aceptable.',
        plan:'Mantener Acapella 2×/día. Aumentar intensidad cicloergómetro al 80% de frecuencia cardíaca máxima. Sesión de natación 1×/semana.',
      },
      {
        label:'Semana 12', week:12, icon:'⭐',
        vitals:{spo2:97,fc:82,fr:17,tas:106,imc:19.3,borg:3},
        spiro:{fev1:63,fvc:82,ratio:64},
        smwt:510, bode:null, mrc:1, cat:null,
        gsa:{ph:7.43,pco2:36,hco3:23,pao2:87},
        notes:'VEF₁ al mejor valor en 2 años. 6MWT +100 m. IMC normalizado. Tolerancia al ejercicio comparable a su predicho para la edad.',
        plan:'Plan de mantenimiento: Acapella 2×/día de por vida. Deporte adaptado (natación, ciclismo). Control cada 3 meses en unidad de FQ.',
      }
    ]
  },
  {
    id:2, name:'Roberto A.', age:71, sex:'M', diag:'EPOC Muy Severo + Post-COVID',
    emoji:'👨‍🦳', color:'var(--red)', badgeClass:'badge-red',
    bg:'EPOC GOLD 4, Grupo E. Oxigenoterapia crónica 2 L/min. COVID-19 grave hace 6 meses (20 días en unidad de cuidados intensivos). Inicia rehabilitación pulmonar domiciliaria por deambulación limitada.',
    snapshots:[
      {
        label:'Basal', week:0, icon:'🔵',
        vitals:{spo2:89,fc:96,fr:24,tas:145,imc:21.3,borg:8},
        spiro:{fev1:28,fvc:55,ratio:43},
        smwt:142, bode:8, mrc:4, cat:32,
        gsa:{ph:7.36,pco2:52,hco3:28,pao2:55},
        notes:'Paciente con gran compromiso funcional. Solo puede realizar rehabilitación pulmonar domiciliaria. Oxigenoterapia crónica domiciliaria (OCD) a 2 L/min. Pendiente de evaluación para ventilación mecánica no invasiva nocturna.',
        plan:'Rehabilitación pulmonar domiciliaria: caminata 5 min×3/día progresiva. Ejercicios sentado para miembros superiores. Técnicas de conservación de energía. Posición de alivio de disnea.',
      },
      {
        label:'Semana 4', week:4, icon:'🟡',
        vitals:{spo2:90,fc:92,fr:23,tas:142,imc:21.4,borg:7},
        spiro:{fev1:29,fvc:56,ratio:44},
        smwt:165, bode:7, mrc:4, cat:30,
        gsa:{ph:7.36,pco2:53,hco3:28,pao2:57},
        notes:'Mejora modesta pero significativa para su condición. 6MWT +23 m. PCO₂ levemente elevada. SpO₂ marginal en ejercicio.',
        decision:{
          q:'PCO₂ asciende a 53 mmHg. El paciente refiere cansancio matutino y cefalea al despertar. ¿Cuál es tu decisión prioritaria?',
          opts:[
            {txt:'Aumentar flujo de O₂ a 3 L/min — la SpO₂ está baja', right:false, fb:'Aumentar O₂ sin abordar la hipercapnia puede empeorarla en EPOC (efecto Haldane + pérdida del drive hipóxico). No es la decisión prioritaria aquí.'},
            {txt:'Derivar urgente a neumología para evaluación de ventilación mecánica no invasiva nocturna', right:true, fb:'✓ Correcto. PaCO₂ > 52 mmHg + síntomas de hipoventilación nocturna (cefalea, cansancio matutino) = indicación de evaluación para ventilación no invasiva. Es urgente y debe hacerse en paralelo con la rehabilitación pulmonar. GOLD 2024 lo contempla como indicación formal.'},
            {txt:'Suspender la rehabilitación pulmonar — el paciente está inestable', right:false, fb:'La rehabilitación pulmonar no se suspende por hipercapnia crónica estable. Se adapta la intensidad. Solo se suspende en exacerbación aguda activa con requerimiento de hospitalización.'},
            {txt:'Iniciar VMNI domiciliaria sin evaluación especializada', right:false, fb:'La VMNI requiere evaluación especializada en neumología o unidad de cuidados intensivos para titulación de parámetros (presión inspiratoria, presión espiratoria, frecuencia). No debe iniciarse sin supervisión adecuada.'},
          ]
        }
      },
      {
        label:'Semana 8', week:8, icon:'🟢',
        vitals:{spo2:91,fc:88,fr:21,tas:138,imc:21.6,borg:6},
        spiro:{fev1:30,fvc:57,ratio:44},
        smwt:193, bode:7, mrc:3, cat:27,
        gsa:{ph:7.37,pco2:50,hco3:28,pao2:59},
        notes:'Inició ventilación mecánica no invasiva nocturna (BiPAP 14/6 cmH₂O). PaCO₂ descendió. MRC bajó de 4 a 3 — puede salir de casa acompañado. Gran mejora en calidad de vida.',
        plan:'Continuar rehabilitación pulmonar domiciliaria. VMNI nocturna. Añadir bicicleta estática 10 min×2/día. Escala de Borg guía la intensidad.',
      },
      {
        label:'Semana 12', week:12, icon:'⭐',
        vitals:{spo2:92,fc:84,fr:20,tas:135,imc:21.9,borg:5},
        spiro:{fev1:31,fvc:58,ratio:45},
        smwt:221, bode:6, mrc:3, cat:23,
        gsa:{ph:7.38,pco2:48,hco3:27,pao2:62},
        notes:'Test de marcha +79 m. Índice BODE redujo 2 puntos. Puntaje CAT: impacto alto (↓ desde muy alto). PaCO₂ controlada con ventilación no invasiva. Continúa rehabilitación pulmonar domiciliaria como mantenimiento.',
        plan:'Seguimiento mensual. VMNI toda la noche. Evaluar candidato a trasplante pulmonar según criterios de selección. Oxigenoterapia crónica domiciliaria 2 L/min mantenida.',
      }
    ]
  },
  {
    id:3, name:'Ana L.', age:35, sex:'F', diag:'COVID Persistente — Síndrome Post-UCI',
    emoji:'👩‍⚕️', color:'var(--blue)', badgeClass:'badge-blue',
    bg:'Unidad de cuidados intensivos 18 días por neumonía COVID bilateral grave. Extubada hace 3 meses. Presenta disnea persistente, fatiga severa y deterioro cognitivo leve. Sin enfermedad pulmonar previa.',
    snapshots:[
      {
        label:'Basal', week:0, icon:'🔵',
        vitals:{spo2:95,fc:100,fr:22,tas:128,imc:22.8,borg:6},
        spiro:{fev1:68,fvc:72,ratio:80},
        smwt:320, bode:null, mrc:2, cat:null,
        gsa:{ph:7.42,pco2:36,hco3:23,pao2:76},
        notes:'Patrón espirométrico en límite (CVF baja para edad). Fatiga severa. Sin desaturación en reposo pero sí en ejercicio (SpO₂ 88-90%). Inicia rehabilitación pulmonar adaptada.',
        plan:'Rehabilitación pulmonar muy progresiva. Ejercicio aeróbico de baja intensidad (50-60% de frecuencia cardíaca máxima). Vigilancia estricta de malestar post-esfuerzo. Fisioterapia neurológica concurrente.',
      },
      {
        label:'Semana 4', week:4, icon:'🟡',
        vitals:{spo2:95,fc:96,fr:21,tas:124,imc:23.0,borg:5},
        spiro:{fev1:71,fvc:75,ratio:81},
        smwt:352, bode:null, mrc:2, cat:null,
        gsa:{ph:7.42,pco2:36,hco3:23,pao2:78},
        notes:'Mejora en tolerancia. No refiere malestar post-esfuerzo con la carga actual. Persistencia de fatiga cognitiva. SpO₂ en ejercicio mejoró a 92%.',
        decision:{
          q:'Ana tolera bien el programa. No hay malestar post-esfuerzo. ¿Aumentas la intensidad o mantienes para observar más semanas?',
          opts:[
            {txt:'Aumentar al 70-75% de frecuencia cardíaca máxima — la toleró bien y no hay malestar post-esfuerzo', right:true, fb:'✓ Correcto. La ausencia de malestar post-esfuerzo tras 4 semanas es la señal clave para progresar en COVID persistente. Las guías NICE 2021 recomiendan progresar gradualmente solo cuando no hay empeoramiento tras el esfuerzo. El 70-75% de la frecuencia cardíaca máxima es el siguiente escalón apropiado.'},
            {txt:'Mantener 4 semanas más al 50-60% — COVID persistente requiere más observación', right:false, fb:'Si no hay malestar post-esfuerzo, prolongar en el mismo escalón es excesivamente conservador. Las guías actuales recomiendan progresar cuando hay buena tolerancia, no esperar tiempos fijos.'},
            {txt:'Pasar directamente a entrenamiento de alta intensidad (>85% de frecuencia cardíaca máxima)', right:false, fb:'El salto a alta intensidad sin escalonar es contraproducente en post-COVID. Puede desencadenar malestar post-esfuerzo incluso en pacientes que no lo mostraron antes. La progresión debe ser gradual.'},
            {txt:'Suspender y referir a psicología — la fatiga cognitiva domina el cuadro', right:false, fb:'La fatiga cognitiva en post-COVID se maneja de forma concurrente con la rehabilitación pulmonar, no en lugar de ella. La remisión a psicología es un complemento, no un sustituto de la rehabilitación física.'},
          ]
        }
      },
      {
        label:'Semana 8', week:8, icon:'🟢',
        vitals:{spo2:96,fc:90,fr:19,tas:120,imc:23.2,borg:4},
        spiro:{fev1:75,fvc:79,ratio:82},
        smwt:390, bode:null, mrc:1, cat:null,
        gsa:{ph:7.43,pco2:35,hco3:23,pao2:82},
        notes:'FVC casi normalizada. 6MWT +70 m. MRC bajó a 1. La fatiga cognitiva ha mejorado significativamente. SpO₂ en ejercicio 95%.',
        plan:'Incorporar entrenamiento de fuerza funcional. Actividad aeróbica 40 min×5/días. Plan de retorno progresivo al trabajo.',
      },
      {
        label:'Semana 12', week:12, icon:'⭐',
        vitals:{spo2:97,fc:82,fr:17,tas:116,imc:23.4,borg:2},
        spiro:{fev1:80,fvc:84,ratio:83},
        smwt:440, bode:null, mrc:0, cat:null,
        gsa:{ph:7.43,pco2:35,hco3:23,pao2:87},
        notes:'Recuperación casi completa. CVF y VEF₁ normales. Test de marcha +120 m. MRC 0. Retornó al trabajo parcial. Caso de éxito de rehabilitación pulmonar post-COVID.',
        plan:'Alta de rehabilitación pulmonar formal. Plan de actividad física autónoma. Control en 6 meses en consulta de post-COVID. Seguimiento psicológico mensual.',
      }
    ]
  }
];
