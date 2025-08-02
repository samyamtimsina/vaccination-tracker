import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import axiosClient from '../api/axiosClient.js';

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

// Modal Component
const Modal = ({ show, title, messages, onClose, isSuccess }) => {
  if (!show) return null;
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const textColor = isSuccess ? 'text-green-700' : 'text-red-700';
  const headerColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const buttonBg = isSuccess ? 'bg-green-600' : 'bg-red-600';
  const buttonHover = isSuccess ? 'hover:bg-green-700' : 'hover:bg-red-700';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div
        className={`p-6 border-2 shadow-lg rounded-lg max-w-sm w-full ${bgColor}`}
      >
        <h3 className={`text-xl font-bold mb-4 ${headerColor}`}>{title}</h3>
        <ul className="list-disc list-inside space-y-1">
          {messages.map((msg, index) => (
            <li key={index} className={`text-sm ${textColor}`}>
              {msg}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-sm ${buttonBg} ${buttonHover}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Vaccine Dose Input Component
const VaccineDoseInput = ({
  index,
  vaccineName,
  doseIndex,
  register,
  errors,
  getValues,
  setValue,
  trigger,
  today,
}) => {
  const fieldName = `citizens.${index}.vaccines.${vaccineName}.${doseIndex}`;
  return (
    <div className="flex flex-col gap-1 items-center">
      <input
        type="date"
        {...register(fieldName, {
          validate: (value) => {
            if (!value) return true; // Optional field
            const birthDate = getValues(`citizens.${index}.birthDate`);
            if (!birthDate) return 'Please provide a Birth Date first.';
            const vaccineDate = new Date(value);
            const birth = new Date(birthDate);
            return (
              vaccineDate >= birth ||
              'Vaccine date cannot be before birth date.'
            );
          },
        })}
        className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
      />
      <button
        type="button"
        className="w-full text-[10px] bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold border border-gray-400 rounded-md px-2 py-1 mt-1"
        onClick={() => {
          setValue(fieldName, today, { shouldValidate: true });
          trigger(fieldName);
        }}
      >
        आजको मिति
      </button>
      {errors.citizens?.[index]?.vaccines?.[vaccineName]?.[doseIndex] && (
        <span className="text-red-500 text-xs">
          {errors.citizens[index].vaccines[vaccineName][doseIndex].message}
        </span>
      )}
    </div>
  );
};

// Reusable Citizen Form Fields Component
const CitizenFormFields = ({
  index,
  register,
  errors,
  getValues,
  setValue,
  trigger,
  today,
}) => {
  return (
    <>
      <td className="border border-gray-400 p-1">
        <input
          {...register(`citizens.${index}.wardNumber`)}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
      </td>
      <td className="border border-gray-400 p-1">
        <input
          {...register(`citizens.${index}.fullName`, {
            required: 'नाम अनिबार्य छ',
          })}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
        {errors.citizens?.[index]?.fullName && (
          <span className="text-red-500 text-xs">
            {errors.citizens[index].fullName.message}
          </span>
        )}
      </td>
      <td className="border border-gray-400 p-1">
        <input
          {...register(`citizens.${index}.lastName`, {
            required: 'थर अनिबार्य छ',
          })}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
        {errors.citizens?.[index]?.lastName && (
          <span className="text-red-500 text-xs">
            {errors.citizens[index].lastName.message}
          </span>
        )}
      </td>
      <td className="border border-gray-400 p-1">
        <input
          type="number"
          {...register(`citizens.${index}.casteCode`, {
            required: 'जातिको कोड अनिबार्य छ',
            min: { value: 1, message: 'Caste Code must be positive.' },
          })}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
        {errors.citizens?.[index]?.casteCode && (
          <span className="text-red-500 text-xs">
            {errors.citizens[index].casteCode.message}
          </span>
        )}
      </td>
      <td className="border border-gray-400 p-1">
        <select
          {...register(`citizens.${index}.gender`, {
            required: 'लिङ्ग अनिबार्य छ',
          })}
          className="w-full px-1 py-2 text-sm text-center rounded-md border border-gray-300"
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
          {...register(`citizens.${index}.parentName`)}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
      </td>
      <td className="border border-gray-400 p-1">
        <input
          {...register(`citizens.${index}.tole`)}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
      </td>
      <td className="border border-gray-400 p-1">
        <input
          type="tel"
          {...register(`citizens.${index}.phoneNumber`)}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
      </td>
      <td className="border border-gray-400 p-1">
        <input
          type="date"
          {...register(`citizens.${index}.birthDate`, {
            required: 'जन्म मिति अनिबार्य छ',
          })}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
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
            <VaccineDoseInput
              index={index}
              vaccineName={vaccine.name}
              doseIndex={doseIndex}
              register={register}
              errors={errors}
              getValues={getValues}
              setValue={setValue}
              trigger={trigger}
              today={today}
            />
          </td>
        )),
      )}
      <td className="border border-gray-400 p-1">
        <input
          type="checkbox"
          {...register(`citizens.${index}.purnaKhop`)}
          className="h-5 w-5 rounded text-blue-600 mx-auto block"
        />
      </td>
      <td className="border border-gray-400 p-1">
        <input
          {...register(`citizens.${index}.remarks`)}
          className="w-full px-1 py-2 text-center text-sm rounded-md border border-gray-300"
        />
      </td>
    </>
  );
};

