import { z } from 'zod';

const numericString = z.coerce.number().refine((val) => val > 0, {
  message: 'Value must be a positive number',
});

// A simplified schema that only validates the BS date string format
const bsDateSchema = z
  .string()
  .min(1, 'Date is required')
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

// Corrected schema for a single vaccine dose with date and optional remarks
const vaccineDoseSchema = z.object({
  date: bsDateSchema.nullable().optional(),
  remarks: z.string().optional().nullable(),
});

// Schema for a single weight record, which was missing
const weightRecordSchema = z.object({
  date: bsDateSchema,
  weight: z.coerce.number().min(0.1, 'Weight must be greater than 0.1 kg'),
});

export const createChildSchema = z.object({
  // sewaDartaNumber is removed because it's auto-incrementing

  birthDate: bsDateSchema,
  wardNumber: numericString,
  casteCode: numericString,
  isFromOtherMunicipality: z.boolean().default(false),

  gender: z
    .string()
    .min(1, 'Gender is required')
    .transform((val) => val.toUpperCase().trim())
    .pipe(
      z.enum(['MALE', 'FEMALE', 'OTHER'], {
        errorMap: (issue, ctx) => ({
          message: 'Gender must be MALE, FEMALE, or OTHER',
        }),
      }),
    ),

  // Corrected schema for vaccines to match your payload
  vaccines: z
    .record(
      z.enum([
        'BCG',
        'ROTA',
        'OPV',
        'fIPV',
        'PCV',
        'DPT_HepB_hib',
        'MR',
        'JE',
        'TCV',
        'HPV',
      ]),
      z.array(vaccineDoseSchema),
    )
    .optional()
    .transform((val) => {
      // This transform ensures the final object has empty arrays for any missing vaccine types.
      const vaccinesObject = val || {};
      const allVaccineTypes = [
        'BCG',
        'ROTA',
        'OPV',
        'fIPV',
        'PCV',
        'DPT_HepB_hib',
        'MR',
        'JE',
        'TCV',
        'HPV',
      ];
      const transformed = {};
      for (const type of allVaccineTypes) {
        transformed[type] = vaccinesObject[type] || [];
      }
      return transformed;
    }),

  // Re-added the weight records field
  weightRecords: z.array(weightRecordSchema),

  fullName: z.string().min(1, 'Full name is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  tole: z.string().min(1, 'Tole is required'),
  phoneNumber: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || /^\+?\d{7,15}$/.test(val), {
      message: 'Phone number must be 7-15 digits, optionally starting with +',
    }),
  purnaKhop: z.boolean().default(false),
  remarks: z.string().optional(),
});
