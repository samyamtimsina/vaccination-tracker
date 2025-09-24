// helpers/calculateAge.jsx
import NepaliDate from 'nepali-date-converter';

// Export the current BS date as a formatted string YYYY-MM-DD
export const currentBSYear = (() => {
    const today = new NepaliDate();
    return today.getYear(); // just the BS year as a number
})();

// Age calculation function
export function calculateAge(birthDate) {
    if (
        !birthDate ||
        typeof birthDate !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)
    ) {
        return { years: 0, months: 0, days: 0, weeks: 0 };
    }

    try {
        const [year, month, day] = birthDate.split('-').map(Number);
        const nepaliBirthDate = new NepaliDate(year, month - 1, day);
        const currentNepaliDate = new NepaliDate(); // today in BS

        let years = currentNepaliDate.getYear() - nepaliBirthDate.getYear();
        let months = currentNepaliDate.getMonth() - nepaliBirthDate.getMonth();
        let days = currentNepaliDate.getDate() - nepaliBirthDate.getDate();

        if (days < 0) {
            months -= 1;
            const prevMonth = new NepaliDate(
                currentNepaliDate.getYear(),
                currentNepaliDate.getMonth(),
                0
            );
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        const birthGregorian = nepaliBirthDate.toJsDate();
        const currentGregorian = currentNepaliDate.toJsDate();
        const totalDays = Math.floor(
            (currentGregorian - birthGregorian) / (1000 * 60 * 60 * 24)
        );

        return {
            years: Math.max(years, 0),
            months: Math.max(months, 0),
            days: Math.max(days, 0),
            weeks: Math.floor(Math.max(totalDays, 0) / 7),
        };
    } catch (err) {
        console.error('Error calculating age:', err);
        return { years: 0, months: 0, days: 0, weeks: 0 };
    }
}
