// App.jsx
import React from 'react';
import VaccinationCardOverlay from './print';

export default function App() {
  return (
    <div>
      <button
        onClick={() => window.print()}
        className="print:hidden bg-blue-500 text-white px-4 py-2 rounded"
      >
        Print
      </button>
      <VaccinationCardOverlay childInfo={childData} />
    </div>
  );
}
