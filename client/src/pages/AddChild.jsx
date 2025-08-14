import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { vaccineSchedule } from '../utils/vaccineSchedule';
import axiosClient from '../api/axiosClient.js';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaPlus, FaMinus, FaInfoCircle } from 'react-icons/fa';
import NepaliDate from 'nepali-date-converter';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChildSchema } from '../schemas/childSchema.js';
import { useChildContext } from '../context/ChildContext';
import { useState } from 'react';

function calculateAge(birthDate) {
  if (
    !birthDate ||
    typeof birthDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)
  ) {
    return { days: 0, weeks: 0, months: 0 };
  }

  try {
    const [year, month, day] = birthDate.split('-').map(Number);
    if (
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 32
    ) {
      throw new Error('Invalid date components');
    }
    const nepaliBirthDate = new NepaliDate(year, month - 1, day);
    const currentNepaliDate = new NepaliDate();

    let diffMonths =
      (currentNepaliDate.getYear() - nepaliBirthDate.getYear()) * 12 +
      (currentNepaliDate.getMonth() - nepaliBirthDate.getMonth());
    let diffDays = currentNepaliDate.getDate() - nepaliBirthDate.getDate();

    if (diffDays < 0) {
      diffMonths -= 1;
      const lastMonth = new NepaliDate(
        nepaliBirthDate.getYear(),
        nepaliBirthDate.getMonth(),
        0,
      );
      diffDays += lastMonth.getDate();
    }
    if (diffMonths < 0) {
      diffMonths += 12;
    }

    const birthGregorian = nepaliBirthDate.toJsDate();
    const currentGregorian = currentNepaliDate.toJsDate();
    const totalDays = Math.floor(
      (currentGregorian.getTime() - birthGregorian.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const age = {
      days: Math.max(totalDays, 0),
      weeks: Math.floor(Math.max(totalDays, 0) / 7),
      months: Math.max(diffMonths, 0),
    };

    return age;
  } catch (err) {
    console.error('Error calculating age:', err);
    return { days: 0, weeks: 0, months: 0 };
  }
}
// A simple helper function to get the first error message from the nested errors object
const getFirstErrorMessage = (errors) => {
  const firstErrorKey = Object.keys(errors)[0];
  if (!firstErrorKey) return 'Unknown error.';

  const firstError = errors[firstErrorKey];
  // Handles errors for simple fields
  if (typeof firstError.message === 'string') {
    return firstError.message;
  }
  // Handles errors for nested fields like weightRecords
  if (Array.isArray(firstError)) {
    const nestedError = firstError.find(
      (err) => err && Object.keys(err).length > 0,
    );
    if (nestedError) {
      const nestedKey = Object.keys(nestedError)[0];
      return nestedError[nestedKey].message;
    }
  }
  return 'Please check the form for errors.';
};

export default function AddChild() {
  const { addChildToState } = useChildContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues, // <<< ADDED getValues here
  } = useForm({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      isFromOtherMunicipality: false,
      birthDate: '',
      vaccines: Object.fromEntries(
        Object.entries(vaccineSchedule).map(([vaccineName, doses]) => [
          vaccineName,
          doses.map(() => ({ date: '', remarks: '' })),
        ]),
      ),
      // Start with one empty weight record field
      weightRecords: [{ date: '', weight: '' }],
    },
  });

  const navigate = useNavigate();
  const gender = useWatch({ control, name: 'gender', defaultValue: '' });
  const birthDate = useWatch({ control, name: 'birthDate', defaultValue: '' });

  const [showRemarks, setShowRemarks] = useState({});
  // Remove useState and getValues for managing dynamic fields

  // Use useFieldArray to manage the weightRecords array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'weightRecords',
  });
  // Remove the old add and remove weight record functions
  // The append and remove functions from useFieldArray handle this now

  const toggleRemarks = (vaccineName, doseIndex) => {
    const key = `${vaccineName}-${doseIndex}`;
    setShowRemarks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = async (data) => {
    try {
      const filteredWeightRecords = data.weightRecords.filter(
        (record) => record.date && record.weight,
      );

      const payload = {
        ...data,
        weightRecords: filteredWeightRecords,
      };

      const res = await axiosClient.post('/api/child', payload);
      addChildToState(res.data);
      toast.success('बालबालिका डेटा सफलतापूर्वक सेभ भयो!');
      reset();
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('डेटा सेभ गर्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।');
    }
  };
  // This is the new function that runs when submission FAILS due to validation
  const onErrors = (errors) => {
    const errorMessage = getFirstErrorMessage(errors);
    toast.error(`कृपया सबै आवश्यक जानकारी भर्नुहोस्। (${errorMessage})`);
  };

  const age = calculateAge(birthDate);
  const vaccineEntries = Object.entries(vaccineSchedule).filter(
    ([name]) => !(name === 'HPV' && gender !== 'FEMALE'),
  );

  const isDoseAccessible = (dose) => {
    if (dose.recommendedAtDays !== undefined)
      return age.days >= dose.recommendedAtDays;
    if (dose.recommendedAtWeeks !== undefined)
      return age.weeks >= dose.recommendedAtWeeks;
    if (dose.recommendedAtMonths !== undefined)
      return age.months >= dose.recommendedAtMonths;
    return false;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit(onSubmit, onErrors)}
        className="card w-full max-w-full mx-auto p-6 bg-base-100 shadow-xl space-y-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-base-content">
            बालबालिका थप्नुहोस्
          </h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-sm btn-info btn-outline"
          >
            <FaArrowLeft />
            <span>ड्यासबोर्डमा फर्कनुहोस्</span>
          </button>
        </div>

        <section className="sm:col-span-1 lg:col-span-1 form-control">
          <div className="flex items-center space-x-2">
            <Controller
              name="isFromOtherMunicipality"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  id="isFromOtherMunicipality"
                  className="checkbox"
                />
              )}
            />
            <label
              htmlFor="isFromOtherMunicipality"
              className="select-none text-base-content"
            >
              बाहिरको नगरपालिकाबाट आएको हो
            </label>
          </div>
          {errors.isFromOtherMunicipality && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.isFromOtherMunicipality.message}
              </span>
            </label>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Personal Information Fields */}
          {/* <div className="sm:col-span-1 lg:col-span-1 form-control"> */}
          {/* <label className="label" htmlFor="sewaDartaNumber"> */}
          {/* <span className="label-text text-base-content"> */}
          {/* सेवा दर्ता नम्बर */}
          {/* </span> */}
          {/* </label> */}
          {/* <input */}
          {/* id="sewaDartaNumber" */}
          {/* type="number" */}
          {/* {...register('sewaDartaNumber')} */}
          {/* className="input input-bordered w-full text-base-content" */}
          {/* placeholder="सेवा दर्ता नम्बर" */}
          {/* /> */}
          {/* {errors.sewaDartaNumber && ( */}
          {/* <label className="label"> */}
          {/* <span className="label-text-alt text-error"> */}
          {/* {errors.sewaDartaNumber.message} */}
          {/* </span> */}
          {/* </label> */}
          {/* )} */}
          {/* </div> */}

          <div className="form-control">
            <label className="label" htmlFor="fullName">
              <span className="label-text text-base-content">
                पहिलो नाम<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="fullName"
              {...register('fullName')}
              className="input input-bordered w-full text-base-content"
              placeholder="पहिलो नाम"
            />
            {errors.fullName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.fullName.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="lastName">
              <span className="label-text text-base-content">थर</span>
            </label>
            <input
              id="lastName"
              {...register('lastName')}
              className="input input-bordered w-full text-base-content"
              placeholder="थर"
            />
            {errors.lastName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.lastName.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="wardNumber">
              <span className="label-text text-base-content">
                वडा नम्बर<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="wardNumber"
              {...register('wardNumber')}
              className="input input-bordered w-full text-base-content"
              placeholder="वडा नम्बर"
            />
            {errors.wardNumber && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.wardNumber.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="casteCode">
              <span className="label-text text-base-content">
                जात कोड<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="casteCode"
              type="number"
              {...register('casteCode')}
              className="input input-bordered w-full text-base-content"
              placeholder="जात कोड"
            />
            {errors.casteCode && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.casteCode.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="gender">
              <span className="label-text text-base-content">
                लिङ्ग<span className="text-error">*</span>
              </span>
            </label>
            <select
              id="gender"
              {...register('gender')}
              className="select select-bordered w-full text-base-content"
            >
              <option value="">लिङ्ग छान्नुहोस्</option>
              <option value="MALE">पुरुष</option>
              <option value="FEMALE">महिला</option>
              <option value="OTHER">अन्य</option>
            </select>
            {errors.gender && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.gender.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="parentName">
              <span className="label-text text-base-content">
                अभिभावकको नाम<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="parentName"
              {...register('parentName')}
              className="input input-bordered w-full text-base-content"
              placeholder="अभिभावकको नाम"
            />
            {errors.parentName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.parentName.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="tole">
              <span className="label-text text-base-content">
                टोल<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="tole"
              {...register('tole')}
              className="input input-bordered w-full text-base-content"
              placeholder="टोल"
            />
            {errors.tole && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.tole.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="phoneNumber">
              <span className="label-text text-base-content">फोन नम्बर</span>
            </label>
            <input
              id="phoneNumber"
              {...register('phoneNumber')}
              className="input input-bordered w-full text-base-content"
              placeholder="फोन नम्बर"
            />
            {errors.phoneNumber && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.phoneNumber.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="birthDate">
              <span className="label-text text-base-content">
                जन्म मिति (बिक्रम संवत)<span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <>
                    <NepaliDatePicker
                      className="w-full"
                      inputClassName="input input-bordered w-full pr-12 text-base-content"
                      value={field.value || ''}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      language="ne"
                      theme="light"
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => {
                          setValue('birthDate', '');
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-lg text-error hover:text-error-focus hover:bg-error/10 rounded-full focus:outline-none cursor-pointer"
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
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.birthDate.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control flex items-start mt-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('purnaKhop')}
                id="purnaKhop"
                className="checkbox"
              />
              <label
                htmlFor="purnaKhop"
                className="select-none text-base-content"
              >
                पूर्ण खोप
              </label>
            </div>
          </div>
        </section>

        {/* Weight Tracking Section */}
        <section className="card p-5 space-y-6 bg-base-200 shadow-sm mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-base-content">
              तौल ट्र्याकिंग
            </h3>
            <div
              className="tooltip"
              data-tip="बालबालिकाको वृद्धि अनुगमन गर्न तौल रेकर्ड थप्नुहोस्"
            >
              <FaInfoCircle className="text-info" />
            </div>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id} // Use the field's unique ID for the key
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
            >
              <div className="form-control">
                <label className="label" htmlFor={`weightDate-${index}`}>
                  <span className="label-text text-base-content">
                    मिति {index + 1}
                  </span>
                </label>
                <Controller
                  name={`weightRecords.${index}.date`}
                  control={control}
                  render={({ field }) => (
                    <NepaliDatePicker
                      className="w-full"
                      inputClassName="input input-bordered w-full pr-12 text-base-content"
                      value={field.value || ''}
                      onChange={(value) => field.onChange(value)}
                      language="ne"
                      theme="light"
                    />
                  )}
                />
                {errors.weightRecords?.[index]?.date && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.weightRecords[index].date.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor={`weight-${index}`}>
                  <span className="label-text text-base-content">
                    तौल (किलोग्राम)
                  </span>
                </label>
                <input
                  id={`weight-${index}`}
                  type="number"
                  step="0.1"
                  {...register(`weightRecords.${index}.weight`, {
                    min: { value: 0, message: 'तौल सकारात्मक हुनुपर्छ' },
                    max: { value: 50, message: 'तौल धेरै ठूलो छ' },
                  })}
                  className="input input-bordered w-full text-base-content"
                  placeholder="तौल"
                />
                {errors.weightRecords?.[index]?.weight && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.weightRecords[index].weight.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="flex space-x-2">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn btn-sm btn-error"
                  >
                    <FaMinus />
                  </button>
                )}
                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append({ date: '', weight: '' })}
                    className="btn btn-sm btn-success"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => append({ date: '', weight: '' })}
                className="btn btn-sm btn-success"
              >
                <FaPlus />
                <span>पहिलो तौल रेकर्ड थप्नुहोस्</span>
              </button>
            </div>
          )}
        </section>

        {/* Vaccines Section */}
        <section className="card p-5 space-y-6 bg-base-200 shadow-sm mt-6">
          <h3 className="text-xl font-semibold mb-4 text-center text-base-content">
            खोपहरू
          </h3>

          {vaccineEntries.map(([vaccineName, doses]) => (
            <div key={vaccineName} className="card p-4 bg-base-100 shadow-sm">
              <h4 className="font-semibold mb-3 text-base-content">
                {vaccineName}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {doses.map((dose, idx) => {
                  const isAccessible = isDoseAccessible(dose);
                  const remarksKey = `${vaccineName}-${idx}`;
                  const showRemark = showRemarks[remarksKey] || false;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="form-control">
                        <label
                          className="label"
                          htmlFor={`${vaccineName}-${idx}`}
                        >
                          <span className="label-text text-sm text-base-content">
                            मात्रा {dose.dose} (
                            {dose.recommendedAtMonths
                              ? `${dose.recommendedAtMonths} महिना`
                              : dose.recommendedAtWeeks
                                ? `${dose.recommendedAtWeeks} हप्ता`
                                : `${dose.recommendedAtDays} दिन`}
                            )
                          </span>
                        </label>
                        <div className="relative">
                          <Controller
                            name={`vaccines.${vaccineName}.${idx}.date`}
                            control={control}
                            render={({ field }) => (
                              <>
                                {isAccessible ? (
                                  <>
                                    <NepaliDatePicker
                                      className="w-full"
                                      inputClassName="input input-bordered w-full pr-12 text-base-content"
                                      value={field.value || ''}
                                      onChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      language="ne"
                                      theme="dark"
                                    />
                                    {field.value && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setValue(
                                            `vaccines.${vaccineName}.${idx}.date`,
                                            '',
                                          )
                                        }
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-lg text-error hover:text-error-focus hover:bg-error/10 rounded-full focus:outline-none cursor-pointer"
                                        title="मिति मेट्नुहोस्"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <input
                                    type="text"
                                    className="input input-bordered w-full bg-base-200 cursor-not-allowed text-base-content"
                                    value={field.value || ''}
                                    disabled
                                    readOnly
                                    placeholder="मिति चयन गर्न सकिँदैन"
                                  />
                                )}
                              </>
                            )}
                          />
                        </div>
                        {!isAccessible && (
                          <label className="label">
                            <span className="label-text-alt text-base-content text-opacity-70">
                              यो खोपको लागि उमेर पुगेको छैन
                            </span>
                          </label>
                        )}
                      </div>

                      {isAccessible && (
                        <div className="flex justify-between items-center mt-1">
                          <button
                            type="button"
                            onClick={() => toggleRemarks(vaccineName, idx)}
                            className={`btn btn-xs ${
                              showRemark
                                ? 'btn-ghost text-error'
                                : 'btn-outline btn-info'
                            } transition-all duration-200`}
                          >
                            {showRemark ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                कैफियत बन्द गर्नुहोस्
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                कैफियत थप्नुहोस्
                              </>
                            )}
                          </button>

                          {showRemark && (
                            <span className="badge badge-info badge-sm animate-pulse">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              कैफियत सक्रिय
                            </span>
                          )}
                        </div>
                      )}

                      {showRemark && isAccessible && (
                        <div className="mt-2 animate-fadeIn">
                          <div className="form-control">
                            <div className="flex items-center justify-between mb-1">
                              <label
                                className="label py-0"
                                htmlFor={`${vaccineName}-${idx}-remarks`}
                              >
                                <span className="label-text text-sm font-medium text-info">
                                  विशेष कैफियत
                                </span>
                              </label>
                              <span className="text-xs text-info/70">
                                वैकल्पिक
                              </span>
                            </div>
                            <div className="relative">
                              <textarea
                                id={`${vaccineName}-${idx}-remarks`}
                                {...register(
                                  `vaccines.${vaccineName}.${idx}.remarks`,
                                )}
                                className="textarea textarea-bordered text-sm w-full bg-info/5 border-info/20 focus:border-info/40 focus:ring-1 focus:ring-info/20"
                                placeholder="उदाहरण: बच्चालाई ज्वरो भयो, डाक्टरले सुझाव दिए..."
                                rows={3}
                              />
                              <div className="absolute bottom-2 right-2">
                                <span className="text-xs text-info/50">
                                  {getValues(
                                    `vaccines.${vaccineName}.${idx}.remarks`,
                                  )?.length || 0}
                                  /200
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* General Remarks Section */}
        <section className="mt-6 form-control">
          <label className="label" htmlFor="remarks">
            <span className="label-text text-base-content">कैफियत</span>
          </label>
          <textarea
            id="remarks"
            {...register('remarks')}
            rows={8}
            className="textarea textarea-bordered h-28 resize-y w-full text-base-content"
            placeholder="कैफियत लेख्नुहोस्"
          />
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
