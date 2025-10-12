import { z } from 'zod';

const vaccineDoseSchema = z.object({
  date: z.string(),
  remarks: z.string().optional().nullable(),
  type: z.enum(['current', 'booster']).default('current'),
  doseNumber: z.number(),

  // ✅ New fields for external administration
  isExternallyAdministered: z.boolean().optional().default(false),
  externalAdministeredBy: z.string().optional().nullable(),
  administeredById: z.number().nullable().optional(),
});

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

  // ✅ allow null (for external)
  administeredById: z.number().nullable().optional(),
  externalAdministeredBy: z.string().optional().nullable(),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phoneNumber: z.string().optional(),
  remarks: z.string().optional().nullable(),

  // ✅ Updated vaccines schema
  vaccines: z
    .object({
      BCG: z.array(vaccineDoseSchema).optional(),
      DPT_HepB_hib: z.array(vaccineDoseSchema).optional(),
      ROTA: z.array(vaccineDoseSchema).optional(),
      OPV: z.array(vaccineDoseSchema).optional(),
      fIPV: z.array(vaccineDoseSchema).optional(),
      PCV: z.array(vaccineDoseSchema).optional(),
      MR: z.array(vaccineDoseSchema).optional(),
      JE: z.array(vaccineDoseSchema).optional(),
      TCV: z.array(vaccineDoseSchema).optional(),
      HPV: z.array(vaccineDoseSchema).optional(),
    })
    .optional(),

  weightRecords: z
    .array(
      z.object({
        date: z.string(),
        weight: z.union([z.number(), z.string()]),
      })
    )
    .optional(),
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

  administeredById: z.number().nullable().optional(),
  externalAdministeredBy: z.string().optional().nullable(),

  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  phoneNumber: z.string().optional(),
  remarks: z.string().optional().nullable(),

  vaccinations: z
    .array(
      z.object({
        vaccineType: z.string(),
        doseNumber: z.number(),
        dateGiven: z.string(),
        remarks: z.string().optional().nullable(),
        type: z.enum(['routine', 'booster']).optional(),
        isExternallyAdministered: z.boolean().optional(),
        externalAdministeredBy: z.string().optional().nullable(),
      })
    )
    .optional(),

  weightRecords: z
    .array(
      z.object({
        date: z.string(),
        weight: z.number(),
      })
    )
    .optional(),
});
