import NepaliDate from 'nepali-date-converter';

export function calculateAge(birthDate) {
    if (!birthDate ||
        typeof birthDate !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        return { days: 0, weeks: 0, months: 0 };
    }

    try {
        const [year, month, day] = birthDate.split('-').map(Number);
        if (isNaN(year) ||
            isNaN(month) ||
            isNaN(day) ||
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 32) {
            throw new Error('Invalid date components');
        }
        const nepaliBirthDate = new NepaliDate(year, month - 1, day);
        const currentNepaliDate = new NepaliDate();

        let diffMonths = (currentNepaliDate.getYear() - nepaliBirthDate.getYear()) * 12 +
            (currentNepaliDate.getMonth() - nepaliBirthDate.getMonth());
        let diffDays = currentNepaliDate.getDate() - nepaliBirthDate.getDate();

        if (diffDays < 0) {
            diffMonths -= 1;
            const lastMonth = new NepaliDate(
                nepaliBirthDate.getYear(),
                nepaliBirthDate.getMonth(),
                0
            );
            diffDays += lastMonth.getDate();
        }
        if (diffMonths < 0) {
            diffMonths += 12;
        }

        const birthGregorian = nepaliBirthDate.toJsDate();
        const currentGregorian = currentNepaliDate.toJsDate();
        const totalDays = Math.floor(
            (currentGregorian.getTime() - birthGregorian.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const age = {
            days: Math.max(totalDays, 0),
            weeks: Math.floor(Math.max(totalDays, 0) / 7),
            months: Math.max(diffMonths, 0),
        };

        return age;
    } catch (err) {
        console.error('Error calculating age:', err);
        return { days: 0, weeks: 0, months: 0 };
    }
}
