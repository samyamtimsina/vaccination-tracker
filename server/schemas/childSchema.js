import { z } from 'zod';

const numericString = z.coerce.number().refine((val) => val > 0, {
  message: 'Value must be a positive number',
});

// A new schema for dates that can handle both formats
const dateSchema = z
  .union([
    z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Invalid date format. Please use "YYYY-MM-DD"',
      ),
    z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        'Invalid ISO date format',
      ),
  ])
  .transform((val) => {
    // Take the first 10 characters to get the "YYYY-MM-DD" part
    return val.substring(0, 10);
  })
  .or(z.date()); // Also allow Date objects

export const createChildSchema = z.object({
  sewaDartaNumber: numericString,
  wardNumber: numericString,
  casteCode: numericString,

  birthDate: dateSchema.pipe(
    // You can add more refinements or transformations here if needed
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format after transformation'),
  ),

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
      z.array(
        z.union([dateSchema, z.string().nullable().optional()]).nullable(),
      ),
    )
    .optional()
    .transform((val) => {
      if (!val) {
        return {
          BCG: [],
          ROTA: [],
          OPV: [],
          fIPV: [],
          PCV: [],
          DPT_HepB_hib: [],
          MR: [],
          JE: [],
          TCV: [],
          HPV: [],
        };
      }
      return {
        BCG: val.BCG || [],
        ROTA: val.ROTA || [],
        OPV: val.OPV || [],
        fIPV: val.fIPV || [],
        PCV: val.PCV || [],
        DPT_HepB_hib: val.DPT_HepB_hib || [],
        MR: val.MR || [],
        JE: val.JE || [],
        TCV: val.TCV || [],
        HPV: val.HPV || [],
      };
    }),

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
