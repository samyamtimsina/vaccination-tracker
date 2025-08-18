// src/utils/vaccineSchedule.js

// --------------------------
// 1. Routine Immunization Schedule (Nepal, MoHP / NEPAS 2024)
// --------------------------
export const vaccineSchedule = {
  BCG: [{ dose: 1, recommendedAtDays: 0 }], // At birth (valid until 12 months)

  DPT_HepB_hib: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
    { dose: 3, recommendedAtWeeks: 14 },
    { dose: 4, recommendedAtMonths: 18, isBooster: true }, // 16–24m booster
    { dose: 5, recommendedAtYears: 5, isBooster: true }, // 2nd booster
  ],

  ROTA: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
    // Note: not valid if >8 months old
  ],

  OPV: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
    { dose: 3, recommendedAtWeeks: 14 },
    { dose: 4, recommendedAtMonths: 18, isBooster: true },
    { dose: 5, recommendedAtYears: 5, isBooster: true },
  ],

  fIPV: [
    { dose: 1, recommendedAtWeeks: 14 },
    { dose: 2, recommendedAtMonths: 9 },
  ],

  PCV: [
    { dose: 1, recommendedAtWeeks: 6 },
    { dose: 2, recommendedAtWeeks: 10 },
    { dose: 3, recommendedAtMonths: 9 }, // booster
    { dose: 4, recommendedAtMonths: 18, isBooster: true }, // optional booster
  ],

  MR: [
    { dose: 1, recommendedAtMonths: 9 },
    { dose: 2, recommendedAtMonths: 15 },
  ],

  JE: [
    { dose: 1, recommendedAtMonths: 12 },
    { dose: 2, recommendedAtMonths: 24 }, // 2nd dose
  ],

  TCV: [{ dose: 1, recommendedAtMonths: 15 }],

  HPV: [
    // Officially for adolescent girls 9–14 yrs
    { dose: 1, recommendedAtYears: 10, isAdolescent: true },
    { dose: 2, recommendedAtYears: 10.5, isAdolescent: true }, // 6 months later
  ],
};

// --------------------------
// 2. Catch-Up Rules (children <5 years)
// --------------------------
// These rules reflect official Government of Nepal immunization campaigns.
export const catchUpRules = {
  BCG: { maxAgeMonths: 60, totalDoses: 1 },
  ROTA: { maxAgeWeeks: 32, totalDoses: 2 },
  DPT_HepB_hib: { maxAgeMonths: 180, minIntervalWeeks: 4, totalDoses: 5 },
  OPV: { maxAgeMonths: 59, minIntervalWeeks: 4, totalDoses: 5 },
  fIPV: { maxAgeMonths: 59, minIntervalWeeks: 4, totalDoses: 2 },
  PCV: { maxAgeMonths: 59, minIntervalWeeks: 4, totalDoses: 4 },
  MR: { maxAgeMonths: 180, minIntervalWeeks: 4, totalDoses: 2 },
  JE: { maxAgeMonths: 180, totalDoses: 2 },
  TCV: { maxAgeMonths: 180, totalDoses: 1 },
  HPV: { maxAgeYears: 26, totalDoses: 2 }, // optional catch-up for missed adolescent series
};
// // src/utils/vaccineSchedule.js
//second verions

// // Full master schedule with type field for each dose
// export const fullSchedule = {
//   BCG: [
//     { dose: 1, recommendedAtDays: 0, type: 'routine' }
//   ],

//   DPT_HepB_hib: [
//     { dose: 1, recommendedAtWeeks: 6, type: 'routine' },
//     { dose: 2, recommendedAtWeeks: 10, type: 'routine' },
//     { dose: 3, recommendedAtWeeks: 14, type: 'routine' },
//     { dose: 4, recommendedAtMonths: 18, type: 'booster' },
//     { dose: 5, recommendedAtYears: 5, type: 'booster' },
//   ],

//   ROTA: [
//     { dose: 1, recommendedAtWeeks: 6, type: 'routine' },
//     { dose: 2, recommendedAtWeeks: 10, type: 'routine' },
//   ],

//   OPV: [
//     { dose: 1, recommendedAtWeeks: 6, type: 'routine' },
//     { dose: 2, recommendedAtWeeks: 10, type: 'routine' },
//     { dose: 3, recommendedAtWeeks: 14, type: 'routine' },
//     { dose: 4, recommendedAtMonths: 18, type: 'booster' },
//     { dose: 5, recommendedAtYears: 5, type: 'booster' },
//   ],

//   fIPV: [
//     { dose: 1, recommendedAtWeeks: 14, type: 'routine' },
//     { dose: 2, recommendedAtMonths: 9, type: 'routine' },
//   ],

//   PCV: [
//     { dose: 1, recommendedAtWeeks: 6, type: 'routine' },
//     { dose: 2, recommendedAtWeeks: 10, type: 'routine' },
//     { dose: 3, recommendedAtMonths: 9, type: 'routine' },
//     { dose: 4, recommendedAtYears: 5, type: 'booster' },
//   ],

//   MR: [
//     { dose: 1, recommendedAtMonths: 9, type: 'routine' },
//     { dose: 2, recommendedAtMonths: 15, type: 'routine' },
//   ],

//   JE: [
//     { dose: 1, recommendedAtMonths: 12, type: 'routine' },
//     { dose: 2, recommendedAtYears: 2, type: 'booster' },
//   ],

//   TCV: [
//     { dose: 1, recommendedAtMonths: 9, type: 'routine' }
//   ],

//   HPV: [
//     { dose: 1, recommendedAtYears: 9, type: 'booster' },
//     { dose: 2, recommendedAtYears: 14, type: 'booster' },
//   ],

// };V