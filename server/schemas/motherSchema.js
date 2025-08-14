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

export const createMotherSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  lastName: z.string().optional(),
  casteCode: numericString.refine((val) => val > 0, {
    message: 'Caste code is required',
  }),
  age: numericString.refine((val) => val > 0, {
    message: 'Age is required',
  }),
  phoneNumber: z.string().optional(),
  tole: z.string().optional(),
  wardNumber: numericString.refine((val) => val > 0, {
    message: 'Ward number is required',
  }),
  pregnancyCount: numericString.optional(),
  previousTDTakenCount: numericString.optional(),

  // The date fields now use the same bsDateSchema for validation
  tdDose1: bsDateSchema.optional().nullable(),
  tdDose2: bsDateSchema.optional().nullable(),
  tdDose2Plus: bsDateSchema.optional().nullable(),

  remarks: z.string().optional(),
});
