import { z } from 'zod';

export const createChildSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  parentName: z.string().min(1),
  tole: z.string().min(1),
  wardNumber: z.number().nullable().optional(),
  wardOfVaccination: z.number(),
  casteCode: z.number(),
  birthDate: z.string(),
  isFromOtherMunicipality: z.boolean().default(false),
  administeredById: z.number(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phoneNumber: z.string().optional(),
  remarks: z.string().optional().nullable(),
  // Fix the vaccines schema structure
  vaccines: z.object({
    BCG: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    DPT_HepB_hib: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    ROTA: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    OPV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    fIPV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    PCV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    MR: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    JE: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    TCV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional(),
    HPV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['current', 'booster']).default('current'),
      doseNumber: z.number()
    })).optional()
  }).optional(),
  weightRecords: z.array(
    z.object({
      date: z.string(),
      weight: z.number().or(z.string())
    })
  ).optional()
}).strict();

export const updateChildSchema = z.object({
  fullName: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
  parentName: z.string().min(1).optional(),
  tole: z.string().min(1).optional(),
  wardNumber: z.number().optional(),
  casteCode: z.number().optional(),
  birthDate: z.string().optional(),
  isFromOtherMunicipality: z.boolean().optional(),
  administeredById: z.number().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  phoneNumber: z.string().optional(),
  remarks: z.string().optional().nullable(),
  // Add the vaccination and weight records fields for validation
  vaccinations: z.array(
    z.object({
      vaccineType: z.string(),
      doseNumber: z.number(),
      dateGiven: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'booster']).optional(),
    })
  ).optional(),
  weightRecords: z.array(
    z.object({
      date: z.string(),
      weight: z.number(),
    })
  ).optional(),
});