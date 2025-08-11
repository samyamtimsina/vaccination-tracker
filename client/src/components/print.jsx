import React, { forwardRef } from 'react';

const VaccinationCard = forwardRef(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[21cm] h-[15cm] border border-black p-4 font-sans text-[12px] flex flex-col justify-between"
    >
      {/* --- FRONT SIDE --- */}
      <div className="flex justify-between items-start border-b border-black pb-2">
        <img src="/images/gov-logo.png" alt="Gov Logo" className="w-14 h-14" />
        <div className="text-center">
          <h1 className="font-bold text-[14px]">
            नवजात शिशु तथा बाल रोगको खोप कार्ड
          </h1>
          <p>नेपाल सरकार - स्वास्थ्य तथा जनसंख्या मन्त्रालय</p>
        </div>
        <img src="/images/seal.png" alt="Seal" className="w-14 h-14" />
      </div>

      {/* Info Fields */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        <div>बच्चाको नाम: {data.fullName}</div>
        <div>जन्म मिति: {data.birthDate}</div>
        <div>लिङ्ग: {data.gender}</div>
        <div>बुवाको नाम: {data.fatherName}</div>
        <div>आमाको नाम: {data.motherName}</div>
        <div>ठेगाना: {data.address}</div>
        <div>वडा नं.: {data.wardNumber}</div>
        <div>स्वास्थ्य संस्थाको नाम: {data.healthPost}</div>
        <div>स्वास्थ्यकर्मीको नाम: {data.healthWorker}</div>
        <div>कार्ड जारी मिति: {data.issueDate}</div>
      </div>

      {/* Small Notes */}
      <div className="border border-black mt-2 p-1 text-[10px] leading-tight">
        यो कार्ड सुरक्षित राख्नुहोस् र प्रत्येक खोप लगाउँदा स्वास्थ्यकर्मीलाई
        देखाउनुहोस्।
      </div>

      {/* --- BACK SIDE --- */}
      <div className="mt-4">
        <h2 className="font-bold text-center mb-1">
          खोप तालिका / Immunization Schedule
        </h2>
        <table className="w-full border border-black text-[10px]">
          <thead>
            <tr>
              <th className="border border-black p-1">खोप</th>
              <th className="border border-black p-1">खोप दिने उमेर</th>
              <th className="border border-black p-1">मिति</th>
              <th className="border border-black p-1">
                स्वास्थ्यकर्मीको हस्ताक्षर
              </th>
            </tr>
          </thead>
          <tbody>
            {data.vaccinations.map((v, idx) => (
              <tr key={idx}>
                <td className="border border-black p-1">{v.name}</td>
                <td className="border border-black p-1">{v.age}</td>
                <td className="border border-black p-1">{v.date}</td>
                <td className="border border-black p-1">{v.signedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default VaccinationCard;
