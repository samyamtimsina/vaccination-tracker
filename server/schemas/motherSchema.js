import { z } from 'zod';

const numericString = z.coerce.number().refine((val) => val > 0, {
  message: 'Value must be a positive number',
});

export const createMotherSchema = z.object({
  sewaDartaNumber: numericString.refine((val) => val > 0, {
    message: 'Sewa Darta Number is required',
  }),
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

  // Transform date string to Date object for optional fields
  tdDose1: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  tdDose2: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  tdDose2Plus: z
    .string()
    .transform((val) => new Date(val))
    .optional(),

  remarks: z.string().optional(),
});
