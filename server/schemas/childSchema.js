import { z } from 'zod';

export const createChildSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  parentName: z.string().min(1),
  tole: z.string().min(1),
  wardNumber: z.number(),
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
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    DPT_HepB_hib: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    ROTA: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    OPV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    fIPV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    PCV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    MR: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    JE: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    TCV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
      doseNumber: z.number()
    })).optional(),
    HPV: z.array(z.object({
      date: z.string(),
      remarks: z.string().optional().nullable(),
      type: z.enum(['routine', 'catchup']).default('routine'),
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