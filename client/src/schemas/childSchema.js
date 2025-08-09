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
// and then transforms it to "YYYY-MM-DD"
const dateSchema = z
  .union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
  ])
  .transform((val) => val.substring(0, 10))
  .pipe(
    z
      .string({
        required_error: 'मिति आवश्यक छ',
        invalid_type_error: 'मिति स्ट्रिङ ढाँचामा हुनुपर्छ',
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'मिति ढाँचा सही छैन (YYYY-MM-DD)'),
  )
  .refine((val) => {
    try {
      const [year, month, day] = val.split('-').map(Number);
      const nepaliDate = new NepaliDate(year, month - 1, day);
      const gregorianDate = nepaliDate.toJsDate();
      return !isNaN(gregorianDate.getTime());
    } catch (e) {
      console.log(e, 'error zod date');
      return false;
    }
  }, 'अमान्य मिति');

// Schema for a single vaccine dose date
const vaccineDateSchema = z
  .union([dateSchema, z.string().length(0)]) // Allow empty string
  .nullable()
  .optional()
  .transform((val) => (val === '' ? null : val));

export const createChildSchema = z.object({
  sewaDartaNumber: numericString,
  wardNumber: numericString,
  casteCode: numericString,
  birthDate: dateSchema,
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
      z.array(vaccineDateSchema),
    )
    .optional()
    .transform((val) => {
      // Ensure all vaccine keys are present with empty arrays if not provided
      const defaultVaccines = {
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
      return { ...defaultVaccines, ...(val || {}) };
    }),

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
