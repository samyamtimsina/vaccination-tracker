import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import axiosClient from '../api/axiosClient.js';

// Use a mock API client since axiosClient is not provided

const VACCINES = [
  { name: 'BCG', doses: ['BCG'] },
  { name: 'Rota', doses: ['Rota 1', 'Rota 2'] },
  { name: 'Polio', doses: ['bOPV 1', 'bOPV 2', 'bOPV 3'] },
  { name: 'fIPV', doses: ['fIPV 1', 'fIPV 2'] },
  { name: 'PCV', doses: ['PCV 1', 'PCV 2', 'PCV 3'] },
  {
    name: 'DPT-HepB-Hib',
    doses: ['DPT-HepB-Hib 1', 'DPT-HepB-Hib 2', 'DPT-HepB-Hib 3'],
  },
  { name: 'MR', doses: ['MR 1', 'MR 2'] },
  { name: 'JE', doses: ['JE'] },
  { name: 'TCV', doses: ['TCV'] },
  { name: 'HPV', doses: ['HPV 1', 'HPV 2'] },
];

// Helper component for the modal dialog
const Modal = ({ show, title, messages, onClose, isSuccess }) => {
  if (!show) return null;

  const bgColor = isSuccess
    ? 'bg-green-100 border-green-400 text-green-700'
    : 'bg-red-100 border-red-400 text-red-700';
  const headerColor = isSuccess ? 'text-green-800' : 'text-red-800';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div
        className="relative p-6 border-2 shadow-lg rounded-lg max-w-sm w-full"
        style={{
          borderColor: isSuccess ? 'rgb(74 222 128)' : 'rgb(248 113 113)',
          backgroundColor: isSuccess ? 'rgb(220 252 231)' : 'rgb(254 226 226)',
        }}
      >
        <h3 className={`text-xl font-bold mb-4 ${headerColor}`}>{title}</h3>
        <ul className="list-disc list-inside space-y-1">
          {messages.map((msg, index) => (
            <li key={index} className="text-sm">
              {msg}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isSuccess ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VaccinationRegister() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessages, setModalMessages] = useState([]);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const createEmptyCitizen = () => {
    const vaccineFields = {};
    VACCINES.forEach((vaccine) => {
      vaccineFields[vaccine.name] = vaccine.doses.map(() => '');
    });
    return {
      fullName: '',
      lastName: '',
      wardNumber: '',
      casteCode: '',
      gender: '',
      parentName: '',
      tole: '',
      phoneNumber: '',
      birthDate: '',
      vaccines: vaccineFields,
      purnaKhop: false,
      remarks: '',
    };
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues, // To get form values for validation
    trigger, // To manually trigger validation
  } = useForm({
    defaultValues: { citizens: [createEmptyCitizen()] },
  });

  const { fields, append } = useFieldArray({ control, name: 'citizens' });

  // ... (rest of your component)

  const onSubmit = async (data) => {
    // First, let react-hook-form run its validations based on 'register' rules
    // handleSubmit already does this before calling onSubmit if there are formState errors.
    // However, your custom date validation needs to be explicitly handled if you want
    // react-hook-form's error object to reflect it.

    let customValidationErrors = {}; // Object to store custom validation errors

    data.citizens.forEach((citizen, citizenIndex) => {
      const birthDateStr = citizen.birthDate;
      if (birthDateStr) {
        const birthDate = new Date(birthDateStr);
        VACCINES.forEach((vaccine) => {
          citizen.vaccines[vaccine.name].forEach(
            (vaccineDateStr, doseIndex) => {
              if (vaccineDateStr) {
                const vaccineDate = new Date(vaccineDateStr);
                if (vaccineDate < birthDate) {
                  // Add custom error to react-hook-form's error structure
                  const fieldName = `citizens.${citizenIndex}.vaccines.${vaccine.name}.${doseIndex}`;
                  // Use setValue with error option, or manually set an error if needed
                  // For direct validation integration:
                  if (!customValidationErrors.citizens) {
                    customValidationErrors.citizens = {};
                  }
                  if (!customValidationErrors.citizens[citizenIndex]) {
                    customValidationErrors.citizens[citizenIndex] = {};
                  }
                  if (!customValidationErrors.citizens[citizenIndex].vaccines) {
                    customValidationErrors.citizens[citizenIndex].vaccines = {};
                  }
                  if (
                    !customValidationErrors.citizens[citizenIndex].vaccines[
                      vaccine.name
                    ]
                  ) {
                    customValidationErrors.citizens[citizenIndex].vaccines[
                      vaccine.name
                    ] = [];
                  }
                  customValidationErrors.citizens[citizenIndex].vaccines[
                    vaccine.name
                  ][doseIndex] = {
                    type: 'custom',
                    message: `Error for बच्चा ${citizenIndex + 1}: ${vaccine.name} ${vaccine.doses[doseIndex]} date cannot be before the birth date.`,
                  };
                }
              }
            },
          );
        });
      }
    });

    // Merge react-hook-form's errors with custom errors
    // Note: 'errors' from formState is reactive. After handleSubmit runs,
    // it should already contain errors from 'register' rules.
    // We'll primarily rely on the 'errors' object directly from formState later.

    // If there are any errors (either from register rules or custom validation)
    if (
      Object.keys(errors).length > 0 ||
      Object.keys(customValidationErrors).length > 0
    ) {
      // Flatten all error messages for display
      const mergedErrors = { ...errors, ...customValidationErrors }; // Simple merge, complex if paths conflict

      // A more robust way to flatten messages from the 'mergedErrors' object
      const allErrorMessages = [];

      // Helper to recursively extract messages
      const extractMessages = (obj) => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
              if (value.message) {
                allErrorMessages.push(value.message);
              }
              extractMessages(value); // Recurse for nested objects
            } else if (Array.isArray(value)) {
              value.forEach((item) => {
                if (item && typeof item === 'object' && item.message) {
                  allErrorMessages.push(item.message);
                } else if (item && typeof item === 'object') {
                  // Recurse for arrays of objects
                  extractMessages(item);
                }
              });
            }
          }
        }
      };

      extractMessages(mergedErrors); // Populate allErrorMessages

      setModalMessages(allErrorMessages.filter(Boolean)); // Filter out any undefined/null
      setIsSuccessModal(false);
      setShowModal(true);
      return; // Stop submission
    }

    // If validation passes (no errors from RHF or custom), proceed with API call
    try {
      const citizensToSubmit = data.citizens.filter(
        (citizen) =>
          citizen.fullName.trim() !== '' || citizen.birthDate.trim() !== '',
      );

      if (citizensToSubmit.length > 0) {
        const response = await axiosClient.post(
          'http://localhost:5000/api/citizens',
          { citizens: citizensToSubmit },
        );
        console.log('Citizen created:', response.data);
        setModalMessages(['Form submitted successfully!']);
        setIsSuccessModal(true);
        setShowModal(true);
        // Optional: Reset the form completely after successful submission
        // reset();
      } else {
        setModalMessages(['No data to submit.']);
        setIsSuccessModal(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setModalMessages([
        `Error: ${error.response?.data?.message || error.message}`,
      ]);
      setIsSuccessModal(false);
      setShowModal(true);
    }
    console.log('Form errors:', errors);
    console.log('Form values on error:', getValues());
  };

  // Function to handle setting today's date and immediately triggering validation
  const handleSetTodayDate = async (citizenIndex, vaccineName, doseIndex) => {
    const fieldName = `citizens.${citizenIndex}.vaccines.${vaccineName}.${doseIndex}`;
    setValue(fieldName, today, { shouldValidate: true });
    await trigger(fieldName); // Manually trigger validation for the specific field
  };

  const handleAddRow = () => append(createEmptyCitizen());

  const today = new Date().toISOString().split('T')[0];
  const totalVaccineDoses = VACCINES.reduce(
    (total, vaccine) => total + vaccine.doses.length,
    0,
  );

  return (
    <div className="bg-gray-50 min-h-screen p-2 flex flex-col items-center font-['Inter']">
      <h1 className="text-xl font-bold mb-4">
        खोप सेवा दर्ता फारम (Vaccination Service Registration Form)
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full shadow-lg rounded-lg bg-white p-4"
      >
        {/* Desktop View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="table-auto border-collapse w-full min-w-[1500px] border border-gray-400 text-center text-[10px]">
            <thead className="bg-gray-200">
              <tr>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[30px]"
                >
                  सि. नं.
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[80px]"
                >
                  सेवा दर्ता नं.
                </th>
                <th colSpan="2" className="border border-gray-400 p-2">
                  बच्चाको
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[50px]"
                >
                  जातिको कोड
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[30px]"
                >
                  लिङ्ग
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[120px]"
                >
                  आमा/बुवाको नाम, थर
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[80px]"
                >
                  गाउँ/टोल
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[80px]"
                >
                  फोन नं.
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[80px]"
                >
                  जन्म मिति
                </th>
                <th
                  colSpan={totalVaccineDoses + 1}
                  className="border border-gray-400 p-2"
                >
                  खोप मिति
                </th>
                <th
                  rowSpan="3"
                  className="border border-gray-400 p-2 min-w-[120px]"
                >
                  कैफियत
                </th>
              </tr>
              <tr>
                <th
                  rowSpan="2"
                  className="border border-gray-400 p-2 min-w-[100px]"
                >
                  नाम
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-400 p-2 min-w-[100px]"
                >
                  थर
                </th>
                {VACCINES.map((vaccine) => (
                  <th
                    key={vaccine.name}
                    colSpan={vaccine.doses.length}
                    className="border border-gray-400 p-2"
                  >
                    {vaccine.name}
                  </th>
                ))}
                <th rowSpan="2" className="border border-gray-400 p-2">
                  पूर्ण खोप पूरा गरेको
                </th>
              </tr>
              <tr>
                {VACCINES.map((vaccine) =>
                  vaccine.doses.map((doseName, doseIndex) => (
                    <th
                      key={`${vaccine.name}-${doseIndex}`}
                      className="border border-gray-400 p-2 min-w-[120px]"
                    >
                      {doseName}
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="border border-gray-400 p-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`wardNumber-${index}`}
                      {...register(`citizens.${index}.wardNumber`)}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`fullName-${index}`}
                      {...register(`citizens.${index}.fullName`, {
                        required: 'नाम अनिबार्य छ ',
                      })}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.citizens?.[index]?.fullName && (
                      <span className="text-red-500 text-xs">
                        {errors.citizens[index].fullName.message}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`lastName-${index}`}
                      {...register(`citizens.${index}.lastName`, {
                        required: 'थर अनिबार्य छ ',
                      })}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.citizens?.[index]?.lastName && (
                      <span className="text-red-500 text-xs">
                        {errors.citizens[index].lastName.message}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`casteCode-${index}`}
                      type="number"
                      {...register(`citizens.${index}.casteCode`, {
                        required: 'जाित कोड अनिबार्य छ ',
                        min: {
                          value: 1,
                          message: 'Caste Code must be a positive number.',
                        },
                      })}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.citizens?.[index]?.casteCode && (
                      <span className="text-red-500 text-xs">
                        {errors.citizens[index].casteCode.message}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-400 p-1">
                    <select
                      id={`gender-${index}`}
                      {...register(`citizens.${index}.gender`, {
                        required: 'लिंग अनिबार्य छ ',
                      })}
                      className="w-full px-1 py-2 text-sm text-center rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">--</option>
                      <option value="M">पु</option>
                      <option value="F">सा</option>
                    </select>
                    {errors.citizens?.[index]?.gender && (
                      <span className="text-red-500 text-xs">
                        {errors.citizens[index].gender.message}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`parentName-${index}`}
                      {...register(`citizens.${index}.parentName`)}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`tole-${index}`}
                      {...register(`citizens.${index}.tole`)}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`phoneNumber-${index}`}
                      type="tel"
                      {...register(`citizens.${index}.phoneNumber`)}
                      className="w-25 px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`birthDate-${index}`}
                      type="date"
                      {...register(`citizens.${index}.birthDate`, {
                        required: 'नाम अनिबार्य छ ',
                      })}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.citizens?.[index]?.birthDate && (
                      <span className="text-red-500 text-xs">
                        {errors.citizens[index].birthDate.message}
                      </span>
                    )}
                  </td>
                  {VACCINES.map((vaccine) =>
                    vaccine.doses.map((_, doseIndex) => (
                      <td
                        key={`${vaccine.name}-${doseIndex}`}
                        className="border border-gray-400 p-1 min-w-[120px]"
                      >
                        <div className="flex flex-col gap-1 items-center">
                          <input
                            id={`vaccine-${vaccine.name}-${doseIndex}-${index}`}
                            type="date"
                            {...register(
                              `citizens.${index}.vaccines.${vaccine.name}.${doseIndex}`,
                              {
                                validate: (value) => {
                                  if (!value) return true; // Don't validate if field is empty
                                  const birthDate = getValues(
                                    `citizens.${index}.birthDate`,
                                  );
                                  if (!birthDate)
                                    return 'Please provide a Birth Date first.';
                                  const vaccineDate = new Date(value);
                                  const birth = new Date(birthDate);
                                  return (
                                    vaccineDate >= birth ||
                                    'Vaccine date cannot be before birth date.'
                                  );
                                },
                              },
                            )}
                            className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          {errors.citizens?.[index]?.vaccines?.[vaccine.name]?.[
                            doseIndex
                          ] && (
                            <span className="text-red-500 text-xs">
                              {
                                errors.citizens[index].vaccines[vaccine.name][
                                  doseIndex
                                ].message
                              }
                            </span>
                          )}
                          <button
                            type="button"
                            className="w-full text-[10px] bg-gray-300 hover:bg-gray-400 transition-colors text-gray-800 font-semibold border border-gray-400 rounded-md px-2 py-1 shadow-sm mt-1"
                            onClick={() =>
                              handleSetTodayDate(index, vaccine.name, doseIndex)
                            }
                          >
                            आजको मिति
                          </button>
                        </div>
                      </td>
                    )),
                  )}
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`purnaKhop-${index}`}
                      type="checkbox"
                      {...register(`citizens.${index}.purnaKhop`)}
                      className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </td>
                  <td className="border border-gray-400 p-1">
                    <input
                      id={`remarks-${index}`}
                      {...register(`citizens.${index}.remarks`)}
                      className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              <h3 className="text-sm font-semibold mb-2">बच्चा {index + 1}</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    सेवा दर्ता नं.
                  </label>
                  <input
                    id={`wardNumber-${index}`}
                    {...register(`citizens.${index}.wardNumber`)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    नाम
                  </label>
                  <input
                    id={`fullName-${index}`}
                    {...register(`citizens.${index}.fullName`, {
                      required: 'नाम अनिबार्य छ ',
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.citizens?.[index]?.fullName && (
                    <span className="text-red-500 text-xs">
                      {errors.citizens[index].fullName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    थर
                  </label>
                  <input
                    id={`lastName-${index}`}
                    {...register(`citizens.${index}.lastName`, {
                      required: 'Last Name is required.',
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.citizens?.[index]?.lastName && (
                    <span className="text-red-500 text-xs">
                      {errors.citizens[index].lastName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    जातिको कोड
                  </label>
                  <input
                    id={`casteCode-${index}`}
                    type="number"
                    {...register(`citizens.${index}.casteCode`, {
                      required: 'Caste Code is required.',
                      min: {
                        value: 1,
                        message: 'Caste Code must be a positive number.',
                      },
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.citizens?.[index]?.casteCode && (
                    <span className="text-red-500 text-xs">
                      {errors.citizens[index].casteCode.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    लिङ्ग
                  </label>
                  <select
                    id={`gender-${index}`}
                    {...register(`citizens.${index}.gender`, {
                      required: 'Gender is required.',
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">--</option>
                    <option value="M">पु</option>
                    <option value="F">सा</option>
                  </select>
                  {errors.citizens?.[index]?.gender && (
                    <span className="text-red-500 text-xs">
                      {errors.citizens[index].gender.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    आमा/बुवाको नाम, थर
                  </label>
                  <input
                    id={`parentName-${index}`}
                    {...register(`citizens.${index}.parentName`)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    गाउँ/टोल
                  </label>
                  <input
                    id={`tole-${index}`}
                    {...register(`citizens.${index}.tole`)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    फोन नं.
                  </label>
                  <input
                    id={`phoneNumber-${index}`}
                    type="tel" // Use type="tel" as it's semantically correct for phone numbers
                    {...register(`citizens.${index}.phoneNumber`, {
                      pattern: {
                        // Allows only digits (0-9), and optionally + (at the start), space, -, (, )
                        value: /^[+]?[0-9\s()-]*$/,
                        message:
                          'Invalid phone number format. Only digits, spaces, -, (), and + are allowed.',
                      },
                      minLength: {
                        value: 7, // Example: minimum 7 digits for a realistic phone number
                        message: 'Phone number must be at least 7 digits long.',
                      },
                      maxLength: {
                        value: 15, // Example: maximum 15 digits
                        message: 'Phone number cannot exceed 15 digits.',
                      },
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {/* Display error message if validation fails */}
                  {errors.citizens?.[index]?.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.citizens[index].phoneNumber.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    जन्म मिति
                  </label>
                  <input
                    id={`birthDate-${index}`}
                    type="date"
                    {...register(`citizens.${index}.birthDate`, {
                      required: 'Birth Date is required.',
                    })}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.citizens?.[index]?.birthDate && (
                    <span className="text-red-500 text-xs">
                      {errors.citizens[index].birthDate.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    खोप मिति
                  </label>
                  <div className="space-y-3">
                    {VACCINES.map((vaccine) => (
                      <div key={vaccine.name} className="border-t pt-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                          {vaccine.name}
                        </h4>
                        {vaccine.doses.map((doseName, doseIndex) => (
                          <div
                            key={`${vaccine.name}-${doseIndex}`}
                            className="mt-2"
                          >
                            <label className="block text-xs text-gray-600">
                              {doseName}
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                id={`vaccine-${vaccine.name}-${doseIndex}-${index}`}
                                type="date"
                                {...register(
                                  `citizens.${index}.vaccines.${vaccine.name}.${doseIndex}`,
                                  {
                                    validate: (value) => {
                                      if (!value) return true; // Don't validate if field is empty
                                      const birthDate = getValues(
                                        `citizens.${index}.birthDate`,
                                      );
                                      if (!birthDate)
                                        return 'Please provide a Birth Date first.';
                                      const vaccineDate = new Date(value);
                                      const birth = new Date(birthDate);
                                      return (
                                        vaccineDate >= birth ||
                                        'Vaccine date cannot be before birth date.'
                                      );
                                    },
                                  },
                                )}
                                className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                className="text-xs bg-gray-300 hover:bg-gray-400 transition-colors text-gray-800 font-semibold border border-gray-400 rounded-md px-2 py-1.5 shadow-sm"
                                onClick={() =>
                                  handleSetTodayDate(
                                    index,
                                    vaccine.name,
                                    doseIndex,
                                  )
                                }
                              >
                                आजको मिति
                              </button>
                            </div>
                            {errors.citizens?.[index]?.vaccines?.[
                              vaccine.name
                            ]?.[doseIndex] && (
                              <span className="text-red-500 text-xs">
                                {
                                  errors.citizens[index].vaccines[vaccine.name][
                                    doseIndex
                                  ].message
                                }
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    पूर्ण खोप पूरा गरेको
                  </label>
                  <input
                    id={`purnaKhop-${index}`}
                    type="checkbox"
                    {...register(`citizens.${index}.purnaKhop`)}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    कैफियत
                  </label>
                  <input
                    id={`remarks-${index}`}
                    {...register(`citizens.${index}.remarks`)}
                    className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold px-6 py-2 text-sm rounded-lg shadow-md"
          >
            सेभ गर्नुहोस् (Save)
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-2 text-sm rounded-lg shadow-md"
          >
            नयाँ हरु थप्नुहोस् (Add Row)
          </button>
        </div>
      </form>

      {/* Modal for displaying validation errors or success messages */}
      <Modal
        show={showModal}
        title={isSuccessModal ? 'Success!' : 'Validation Errors'}
        messages={modalMessages}
        onClose={() => setShowModal(false)}
        isSuccess={isSuccessModal}
      />
    </div>
  );
}
