// Helper to convert days/weeks/months to months (approximate)
import { bsToAd, adToBs } from '@sbmdkl/nepali-date-converter';
export function toMonths({
  recommendedAtDays = 0,
  recommendedAtWeeks = 0,
  recommendedAtMonths = 0,
}) {
  return (
    recommendedAtMonths + recommendedAtWeeks / 4.345 + recommendedAtDays / 30.44
  );
}
import { faker } from '@faker-js/faker';

// Maps a vaccine name string to a standardized enum-like string
export const mapVaccineNameToEnum = (vaccineName) => {
  // Map frontend vaccine names to Prisma VaccineType enum values
  const vaccineMap = {
    'BCG': 'BCG',
    'DPT_HepB_hib': 'DPT_HEPB_HIB',
    'ROTA': 'ROTA',
    'OPV': 'OPV',
    'fIPV': 'FIPV',
    'PCV': 'PCV',
    'MR': 'MR',
    'JE': 'JE',
    'TCV': 'TCV',
    'HPV': 'HPV'
  };

  // Get the enum value or default to 'OTHERS'
  const enumValue = vaccineMap[vaccineName];
  if (!enumValue) {
    console.warn(`Unknown vaccine type: ${vaccineName}, defaulting to OTHERS`);
    return 'OTHERS';
  }
  return enumValue;
};

// Helper function to convert BS date string to JS Date object
export function parseBsDateString(bsDateStr) {
  if (!bsDateStr) return null;
  try {
    // Expect bsDateStr in 'YYYY-MM-DD' format
    const [yearStr, monthStr, dayStr] = bsDateStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid date components');
    }

    // Convert BS to AD using bsToAd function
    const formattedBsDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const adDateStr = bsToAd(formattedBsDate);

    // Convert the AD date string to a Date object
    const adDate = new Date(adDateStr);

    // Validate the resulting date
    if (isNaN(adDate.getTime())) {
      throw new Error('Invalid AD date generated');
    }

    return adDate;
  } catch (error) {
    console.error('Invalid BS date string:', bsDateStr, error);
    return null;
  }
}
export const generateRandomBsDate = () => {
  // Generate a random AD date in the past 10 years to ensure a plausible birth date
  const randomAdDate = faker.date.past({ years: 10 });
  const year = randomAdDate.getFullYear();
  const month = (randomAdDate.getMonth() + 1).toString().padStart(2, '0');
  const day = randomAdDate.getDate().toString().padStart(2, '0');
  const adDateString = `${year}-${month}-${day}`;

  // Convert the valid AD date string to a BS date string
  const bsDateString = adToBs(adDateString);

  // Return the BS date string in 'YYYY-MM-DD' format
  return bsDateString;
};
