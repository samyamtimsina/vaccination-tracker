import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import axiosClient from '../api/axiosClient';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NepaliDate from 'nepali-date-converter'; // Import NepaliDate for conversion

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
      // Create a payload and convert Nepali dates to standard JavaScript Date objects
      const payload = {
        ...data,
      };

      console.log('payload', payload);
      const response = await axiosClient.post('/api/mothers', payload);

      console.log('response', response);
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
      {/* The form now takes full width and includes padding */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-full bg-base-100 shadow-xl space-y-6 p-4 md:p-6 lg:p-8"
      >
        <div className="flex items-center justify-between pb-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-base-content tracking-tight">
            आमा को विवरण थप्नुहोस्
          </h1>
          {/* Go back button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-sm btn-info btn-outline"
          >
            <FaArrowLeft />
            <span>ड्यासबोर्डमा फर्कनुहोस्</span>
          </button>
        </div>

        <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
          <h3 className="text-lg font-medium text-base-content mb-3">
            व्यक्तिगत जानकारी
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="fullName">
                <span className="label-text">
                  नाम<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="fullName"
                {...register('fullName', { required: true })}
                className="input input-bordered w-full"
                placeholder="नाम"
              />
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    नाम आवश्यक छ
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="lastName">
                <span className="label-text">
                  थर<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="lastName"
                {...register('lastName', { required: true })}
                className="input input-bordered w-full"
                placeholder="थर"
              />
              {errors.lastName && (
                <label className="label">
                  <span className="label-text-alt text-error">थर आवश्यक छ</span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="tole">
                <span className="label-text">गाउँ / टोल</span>
              </label>
              <input
                id="tole"
                {...register('tole')}
                className="input input-bordered w-full"
                placeholder="गाउँ / टोल"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="wardNumber">
                <span className="label-text">
                  वडा नम्बर<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="wardNumber"
                type="number"
                {...register('wardNumber', { required: true })}
                className="input input-bordered w-full"
                placeholder="वडा नम्बर"
              />
              {errors.wardNumber && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    वडा नम्बर आवश्यक छ
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="casteCode">
                <span className="label-text">
                  जाति कोड<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="casteCode"
                type="number"
                {...register('casteCode', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="input input-bordered w-full"
                placeholder="जाति कोड"
              />
              {errors.casteCode && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    जाति कोड आवश्यक छ
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="age">
                <span className="label-text">
                  उमेर<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="age"
                type="number"
                {...register('age', { required: true, valueAsNumber: true })}
                className="input input-bordered w-full"
                placeholder="उमेर"
              />
              {errors.age && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    उमेर आवश्यक छ
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="phoneNumber">
                <span className="label-text">
                  फोन नम्बर<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="phoneNumber"
                {...register('phoneNumber', { required: true })}
                className="input input-bordered w-full"
                placeholder="फोन नम्बर"
              />
              {errors.phoneNumber && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    फोन नम्बर आवश्यक छ
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="pregnancyCount">
                <span className="label-text">
                  गर्भको पटक<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="pregnancyCount"
                type="number"
                {...register('pregnancyCount', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="input input-bordered w-full"
                placeholder="गर्भको पटक"
              />
              {errors.pregnancyCount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    गर्भको पटक आवश्यक छ
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="previousTDTakenCount">
                <span className="label-text">
                  यस अघि TD खोप लिएको पटक<span className="text-error">*</span>
                </span>
              </label>
              <input
                id="previousTDTakenCount"
                type="number"
                {...register('previousTDTakenCount', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="input input-bordered w-full"
                placeholder="यस अघि TD खोप लिएको पटक"
              />
              {errors.previousTDTakenCount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    TD खोपको पटक आवश्यक छ
                  </span>
                </label>
              )}
            </div>
          </div>
        </section>

        <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
          <h3 className="text-lg font-medium text-base-content mb-3">
            TD खोप मितिहरू
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="tdDose1">
                <span className="label-text">खुराक १</span>
              </label>
              <div className="relative flex items-center">
                <Controller
                  name="tdDose1"
                  control={control}
                  render={({ field }) => (
                    <>
                      <NepaliDatePicker
                        {...field}
                        // DaisyUI input class
                        inputClassName="input input-bordered w-full"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full"
                        style={{ cursor: 'pointer' }}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => setValue('tdDose1', '')}
                          className="absolute right-3 top-1/2 flex h-6 w-6 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
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
            <div className="form-control">
              <label className="label" htmlFor="tdDose2">
                <span className="label-text">खुराक २</span>
              </label>
              <div className="relative flex items-center">
                <Controller
                  name="tdDose2"
                  control={control}
                  render={({ field }) => (
                    <>
                      <NepaliDatePicker
                        {...field}
                        inputClassName="input input-bordered w-full"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full"
                        style={{ cursor: 'pointer' }}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => setValue('tdDose2', '')}
                          className="absolute right-3 top-1/2 flex h-6 w-6 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
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
            <div className="form-control">
              <label className="label" htmlFor="tdDose2Plus">
                <span className="label-text">खुराक २+</span>
              </label>
              <div className="relative flex items-center">
                <Controller
                  name="tdDose2Plus"
                  control={control}
                  render={({ field }) => (
                    <>
                      <NepaliDatePicker
                        {...field}
                        inputClassName="input input-bordered w-full"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full"
                        style={{ cursor: 'pointer' }}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => setValue('tdDose2Plus', '')}
                          className="absolute right-3 top-1/2 flex h-6 w-6 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
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

        <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
          <div className="form-control">
            <label className="label" htmlFor="remarks">
              <span className="label-text">कैफियत</span>
            </label>
            <textarea
              id="remarks"
              {...register('remarks')}
              rows={4}
              className="textarea textarea-bordered h-24 w-full"
              placeholder="कैफियत लेख्नुहोस्"
            />
          </div>
        </section>

        <div className="flex space-x-3 pt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn flex-1 text-base font-semibold transition-all duration-300 ease-in-out
      ${isSubmitting ? 'btn-disabled' : 'btn-primary'}
      hover:-translate-y-0.5 hover:shadow-md active:translate-y-0`}
          >
            {isSubmitting ? 'सेभ हुँदैछ...' : 'सेभ गर्नुहोस्'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn flex-1 btn-secondary text-base font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            रद्द गर्नुहोस्
          </button>
        </div>
      </form>
    </>
  );
}
