import { useState } from 'react';
import BSDatePicker from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function NepaliDatePicker({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full max-w-xs">
      <div className="input input-bordered flex items-center gap-2 pr-10">
        <input
          type="text"
          value={value}
          readOnly
          onClick={() => setShow(!show)}
          className="grow bg-transparent outline-none"
          placeholder="Select Date"
        />
        <FaRegCalendarAlt
          onClick={() => setShow(!show)}
          className="cursor-pointer text-lg text-base-content/70 hover:text-base-content"
        />
      </div>
      {show && (
        <div className="absolute z-10 mt-2 rounded-box bg-base-100 shadow-lg">
          <BSDatePicker
            onChange={(e) => {
              const { bsDate } = e;
              onChange(bsDate);
              setShow(false);
            }}
            language="ne"
            theme="dark"
          />
        </div>
      )}
    </div>
  );
}
