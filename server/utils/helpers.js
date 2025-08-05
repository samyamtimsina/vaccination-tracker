// Helper to convert days/weeks/months to months (approximate)
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
