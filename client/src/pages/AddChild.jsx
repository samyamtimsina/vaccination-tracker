import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { vaccineSchedule } from '../utils/vaccineSchedule';
import axiosClient from '../api/axiosClient.js';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaInfoCircle,
  FaUser,
  FaWeight,
  FaSyringe,
  FaClipboardList,
  FaHome,
  FaPhone,
  FaBirthdayCake,
} from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChildSchema } from '../schemas/childSchema.js';
import { useChildContext } from '../context/ChildContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { calculateAge } from '../../helpers/calculateAge.jsx';
import { getFirstErrorMessage } from '../../helpers/getFirstErrorMessage.jsx';

export default function AddChild() {
  const { theme } = useTheme();
  const { addChildToState } = useChildContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
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
      weightRecords: [{ date: '', weight: '' }],
    },
  });

  const navigate = useNavigate();
  const gender = useWatch({ control, name: 'gender', defaultValue: '' });
  const birthDate = useWatch({ control, name: 'birthDate', defaultValue: '' });

  const [showRemarks, setShowRemarks] = useState({});

  // Use useFieldArray to manage the weightRecords array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'weightRecords',
  });

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
    <div className="min-h-screen bg-base-200">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FaUser className="text-primary-content text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-base-content">
                  बालबालिका थप्नुहोस्
                </h1>
                <p className="text-base text-base-content/70">
                  नयाँ बालबालिकाको जानकारी दर्ता गर्नुहोस्
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline btn-primary"
            >
              <FaArrowLeft className="mr-2" />
              ड्यासबोर्ड
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-base-100 shadow-sm rounded-xl border border-base-300">
          <form
            onSubmit={handleSubmit(onSubmit, onErrors)}
            className="p-8 space-y-12"
          >
            {/* Personal Information */}
            <div>
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <FaUser className="text-primary text-lg" />
                </div>
                <h2 className="text-xl font-medium text-base-content">
                  व्यक्तिगत जानकारी
                </h2>
              </div>

              {/* Municipality Checkbox */}
              <div className="mb-8 p-4 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center">
                  <Controller
                    name="isFromOtherMunicipality"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        id="isFromOtherMunicipality"
                        className="checkbox checkbox-primary"
                      />
                    )}
                  />
                  <label
                    htmlFor="isFromOtherMunicipality"
                    className="ml-3 text-base font-medium text-base-content cursor-pointer"
                  >
                    बाहिरको नगरपालिकाबाट आएको हो
                  </label>
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      पहिलो नाम <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    {...register('fullName')}
                    className={`input input-bordered w-full ${errors.fullName ? 'input-error' : ''
                      }`}
                    placeholder="पहिलो नाम"
                  />
                  {errors.fullName && (
                    <p className="text-error text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      थर
                    </span>
                  </label>
                  <input
                    {...register('lastName')}
                    className="input input-bordered w-full"
                    placeholder="थर"
                  />
                  {errors.lastName && (
                    <p className="text-error text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      लिंग <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    {...register('gender')}
                    className={`select select-bordered w-full ${errors.gender ? 'select-error' : ''
                      }`}
                  >
                    <option value="">लिंग छान्नुहोस्</option>
                    <option value="MALE">पुरुष</option>
                    <option value="FEMALE">महिला</option>
                    <option value="OTHER">अन्य</option>
                  </select>
                  {errors.gender && (
                    <p className="text-error text-sm mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      वडा नम्बर <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    {...register('wardNumber')}
                    className={`input input-bordered w-full ${errors.wardNumber ? 'input-error' : ''
                      }`}
                    placeholder="वडा नम्बर"
                  />
                  {errors.wardNumber && (
                    <p className="text-error text-sm mt-1">
                      {errors.wardNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      जात कोड <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    {...register('casteCode')}
                    className={`input input-bordered w-full ${errors.casteCode ? 'input-error' : ''
                      }`}
                    placeholder="जात कोड"
                  />
                  {errors.casteCode && (
                    <p className="text-error text-sm mt-1">
                      {errors.casteCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      अभिभावकको नाम <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    {...register('parentName')}
                    className={`input input-bordered w-full ${errors.parentName ? 'input-error' : ''
                      }`}
                    placeholder="अभिभावकको नाम"
                  />
                  {errors.parentName && (
                    <p className="text-error text-sm mt-1">
                      {errors.parentName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      टोल <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    {...register('tole')}
                    className={`input input-bordered w-full ${errors.tole ? 'input-error' : ''
                      }`}
                    placeholder="टोल"
                  />
                  {errors.tole && (
                    <p className="text-error text-sm mt-1">
                      {errors.tole.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      फोन नम्बर
                    </span>
                  </label>
                  <input
                    {...register('phoneNumber')}
                    className="input input-bordered w-full"
                    placeholder="फोन नम्बर"
                  />
                  {errors.phoneNumber && (
                    <p className="text-error text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      जन्म मिति <span className="text-error">*</span>
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
                            inputClassName={`input input-bordered w-full pr-10 ${errors.birthDate ? 'input-error' : ''
                              }`}
                            value={field.value || ''}
                            onChange={(value) => field.onChange(value)}
                            language="ne"
                            theme={theme}
                          />
                          {field.value && (
                            <button
                              type="button"
                              onClick={() => setValue('birthDate', '')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-error transition-colors"
                              title="मिति मेटाउनुहोस्"
                            >
                              ✕
                            </button>
                          )}
                        </>
                      )}
                    />
                  </div>
                  {errors.birthDate && (
                    <p className="text-error text-sm mt-1">
                      {errors.birthDate.message}
                    </p>
                  )}
                  {birthDate && (
                    <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="text-base text-success font-medium">
                        उमेर: {age.months} महिना ({age.days} दिन)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Purna Khop */}
              <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('purnaKhop')}
                    id="purnaKhop"
                    className="checkbox checkbox-success"
                  />
                  <label
                    htmlFor="purnaKhop"
                    className="ml-3 text-base font-medium text-base-content cursor-pointer"
                  >
                    पूर्ण खोप
                  </label>
                </div>
              </div>
            </div>

            {/* Weight Tracking */}
            <div className="border-t border-base-300 pt-12">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                  <FaWeight className="text-warning text-lg" />
                </div>
                <h2 className="text-xl font-medium text-base-content">
                  तौल ट्र्याकिंग
                </h2>
              </div>

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-6 bg-base-200 rounded-lg border border-base-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div>
                        <label className="label">
                          <span className="label-text text-base font-medium">
                            मिति {index + 1}
                          </span>
                        </label>
                        <Controller
                          name={`weightRecords.${index}.date`}
                          control={control}
                          render={({ field }) => (
                            <NepaliDatePicker
                              className="w-full"
                              inputClassName="input input-bordered w-full"
                              value={field.value || ''}
                              onChange={(value) => field.onChange(value)}
                              language="ne"
                              theme={theme}
                            />
                          )}
                        />
                        {errors.weightRecords?.[index]?.date && (
                          <p className="text-error text-sm mt-1">
                            {errors.weightRecords[index].date.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text text-base font-medium">
                            तौल (किलोग्राम)
                          </span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          {...register(`weightRecords.${index}.weight`, {
                            min: {
                              value: 0,
                              message: 'तौल सकारात्मक हुनुपर्छ',
                            },
                            max: { value: 50, message: 'तौल धेरै ठूलो छ' },
                          })}
                          className="input input-bordered w-full"
                          placeholder="तौल"
                        />
                        {errors.weightRecords?.[index]?.weight && (
                          <p className="text-error text-sm mt-1">
                            {errors.weightRecords[index].weight.message}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="btn btn-outline btn-error btn-sm"
                          >
                            <FaMinus className="w-4 h-4" />
                          </button>
                        )}
                        {index === fields.length - 1 && (
                          <button
                            type="button"
                            onClick={() => append({ date: '', weight: '' })}
                            className="btn btn-outline btn-success btn-sm"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-12">
                    <button
                      type="button"
                      onClick={() => append({ date: '', weight: '' })}
                      className="btn btn-success btn-lg"
                    >
                      <FaPlus className="mr-2" />
                      पहिलो तौल रेकर्ड थप्नुहोस्
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Vaccines */}
            <div className="border-t border-base-300 pt-12">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                  <FaSyringe className="text-secondary text-lg" />
                </div>
                <h2 className="text-xl font-medium text-base-content">
                  खोपहरू
                </h2>
              </div>

              <div className="space-y-8">
                {vaccineEntries.map(([vaccineName, doses]) => (
                  <div
                    key={vaccineName}
                    className="border border-base-300 rounded-xl p-6 bg-base-100"
                  >
                    <h3 className="text-lg font-semibold text-base-content mb-6">
                      {vaccineName}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {doses.map((dose, idx) => {
                        const isAccessible = isDoseAccessible(dose);
                        const remarksKey = `${vaccineName}-${idx}`;
                        const showRemark = showRemarks[remarksKey] || false;

                        return (
                          <div
                            key={idx}
                            className={`p-5 border rounded-lg transition-all ${isAccessible
                                ? 'bg-base-100 border-success/20'
                                : 'bg-base-200 border-base-300'
                              }`}
                          >
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-base font-medium ${isAccessible
                                      ? 'text-base-content'
                                      : 'text-base-content/50'
                                    }`}
                                >
                                  मात्रा {dose.dose}
                                </span>
                                <span
                                  className={`badge ${isAccessible
                                      ? 'badge-success'
                                      : 'badge-neutral'
                                    }`}
                                >
                                  {dose.recommendedAtMonths
                                    ? `${dose.recommendedAtMonths} महिना`
                                    : dose.recommendedAtWeeks
                                      ? `${dose.recommendedAtWeeks} हप्ता`
                                      : `${dose.recommendedAtDays} दिन`}
                                </span>
                              </div>

                              <div>
                                <Controller
                                  name={`vaccines.${vaccineName}.${idx}.date`}
                                  control={control}
                                  render={({ field }) => (
                                    <div className="relative">
                                      {isAccessible ? (
                                        <>
                                          <NepaliDatePicker
                                            className="w-full"
                                            inputClassName="input input-bordered w-full pr-10"
                                            value={field.value || ''}
                                            onChange={(value) =>
                                              field.onChange(value)
                                            }
                                            language="ne"
                                            theme={theme}
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
                                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-error transition-colors"
                                              title="मिति मेटाउनुहोस्"
                                            >
                                              ✕
                                            </button>
                                          )}
                                        </>
                                      ) : (
                                        <input
                                          type="text"
                                          className="input input-bordered w-full input-disabled"
                                          value=""
                                          disabled
                                          readOnly
                                          placeholder="उमेर पुगेको छैन"
                                        />
                                      )}
                                    </div>
                                  )}
                                />

                                {!isAccessible && (
                                  <div className="mt-2">
                                    <div className="text-sm text-warning flex items-center">
                                      <FaInfoCircle className="w-4 h-4 mr-2" />
                                      खोपको लागि उमेर पुगेको छैन
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Professional Remarks Section */}
                              {isAccessible && (
                                <div className="pt-2 border-t border-base-300">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleRemarks(vaccineName, idx)
                                    }
                                    className="btn btn-ghost btn-sm w-full justify-between"
                                  >
                                    <span className="flex items-center">
                                      <FaClipboardList className="w-4 h-4 mr-2" />
                                      कैफियत
                                    </span>
                                    <span
                                      className={`transform transition-transform ${showRemark ? 'rotate-180' : ''
                                        }`}
                                    >
                                      ▼
                                    </span>
                                  </button>

                                  {showRemark && (
                                    <div className="mt-3">
                                      <textarea
                                        {...register(
                                          `vaccines.${vaccineName}.${idx}.remarks`,
                                        )}
                                        className="textarea textarea-bordered w-full"
                                        placeholder="उदाहरण: बच्चालाई ज्वरो भयो..."
                                        rows={3}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Remarks */}
            <div className="border-t border-base-300 pt-12">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                  <FaClipboardList className="text-accent text-lg" />
                </div>
                <h2 className="text-xl font-medium text-base-content">
                  सामान्य कैफियत
                </h2>
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-base font-medium">
                    अतिरिक्त जानकारी वा टिप्पणी (वैकल्पिक)
                  </span>
                </label>
                <textarea
                  {...register('remarks')}
                  rows={6}
                  className="textarea textarea-bordered w-full"
                  placeholder="यहाँ कुनै विशेष कैफियत, अवलोकन, वा अन्य महत्वपूर्ण जानकारी लेख्नुहोस्..."
                />
                <p className="text-sm text-base-content/60 mt-2">
                  यो क्षेत्र वैकल्पिक छ
                </p>
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t border-base-300 pt-12">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-base-content">
                    तयार छ?
                  </h3>
                  <p className="text-base text-base-content/70">
                    सबै जानकारी जाँच गरेर सेभ गर्नुहोस्
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          'के तपाईं निश्चित हुनुहुन्छ? सबै डेटा हराउनेछ।',
                        )
                      ) {
                        reset();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="btn btn-outline btn-neutral"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    रिसेट गर्नुहोस्
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary ${isSubmitting ? 'loading' : ''
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        सेभ हुँदैछ...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        डेटा सेभ गर्नुहोस्
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 btn btn-primary btn-circle shadow-lg"
        title="माथि जानुहोस्"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}
