import { z } from 'zod';
import NepaliDate from 'nepali-date-converter';

const numericString = z.coerce
  .number({
    invalid_type_error: 'नम्बर हुनुपर्छ',
  })
  .refine((val) => val > 0, {
    message: 'मान सकारात्मक संख्या हुनुपर्छ',
  });

// A robust date schema that accepts either "YYYY-MM-DD" or the full ISO string
const dateSchema = z
  .union([
    z.string({
      required_error: 'मिति आवश्यक छ',
      invalid_type_error: 'मिति स्ट्रिङ प्रकारको हुनुपर्छ',
    }),
    z.date({
      invalid_type_error: 'मिति मिति प्रकारको हुनुपर्छ',
    }),
  ])
  .transform((val) => {
    if (val instanceof Date) {
      // Get UTC date parts to avoid timezone shift
      const year = val.getUTCFullYear();
      const month = val.getUTCMonth();
      const day = val.getUTCDate();
      const nepDate = new NepaliDate(year, month, day);
      return `${nepDate.getYear()}-${String(nepDate.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(nepDate.getDate()).padStart(2, '0')}`;
    }
    return val;
  })
  .pipe(
    z
      .string()
      .min(1, 'मिति खाली हुनु हुँदैन')
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "मितिले 'YYYY-MM-DD' ढाँचा पछ्याउनुपर्छ (जस्तै: २०८०-०१-१५)",
      )
      .refine(
        (val) => {
          const parts = val.split('-');
          if (parts.length !== 3) return false;
          const [year, month, day] = parts.map(Number);
          return (
            year >= 2000 && month >= 1 && month <= 12 && day >= 1 && day <= 32
          );
        },
        {
          message: 'मितिको वर्ष, महिना वा दिन अमान्य छ',
        },
      )
      .refine(
        (val) => {
          try {
            const [year, month, day] = val.split('-').map(Number);
            new NepaliDate(year, month - 1, day);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: 'अमान्य बिक्रम सम्बत मिति',
        },
      ),
  );

// New schema for a single vaccine dose with date and optional remarks
const vaccineDoseSchema = z.object({
  date: z
    .union([dateSchema, z.string().length(0)])
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val)),
  remarks: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
});

// New schema for a single weight record
const weightRecordSchema = z.object({
  date: dateSchema,
  weight: z.coerce.number().min(0.1, 'तौल ०.१ kg भन्दा बढी हुनुपर्छ'),
});

export const createChildSchema = z.object({
  sewaDartaNumber: numericString,
  wardNumber: numericString,
  casteCode: numericString,
  birthDate: dateSchema,
  isFromOtherMunicipality: z.boolean().default(false),
  gender: z
    .string()
    .min(1, 'लिङ्ग आवश्यक छ')
    .transform((val) => val.toUpperCase().trim())
    .pipe(
      z.enum(['MALE', 'FEMALE', 'OTHER'], {
        errorMap: (issue, ctx) => ({
          message: 'लिङ्ग पुरुष, महिला वा अन्य हुनुपर्छ',
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
      z.array(vaccineDoseSchema),
    )
    .optional(),

  weightRecords: z.array(weightRecordSchema),

  fullName: z.string().min(1, 'पुरा नाम आवश्यक छ'),
  parentName: z.string().min(1, 'अभिभावकको नाम आवश्यक छ'),
  tole: z.string().min(1, 'टोल आवश्यक छ'),
  phoneNumber: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || /^\+?\d{7,15}$/.test(val), {
      message:
        'फोन नम्बर 7-15 अंकको हुनुपर्छ, वैकल्पिक रूपमा + बाट सुरु हुन सक्छ',
    }),
  purnaKhop: z.boolean().default(false),
  remarks: z.string().optional(),
});
