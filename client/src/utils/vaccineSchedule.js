// src/utils/vaccineSchedule.js

export const vaccineSchedule = {
  BCG: [{ dose: 1, recommendedAtDays: 0 }], // At birth

  ROTA: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
  ],

  OPV: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
    { dose: 3, recommendedAtWeeks: 14 },
  ],

  DPT_HepB_hib: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
    { dose: 3, recommendedAtWeeks: 14 },
  ],

  fIPV: [
    { dose: 1, recommendedAtWeeks: 14 },
    { dose: 2, recommendedAtMonths: 9 },
  ],

  PCV: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
    { dose: 3, recommendedAtMonths: 9 },
  ],

  MR: [
    { dose: 1, recommendedAtMonths: 9 },
    { dose: 2, recommendedAtMonths: 15 },
  ],

  JE: [{ dose: 1, recommendedAtMonths: 15 }],

  TCV: [{ dose: 1, recommendedAtMonths: 15 }],

  HPV: [],
};
