import { useState } from 'react';
import BSDatePicker from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import NepaliDate from 'nepali-date-converter';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function NepaliDatePicker({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        readOnly
        onClick={() => setShow(!show)}
        className="border p-2 rounded"
      />
      <FaRegCalendarAlt
        onClick={() => setShow(!show)}
        className="absolute right-2 top-2 cursor-pointer text-xl"
      />
      {show && (
        <BSDatePicker
          onChange={(e) => {
            const { bsDate } = e;
            onChange(bsDate);
            setShow(false);
          }}
          language="ne"
          theme="dark"
        />
      )}
    </div>
  );
}
