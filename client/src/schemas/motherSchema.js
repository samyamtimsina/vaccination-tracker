// File: schemas/motherSchema.js
import { z } from 'zod';
import NepaliDate from 'nepali-date-converter';

// A reusable schema for dates in Nepali B.S. format
const bsDateSchema = z
  .string()
  .min(1, 'मिति आवश्यक छ')
  .regex(/^\\d{4}-\\d{2}-\\d{2}$/, "मितिले 'YYYY-MM-DD' ढाँचा पछ्याउनुपर्छ")
  .refine(
    (val) => {
      try {
        const [year, month, day] = val.split('-').map(Number);
        new NepaliDate(year, month - 1, day); // month is 0-indexed in the library
        return true;
      } catch {
        return false;
      }
    },
    {
      message: 'अमान्य बिक्रम सम्बत मिति',
    },
  );

// Schema for a single TD vaccine dose
const tdDoseSchema = z.object({
  doseNumber: z.number().int().min(1, 'खोपको मात्रा नम्बर आवश्यक छ'),
  dateGiven: bsDateSchema,
  administeredById: z.number().int().min(1, 'प्रशासक ID आवश्यक छ'),
  remarks: z.string().optional().nullable(),
});

// Main schema for creating a new Mother record
export const createMotherSchema = z.object({
  fullName: z.string().min(1, 'पूरा नाम आवश्यक छ'),
  lastName: z.string().optional().nullable(),
  casteCode: z.number().int().min(1, 'जाति कोड आवश्यक छ'),
  age: z.number().int().min(10, 'उमेर १० भन्दा बढी हुनुपर्छ'),
  phoneNumber: z.string().optional().nullable(),
  tole: z.string().min(1, 'टोल आवश्यक छ'),
  wardNumber: z.number().int().min(1, 'वार्ड नम्बर आवश्यक छ'),
  isFromOtherMunicipality: z.boolean().default(false),
  remarks: z.string().optional().nullable(),
  // Use z.array to validate that tdDoses is an array of tdDoseSchema objects
  tdDoses: z.array(tdDoseSchema),
});
