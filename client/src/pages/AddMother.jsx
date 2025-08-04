import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import axiosClient from '../api/axiosClient';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AddMother() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      await axiosClient.post('/api/mothers', data);
      toast.success('आमा को विवरण सफलतापूर्वक थपियो');
      reset();
    } catch (err) {
      console.error(err);
      toast.error('डेटा थप्न सकिएन');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-100 space-y-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
              आमा को विवरण थप्नुहोस्
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

          <section className="bg-white p-4 sm:p-5 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              व्यक्तिगत जानकारी
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
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
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="fullName"
                >
                  नाम<span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  {...register('fullName', { required: true })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="नाम"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">नाम आवश्यक छ</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="lastName"
                >
                  थर<span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  {...register('lastName', { required: true })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="थर"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">थर आवश्यक छ</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="tole"
                >
                  गाउँ / टोल
                </label>
                <input
                  id="tole"
                  {...register('tole')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="गाउँ / टोल"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="wardNumber"
                >
                  वडा नम्बर<span className="text-red-500">*</span>
                </label>
                <input
                  id="wardNumber"
                  type="number"
                  {...register('wardNumber', { required: true })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="वडा नम्बर"
                />
                {errors.wardNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    वडा नम्बर आवश्यक छ
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="casteCode"
                >
                  जाति कोड<span className="text-red-500">*</span>
                </label>
                <input
                  id="casteCode"
                  type="number"
                  {...register('casteCode', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="जाति कोड"
                />
                {errors.casteCode && (
                  <p className="text-red-500 text-xs mt-1">जाति कोड आवश्यक छ</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="age"
                >
                  उमेर<span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  type="number"
                  {...register('age', { required: true, valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="उमेर"
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">उमेर आवश्यक छ</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="phoneNumber"
                >
                  फोन नम्बर<span className="text-red-500">*</span>
                </label>
                <input
                  id="phoneNumber"
                  {...register('phoneNumber', { required: true })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="फोन नम्बर"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    फोन नम्बर आवश्यक छ
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="pregnancyCount"
                >
                  गर्भको पटक<span className="text-red-500">*</span>
                </label>
                <input
                  id="pregnancyCount"
                  type="number"
                  {...register('pregnancyCount', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="गर्भको पटक"
                />
                {errors.pregnancyCount && (
                  <p className="text-red-500 text-xs mt-1">
                    गर्भको पटक आवश्यक छ
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="previousTDTakenCount"
                >
                  यस अघि TD खोप लिएको पटक<span className="text-red-500">*</span>
                </label>
                <input
                  id="previousTDTakenCount"
                  type="number"
                  {...register('previousTDTakenCount', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="यस अघि TD खोप लिएको पटक"
                />
                {errors.previousTdTakenCount && (
                  <p className="text-red-500 text-xs mt-1">
                    TD खोपको पटक आवश्यक छ
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white p-4 sm:p-5 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              TD खोप मितिहरू
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="dose1"
                >
                  खुराक १
                </label>
                <div className="relative flex items-center">
                  <Controller
                    name="dose1"
                    control={control}
                    render={({ field }) => (
                      <>
                        <NepaliDatePicker
                          {...field}
                          inputClassName="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          value={field.value || ''}
                          onChange={field.onChange}
                          className="w-full"
                          style={{ cursor: 'pointer' }}
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => setValue('dose1', '')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none cursor-pointer"
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
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="dose2"
                >
                  खुराक २
                </label>
                <div className="relative flex items-center">
                  <Controller
                    name="dose2"
                    control={control}
                    render={({ field }) => (
                      <>
                        <NepaliDatePicker
                          {...field}
                          inputClassName="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          value={field.value || ''}
                          onChange={field.onChange}
                          className="w-full"
                          style={{ cursor: 'pointer' }}
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => setValue('dose2', '')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none cursor-pointer"
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
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="dose2Plus"
                >
                  खुराक २+
                </label>
                <div className="relative flex items-center">
                  <Controller
                    name="dose2Plus"
                    control={control}
                    render={({ field }) => (
                      <>
                        <NepaliDatePicker
                          {...field}
                          inputClassName="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          value={field.value || ''}
                          onChange={field.onChange}
                          className="w-full"
                          style={{ cursor: 'pointer' }}
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => setValue('dose2Plus', '')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none cursor-pointer"
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
            </div>
          </section>

          <section className="bg-white p-4 sm:p-5 rounded-lg border border-gray-100 shadow-sm">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="remarks"
            >
              कैफियत
            </label>
            <textarea
              id="remarks"
              {...register('remarks')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="कैफियत लेख्नुहोस्"
            />
          </section>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'सेभ हुँदैछ...' : 'सेभ गर्नुहोस्'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200 cursor-pointer"
            >
              रद्द गर्नुहोस्
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
