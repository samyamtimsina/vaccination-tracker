import { z } from 'zod';

export const vaccinationSchema = z.object({
  vaccineType: z.enum([
    'BCG',
    'ROTA',
    'OPV',
    'DPT_HepB_hib',
    'fIPV',
    'PCV',
    'MR',
    'JE',
    'TCV',
    'OTHERS',
  ]),
  // FIX 1: Apply .max() before .optional() and .nullable() for customVaccineName
  customVaccineName: z.string().max(100).optional().nullable(),
  doseNumber: z.number().int().min(1),
  dateGiven: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  isComplete: z.boolean(),
  // FIX 2: Apply .max() before .optional() and .nullable() for remarks
  remarks: z.string().max(500).optional().nullable(),
  recommendedAtMonths: z.number().int().min(0),
});

export const citizenSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255),
  wardNumber: z.number().int().min(1, 'Ward number required'),
  parentName: z.string().min(1, 'Parent name required').max(255),
  address: z.string().min(1, 'Address required').max(500),
  phoneNumber: z.string().min(6, 'Phone number required').max(20),
  casteCode: z.number().int().min(0),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid birth date',
  }),
  vaccinations: z.array(vaccinationSchema).optional(),
});
