// ════════════════════════════════════════════════════════════════════════════
// FISIOPATOLOGÍA RESPIRATORIA — Motor paramétrico
// Parámetros fisiológicos base (valores normales de referencia):
//   Raw  = 2.0 cmH₂O/L/s  — Resistencia de la vía aérea
//   CL   = 0.20 L/cmH₂O   — Compliance pulmonar
//   CW   = 0.20 L/cmH₂O   — Compliance de la pared torácica
//   Pmax = 80  cmH₂O       — Presión inspiratoria máxima
//   FRC  = 1.0 (relativo)  — Capacidad residual funcional
// ════════════════════════════════════════════════════════════════════════════

const PHYS_NORMAL = { Raw:2.0, CL:0.20, CW:0.20, Pmax:80, FRC:1.0 };

// ── Motor físico ─────────────────────────────────────────────────────────────
// Calcula parámetros de animación SVG a partir del estado fisiológico.
// Las vitales del panel usan baseVitals + deltas de técnicas (no esta función).
function calcPhysFromParams(p) {
  const { Raw, CL, CW, Pmax, FRC } = p;
  // Volumen tidal (L)
  const vtC = Math.min(0.60, CL * 2.8);
  const vtS = Math.min(1.0, Pmax / 80);
  const vtW = Math.min(1.0, CW / 0.20);
  const vtR = Raw > 4 ? Math.max(0.5, 1 - (Raw - 4) * 0.035) : 1.0;
  const VT  = Math.max(0.15, Math.min(0.68, vtC * vtS * vtW * vtR));
  // Frecuencia respiratoria
  const rrBase = 14 * (0.50 / Math.max(VT, 0.15));
  const rrRaw  = Raw > 3 ? (Raw - 3) * 1.2 : 0;
  const rrPmax = Pmax < 50 ? (50 - Pmax) * 0.12 : 0;
  const RR = Math.round(Math.max(12, Math.min(40, rrBase + rrRaw + rrPmax)));
  // Amplitudes de animación SVG (0–1)
  const lungAmpl  = Math.min(1.0, VT / 0.50);
  const ribAmpl   = Math.min(1.0, CW / 0.20);
  const diagAmpl  = Math.min(1.0, Pmax / 80);
  const isParadox = Pmax < 28;
  // Fracción inspiratoria (1:E ratio)
  const inspFrac = Raw > 4.5 ? 0.24 : Raw > 3.0 ? 0.28 : CL < 0.15 ? 0.34 : 0.33;
  const period = 60 / RR;
  return { VT, RR, inspFrac, lungAmpl, ribAmpl, diagAmpl, isParadox, period };
}

