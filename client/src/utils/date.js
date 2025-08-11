// Safe date conversion utilities that avoid Date constructor issues
import { ADToBS, BSToAD } from 'bikram-sambat-js';

/**
 * Parse ISO date string to components
 * @param {string} isoString - ISO date string like "2024-07-15T00:00:00.000Z"
 * @returns {Object} - {year, month, day} or null if invalid
 */
function parseISOString(isoString) {
  try {
    // Match ISO date pattern
    const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    // Validate components
    if (
      year < 1900 ||
      year > 2100 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return null;
    }

    return { year, month, day };
  } catch {
    return null;
  }
}

/**
 * Convert Gregorian date (string or Date) to Nepali date string
 * @param {Date|string} dateInput - Date input
 * @returns {string} - Nepali date in YYYY-MM-DD format
 */
export function safeGregorianToNepali(dateInput) {
  try {
    if (!dateInput) return 'No Date';

    let year, month, day;

    if (typeof dateInput === 'string') {
      // Parse ISO string directly
      const parsed = parseISOString(dateInput);
      if (!parsed) return 'Invalid Date';
      ({ year, month, day } = parsed);
    } else if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      // Handle Date object
      year = dateInput.getFullYear();
      month = dateInput.getMonth() + 1;
      day = dateInput.getDate();
    } else {
      return 'Invalid Date';
    }

    const nepali = ADToBS(year, month, day);
    const pad = (n) => n.toString().padStart(2, '0');

    return `${nepali.year}-${pad(nepali.month)}-${pad(nepali.day)}`;
  } catch (err) {
    console.error('Error in safeGregorianToNepali:', err, 'Input:', dateInput);
    return 'Conversion Error';
  }
}

/**
 * Calculate age from ISO date string
 * @param {string} birthDateString - ISO date string
 * @returns {Object} - Age object
 */
export function safeCalculateAge(birthDateString) {
  try {
    if (!birthDateString) {
      return {
        days: 0,
        weeks: 0,
        months: 0,
        years: 0,
        formatted: 'No Birth Date',
      };
    }

    const birthParts = parseISOString(birthDateString);
    if (!birthParts) {
      return {
        days: 0,
        weeks: 0,
        months: 0,
        years: 0,
        formatted: 'Invalid Birth Date',
      };
    }

    // Create dates safely
    const birthDate = new Date(
      birthParts.year,
      birthParts.month - 1,
      birthParts.day,
    );
    const now = new Date();

    if (isNaN(birthDate.getTime())) {
      return {
        days: 0,
        weeks: 0,
        months: 0,
        years: 0,
        formatted: 'Invalid Birth Date',
      };
    }

    // Calculate total days
    const totalDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));

    // Calculate years, months, days
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Format for display
    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    const formatted =
      parts.length === 0 ? 'Less than a day old' : parts.join(', ');

    return {
      days: Math.max(totalDays, 0),
      weeks: Math.floor(Math.max(totalDays, 0) / 7),
      months: Math.max(years * 12 + months, 0),
      years: Math.max(years, 0),
      formatted,
    };
  } catch (err) {
    console.error('Error in safeCalculateAge:', err, 'Input:', birthDateString);
    return {
      days: 0,
      weeks: 0,
      months: 0,
      years: 0,
      formatted: 'Age Calculation Error',
    };
  }
}

/**
 * Format ISO date string for display
 * @param {string} isoString - ISO date string
 * @param {string} locale - Locale for formatting
 * @returns {string} - Formatted date
 */
export function safeFormatDate(isoString, locale = 'en-US') {
  try {
    if (!isoString) return 'No Date';

    const parsed = parseISOString(isoString);
    if (!parsed) return 'Invalid Date';

    const date = new Date(parsed.year, parsed.month - 1, parsed.day);

    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (err) {
    console.error('Error in safeFormatDate:', err, 'Input:', isoString);
    return 'Format Error';
  }
}

export function nepaliToGregorianDate(nepaliDateString) {
  if (!nepaliDateString || !/^\d{4}-\d{2}-\d{2}$/.test(nepaliDateString)) {
    return null;
  }

  try {
    const [year, month, day] = nepaliDateString.split('-').map(Number);

    // Validate date components
    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 32
    ) {
      throw new Error('Invalid date components');
    }

    // Use bikram-sambat-js for conversion (more reliable)
    const gregorian = BSToAD(year, month, day);

    // Create Date object (month is 0-indexed in JavaScript)
    return new Date(gregorian.year, gregorian.month - 1, gregorian.day);
  } catch (err) {
    console.error('Error converting Nepali to Gregorian date:', err);
    return null;
  }
}
