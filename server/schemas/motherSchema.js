import { z } from 'zod';

// Schema for a single TD dose
const tdDoseSchema = z.object({
  doseNumber: z.number().int().min(1, 'Dose number must be at least 1'),
  dateGiven: z.date().nullable(), // <-- must be a JS Date object or null!
  administeredById: z.number().int().min(1, 'Administered by ID is required'),
  remarks: z.string().optional(),
});

// Main schema for creating a Mother record
export const createMotherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  lastName: z.string().optional(),
  casteCode: z.number().int(),
  dateOfBirth: z.date(), // <-- must be a JS Date object!
  phoneNumber: z.string().min(1),
  tole: z.string().optional(),
  pregnancyCount: z.number().int(),
  previousTDTakenCount: z.number().int(),
  remarks: z.string().optional(),
  isFromOtherMunicipality: z.boolean(),
  tdDoses: z.array(tdDoseSchema).optional(),
});