// Mobile Citizen Form Component
const MobileCitizenForm = ({
  index,
  register,
  errors,
  getValues,
  setValue,
  trigger,
  today,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-700">
          सेवा दर्ता नं.
        </label>
        <input
          {...register(`citizens.${index}.wardNumber`)}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">नाम</label>
        <input
          {...register(`citizens.${index}.fullName`, {
            required: 'नाम अनिबार्य छ',
          })}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
        />
        {errors.citizens?.[index]?.fullName && (
          <span className="text-red-500 text-xs">
            {errors.citizens[index].fullName.message}
          </span>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">थर</label>
        <input
          {...register(`citizens.${index}.lastName`, {
            required: 'थर अनिबार्य छ',
          })}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
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
          type="number"
          {...register(`citizens.${index}.casteCode`, {
            required: 'जातिको कोड अनिबार्य छ',
            min: { value: 1, message: 'Caste Code must be positive.' },
          })}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
        />
        {errors.citizens?.[index]?.casteCode && (
          <span className="text-red-500 text-xs">
            {errors.citizens[index].casteCode.message}
          </span>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">लिङ्ग</label>
        <select
          {...register(`citizens.${index}.gender`, {
            required: 'लिङ्ग अनिबार्य छ',
          })}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
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
          {...register(`citizens.${index}.parentName`)}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          गाउँ/टोल
        </label>
        <input
          {...register(`citizens.${index}.tole`)}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          फोन नं.
        </label>
        <input
          type="tel"
          {...register(`citizens.${index}.phoneNumber`)}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          जन्म मिति
        </label>
        <input
          type="date"
          {...register(`citizens.${index}.birthDate`, {
            required: 'जन्म मिति अनिबार्य छ',
          })}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
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
                <div key={doseIndex} className="mt-2">
                  <label className="block text-xs text-gray-600">
                    {doseName}
                  </label>
                  <VaccineDoseInput
                    index={index}
                    vaccineName={vaccine.name}
                    doseIndex={doseIndex}
                    register={register}
                    errors={errors}
                    getValues={getValues}
                    setValue={setValue}
                    trigger={trigger}
                    today={today}
                  />
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
          type="checkbox"
          {...register(`citizens.${index}.purnaKhop`)}
          className="h-5 w-5 rounded text-blue-600"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">
          कैफियत
        </label>
        <input
          {...register(`citizens.${index}.remarks`)}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300"
        />
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
    getValues,
    trigger,
  } = useForm({
    defaultValues: { citizens: [createEmptyCitizen()] },
    shouldUnregister: false,
  });

  const { fields, append } = useFieldArray({ control, name: 'citizens' });

  const onSubmit = async (data) => {
    try {
      const citizensToSubmit = data.citizens.filter(
        (citizen) =>
          citizen.fullName.trim() !== '' || citizen.birthDate.trim() !== '',
      );
      if (citizensToSubmit.length === 0) {
        setModalMessages([
          'No valid data to submit. Please fill in at least one citizen.',
        ]);
        setIsSuccessModal(false);
      } else {
        const response = await axiosClient.post(
          'http://localhost:5000/api/citizens',
          { citizens: citizensToSubmit },
        );
        console.log('Citizen created:', response.data);
        setModalMessages(['Form submitted successfully!']);
        setIsSuccessModal(true);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setModalMessages([
        `Error: ${error.response?.data?.message || error.message}`,
      ]);
      setIsSuccessModal(false);
    }
    setShowModal(true);
  };

  const handleAddRow = () => append(createEmptyCitizen());
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gray-50 min-h-screen p-2 flex flex-col items-center font-['Inter']">
      <h1 className="text-xl font-bold mb-4">खोप सेवा दर्ता फारम</h1>
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
                  colSpan={
                    VACCINES.reduce((acc, v) => acc + v.doses.length, 0) + 1
                  }
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
                  <CitizenFormFields
                    index={index}
                    register={register}
                    errors={errors}
                    getValues={getValues}
                    setValue={setValue}
                    trigger={trigger}
                    today={today}
                  />
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
              <MobileCitizenForm
                index={index}
                register={register}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                trigger={trigger}
                today={today}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 text-sm rounded-lg shadow-md"
          >
            सेभ गर्नुहोस्
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 text-sm rounded-lg shadow-md"
          >
            नयाँ हरु थप्नुहोस्
          </button>
        </div>
      </form>

      <Modal
        show={showModal}
        title={isSuccessModal ? 'Success!' : 'Error'}
        messages={modalMessages}
        onClose={() => setShowModal(false)}
        isSuccess={isSuccessModal}
      />
    </div>
  );
}
