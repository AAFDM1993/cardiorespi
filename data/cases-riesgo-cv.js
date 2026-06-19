/* ── Riesgo CV: 10 casos clínicos preconfigurados ── */
/* Perfil unificado por caso — applyCaseToScales() en riesgo_cv.html deriva
   de aquí los campos especificos de cada una de las 5 escalas. */

const RIESGO_CV_CASES = [
  { id:1, name:'María Dolores Ruiz', age:45, sex:'F',
    vignette:'45 años, físicamente activa, sin antecedentes. Perfil lipídico óptimo.',
    sbp:112, tc:178, hdl:62, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:23, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:3, sedentary:false, dyslipidemiaTx:false },

  { id:2, name:'Antonio Gómez', age:50, sex:'M',
    vignette:'Hipertensión tratada y controlada. Exfumador desde hace 5 años.',
    sbp:134, tc:205, hdl:45, bpTreated:true,
    smoking:{status:'ex', cigsPerDay:0, quitMonthsAgo:60},
    bmi:26, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:4, sedentary:false, dyslipidemiaTx:true },

  { id:3, name:'Carmen Salas', age:55, sex:'F',
    vignette:'Sedentaria, HDL bajo. Madre con IAM a los 58 años.',
    sbp:128, tc:230, hdl:38, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:27, ethnicity:'white', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:4, sedentary:true, dyslipidemiaTx:false },

  { id:4, name:'Jorge Paredes', age:58, sex:'M',
    vignette:'Fumador activo (20 cig/día), hipertensión sin tratamiento, sedentario.',
    sbp:158, tc:215, hdl:41, bpTreated:false,
    smoking:{status:'current', cigsPerDay:20, quitMonthsAgo:null},
    bmi:28, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:5, sedentary:true, dyslipidemiaTx:false },

  { id:5, name:'Manuel Torres', age:62, sex:'M',
    vignette:'Diabetes tipo 2, obesidad (IMC 32), dislipidemia tratada, sedentario.',
    sbp:148, tc:240, hdl:36, bpTreated:true,
    smoking:{status:'ex', cigsPerDay:0, quitMonthsAgo:24},
    bmi:32, ethnicity:'white', diabetes:'type2', famHist:false, afib:false, ckd:false,
    ses:5, sedentary:true, dyslipidemiaTx:true },

  { id:6, name:'Lucía Fernández', age:60, sex:'F',
    vignette:'Fumadora intensa (25 cig/día). Padre con IAM a los 52 años.',
    sbp:142, tc:225, hdl:44, bpTreated:false,
    smoking:{status:'current', cigsPerDay:25, quitMonthsAgo:null},
    bmi:25, ethnicity:'white', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:4, sedentary:false, dyslipidemiaTx:false },

  { id:7, name:'Ricardo Núñez', age:67, sex:'M',
    vignette:'Fibrilación auricular conocida y enfermedad renal crónica estadio 4. Lípidos y PA bien controlados.',
    sbp:138, tc:198, hdl:48, bpTreated:true,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:27, ethnicity:'white', diabetes:'type2', famHist:false, afib:true, ckd:true,
    ses:4, sedentary:true, dyslipidemiaTx:true },

  { id:8, name:'Suresh Patel', age:48, sex:'M',
    vignette:'Etnia surasiática. Hermano con IAM a los 50 años. Resto del perfil casi óptimo.',
    sbp:124, tc:190, hdl:50, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:24, ethnicity:'southAsian', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:3, sedentary:false, dyslipidemiaTx:false },

  { id:9, name:'Esperanza Molina', age:56, sex:'F',
    vignette:'Nivel socioeconómico muy desfavorecido. Resto de factores moderados.',
    sbp:136, tc:210, hdl:46, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:26, ethnicity:'white', diabetes:'none', famHist:false, afib:false, ckd:false,
    ses:7, sedentary:true, dyslipidemiaTx:false },

  { id:10, name:'Felipe Castaño', age:50, sex:'M',
    vignette:'No fumador, PA y lípidos casi normales, pero sedentario, obeso (IMC 31), prediabético y con antecedente familiar.',
    sbp:126, tc:195, hdl:47, bpTreated:false,
    smoking:{status:'never', cigsPerDay:0, quitMonthsAgo:null},
    bmi:31, ethnicity:'white', diabetes:'none', famHist:true, afib:false, ckd:false,
    ses:4, sedentary:true, dyslipidemiaTx:false, prediabetic:true },
];
