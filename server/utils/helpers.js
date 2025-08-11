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

// Maps a vaccine name string to a standardized enum-like string
export function mapVaccineNameToEnum(name) {
  if (!name) return 'OTHERS';
  const normalized = name.toLowerCase();

  switch (normalized) {
    case 'bcg':
      return 'BCG';
    case 'rota':
      return 'ROTA';
    case 'polio':
    case 'opv':
      return 'OPV';
    case 'fipv':
      return 'fIPV';
    case 'pcv':
      return 'PCV';
    case 'dpt-hepb-hib':
    case 'dpt_hepb_hib':
    case 'dpthepbhib':
      return 'DPT_HepB_hib';
    case 'mr':
      return 'MR';
    case 'je':
      return 'JE';
    case 'tcv':
      return 'TCV';
    case 'hpv':
      return 'HPV';
    default:
      return 'OTHERS';
  }
}

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
