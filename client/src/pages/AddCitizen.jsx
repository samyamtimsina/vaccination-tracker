// src/pages/AddCitizen.jsx
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { citizenSchema } from '../validators/citizenSchema';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const vaccineOptions = [
  'BCG',
  'ROTA',
  'OPV',
  'DPT_HepB_hib',
  'fIPV',
  'PCV',
  'MR',
  'JE',
  'TCV',
  'OTHERS',
];

export default function AddCitizen() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(citizenSchema),
    defaultValues: {
      vaccinations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vaccinations',
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/citizens', data);
      alert('Citizen and vaccinations added!');
      navigate('/citizens');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to add citizen');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Add Citizen</h2>

      <div className="space-y-4">
        <input
          {...register('fullName')}
          placeholder="Full Name"
          className="w-full border p-2"
        />
        <p className="text-red-500">{errors.fullName?.message}</p>

        <input
          {...register('wardNumber')}
          placeholder="Ward Number"
          type="number"
          className="w-full border p-2"
        />
        <p className="text-red-500">{errors.wardNumber?.message}</p>

        <input
          {...register('parentName')}
          placeholder="Parent Name"
          className="w-full border p-2"
        />
        <p className="text-red-500">{errors.parentName?.message}</p>

        <input
          {...register('address')}
          placeholder="Address"
          className="w-full border p-2"
        />
        <p className="text-red-500">{errors.address?.message}</p>

        <input
          {...register('phoneNumber')}
          placeholder="Phone Number"
          className="w-full border p-2"
        />
        <p className="text-red-500">{errors.phoneNumber?.message}</p>

        <input
          {...register('casteCode')}
          placeholder="Caste Code"
          type="number"
          className="w-full border p-2"
        />
        <p className="text-red-500">{errors.casteCode?.message}</p>

        <input
          {...register('birthDate')}
          type="date"
          className="w-full border p-2"
        />
        <p className="text-red-500">{errors.birthDate?.message}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vaccinations</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded space-y-2 relative">
            <select
              {...register(`vaccinations.${index}.vaccineType`)}
              className="w-full border p-2"
            >
              {vaccineOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              {...register(`vaccinations.${index}.customVaccineName`)}
              placeholder="Custom Vaccine Name (if OTHERS)"
              className="w-full border p-2"
            />

            <input
              {...register(`vaccinations.${index}.doseNumber`)}
              type="number"
              placeholder="Dose Number"
              className="w-full border p-2"
            />

            <input
              {...register(`vaccinations.${index}.dateGiven`)}
              type="date"
              className="w-full border p-2"
            />

            <input
              {...register(`vaccinations.${index}.recommendedAtMonths`)}
              type="number"
              placeholder="Recommended At (Months)"
              className="w-full border p-2"
            />

            <input
              {...register(`vaccinations.${index}.remarks`)}
              placeholder="Remarks"
              className="w-full border p-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`vaccinations.${index}.isComplete`)}
              />
              Completed
            </label>

            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-1 right-1 text-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              vaccineType: 'BCG',
              customVaccineName: '',
              doseNumber: 1,
              dateGiven: '',
              isComplete: false,
              remarks: '',
              recommendedAtMonths: 0,
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Vaccination
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Submit Citizen
      </button>
    </form>
  );
}
