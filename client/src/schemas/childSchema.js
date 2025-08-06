import { z } from 'zod';

const numericString = z.coerce
  .number({
    invalid_type_error: 'नम्बर हुनुपर्छ',
  })
  .refine((val) => val > 0, {
    message: 'मान सकारात्मक संख्या हुनुपर्छ',
  });

// Schema for a single vaccine dose date
const vaccineDateSchema = z
  .string()
  .refine(
    (val) => val === '' || /^\d{4}-\d{2}-\d{2}$/.test(val),
    'मिति ढाँचा अमान्य छ। "YYYY-MM-DD" प्रयोग गर्नुहोस्',
  )
  .optional()
  .nullable()
  .transform((val) => (val === '' ? null : val));

export const createChildSchema = z.object({
  sewaDartaNumber: numericString,

  wardNumber: numericString,
  casteCode: numericString,

  birthDate: z
    .string({
      required_error: 'जन्म मिति आवश्यक छ',
      invalid_type_error: 'जन्म मिति स्ट्रिङ ढाँचामा हुनुपर्छ',
    })
    .min(1, { message: 'जन्म मिति आवश्यक छ' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'मिति ढाँचा सही छैन (YYYY-MM-DD)')
    .refine((val) => {
      try {
        const [year, month, day] = val.split('-').map(Number);
        const nepaliDate = new NepaliDate(year, month - 1, day);
        const gregorianDate = nepaliDate.toJsDate();
        return !isNaN(gregorianDate.getTime());
      } catch (e) {
        return false;
      }
    }, 'अमान्य जन्म मिति'),

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
    .optional(),

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
