import { useForm, Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { vaccineSchedule } from '../utils/vaccineSchedule';

import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';

import axiosClient from '../api/axiosClient.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from 'react-icons/fa';

export default function AddChild() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue, // setValue is needed to clear specific fields
  } = useForm();

  const navigate = useNavigate(); //  back navigation
  const gender = useWatch({
    control,
    name: 'gender',
    defaultValue: '',
  });

  const onSubmit = async (data) => {
    try {
      const formatted = {
        ...data,
        vaccines: Object.fromEntries(
          Object.entries(data.vaccines || {}).map(
            ([vaccineName, doseArray]) => [
              vaccineName,
              doseArray.map((d) => (d === '' ? null : d)),
            ],
          ),
        ),
      };

      const res = await axiosClient.post('/api/child', formatted);
      toast.success('बालबालिका डेटा सफलतापूर्वक सेभ भयो!');

      console.log('Response:', res.data);

      reset(); // Reset form after successful submission
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('डेटा सेभ गर्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।');
    }
  };

  // Filter out HPV for non-females
  const vaccineEntries = Object.entries(vaccineSchedule).filter(
    ([name]) => !(name === 'HPV' && gender !== 'female'),
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-full mx-auto p-6 bg-white rounded shadow space-y-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            बालबालिका थप्नुहोस्
          </h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-md shadow-sm border border-blue-200 hover:bg-blue-200 hover:text-blue-700 hover:border-blue-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            <FaArrowLeft />
            <span>ड्यासबोर्डमा फर्कनुहोस्</span>
          </button>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="sm:col-span-1 lg:col-span-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="sewaDartaNumber"
            >
              सेवा दर्ता नम्बर
            </label>
            <input
              id="sewaDartaNumber"
              type="number"
              {...register('sewaDartaNumber')}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="सेवा दर्ता नम्बर"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="fullName">
              पहिलो नाम<span className="text-red-600">*</span>
            </label>
            <input
              id="fullName"
              {...register('fullName', { required: true })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="पहिलो नाम"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">पहिलो नाम आवश्यक छ</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="lastName">
              थर
            </label>
            <input
              id="lastName"
              {...register('lastName')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="थर"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="wardNumber">
              वडा नम्बर<span className="text-red-600">*</span>
            </label>
            <input
              id="wardNumber"
              {...register('wardNumber', { required: true })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="वडा नम्बर"
            />
            {errors.wardNumber && (
              <p className="text-red-600 text-sm mt-1">वडा नम्बर आवश्यक छ</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="casteCode">
              जात कोड<span className="text-red-600">*</span>
            </label>
            <input
              id="casteCode"
              type="number"
              {...register('casteCode', {
                required: true,
                valueAsNumber: true,
              })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="जात कोड"
            />
            {errors.casteCode && (
              <p className="text-red-600 text-sm mt-1">जात कोड आवश्यक छ</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="gender">
              लिङ्ग<span className="text-red-600">*</span>
            </label>
            <select
              id="gender"
              {...register('gender', { required: true })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">लिङ्ग छान्नुहोस्</option>
              <option value="male">पुरुष</option>
              <option value="female">महिला</option>
              <option value="other">अन्य</option>
            </select>
            {errors.gender && (
              <p className="text-red-600 text-sm mt-1">लिङ्ग आवश्यक छ</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="parentName">
              अभिभावकको नाम
            </label>
            <input
              id="parentName"
              {...register('parentName')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="अभिभावकको नाम"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="tole">
              टोल
            </label>
            <input
              id="tole"
              {...register('tole')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="टोल"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="phoneNumber">
              फोन नम्बर
            </label>
            <input
              id="phoneNumber"
              {...register('phoneNumber')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="फोन नम्बर"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="birthDate">
              जन्म मिति (बिक्रम संवत)<span className="text-red-600">*</span>
            </label>
            <div className="relative flex items-center">
              <Controller
                name="birthDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <NepaliDatePicker
                      {...field}
                      className="w-full"
                      inputClassName="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.value || ''}
                      onChange={field.onChange}
                      style={{ cursor: 'pointer' }}
                    />
                    {/* The x button is now conditionally rendered */}
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => setValue('birthDate', '')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-lg text-red-500 hover:text-red-700 bg-transparent hover:bg-gray-200 rounded-full transition-colors focus:outline-none cursor-pointer"
                        title="मिति मेट्नुहोस्"
                      >
                        ✕
                      </button>
                    )}
                  </>
                )}
              />
            </div>
            {errors.birthDate && (
              <p className="text-red-600 text-sm mt-1">जन्म मिति आवश्यक छ</p>
            )}
          </div>

          <div className="flex items-center mt-6 space-x-2">
            <input
              type="checkbox"
              {...register('purnaKhop')}
              id="purnaKhop"
              className="form-checkbox rounded"
            />
            <label htmlFor="purnaKhop" className="select-none">
              पूर्ण खोप
            </label>
          </div>
        </section>

        {/* Vaccination Dates */}
        <section className="border rounded p-5 space-y-6 bg-gray-50 mt-6">
          <h3 className="text-xl font-semibold mb-4 text-center">खोपहरु</h3>

          {vaccineEntries.map(([vaccineName, doses]) => (
            <div
              key={vaccineName}
              className="p-4 rounded border border-gray-300 bg-white shadow-sm"
            >
              <h4 className="font-semibold mb-3">{vaccineName}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {doses.map((dose, idx) => (
                  <div key={idx}>
                    <label
                      className="block mb-1 text-sm font-medium"
                      htmlFor={`${vaccineName}-${idx}`}
                    >
                      मात्रा {dose.dose} (
                      {dose.recommendedAtMonths
                        ? `${dose.recommendedAtMonths} महिना`
                        : dose.recommendedAtWeeks
                          ? `${dose.recommendedAtWeeks} हप्ता`
                          : `${dose.recommendedAtDays} दिन`}
                      )
                    </label>
                    <div className="relative flex items-center">
                      <Controller
                        name={`vaccines.${vaccineName}.${idx}`}
                        control={control}
                        render={({ field }) => (
                          <>
                            <NepaliDatePicker
                              {...field}
                              className="w-full"
                              inputClassName="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={field.value || ''}
                              onChange={field.onChange}
                              style={{ cursor: 'pointer' }}
                            />
                            {/* The x button is now conditionally rendered */}
                            {field.value && (
                              <button
                                type="button"
                                onClick={() =>
                                  setValue(`vaccines.${vaccineName}.${idx}`, '')
                                }
                                className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-lg text-red-500 hover:text-red-700 bg-transparent hover:bg-gray-200 rounded-full transition-colors focus:outline-none cursor-pointer"
                                title="मिति मेट्नुहोस्"
                              >
                                ✕
                              </button>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <label className="block font-medium mb-1" htmlFor="remarks">
            कैफियत
          </label>
          <textarea
            id="remarks"
            {...register('remarks')}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="कैफियत लेख्नुहोस्"
          />
        </section>

        <div className="flex space-x-3 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded text-lg font-semibold transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            }`}
          >
            {isSubmitting ? 'सेभ हुँदैछ...' : 'सेभ गर्नुहोस्'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md shadow-sm transition-all duration-200 cursor-pointer"
          >
            रद्द गर्नुहोस्
          </button>
        </div>
      </form>
    </>
  );
}
