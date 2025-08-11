import { z } from 'zod';

const numericString = z.coerce.number().refine((val) => val > 0, {
  message: 'Value must be a positive number',
});

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

export const createChildSchema = z.object({
  birthDate: bsDateSchema,
  sewaDartaNumber: numericString,
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
      z.array(bsDateSchema.nullable()), //
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