// ════════════════════════════════════════════════════════════════════════════
// ENFERMEDADES — 11 patologías organizadas por mecanismo fisiopatológico
// ════════════════════════════════════════════════════════════════════════════
const FISIO_DISEASES = {

  // ── OBSTRUCTIVAS — Pequeña vía aérea ────────────────────────────────────
  epoc: {
    id:'epoc', name:'EPOC / Enfisema', group:'obstructive',
    color:'#fb923c', icon:'💨',
    patient:{name:'Carlos M.', age:68, sex:'M', dx:'EPOC GOLD II / Enfisema'},
    clinical:'Fumador 40 paq/año. Disnea MRC 3. Sibilancias espiratorias. Tórax en tonel. Espiración prolongada. Usa musculatura accesoria.',
    physiopath:'Destrucción alveolar → CL aumentada + FRC elevada. Air-trapping por colapso dinámico espiratorio. Resistencia aumentada por pérdida de soporte radial. Diafragma aplanado.',
    params:{ Raw:4.5, CL:0.35, CW:0.20, Pmax:60, FRC:1.4 },
    baseVitals:{ spo2:91, hr:98, rr:22, bp:'138/88', paco2:48 },
    visual:{ chestShape:'barrel', secretions:1, bronchospasm:1, airTrap:true, pleural:null },
    techniques:{
      plb:{paramDeltas:{Raw:-0.4,FRC:-0.06},vitalDeltas:{spo2:+2,hr:-4,rr:-4,paco2:-3},label:'Primera línea',cls:'best',explanation:'Aumenta PEEP fisiológica previniendo colapso dinámico espiratorio. Prolonga espiración y mejora V/Q. Técnica de primera elección en EPOC.'},
      diaphragmatic:{paramDeltas:{Pmax:+8},vitalDeltas:{spo2:+1,hr:-2,rr:-2,paco2:-2},label:'Beneficioso',cls:'good',explanation:'Mejora eficiencia ventilatoria reduciendo uso de musculatura accesoria. Útil en EPOC con diafragma aplanado por hiperinsuflación.'},
      postural:{paramDeltas:{Raw:-0.6,sec:-1},vitalDeltas:{spo2:+1,hr:0,rr:0,paco2:0},label:'Beneficioso',cls:'good',explanation:'Utiliza gravedad para movilizar secreciones de vías periféricas hacia bronquios centrales donde pueden eliminarse.'},
      acbt:{paramDeltas:{Raw:-0.5,CL:+0.01,sec:-1},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-1},label:'Óptimo',cls:'best',explanation:'ACBT es el estándar de oro en EPOC: control respiratorio → expansión torácica → FET. Eficaz sin provocar colapso de vía aérea.'},
      fet:{paramDeltas:{Raw:-0.2,sec:-0.5},vitalDeltas:{spo2:+1,hr:+2,rr:0,paco2:0},label:'Con precaución',cls:'warn',explanation:'Espiración forzada puede causar colapso dinámico en EPOC severo. Usar desde volumen medio, boca entreabierta.'},
      flutter:{paramDeltas:{Raw:-0.6,sec:-2},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-1},label:'Beneficioso',cls:'good',explanation:'Oscilaciones de presión mejoran clearance mucociliar. Muy eficaz combinado con PLB en EPOC.'},
      incentive:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'Poco útil',cls:'neutral',explanation:'Escasa evidencia en patología obstructiva. Puede aumentar trabajo inspiratorio. Reservar para restrictivos.'},
      nebulization:{paramDeltas:{Raw:-1.5,bronch:-1},vitalDeltas:{spo2:+2,hr:+3,rr:-2,paco2:-2},label:'Primera línea',cls:'best',explanation:'Broncodilatador β2 reduce obstrucción reversible. Leve taquicardia esperada. Fundamental antes de técnicas de clearance.'},
      vni:{paramDeltas:{Pmax:+22,FRC:+0.05},vitalDeltas:{spo2:+3,hr:-3,rr:-3,paco2:-5},label:'En exacerbación',cls:'good',explanation:'BiPAP reduce trabajo respiratorio, mejora ventilación alveolar y corrige hipercapnia. Indicado en exacerbación con acidosis respiratoria.'},
      movilizacion:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'La movilización torácica no aborda el mecanismo principal en EPOC (obstrucción + hiperinsuflación). No es técnica de primera línea.'},
    }
  },

  asma:{
    id:'asma', name:'Asma Aguda', group:'obstructive',
    color:'#f59e0b', icon:'🌬️',
    patient:{name:'Laura S.', age:34, sex:'F', dx:'Asma bronquial — crisis moderada'},
    clinical:'Crisis desencadenada por alérgeno. Disnea de reposo. Sibilancias bilaterales. Uso de musculatura accesoria. Habla entrecortada.',
    physiopath:'Broncoespasmo difuso + edema mucosa + hipersecreción → Raw muy aumentada. Obstrucción reversible severa aguda. Auto-PEEP por atrapamiento. Riesgo de broncoespasmo paradójico con maniobras espiratorias forzadas.',
    params:{ Raw:8.0, CL:0.22, CW:0.20, Pmax:75, FRC:1.2 },
    baseVitals:{ spo2:89, hr:115, rr:26, bp:'142/92', paco2:32 },
    visual:{ chestShape:'normal', secretions:1, bronchospasm:3, airTrap:true, pleural:null },
    techniques:{
      plb:{paramDeltas:{Raw:-0.5,FRC:-0.05},vitalDeltas:{spo2:+2,hr:-5,rr:-4,paco2:+2},label:'Beneficioso',cls:'good',explanation:'Reduce taquipnea de pánico y mejora patrón ventilatorio. Reduce broncoespasmo reflejo asociado a hiperventilación.'},
      diaphragmatic:{paramDeltas:{Pmax:+5},vitalDeltas:{spo2:+1,hr:-4,rr:-3,paco2:+1},label:'Beneficioso',cls:'good',explanation:'Reduce ansiedad y componente de hiperventilación. Disminuye activación simpática que perpetúa el broncoespasmo.'},
      postural:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'Neutro',cls:'neutral',explanation:'Las secreciones no son el problema principal en asma aguda. El drenaje postural no aborda el broncoespasmo y puede aumentar incomodidad.'},
      acbt:{paramDeltas:{Raw:+0.5},vitalDeltas:{spo2:-1,hr:+3,rr:+2,paco2:-1},label:'Contraindicado agudo',cls:'bad',explanation:'La expansión activa y FET en crisis aguda puede desencadenar más broncoespasmo por estímulo de receptores irritantes.'},
      fet:{paramDeltas:{Raw:+1.0,bronch:+0.5},vitalDeltas:{spo2:-2,hr:+4,rr:+2,paco2:-2},label:'Contraindicado',cls:'bad',explanation:'Espiración forzada en asma aguda es el clásico desencadenante de broncoespasmo paradójico. Formalmente contraindicada.'},
      flutter:{paramDeltas:{Raw:+0.5,bronch:+0.5},vitalDeltas:{spo2:-1,hr:+2,rr:+1,paco2:-1},label:'Contraindicado agudo',cls:'bad',explanation:'Oscilaciones de presión pueden desencadenar broncoespasmo reflejo en vías aéreas hiperreactivas durante la crisis.'},
      incentive:{paramDeltas:{Raw:+0.5},vitalDeltas:{spo2:-1,hr:+2,rr:+1,paco2:-1},label:'Contraindicado',cls:'bad',explanation:'Requiere esfuerzo inspiratorio máximo que provoca irritación bronquial. Contraindicada en crisis aguda.'},
      nebulization:{paramDeltas:{Raw:-4.0,bronch:-2.5},vitalDeltas:{spo2:+4,hr:+8,rr:-4,paco2:+3},label:'Primera línea urgente',cls:'best',explanation:'Salbutamol nebulizado es el tratamiento de primera línea. Revierte broncoespasmo en 5-15 min. Taquicardia esperada por efecto β2.'},
      vni:{paramDeltas:{Pmax:+22,FRC:+0.05},vitalDeltas:{spo2:+3,hr:-4,rr:-4,paco2:+4},label:'Si no responde',cls:'good',explanation:'CPAP/BiPAP de rescate si no responde a broncodilatadores. Reduce trabajo respiratorio mientras actúa el tratamiento.'},
      movilizacion:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'La movilización torácica no tiene papel en asma aguda. El mecanismo es broncoespasmo, no restricción de la caja torácica.'},
    }
  },

  bronquitis:{
    id:'bronquitis', name:'Bronquitis Crónica', group:'obstructive',
    color:'#f97316', icon:'🫁',
    patient:{name:'Jorge V.', age:58, sex:'M', dx:'Bronquitis crónica — EPOC fenotipo bronquítico'},
    clinical:'Tos productiva matutina >3 meses/año por >2 años. Esputo mucoso-purulento. Roncus y sibilancias difusas. "Blue bloater" con hipoxemia y policitemia.',
    physiopath:'Hipertrofia glandular mucosa + hipersecreción crónica. Inflamación bronquial aumenta Raw. Acúmulo de secreciones agrava obstrucción. FRC elevada pero menos que en enfisema puro.',
    params:{ Raw:5.5, CL:0.25, CW:0.20, Pmax:65, FRC:1.2 },
    baseVitals:{ spo2:90, hr:105, rr:24, bp:'145/90', paco2:50 },
    visual:{ chestShape:'normal', secretions:3, bronchospasm:1, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{Raw:-0.3,FRC:-0.04},vitalDeltas:{spo2:+1,hr:-3,rr:-3,paco2:-2},label:'Beneficioso',cls:'good',explanation:'Reduce trabajo ventilatorio y mejora patrón espiratorio. Complemento útil a las técnicas de clearance.'},
      diaphragmatic:{paramDeltas:{Pmax:+6},vitalDeltas:{spo2:+1,hr:-2,rr:-2,paco2:-1},label:'Beneficioso',cls:'good',explanation:'Mejora eficiencia ventilatoria y reduce uso de musculatura accesoria. Fase de control respiratorio en ACBT.'},
      postural:{paramDeltas:{Raw:-0.8,sec:-2},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-2},label:'Primera línea',cls:'best',explanation:'Drenaje postural + vibración/percusión es pilar del tratamiento. Moviliza secreciones viscosas hacia bronquios centrales.'},
      acbt:{paramDeltas:{Raw:-0.7,CL:+0.01,sec:-2},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-2},label:'Primera línea',cls:'best',explanation:'ACBT combina control ventilatorio + expansión + FET. Técnica más completa y de mayor evidencia en bronquitis crónica.'},
      fet:{paramDeltas:{Raw:-0.5,sec:-1.5},vitalDeltas:{spo2:+2,hr:+1,rr:0,paco2:-1},label:'Primera línea',cls:'best',explanation:'FET/Huff moviliza secreciones desde periférico a central. Espiración desde volumen medio-alto para evitar colapso.'},
      flutter:{paramDeltas:{Raw:-0.8,sec:-2.5},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-2},label:'Óptimo',cls:'best',explanation:'Dispositivo de oscilación ideal para bronquitis crónica: fluidifica secreciones + previene colapso bronquial.'},
      incentive:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'Complementario',cls:'neutral',explanation:'Útil para mantener volúmenes entre sesiones. No es técnica principal en bronquitis; el clearance es la prioridad.'},
      nebulization:{paramDeltas:{Raw:-1.2,bronch:-0.8,sec:-0.8},vitalDeltas:{spo2:+2,hr:+2,rr:-2,paco2:-2},label:'Beneficioso',cls:'good',explanation:'Broncodilatador reduce obstrucción reversible. Suero fisiológico fluidifica secreciones antes del clearance. Usar antes de ACBT.'},
      vni:{paramDeltas:{Pmax:+20,FRC:+0.04},vitalDeltas:{spo2:+3,hr:-3,rr:-3,paco2:-5},label:'En exacerbación',cls:'good',explanation:'BiPAP indicada en exacerbación con hipercapnia y acidosis. Reduce trabajo respiratorio y mejora ventilación alveolar.'},
      movilizacion:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'En bronquitis el problema es la hipersecreción y obstrucción, no la rigidez de la caja torácica. Movilización no es la prioridad.'},
    }
  },

  bronquiectasias:{
    id:'bronquiectasias', name:'Bronquiectasias', group:'obstructive',
    color:'#22d3ee', icon:'🌀',
    patient:{name:'Pedro A.', age:52, sex:'M', dx:'Bronquiectasias difusas bilaterales'},
    clinical:'Tos crónica con 80 ml/día de esputo purulento. Disnea de esfuerzo. Acropaquias. Crepitantes basales bilaterales. Imagen "riel de tranvía" en Rx.',
    physiopath:'Destrucción de pared bronquial → dilatación permanente + estasis mucociliar. Ciclo inflamación-infección por acúmulo de secreciones. Raw aumentada por tapones mucosos.',
    params:{ Raw:4.0, CL:0.20, CW:0.20, Pmax:75, FRC:1.0 },
    baseVitals:{ spo2:93, hr:92, rr:20, bp:'128/78', paco2:44 },
    visual:{ chestShape:'normal', secretions:3, bronchospasm:0, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{Raw:-0.2},vitalDeltas:{spo2:+1,hr:-1,rr:-1,paco2:0},label:'Beneficioso',cls:'good',explanation:'Útil para manejo sintomático de disnea entre sesiones de clearance. No aborda el problema principal de hipersecreción.'},
      diaphragmatic:{paramDeltas:{Pmax:+5},vitalDeltas:{spo2:+1,hr:-1,rr:-1,paco2:0},label:'Beneficioso',cls:'good',explanation:'Mejora eficiencia ventilatoria. Usada como fase de control respiratorio antes de las técnicas de clearance.'},
      postural:{paramDeltas:{Raw:-1.0,sec:-2},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-1},label:'Primera línea',cls:'best',explanation:'Drenaje postural segmentario con percusión/vibración es el pilar del tratamiento. Tratar cada segmento según distribución de bronquiectasias.'},
      acbt:{paramDeltas:{Raw:-0.8,sec:-2},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-1},label:'Primera línea',cls:'best',explanation:'ACBT tiene mayor evidencia en bronquiectasias. Puede realizarse autónomamente y es tan eficaz como el drenaje postural asistido.'},
      fet:{paramDeltas:{Raw:-0.6,sec:-2},vitalDeltas:{spo2:+2,hr:+1,rr:0,paco2:-1},label:'Primera línea',cls:'best',explanation:'FET/Huff moviliza secreciones de vías medias a centrales. Componente esencial del ACBT en bronquiectasias.'},
      flutter:{paramDeltas:{Raw:-1.0,sec:-3},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-1},label:'Óptimo',cls:'best',explanation:'Flutter/Acapella son ideales: oscilaciones movilizan secreciones viscosas y PEEP previene colapso bronquial dilatado.'},
      incentive:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:+1,hr:0,rr:0,paco2:0},label:'Complementario',cls:'neutral',explanation:'Mantiene volúmenes pulmonares entre sesiones. No aborda la hipersecreción principal.'},
      nebulization:{paramDeltas:{Raw:-0.4,sec:-0.8},vitalDeltas:{spo2:+1,hr:+2,rr:-1,paco2:0},label:'Beneficioso',cls:'good',explanation:'Suero salino hipertónico (6%) fluidifica secreciones antes del clearance. DNasa en fibrosis quística. Usar siempre antes de ACBT.'},
      vni:{paramDeltas:{Pmax:+18,FRC:+0.04},vitalDeltas:{spo2:+2,hr:-2,rr:-2,paco2:-3},label:'En insuficiencia',cls:'good',explanation:'Indicada en exacerbaciones con insuficiencia respiratoria o como soporte nocturno en enfermedad avanzada.'},
      movilizacion:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Las bronquiectasias son obstrucción + hipersecreción, no restricción de la pared torácica. Movilización no es técnica prioritaria.'},
    }
  },

  // ── RESTRICTIVAS — Esquelética / Caja torácica ───────────────────────────
  escoliosis:{
    id:'escoliosis', name:'Escoliosis Severa', group:'restrictive_chest',
    color:'#c084fc', icon:'🦴',
    patient:{name:'María J.', age:28, sex:'F', dx:'Escoliosis idiopática — Cobb 70°'},
    clinical:'Curvatura lateral severa de columna. Asimetría visible de expansión torácica. Disnea de esfuerzo moderada. Un hemitórax comprimido.',
    physiopath:'Deformidad de la caja torácica → CW muy reducida → restricción de volúmenes. Expansión asimétrica: un pulmón comprimido. Diafragma intacto pero mecánicamente limitado. FR alta compensadora.',
    params:{ Raw:2.0, CL:0.18, CW:0.10, Pmax:65, FRC:0.75 },
    baseVitals:{ spo2:92, hr:90, rr:22, bp:'118/74', paco2:42 },
    visual:{ chestShape:'scoliosis', secretions:0, bronchospasm:0, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:-1,rr:-2,paco2:0},label:'Poco útil',cls:'neutral',explanation:'PLB reduce la taquipnea pero no aborda el mecanismo principal (restricción esquelética). Mínimo beneficio directo.'},
      diaphragmatic:{paramDeltas:{Pmax:+8},vitalDeltas:{spo2:+1,hr:-2,rr:-3,paco2:-1},label:'Beneficioso',cls:'good',explanation:'Potencia el diafragma, que debe compensar la limitación costal. Mejora VT y reduce FR. Técnica central en escoliosis.'},
      postural:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción en escoliosis simple. Drenaje postural no aborda el mecanismo restrictivo esquelético.'},
      acbt:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:+1,hr:0,rr:-1,paco2:0},label:'Complementario',cls:'neutral',explanation:'La expansión torácica del ACBT tiene beneficio modesto. Sin hipersecreción, el FET no aporta. Útil solo la fase expansiva.'},
      fet:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'FET sin secreciones no tiene indicación. No mejora la restricción de la caja torácica.'},
      flutter:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción, Flutter no aporta beneficio y añade trabajo ventilatorio innecesario.'},
      incentive:{paramDeltas:{CL:+0.02},vitalDeltas:{spo2:+2,hr:-1,rr:-2,paco2:+1},label:'Beneficioso',cls:'good',explanation:'Espirometría incentivada de volumen mantiene capacidad pulmonar y previene atelectasias. Importante en escoliosis severa.'},
      nebulization:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin broncoespasmo ni hipersecreción. La nebulización no modifica el mecanismo restrictivo esquelético.'},
      vni:{paramDeltas:{Pmax:+25,FRC:+0.06},vitalDeltas:{spo2:+3,hr:-3,rr:-4,paco2:-4},label:'En severos',cls:'good',explanation:'VNI nocturna en escoliosis severa (Cobb >70°) mejora intercambio gaseoso, reduce fatiga muscular y ralentiza la progresión.'},
      movilizacion:{paramDeltas:{CW:+0.04},vitalDeltas:{spo2:+2,hr:-2,rr:-3,paco2:-2},label:'Primera línea',cls:'best',explanation:'Movilización torácica + ejercicios de elongación mejoran la compliance de la pared, aumentan VT y reducen FR compensadora.'},
    }
  },

  torax_rigido:{
    id:'torax_rigido', name:'Tórax Rígido', group:'restrictive_chest',
    color:'#a78bfa', icon:'🔒',
    patient:{name:'Roberto E.', age:55, sex:'M', dx:'Espondilitis anquilosante — compromiso torácico severo'},
    clinical:'Limitación severa de expansión costal (<2 cm). Respiración predominantemente diafragmática. Dolor paravertebral. Rx: calcificación de articulaciones costovertebales.',
    physiopath:'Anquilosis de articulaciones costovertebales → CW drásticamente reducida. El diafragma debe compensar casi toda la ventilación. Restricción severa con FRC reducida.',
    params:{ Raw:2.0, CL:0.20, CW:0.05, Pmax:75, FRC:0.80 },
    baseVitals:{ spo2:93, hr:88, rr:24, bp:'130/80', paco2:40 },
    visual:{ chestShape:'rigid', secretions:0, bronchospasm:0, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:-1,rr:-2,paco2:0},label:'Poco útil',cls:'neutral',explanation:'Sin obstrucción ni Raw elevada, PLB no aporta beneficio mecánico directo. Puede reducir taquipnea levemente.'},
      diaphragmatic:{paramDeltas:{Pmax:+10},vitalDeltas:{spo2:+2,hr:-3,rr:-4,paco2:-2},label:'Primera línea',cls:'best',explanation:'El diafragma es el único motor ventilatorio disponible. Entrenamiento diafragmático es crítico en tórax rígido.'},
      postural:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción. El drenaje postural no modifica la rigidez articular.'},
      acbt:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:+1,hr:0,rr:-1,paco2:0},label:'Beneficio marginal',cls:'neutral',explanation:'La fase expansiva del ACBT tiene beneficio mínimo dado que la restricción es extratorácica (articular). Sin hipersecreción.'},
      fet:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción, FET no tiene indicación y añade trabajo ventilatorio innecesario.'},
      flutter:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción. La resistencia del dispositivo agrega carga innecesaria a la musculatura diafragmática.'},
      incentive:{paramDeltas:{CL:+0.015},vitalDeltas:{spo2:+1,hr:-1,rr:-2,paco2:+1},label:'Complementario',cls:'good',explanation:'Espirometría incentivada puede mantener volúmenes pulmonares y prevenir microatelectasias en tórax rígido severo.'},
      nebulization:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin broncoespasmo ni hipersecreción. La nebulización no modifica la anquilosis articular.'},
      vni:{paramDeltas:{Pmax:+28,FRC:+0.06},vitalDeltas:{spo2:+3,hr:-4,rr:-5,paco2:-5},label:'En avanzados',cls:'best',explanation:'VNI nocturna es la intervención más eficaz cuando la restricción es severa. Descarga el diafragma durante el sueño.'},
      movilizacion:{paramDeltas:{CW:+0.02},vitalDeltas:{spo2:+2,hr:-2,rr:-3,paco2:-2},label:'Primera línea',cls:'best',explanation:'Ejercicios de movilización torácica + elongación vertebral pueden mantener y mejorar parcialmente la CW. Técnica central del tratamiento.'},
    }
  },

  cifosis:{
    id:'cifosis', name:'Cifosis Severa', group:'restrictive_chest',
    color:'#818cf8', icon:'⬆️',
    patient:{name:'Elena G.', age:74, sex:'F', dx:'Cifoescoliosis por osteoporosis — ángulo 78°'},
    clinical:'Cifosis por aplastamientos vertebrales múltiples. Reducción marcada del diámetro AP torácico. Disnea de esfuerzo-reposo. Respiración superficial y rápida.',
    physiopath:'Cifosis reduce diámetro AP del tórax → compresión pulmonar anterior + reducción CW + CL reducida. Patrón restrictivo moderado-severo. FRC reducida. FR alta compensadora.',
    params:{ Raw:2.0, CL:0.17, CW:0.12, Pmax:60, FRC:0.70 },
    baseVitals:{ spo2:91, hr:92, rr:22, bp:'128/78', paco2:43 },
    visual:{ chestShape:'kyphosis', secretions:0, bronchospasm:0, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:-1,rr:-2,paco2:0},label:'Poco útil',cls:'neutral',explanation:'Beneficio mínimo en cifosis sin obstrucción. Puede reducir taquipnea y mejorar el patrón ventilatorio superficial.'},
      diaphragmatic:{paramDeltas:{Pmax:+8},vitalDeltas:{spo2:+2,hr:-2,rr:-3,paco2:-2},label:'Primera línea',cls:'best',explanation:'Con cifosis severa el diafragma es el principal motor ventilatorio. El entrenamiento diafragmático mejora VT y SpO₂.'},
      postural:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción. El drenaje postural no modifica el ángulo cifótico ni la compliance reducida.'},
      acbt:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:+1,hr:0,rr:-1,paco2:0},label:'Beneficio parcial',cls:'neutral',explanation:'La fase de expansión torácica del ACBT tiene beneficio limitado por la deformidad estructural. Sin hipersecreción el FET no aplica.'},
      fet:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin secreciones que movilizar. FET no tiene indicación y puede ser incómodo por la deformidad vertebral.'},
      flutter:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción. Oscilaciones no modifican la restricción esquelética y añaden trabajo ventilatorio.'},
      incentive:{paramDeltas:{CL:+0.02},vitalDeltas:{spo2:+2,hr:-1,rr:-2,paco2:+1},label:'Beneficioso',cls:'good',explanation:'Espirometría incentivada mantiene volúmenes residuales y previene atelectasias dependientes en cifosis severa.'},
      nebulization:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin broncoespasmo. La nebulización no modifica el mecanismo restrictivo esquelético.'},
      vni:{paramDeltas:{Pmax:+26,FRC:+0.06},vitalDeltas:{spo2:+3,hr:-3,rr:-4,paco2:-5},label:'En avanzados',cls:'best',explanation:'VNI nocturna reduce hipercapnia nocturna en cifosis severa, mejora calidad de sueño y ralentiza la progresión.'},
      movilizacion:{paramDeltas:{CW:+0.03},vitalDeltas:{spo2:+2,hr:-2,rr:-3,paco2:-2},label:'Primera línea',cls:'best',explanation:'Movilización torácica + ejercicios de extensión vertebral mejoran CW y frenan progresión. Técnica central con VNI nocturna.'},
    }
  },

  // ── RESTRICTIVA — Neuromuscular ─────────────────────────────────────────
  neuromuscular:{
    id:'neuromuscular', name:'Debilidad Neuromuscular', group:'restrictive_neuro',
    color:'#f472b6', icon:'⚡',
    patient:{name:'Tomás R.', age:42, sex:'M', dx:'Síndrome de Guillain-Barré — fase progresiva'},
    clinical:'Debilidad muscular ascendente. PIM y PEM severamente reducidas. VT muy bajo. Tos ineficaz. Sin anomalías parenquimatosas. Riesgo de falla ventilatoria aguda.',
    physiopath:'Fuerza muscular reducida → VT muy bajo → FR muy elevada (patrón superficial taquipneico) → hipercapnia. Riesgo de movimiento paradójico diafragmático. Sin alteración de vía aérea ni compliance.',
    params:{ Raw:2.0, CL:0.20, CW:0.20, Pmax:25, FRC:0.80 },
    baseVitals:{ spo2:88, hr:108, rr:30, bp:'130/82', paco2:52 },
    visual:{ chestShape:'normal', secretions:1, bronchospasm:0, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:-1,rr:-2,paco2:-1},label:'Beneficio menor',cls:'neutral',explanation:'PLB puede reducir taquipnea levemente pero no aborda la fuerza muscular reducida. Beneficio limitado.'},
      diaphragmatic:{paramDeltas:{Pmax:+4},vitalDeltas:{spo2:+1,hr:-2,rr:-3,paco2:-2},label:'Beneficioso',cls:'good',explanation:'Mantiene el remanente de fuerza diafragmática. Importante para evitar atrofia por desuso, siempre que no fatigue.'},
      postural:{paramDeltas:{Raw:-0.3,sec:-0.8},vitalDeltas:{spo2:+1,hr:0,rr:0,paco2:0},label:'Beneficioso',cls:'good',explanation:'Drenaje postural asistido moviliza secreciones que el paciente no puede eliminar por tos ineficaz. Técnica pasiva recomendada.'},
      acbt:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:+1,hr:0,rr:-1,paco2:0},label:'Beneficio limitado',cls:'neutral',explanation:'El paciente puede no tener fuerza para completar el ACBT. Si hay secreciones, la fase pasiva (expansión asistida) puede ser útil.'},
      fet:{paramDeltas:{sec:-0.5},vitalDeltas:{spo2:+1,hr:+1,rr:0,paco2:0},label:'Muy limitado',cls:'neutral',explanation:'FET requiere esfuerzo espiratorio que puede no ser posible. Considerar técnicas asistidas de tos (tos provocada, MI-E).'},
      flutter:{paramDeltas:{sec:-0.8},vitalDeltas:{spo2:+1,hr:0,rr:0,paco2:0},label:'Beneficio parcial',cls:'neutral',explanation:'Si el paciente puede sostener el Flutter, las oscilaciones movilizan secreciones sin requerir gran esfuerzo espiratorio.'},
      incentive:{paramDeltas:{CL:+0.01},vitalDeltas:{spo2:+1,hr:-1,rr:-1,paco2:0},label:'Beneficioso',cls:'good',explanation:'Espirometría incentivada mantiene VT máximo posible y previene microatelectasias. Útil mientras el paciente pueda cooperar.'},
      nebulization:{paramDeltas:{sec:-0.6},vitalDeltas:{spo2:+1,hr:0,rr:-1,paco2:0},label:'Beneficioso',cls:'good',explanation:'Suero fisiológico nebulizado fluidifica secreciones que el paciente no puede expectorar. Facilita drenaje postural asistido.'},
      vni:{paramDeltas:{Pmax:+40,FRC:+0.05},vitalDeltas:{spo2:+6,hr:-10,rr:-10,paco2:-12},label:'Crítico',cls:'best',explanation:'VNI es el pilar del tratamiento. Sustituye la fuerza muscular perdida, corrige hipercapnia y previene falla ventilatoria. Iniciar precozmente.'},
      movilizacion:{paramDeltas:{CW:+0.02,Pmax:+5},vitalDeltas:{spo2:+1,hr:-2,rr:-2,paco2:-1},label:'Complementario',cls:'good',explanation:'Movilización torácica pasiva-activa asistida mantiene compliance de la pared y evita contracturas. Complemento a VNI.'},
    }
  },

  // ── RESTRICTIVA — Pleural ───────────────────────────────────────────────
  derrame:{
    id:'derrame', name:'Derrame Pleural', group:'restrictive_pleural',
    color:'#38bdf8', icon:'💧',
    patient:{name:'Miguel R.', age:58, sex:'M', dx:'Derrame pleural masivo derecho'},
    clinical:'Matidez percutoria hasta campo medio derecho. MV abolido en base derecha. Disnea en reposo. Derrame paraneumónico masivo en Rx. SpO₂ muy reducida.',
    physiopath:'Compresión pulmonar mecánica por líquido pleural → CL funcional reducida + atelectasia compresiva → shunt intrapulmonar → hipoxemia severa. FRC reducida.',
    params:{ Raw:2.0, CL:0.14, CW:0.20, Pmax:75, FRC:0.70 },
    baseVitals:{ spo2:87, hr:105, rr:26, bp:'126/82', paco2:40 },
    visual:{ chestShape:'normal', secretions:0, bronchospasm:0, airTrap:false, pleural:{type:'effusion',side:'R',level:0.50} },
    techniques:{
      plb:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:-3,rr:-3,paco2:+1},label:'Beneficioso',cls:'good',explanation:'Reduce taquipnea y trabajo respiratorio. Útil para manejo sintomático mientras se realiza la toracocentesis.'},
      diaphragmatic:{paramDeltas:{Pmax:+5},vitalDeltas:{spo2:+1,hr:-2,rr:-2,paco2:0},label:'Beneficioso',cls:'good',explanation:'Mejora eficiencia ventilatoria del hemidiafragma no comprometido. Especialmente útil post-toracocentesis.'},
      postural:{paramDeltas:{CL:-0.02},vitalDeltas:{spo2:-1,hr:+3,rr:+2,paco2:0},label:'Contraindicado',cls:'bad',explanation:'Drenaje postural puede desplazar líquido pleural y empeorar la compresión pulmonar. Contraindicado hasta realizar toracocentesis.'},
      acbt:{paramDeltas:{CL:-0.01},vitalDeltas:{spo2:-1,hr:+2,rr:+2,paco2:0},label:'Evitar pre-drenaje',cls:'bad',explanation:'Expansión torácica forzada antes de toracocentesis es dolorosa y aumenta trabajo respiratorio sin aliviar la restricción mecánica.'},
      fet:{paramDeltas:{CL:-0.01},vitalDeltas:{spo2:-1,hr:+2,rr:+1,paco2:0},label:'Contraindicado',cls:'bad',explanation:'FET es doloroso y puede provocar neumotórax en derrame a tensión. Sin beneficio por ausencia de secreciones.'},
      flutter:{paramDeltas:{CL:-0.01},vitalDeltas:{spo2:-1,hr:+1,rr:+1,paco2:0},label:'Contraindicado',cls:'bad',explanation:'Resistencia del dispositivo aumenta trabajo ventilatorio en pulmón comprimido. Sin beneficio por ausencia de secreciones.'},
      incentive:{paramDeltas:{CL:+0.03},vitalDeltas:{spo2:+2,hr:-1,rr:-1,paco2:+1},label:'Post-toracocentesis',cls:'good',explanation:'Tras drenar el derrame, espirometría incentivada es fundamental para reexpansión pulmonar progresiva y prevenir atelectasias residuales.'},
      nebulization:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:0,rr:0,paco2:0},label:'Según causa',cls:'neutral',explanation:'Nebulización específica según etiología del derrame. Sin beneficio directo sobre la restricción mecánica por el líquido.'},
      vni:{paramDeltas:{Pmax:+22,FRC:+0.05},vitalDeltas:{spo2:+3,hr:-4,rr:-4,paco2:+2},label:'Si hipoxemia severa',cls:'good',explanation:'VNI es paliativa en derrame: trata la hipoxemia pero no el derrame. El tratamiento definitivo es la toracocentesis evacuadora.'},
      movilizacion:{paramDeltas:{CW:+0.01},vitalDeltas:{spo2:+1,hr:-1,rr:-1,paco2:0},label:'Post-toracocentesis',cls:'good',explanation:'Movilización torácica post-drenaje mejora expansión del pulmón reexpandido y previene rigidez de la pared por desuso.'},
    }
  },

  // ── RESTRICTIVA — Parenquimatosa ────────────────────────────────────────
  fpi:{
    id:'fpi', name:'Fibrosis Pulmonar', group:'restrictive_parench',
    color:'#a855f7', icon:'🩹',
    patient:{name:'Rosa T.', age:71, sex:'F', dx:'Fibrosis Pulmonar Idiopática'},
    clinical:'Disnea progresiva de meses. Tos seca irritativa. Crepitantes tipo "velcro" en bases. SpO₂ 88% basal. Acropaquias. Patrón en panal de abeja en TCAR.',
    physiopath:'Fibrosis intersticial difusa → CL muy reducida + pulmones pequeños + FRC↓↓. FR alta compensadora (patrón taquipneico superficial). Hipoxemia por alteración de difusión + V/Q mismatch.',
    params:{ Raw:1.8, CL:0.10, CW:0.20, Pmax:75, FRC:0.60 },
    baseVitals:{ spo2:88, hr:96, rr:24, bp:'132/84', paco2:36 },
    visual:{ chestShape:'small', secretions:0, bronchospasm:0, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:-2,rr:-2,paco2:+1},label:'Beneficioso',cls:'good',explanation:'Aunque diseñada para obstructivos, PLB reduce taquipnea y el componente de ansiedad en FPI. Mejora levemente el patrón superficial.'},
      diaphragmatic:{paramDeltas:{Pmax:+5},vitalDeltas:{spo2:+1,hr:-2,rr:-2,paco2:+1},label:'Beneficioso',cls:'good',explanation:'Mejora eficiencia ventilatoria y reduce trabajo respiratorio. Útil para manejo crónico de la disnea.'},
      postural:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'FPI genera escasas secreciones. El drenaje postural no tiene indicación salvo exacerbación con sobreinfección.'},
      acbt:{paramDeltas:{CL:+0.005},vitalDeltas:{spo2:0,hr:+1,rr:+1,paco2:0},label:'No indicado en FPI',cls:'neutral',explanation:'Sin hipersecreción significativa, ACBT no aporta beneficio. La expansión activa puede aumentar el trabajo respiratorio.'},
      fet:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:0,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin secreciones. FET puede causar tos irritativa que agrava síntomas en FPI. No tiene indicación.'},
      flutter:{paramDeltas:{},vitalDeltas:{spo2:0,hr:0,rr:+1,paco2:0},label:'No indicado',cls:'neutral',explanation:'Sin hipersecreción. Flutter no aporta beneficio y la resistencia del dispositivo aumenta trabajo respiratorio.'},
      incentive:{paramDeltas:{CL:+0.025},vitalDeltas:{spo2:+2,hr:-1,rr:-1,paco2:+1},label:'Primera línea',cls:'best',explanation:'Espirometría incentivada de volumen es la técnica de elección en restrictivos: mantiene CPT, previene atelectasias y mejora la distensibilidad residual.'},
      nebulization:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:0,rr:-1,paco2:0},label:'Según síntomas',cls:'neutral',explanation:'Mucolítico nebulizado puede aliviar tos irritativa. No modifica la fibrosis. Oxigenoterapia durante ejercicio si hay desaturación.'},
      vni:{paramDeltas:{Pmax:+22,FRC:+0.06},vitalDeltas:{spo2:+3,hr:-3,rr:-3,paco2:+2},label:'Estadios avanzados',cls:'good',explanation:'VNI nocturna en FPI avanzada mejora intercambio gaseoso y calidad de vida. Soporte de rescate en exacerbaciones graves.'},
      movilizacion:{paramDeltas:{CW:+0.01},vitalDeltas:{spo2:+1,hr:-1,rr:-1,paco2:0},label:'Complementario',cls:'good',explanation:'Movilización torácica mantiene compliance residual de la pared. Complemento útil al ejercicio aeróbico en rehabilitación pulmonar.'},
    }
  },

  neumonia:{
    id:'neumonia', name:'Neumonía Consolidante', group:'restrictive_parench',
    color:'#4ade80', icon:'🫧',
    patient:{name:'Ana P.', age:46, sex:'F', dx:'Neumonía lobular inferior derecha'},
    clinical:'Neumonía, 4° día de antibióticos. Fiebre en resolución. Tos productiva con esputo purulento. Crepitantes en base derecha. Consolidación en Rx.',
    physiopath:'Consolidación alveolar → restricción local + atelectasias satélite → shunt intrapulmonar → hipoxemia. Fase de resolución con secreciones en vía aérea. Atelectasias mantenidas.',
    params:{ Raw:3.0, CL:0.15, CW:0.20, Pmax:70, FRC:0.80 },
    baseVitals:{ spo2:90, hr:96, rr:22, bp:'118/74', paco2:38 },
    visual:{ chestShape:'consolidation', secretions:2, bronchospasm:0, airTrap:false, pleural:null },
    techniques:{
      plb:{paramDeltas:{},vitalDeltas:{spo2:+1,hr:-2,rr:-2,paco2:0},label:'Beneficioso',cls:'good',explanation:'Reduce taquipnea y mejora patrón ventilatorio. Complemento a las técnicas principales de expansión y clearance.'},
      diaphragmatic:{paramDeltas:{Pmax:+5},vitalDeltas:{spo2:+1,hr:-1,rr:-2,paco2:0},label:'Beneficioso',cls:'good',explanation:'Mejora eficiencia ventilatoria y expande la base pulmonar afectada cuando el dolor lo permite.'},
      postural:{paramDeltas:{Raw:-0.4,sec:-1.5},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-1},label:'Beneficioso',cls:'good',explanation:'Drenaje postural del lóbulo afectado en fase de resolución moviliza secreciones hacia bronquios centrales. Más eficaz días 4-7.'},
      acbt:{paramDeltas:{CL:+0.02,Raw:-0.4,sec:-1.5},vitalDeltas:{spo2:+2,hr:0,rr:0,paco2:-1},label:'Primera línea',cls:'best',explanation:'ACBT en fase de resolución: expansión de atelectasias + clearance de secreciones. Primera línea en neumonía fase tardía.'},
      fet:{paramDeltas:{Raw:-0.3,sec:-1.5},vitalDeltas:{spo2:+2,hr:+1,rr:0,paco2:-1},label:'Primera línea',cls:'best',explanation:'FET moviliza secreciones desde periférico a central. Muy eficaz en fase de resolución con esputo productivo.'},
      flutter:{paramDeltas:{Raw:-0.3,sec:-1.2},vitalDeltas:{spo2:+1,hr:0,rr:0,paco2:0},label:'Complementario',cls:'good',explanation:'Oscilaciones ayudan a desprender secreciones de la pared alveolar en resolución. Útil si esputo muy viscoso.'},
      incentive:{paramDeltas:{CL:+0.025},vitalDeltas:{spo2:+2,hr:-1,rr:-1,paco2:0},label:'Primera línea',cls:'best',explanation:'Espirometría incentivada resuelve atelectasias compresivas y satélites. Técnica de elección junto con ACBT.'},
      nebulization:{paramDeltas:{Raw:-0.3,sec:-0.8},vitalDeltas:{spo2:+1,hr:0,rr:-1,paco2:0},label:'Beneficioso',cls:'good',explanation:'Suero fisiológico fluidifica secreciones antes del clearance. Mucolítico si esputo muy viscoso.'},
      vni:{paramDeltas:{Pmax:+20,FRC:+0.04},vitalDeltas:{spo2:+3,hr:-2,rr:-3,paco2:+1},label:'Si hipoxemia severa',cls:'good',explanation:'VNI reduce trabajo respiratorio y mejora oxigenación en neumonía grave. No elimina secreciones pero estabiliza al paciente.'},
      movilizacion:{paramDeltas:{CW:+0.01,CL:+0.01},vitalDeltas:{spo2:+1,hr:-1,rr:-1,paco2:0},label:'Complementario',cls:'good',explanation:'Movilización torácica + cambios de posición facilitan redistribución del moco y mejoran ventilación de zonas atelectásicas.'},
    }
  },
};

