/* ── 6MWT: Patient profiles & interpretation cases ── */

const PATIENTS = [
  {
    id:0, name:'EPOC Severo', age:65, sex:'m', weight:72, height:168,
    sev:'sev', sevLabel:'Severo', dx:'EPOC estadio III-IV · FEV₁ 28%',
    basal:{spo2:92, fc:88, fr:22, borg:3, pas:135},
    fcMax:155,
    spiro:{fev1:28, fvc:80},
    // Time-series: values at each 30s interval (0..12 = 0s..360s)
    profile:{
      spo2:[92,91,90,90,89,88,88,87,87,86,86,87,87],
      fc:  [88,95,100,104,108,110,112,113,114,115,115,114,113],
      borg:[3,3,4,4,5,5,6,6,6,7,7,7,7],
      fr:  [22,24,25,26,27,28,29,29,30,31,31,30,30],
    },
    // Recovery (1min, 2min, 3min)
    recovery:{spo2:[87,89,91],fc:[105,96,90],borg:[5,3,2]},
    // Speed profile (m/min at each interval)
    speed:[0,48,50,50,48,46,44,42,42,40,38,38,38],
    stopEvent: null, // or {at:10, reason:'SpO₂ < 85%'}
    clinNotes:'Desaturación significativa (≥4%). Hipoxemia de esfuerzo moderada. Considerar O₂ ambulatorio si SpO₂ <88% sostenida. FC dentro de rango seguro.',
    rehabRec:'Programa de RP 2x/semana. Cicloergómetro a 50-60% FC reserva con monitorización SpO₂ continua. O₂ suplementario si SpO₂ <88% durante ejercicio. PLB post-esfuerzo.',
  },
  {
    id:1, name:'FQ moderada', age:22, sex:'f', weight:52, height:160,
    sev:'mod', sevLabel:'Moderado', dx:'Fibrosis Quística · FEV₁ 52%',
    basal:{spo2:94, fc:78, fr:18, borg:2, pas:110},
    fcMax:198,
    spiro:{fev1:52, fvc:70},
    profile:{
      spo2:[94,93,92,92,91,90,90,89,89,88,88,88,89],
      fc:  [78,98,112,120,128,132,135,136,138,140,141,140,138],
      borg:[2,3,4,4,5,5,6,6,6,7,7,7,7],
      fr:  [18,20,22,24,25,26,26,28,28,30,30,29,29],
    },
    recovery:{spo2:[89,91,93],fc:[128,112,96],borg:[6,4,2]},
    speed:[0,65,68,70,70,68,66,64,62,60,58,58,58],
    stopEvent:null,
    clinNotes:'Desaturación de esfuerzo (94→88%). FC alcanza umbral alto. Respuesta cronotrópica adecuada. Limitante principal: intercambio gaseoso.',
    rehabRec:'Ejercicio aeróbico de alta intensidad con monitorización continua. Aclaramiento bronquial pre-ejercicio. Entrenamiento intervalado (HIIT) bien tolerado en FQ. Técnicas post-test.',
  },
  {
    id:2, name:'Post-trasplante cardíaco', age:55, sex:'m', weight:80, height:175,
    sev:'mod', sevLabel:'Moderado', dx:'Trasplante cardíaco 8 meses · Inmunosupresión',
    basal:{spo2:97, fc:75, fr:16, borg:2, pas:118},
    fcMax:130, // Corazón trasplantado: denervado, FCmáx reducida
    spiro:{fev1:85, fvc:88},
    profile:{
      spo2:[97,97,96,96,96,95,95,95,94,94,94,94,95],
      fc:  [75,85,90,95,98,100,102,104,105,106,107,107,106],
      borg:[2,3,4,4,5,5,5,6,6,6,7,7,6],
      fr:  [16,18,20,21,22,22,23,24,24,25,25,24,24],
    },
    recovery:{spo2:[95,96,97],fc:[105,103,98],borg:[5,4,3]},
    speed:[0,60,65,68,70,70,68,66,65,64,62,62,62],
    stopEvent:null,
    clinNotes:'IMPORTANTE: Corazón denervado → respuesta cronotrópica lenta y limitada (~130 lpm máx). La FC NO es un indicador fiable de intensidad post-trasplante. Usar Borg como guía principal. SpO₂ conservada.',
    rehabRec:'PR con Borg 4-6 como guía principal (no FC%). Vigilar respuesta inmune a esfuerzo. Programa 3x/semana supervisado. Evitar ejercicio en ayunas (inmunosupresores).',
  },
  {
    id:3, name:'Asma ejercicio-inducida', age:28, sex:'f', weight:62, height:163,
    sev:'mild', sevLabel:'Leve', dx:'Asma alérgica persistente moderada',
    basal:{spo2:97, fc:76, fr:18, borg:2, pas:112},
    fcMax:192,
    spiro:{fev1:75, fvc:92},
    profile:{
      spo2:[97,96,96,95,94,93,92,91,90,89,88,87,87],
      fc:  [76,100,115,125,132,136,138,140,142,145,146,147,146],
      borg:[2,3,4,5,5,6,6,7,7,8,8,8,8],
      fr:  [18,20,22,24,25,26,26,27,28,29,30,31,31],
    },
    recovery:{spo2:[87,90,93],fc:[138,118,96],borg:[7,5,3]},
    speed:[0,75,78,80,80,78,75,72,70,68,65,62,60],
    stopEvent:{at:11, reason:'Borg 8 + sibilancias audibles'}, // stops at interval 11
    clinNotes:'Broncoespasmo inducido por ejercicio (BIE). SpO₂ cae progresivamente. Borg alcanza 8. Test interrumpido por BIE. Considerar pre-medicación con salbutamol 15 min antes en futuros tests.',
    rehabRec:'Pre-medicación con SABA 15 min pre-ejercicio. Calentamiento gradual 10 min (reduce BIE en 50%). Entrenamiento en ambiente controlado. Programa acondicionamiento físico reduce BIE a largo plazo.',
  },
  {
    id:4, name:'Sano — referencia', age:45, sex:'m', weight:75, height:175,
    sev:'mild', sevLabel:'Normal', dx:'Adulto sano — línea de referencia',
    basal:{spo2:98, fc:68, fr:14, borg:0, pas:118},
    fcMax:175,
    spiro:{fev1:100, fvc:100},
    profile:{
      spo2:[98,98,97,97,97,97,96,96,96,96,96,96,97],
      fc:  [68,90,105,112,118,122,125,127,128,129,130,130,128],
      borg:[0,2,3,3,4,4,5,5,5,5,5,5,4],
      fr:  [14,16,18,20,20,21,22,22,22,23,23,22,22],
    },
    recovery:{spo2:[97,97,98],fc:[118,100,80],borg:[4,2,1]},
    speed:[0,90,95,98,100,100,100,98,97,96,96,96,96],
    stopEvent:null,
    clinNotes:'Sin desaturación, FC bien controlada, respuesta aeróbica normal. Sirve como referencia para comparar con casos patológicos.',
    rehabRec:'No requiere rehabilitación. Mantener actividad física regular ≥150 min/semana de intensidad moderada según OMS.',
  },
];

