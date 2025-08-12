import React from 'react';
import { BsFillCheckSquareFill } from 'react-icons/bs';

// Helper function to get the date parts as an object
const getFormattedNepaliDateParts = (dateString) => {
  if (!dateString) return { day: '', month: '', year: '' };

  const [year, month, day] = dateString.split('-');

  const toNepaliNumerals = (numString) => {
    const nepaliNumerals = {
      0: '०',
      1: '१',
      2: '२',
      3: '३',
      4: '४',
      5: '५',
      6: '६',
      7: '७',
      8: '८',
      9: '९',
    };
    return numString
      .split('')
      .map((digit) => nepaliNumerals[digit] || digit)
      .join('');
  };

  const nepaliDay = toNepaliNumerals(day);
  const nepaliMonth = toNepaliNumerals(month);
  const nepaliYear = toNepaliNumerals(year);

  return { day: nepaliDay, month: nepaliMonth, year: nepaliYear };
};

export default function VaccinationCardOverlay({ data }) {
  // Log the received data for debugging
  console.log('Rendering VaccinationCardOverlay with data:', data);

  // Get the separate date parts
  const birthDateParts = getFormattedNepaliDateParts(data.birthDate);

  return (
    <div
      className="relative print-page"
      style={{
        width: '16cm',
        height: '21.5cm',
        backgroundImage: "url('/assets/page1.jpg')",
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'Noto Sans Devanagari', sans-serif",
      }}
    >
      {/* Name */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '5.8cm',
          left: '3.9cm',
          fontSize: '20px',
        }}
      >
        {data.fullName}
      </div>

      {/* Birth Date - Day */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '6.6cm',
          left: '2.9cm', // Adjust this left position for the day
          fontSize: '20px',
        }}
      >
        {birthDateParts.day}
      </div>

      {/* Birth Date - Month */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '6.6cm',
          left: '3.9cm', // Adjust this left position for the month
          fontSize: '20px',
        }}
      >
        {birthDateParts.month}
      </div>

      {/* Birth Date - Year */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '6.6cm',
          left: '4.9cm', // Adjust this left position for the year
          fontSize: '20px',
        }}
      >
        {birthDateParts.year}
      </div>
      {/* Gender - Male Tick Mark */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '6.1cm', // Adjust these values to the correct vertical position
          left: '13.3cm', // Adjust this value to the correct horizontal position for MALE
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        {data.gender === 'MALE' ? <BsFillCheckSquareFill size="14" /> : ''}
      </div>

      {/* Gender - Female Tick Mark */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '6.1cm', // Adjust these values to the correct vertical position
          left: '11.3cm', // Adjust this value to the correct horizontal position for FEMALE
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        {data.gender === 'FEMALE' ? <BsFillCheckSquareFill size="16" /> : ''}
      </div>

      {/* Address (Tole, Ward Number) */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '3.5cm',
          left: '3.4cm',
          fontSize: '12px',
        }}
      >
        {`${data.tole}`}
      </div>

      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '4.5cm',
          left: '3.4cm',
          fontSize: '12px',
        }}
      >
        {`वडा नं. ${data.wardNumber}`}
      </div>

      {/* Parent Name */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '7.2cm',
          left: '3.8cm',
          fontSize: '12px',
        }}
      >
        {data.parentName}
      </div>

      {/* Mobile Number */}
      <div
        style={{
          color: 'black',
          position: 'absolute',
          top: '9.7cm',
          left: '10.5cm',
          fontSize: '20px',
        }}
      >
        {data.phoneNumber}
      </div>

      {/* Vaccination List */}
      {data.vaccinations.map((vaccine, index) => (
        <div
          key={vaccine.id}
          style={{
            color: 'black',
            position: 'absolute',
            top: `${10 + index * 0.5}cm`,
            left: '1cm',
            fontSize: '12px',
          }}
        >
          {`${vaccine.vaccineType}: ${getFormattedNepaliDateParts(vaccine.dateGiven).day}/${getFormattedNepaliDateParts(vaccine.dateGiven).month}/${getFormattedNepaliDateParts(vaccine.dateGiven).year}`}
        </div>
      ))}
    </div>
  );
}