// ════════════════════════════════════════════════════════════════════════════
// TÉCNICAS
// ════════════════════════════════════════════════════════════════════════════
const FISIO_TECHNIQUES = [
  {id:'plb',          name:'Labios Fruncidos',       short:'PLB',      icon:'💨', group:'ventilatory'},
  {id:'diaphragmatic',name:'Resp. Diafragmática',    short:'Diafrágm.',icon:'🫁', group:'ventilatory'},
  {id:'postural',     name:'Drenaje Postural',        short:'Postural', icon:'↩️', group:'clearance'},
  {id:'acbt',         name:'ACBT / CATR',             short:'ACBT',     icon:'🔄', group:'clearance'},
  {id:'fet',          name:'FET / Huff',              short:'FET',      icon:'💪', group:'clearance'},
  {id:'flutter',      name:'Flutter / Acapella',      short:'Flutter',  icon:'〰️', group:'clearance'},
  {id:'incentive',    name:'Espiróm. Incentivada',    short:'Espiróm.', icon:'📊', group:'expansion'},
  {id:'movilizacion', name:'Movilización Torácica',   short:'Moviliz.', icon:'🤸', group:'expansion'},
  {id:'nebulization', name:'Nebulización',            short:'Nebuliz.', icon:'💊', group:'support'},
  {id:'vni',          name:'VNI / CPAP',              short:'VNI',      icon:'😷', group:'support'},
];

