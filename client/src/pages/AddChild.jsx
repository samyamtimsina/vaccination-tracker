import { useForm, Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { vaccineSchedule } from '../utils/vaccineSchedule';
import axiosClient from '../api/axiosClient.js';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from 'react-icons/fa';
import NepaliDate from 'nepali-date-converter';

// Utility function to calculate age in days, weeks, and months from Nepali date
function calculateAge(birthDate) {
  if (
    !birthDate ||
    typeof birthDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)
  ) {
    console.log('Invalid or missing birthDate:', birthDate);
    return { days: 0, weeks: 0, months: 0 };
  }

  try {
    // Parse Nepali date (BS) in format "YYYY-MM-DD"
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
    const nepaliBirthDate = new NepaliDate(year, month - 1, day); // 0-based month

    // Get current Nepali date
    const currentNepaliDate = new NepaliDate();

    // Calculate difference
    let diffYears = currentNepaliDate.getYear() - nepaliBirthDate.getYear();
    let diffMonths =
      diffYears * 12 +
      (currentNepaliDate.getMonth() - nepaliBirthDate.getMonth());
    let diffDays = currentNepaliDate.getDate() - nepaliBirthDate.getDate();

    // Adjust months and days if necessary
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
      diffYears -= 1;
      diffMonths += 12;
    }

    // Calculate total days using Gregorian conversion
    const birthGregorian = nepaliBirthDate.toJsDate();
    const currentGregorian = currentNepaliDate.toJsDate();
    const totalDays = Math.floor(
      (currentGregorian.getTime() - birthGregorian.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const age = {
      days: Math.max(totalDays, 0), // Ensure non-negative
      weeks: Math.floor(Math.max(totalDays, 0) / 7),
      months: Math.max(diffMonths, 0),
    };

    console.log('Calculated age:', {
      birthDate,
      age,
      currentDate: currentNepaliDate.format('YYYY-MM-DD'),
    });
    return age;
  } catch (err) {
    console.error('Error calculating age:', err);
    return { days: 0, weeks: 0, months: 0 };
  }
}

export default function AddChild() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      birthDate: '', // Explicitly empty
      vaccines: Object.fromEntries(
        Object.entries(vaccineSchedule).map(([vaccineName, doses]) => [
          vaccineName,
          Array(doses.length).fill(''),
        ]),
      ),
    },
  });

  const navigate = useNavigate();
  const gender = useWatch({
    control,
    name: 'gender',
    defaultValue: '',
  });
  const birthDate = useWatch({
    control,
    name: 'birthDate',
    defaultValue: '',
  });

  console.log('Watched birthDate:', birthDate); // Debug log

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
      reset();
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('डेटा सेभ गर्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।');
    }
  };

  // Calculate child's age
  const age = calculateAge(birthDate);

  // Filter out HPV for non-females
  const vaccineEntries = Object.entries(vaccineSchedule).filter(
    ([name]) => !(name === 'HPV' && gender !== 'female'),
  );

  // Function to check if a dose is accessible based on age
  const isDoseAccessible = (dose) => {
    let accessible = false;
    if (dose.recommendedAtDays !== undefined) {
      accessible = age.days >= dose.recommendedAtDays;
    } else if (dose.recommendedAtWeeks !== undefined) {
      accessible = age.weeks >= dose.recommendedAtWeeks;
    } else if (dose.recommendedAtMonths !== undefined) {
      accessible = age.months >= dose.recommendedAtMonths;
    }
    console.log('Dose accessibility:', { vaccine: dose, age, accessible });
    return accessible;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
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

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="sm:col-span-1 lg:col-span-1 form-control">
            <label className="label" htmlFor="sewaDartaNumber">
              <span className="label-text text-base-content">
                सेवा दर्ता नम्बर
              </span>
            </label>
            <input
              id="sewaDartaNumber"
              type="number"
              {...register('sewaDartaNumber')}
              className="input input-bordered w-full text-base-content"
              placeholder="सेवा दर्ता नम्बर"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="fullName">
              <span className="label-text text-base-content">
                पहिलो नाम<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="fullName"
              {...register('fullName', { required: true })}
              className="input input-bordered w-full text-base-content"
              placeholder="पहिलो नाम"
            />
            {errors.fullName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  पहिलो नाम आवश्यक छ
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
          </div>

          <div className="form-control">
            <label className="label" htmlFor="wardNumber">
              <span className="label-text text-base-content">
                वडा नम्बर<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="wardNumber"
              {...register('wardNumber', { required: true })}
              className="input input-bordered w-full text-base-content"
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
              <span className="label-text text-base-content">
                जात कोड<span className="text-error">*</span>
              </span>
            </label>
            <input
              id="casteCode"
              type="number"
              {...register('casteCode', {
                required: true,
                valueAsNumber: true,
              })}
              className="input input-bordered w-full text-base-content"
              placeholder="जात कोड"
            />
            {errors.casteCode && (
              <label className="label">
                <span className="label-text-alt text-error">
                  जात कोड आवश्यक छ
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
              {...register('gender', { required: true })}
              className="select select-bordered w-full text-base-content"
            >
              <option value="">लिङ्ग छान्नुहोस्</option>
              <option value="male">पुरुष</option>
              <option value="female">महिला</option>
              <option value="other">अन्य</option>
            </select>
            {errors.gender && (
              <label className="label">
                <span className="label-text-alt text-error">
                  लिङ्ग आवश्यक छ
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="parentName">
              <span className="label-text text-base-content">
                अभिभावकको नाम
              </span>
            </label>
            <input
              id="parentName"
              {...register('parentName')}
              className="input input-bordered w-full text-base-content"
              placeholder="अभिभावकको नाम"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="tole">
              <span className="label-text text-base-content">टोल</span>
            </label>
            <input
              id="tole"
              {...register('tole')}
              className="input input-bordered w-full text-base-content"
              placeholder="टोल"
            />
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
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <NepaliDatePicker
                      className="w-full"
                      inputClassName="input input-bordered w-full pr-12 text-base-content"
                      value={field.value || ''}
                      onChange={(value) => {
                        console.log('Birth date changed:', value);
                        field.onChange(value);
                      }}
                      language="ne"
                      // Setting theme to light to match DaisyUI's light mode
                      theme="light"
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => {
                          console.log(
                            'Clear button clicked, resetting birthDate',
                          );
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
                  जन्म मिति आवश्यक छ
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

        <section className="card p-5 space-y-6 bg-base-200 shadow-sm mt-6">
          <h3 className="text-xl font-semibold mb-4 text-center text-base-content">
            खोपहरु
          </h3>

          {vaccineEntries.map(([vaccineName, doses]) => (
            <div key={vaccineName} className="card p-4 bg-base-100 shadow-sm">
              <h4 className="font-semibold mb-3 text-base-content">
                {vaccineName}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {doses.map((dose, idx) => {
                  const isAccessible = isDoseAccessible(dose);
                  return (
                    <div key={idx} className="form-control">
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
                          name={`vaccines.${vaccineName}.${idx}`}
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
                                      console.log(
                                        `Vaccine ${vaccineName} dose ${idx + 1} changed:`,
                                        value,
                                      );
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
                                          `vaccines.${vaccineName}.${idx}`,
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
                                  // Replaced custom bg-gray-200 with DaisyUI's theme-friendly bg-base-200
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
                          {/* Replaced custom text-gray-700 with DaisyUI's text-base-content and added opacity for a softer look */}
                          <span className="label-text-alt text-base-content text-opacity-70">
                            यो खोपको लागि उमेर पुगेको छैन
                          </span>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

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