const INTERP_CASES = [
  {
    name:'EPOC estadio III post-exacerbación',
    data:{dist:285, pred:480, lln:327, spo2_basal:92, spo2_min:83, spo2_recov3:90,
          fc_basal:88, fc_peak:122, borg_basal:2, borg_end:8, parada:'SpO₂ 83% en minuto 4'},
    questions:[
      {q:'¿Cuánto representa la distancia obtenida (285m) del predicho (480m)?',
       opts:['59% del predicho → limitación severa (<60%)','85% del predicho → normal','70% del predicho → leve','Supera el LLN (327m) → no hay limitación real'],
       correct:0, exp:'285/480 = 59% → Limitación SEVERA (<60%). Además, 285m < LLN (327m) → por debajo del límite inferior de normalidad. Doble criterio de severidad.'},
      {q:'SpO₂ basal 92% → mínima 83%. ¿Cómo clasificas la desaturación?',
       opts:['Significativa (≥4% de caída) + hipoxemia severa de esfuerzo (SpO₂<85%). Indica O₂ ambulatorio','Leve — solo 9 puntos de caída','No es criterio de parada hasta SpO₂ <80%','Normal para EPOC III'],
       correct:0, exp:'Caída de 9 puntos (>4%) = SIGNIFICATIVA. SpO₂ 83% = hipoxemia severa de esfuerzo → criterio de parada. Esta paciente requiere evaluación para O₂ ambulatorio (objetivo: mantener SpO₂ ≥90% durante esfuerzo).'},
      {q:'FC basal 88 → pico 122 (edad 70 años, FCmáx estimada 150). ¿Interpretación?',
       opts:['Respuesta cronotrópica adecuada (+34 lpm, 56% reserva usada). No hay limitación cardíaca primaria evidente','Respuesta inadecuada — FC muy baja para EPOC','Cronoinsuficiencia: FC no sube suficiente para EPOC','FC pico 122 = arritmia'],
       correct:0, exp:'Reserva FC = FCmáx - FCreposo = 150-88=62. Usó 34/62 = 55% → respuesta cronotrópica adecuada. El limitante en EPOC III generalmente es ventilatorio/gasométrico (SpO₂), no cardíaco. Si la FC hubiera llegado al máximo antes de parar, sugeriría limitación cardíaca concurrente.'},
    ]
  },
  {
    name:'Hipertensión pulmonar idiopática (HTP)',
    data:{dist:330, pred:510, lln:371, spo2_basal:94, spo2_min:88, spo2_recov3:92,
          fc_basal:82, fc_peak:138, borg_basal:2, borg_end:7, parada:null},
    questions:[
      {q:'Distancia 330m, predicho 510m. ¿% del predicho y clasificación?',
       opts:['65% → limitación moderada. LLN 371m → por debajo del LLN','65% → leve','85% → normal','330m es buena distancia para HTP — no hay limitación'],
       correct:0, exp:'330/510 = 65% = limitación moderada. 330 < LLN 371 = por debajo del normal. En HTP, la distancia del 6MWT es predictor independiente de mortalidad: <300m = alta mortalidad, 300-400m = moderada. DMCS en HTP = 33m.'},
      {q:'SpO₂ 94→88% durante el test. ¿Qué indica en HTP?',
       opts:['Desaturación significativa por hipertensión capilar pulmonar y shunt derecho-izquierdo. Implica O₂ de esfuerzo','Normal — 88% es aceptable en cualquier contexto','Solo importante si cae a <80%','Indica broncoespasmo concurrente'],
       correct:0, exp:'En HTP, la desaturación de esfuerzo refleja: shunt derecho-izquierdo por foramen oval permeable (HTP severa), desequilibrio V/Q, y aumento del espacio muerto. SpO₂ 88% de esfuerzo en HTP es criterio para O₂ ambulatorio y factor de mal pronóstico independiente.'},
      {q:'DMCS en HTP es 33m. Si después de 6 meses de tratamiento el paciente hace 363m, ¿es clínicamente relevante?',
       opts:['Sí: 363-330=33m = exactamente DMCS → mejoría clínicamente significativa','No: solo 33m más es mínimo','No: debe superar el LLN para ser relevante','Sí: cualquier mejoría es siempre relevante'],
       correct:0, exp:'33m de mejora = DMCS exacta en HTP → SÍ clínicamente relevante. El paciente además pasaría de 330m a 363m, acercándose más al LLN. El concepto de DMCS es fundamental: no basta con mejorar estadísticamente, la diferencia debe ser percibida y clínicamente importante para el paciente.'},
    ]
  },
];