const TECH_GROUPS = [
  {label:'Control ventilatorio', icon:'🌬️', ids:['plb','diaphragmatic']},
  {label:'Aclaramiento bronquial',icon:'🫁', ids:['postural','acbt','fet','flutter']},
  {label:'Expansión pulmonar',    icon:'📊', ids:['incentive','movilizacion']},
  {label:'Soporte',               icon:'💊', ids:['nebulization','vni']},
];

// ════════════════════════════════════════════════════════════════════════════
// CASOS DE EVALUACIÓN
// ════════════════════════════════════════════════════════════════════════════
const FISIO_EVAL_CASES = [
  {
    id:'ev1', title:'Caso 1 — EPOC en Exacerbación',
    age:65, sex:'M',
    clinical:'Hombre 65 años, EPOC GOLD III. Exacerbación leve. SpO₂ 88%, FR 24, FC 102. Tos con esputo amarillento. Sibilancias difusas. Sin acidosis respiratoria.',
    vitals:{spo2:88,hr:102,rr:24}, type:'obstructive',
    questions:[
      {q:'¿Cuál es el principal mecanismo de hipoxemia?',
       opts:['Hipoventilación alveolar pura sin obstrucción','V/Q mismatch por obstrucción bronquial','Shunt por consolidación','Alteración de difusión sin obstrucción'],
       correct:1,exp:'En EPOC, la obstrucción genera zonas con bajo cociente V/Q (ventilación reducida vs perfusión conservada), produciendo hipoxemia.'},
      {q:'¿Qué técnica de aclaramiento es de primera elección?',
       opts:['Espirometría incentivada de volumen','FET con espiración máxima','ACBT con control respiratorio previo','Drenaje postural en Trendelenburg'],
       correct:2,exp:'ACBT (control respiratorio → expansión torácica → FET) es el gold standard en EPOC: eficaz sin provocar colapso dinámico de vías pequeñas.'},
      {q:'¿Cuál técnica está contraindicada en este momento?',
       opts:['Respiración con labios fruncidos','Nebulización con salbutamol','FET con espiración máxima forzada','VNI si aparece hipercapnia'],
       correct:2,exp:'Espiración máxima forzada en EPOC provoca colapso dinámico de vías aéreas pequeñas y empeora el atrapamiento aéreo.'},
    ]
  },
  {
    id:'ev2', title:'Caso 2 — Crisis Asmática',
    age:28, sex:'F',
    clinical:'Mujer 28 años. Crisis asmática por ejercicio. SpO₂ 90%, FR 28, FC 118. Sibilancias bilaterales. Musculatura accesoria. Ansiosa, habla en frases cortas.',
    vitals:{spo2:90,hr:118,rr:28}, type:'obstructive',
    questions:[
      {q:'¿Cuál es la prioridad fisioterapéutica inmediata?',
       opts:['Drenaje postural para movilizar secreciones','Flutter para abrir vías aéreas','Nebulización broncodilatadora + control ventilatorio','Espirometría incentivada para expandir el pulmón'],
       correct:2,exp:'En asma aguda, el broncodilatador es la primera línea. Simultáneamente, PLB y resp. diafragmática reducen la ansiedad y el broncoespasmo reflejo.'},
      {q:'¿Por qué el FET está contraindicado en esta crisis?',
       opts:['Aumenta la FC excesivamente','Estimula receptores irritantes y puede empeorar el broncoespasmo','Reduce demasiado el PaCO₂','Provoca neumotórax en asmáticos'],
       correct:1,exp:'El FET genera flujos espiratorios altos que irritan receptores bronquiales, desencadenando más broncoespasmo en vías aéreas hiperreactivas.'},
    ]
  },
  {
    id:'ev3', title:'Caso 3 — Escoliosis con Falla Respiratoria',
    age:35, sex:'F',
    clinical:'Mujer 35 años, escoliosis idiopática Cobb 72°. SpO₂ 91%, FR 24, FC 92. Sin secreciones. Disnea de esfuerzo moderada. Expansión asimétrica marcada.',
    vitals:{spo2:91,hr:92,rr:24}, type:'restrictive_chest',
    questions:[
      {q:'¿Cuál es el mecanismo principal de la restricción?',
       opts:['Raw aumentada por broncoespasmo','CW muy reducida por deformidad esquelética','CL reducida por fibrosis pulmonar','Pmax reducida por debilidad muscular'],
       correct:1,exp:'En escoliosis severa, la deformidad esquelética reduce drásticamente la compliance de la pared torácica (CW), limitando la expansión pulmonar.'},
      {q:'¿Qué técnica es de primera línea en este caso?',
       opts:['Nebulización con broncodilatador','Flutter para aclaramiento','Movilización torácica + entrenamiento diafragmático','Drenaje postural segmentario'],
       correct:2,exp:'La movilización torácica mejora CW y el entrenamiento diafragmático potencia el único músculo que puede compensar la rigidez costal.'},
      {q:'¿Cuándo estaría indicada la VNI en este caso?',
       opts:['Inmediatamente como primera línea','Solo si hay infección pulmonar asociada','Cuando la restricción progresa con hipercapnia o nocturna','Nunca en pacientes con escoliosis'],
       correct:2,exp:'VNI nocturna se indica cuando hay hipercapnia diurna, desaturación nocturna o progresión sintomática a pesar del tratamiento rehabilitador.'},
    ]
  },
  {
    id:'ev4', title:'Caso 4 — Debilidad Neuromuscular',
    age:45, sex:'M',
    clinical:'Hombre 45 años, ELA en estadio moderado. SpO₂ 88%, FR 30, FC 108. VT muy reducido. Tos ineficaz. Sin secreciones. Hipercapnia leve.',
    vitals:{spo2:88,hr:108,rr:30}, type:'restrictive_neuro',
    questions:[
      {q:'¿Cuál es la principal amenaza ventilatoria en este paciente?',
       opts:['Broncoespasmo progresivo','Falla ventilatoria hipercápnica por agotamiento muscular','Fibrosis pulmonar progresiva','Derrame pleural recurrente'],
       correct:1,exp:'En ELA, la debilidad muscular progresiva reduce Pmax → VT muy bajo → hipercapnia → acidosis respiratoria → falla ventilatoria.'},
      {q:'¿Qué intervención tiene mayor impacto en la sobrevida?',
       opts:['Entrenamiento muscular intensivo','ACBT diario para clearance','VNI precoz (nocturna y según necesidad)','Nebulización con broncodilatadores'],
       correct:2,exp:'VNI prolonga la sobrevida en ELA e ILA al suplir la fuerza muscular perdida, corregir hipercapnia y mejorar calidad de sueño.'},
    ]
  },
];
