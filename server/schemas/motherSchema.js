import { z } from 'zod';

// Reusing the same numericString validation logic
const numericString = z.coerce.number().refine((val) => val > 0, {
  message: 'Value must be a positive number',
});

// Reusing the same BS date schema for consistent validation
const bsDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in "YYYY-MM-DD" BS format')
  .refine(
    (val) => {
      const [year, month, day] = val.split('-').map(Number);
      return year >= 2000 && month >= 1 && month <= 12 && day >= 1 && day <= 32;
    },
    {
      message: 'Invalid BS date values',
    },
  );

// Schema for a single TD dose
const tdDoseSchema = z.object({
  doseNumber: z.number().int().min(1, 'Dose number must be at least 1'),
  dateGiven: bsDateSchema,
  administeredById: z.number().int().min(1, 'Administered by ID is required'),
  remarks: z.string().optional().nullable(),
});

// Main schema for creating a Mother record
export const createMotherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  lastName: z.string().optional().nullable(),
  casteCode: numericString.refine((val) => val > 0, {
    message: 'Caste code is required',
  }),
  age: numericString.refine((val) => val > 0, {
    message: 'Age is required',
  }),
  phoneNumber: z.string().optional().nullable(),
  tole: z.string().optional().nullable(),
  wardNumber: numericString.refine((val) => val > 0, {
    message: 'Ward number is required',
  }),
  pregnancyCount: numericString.refine((val) => val >= 0, {
    message: 'Pregnancy count cannot be negative',
  }),
  previousTDTakenCount: numericString.refine((val) => val >= 0, {
    message: 'Previous TD taken count cannot be negative',
  }),
  isFromOtherMunicipality: z.boolean().default(false),
  remarks: z.string().optional().nullable(),
  tdDoses: z.array(tdDoseSchema).min(0, 'TD doses must be an array'), // Allow empty array
});