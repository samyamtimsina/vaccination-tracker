import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import axiosClient from '../api/axiosClient';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMotherContext } from '../context/motherContext';
// FIX: Import the shared, correct age calculation helper from the helper file
import { calculateAge } from '../../helpers/calculateAge.jsx';

// REMOVED: The incorrect local function calculateAgeFromDOB was removed.

export default function AddMother() {
  const [healthWorkers, setHealthWorkers] = useState([]);
  const { addMotherToState } = useMotherContext();
  const { t } = useTranslation('addMother');
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  // Fetch health workers
  useEffect(() => {
    const fetchHealthWorkers = async () => {
      try {
        const res = await axiosClient.get('/api/users?role=WARD_OFFICER');
        setHealthWorkers(res.data);
      } catch (err) {
        console.error('Failed to fetch health workers:', err);
      }
    };
    fetchHealthWorkers();
  }, []);

  // Caste code options (same as AddChild)
  const casteCodeOptions = [
    { value: 1, label: 'Code 1: Dalit' },
    { value: 2, label: 'Code 2: Pahad Janajati (Hill Indigenous Nationalities)' },
    { value: 3, label: 'Code 3: Madheshi' },
    { value: 4, label: 'Code 4: Muslim' },
    { value: 5, label: 'Code 5: Brahmin/Chhetri' },
    { value: 6, label: 'Code 6: Other (Anya)' }
  ];

  const dateOfBirth = watch('dateOfBirth');
  // FIX: Use the imported, correct calculateAge function
  const age = calculateAge(dateOfBirth);

  const onSubmit = async (data) => {
    try {
      if ((data.tdDose1 || data.tdDose2 || data.tdDose2Plus) && !data.administeredById) {
        toast.error(t('health_worker_required'));
        return;
      }

      const tdDoses = [];
      if (data.tdDose1) {
        tdDoses.push({
          doseNumber: 1,
          dateGiven: data.tdDose1,
          administeredById: parseInt(data.administeredById, 10),
          remarks: '',
        });
      }
      if (data.tdDose2) {
        tdDoses.push({
          doseNumber: 2,
          dateGiven: data.tdDose2,
          administeredById: parseInt(data.administeredById, 10),
          remarks: '',
        });
      }
      if (data.tdDose2Plus) {
        tdDoses.push({
          doseNumber: 3,
          dateGiven: data.tdDose2Plus,
          administeredById: parseInt(data.administeredById, 10),
          remarks: '',
        });
      }

      // Construct the payload (remove age, wardNumber)
      const payload = {
        fullName: data.fullName,
        lastName: data.lastName || '',
        casteCode: parseInt(data.casteCode, 10),
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        tole: data.tole,
        pregnancyCount: parseInt(data.pregnancyCount, 10),
        previousTDTakenCount: parseInt(data.previousTDTakenCount, 10),
        remarks: data.remarks || '',
        isFromOtherMunicipality: false,
        tdDoses,
      };

      const response = await axiosClient.post('http://localhost:5000/api/mothers', payload);
      addMotherToState(response.data);

      toast.success(t('success_message'));
      reset();
    } catch (err) {
      console.error('Frontend error:', err.response?.data || err.message);
      toast.error(t('error_message'));
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card w-full bg-base-100 shadow-xl space-y-6 p-4 md:p-6 lg:p-8"
      >
        <div className="flex items-center justify-between pb-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-base-content tracking-tight">
            {t('title')}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-sm btn-info btn-outline"
          >
            <FaArrowLeft />
            <span>{t('back_to_dashboard')}</span>
          </button>
        </div>

        <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
          <h3 className="text-lg font-medium text-base-content mb-3">
            {t('personal_information')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="fullName">
                <span className="label-text">
                  {t('full_name')} <span className="text-error">*</span>
                </span>
              </label>
              <input
                id="fullName"
                {...register('fullName', { required: true })}
                className="input input-bordered w-full"
                placeholder={t('full_name_placeholder')}
              />
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t('full_name_error')}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="lastName">
                <span className="label-text">
                  {t('last_name')} <span className="text-error">*</span>
                </span>
              </label>
              <input
                id="lastName"
                {...register('lastName', { required: true })}
                className="input input-bordered w-full"
                placeholder={t('last_name_placeholder')}
              />
              {errors.lastName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t('last_name_error')}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="tole">
                <span className="label-text">{t('tole')}</span>
              </label>
              <input
                id="tole"
                {...register('tole')}
                className="input input-bordered w-full"
                placeholder={t('tole_placeholder')}
              />
            </div>
            {/* Caste Code (Jaati) */}
            <div className="form-control">
              <label className="label" htmlFor="casteCode">
                <span className="label-text">
                  {t('caste_code')} <span className="text-error">*</span>
                </span>
              </label>
              <select
                id="casteCode"
                {...register('casteCode', { required: true })}
                className="select select-bordered w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  {t('caste_code_placeholder')}
                </option>
                {casteCodeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.casteCode && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t('caste_code_error')}
                  </span>
                </label>
              )}
            </div>
            {/* Date of Birth */}
            <div className="form-control">
              <label className="label" htmlFor="dateOfBirth">
                <span className="label-text">
                  {t('date_of_birth')} <span className="text-error">*</span>
                </span>
              </label>
              <div className="relative">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <NepaliDatePicker
                        {...field}
                        inputClassName="input input-bordered w-full pr-8"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full"
                        style={{ cursor: 'pointer' }}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => setValue('dateOfBirth', '')}
                          className="absolute right-3 top-1/2 flex h-6 w-6 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                          title={t('clear_date')}
                        >
                          ✕
                        </button>
                      )}
                    </>
                  )}
                />
              </div>
              {errors.dateOfBirth && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t('date_of_birth_error')}
                  </span>
                </label>
              )}
              {/* Show calculated age in Nepali style like AddChild */}
              {dateOfBirth && (
                <div className="mt-2 text-success font-medium">
                  {/* The calculateAge function returns { years, months, days } */}
                  {`आमाको उमेर: ${age.years} वर्ष, ${age.months} महिना, ${age.days} दिन`}
                </div>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="phoneNumber">
                <span className="label-text">
                  {t('phone_number')} <span className="text-error">*</span>
                </span>
              </label>
              <input
                id="phoneNumber"
                {...register('phoneNumber', { required: true })}
                className="input input-bordered w-full"
                placeholder={t('phone_number_placeholder')}
              />
              {errors.phoneNumber && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t('phone_number_error')}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="pregnancyCount">
                <span className="label-text">
                  {t('pregnancy_count')} <span className="text-error">*</span>
                </span>
              </label>
              <input
                id="pregnancyCount"
                type="number"
                {...register('pregnancyCount', { required: true, valueAsNumber: true, min: 1 })}
                className="input input-bordered w-full"
                placeholder={t('pregnancy_count_placeholder')}
              />
              {errors.pregnancyCount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t('pregnancy_count_error')}
                  </span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="previousTDTakenCount">
                <span className="label-text">
                  {t('previous_td_taken_count')} <span className="text-error">*</span>
                </span>
              </label>
              <input
                id="previousTDTakenCount"
                type="number"
                {...register('previousTDTakenCount', { required: true, valueAsNumber: true, min: 0 })}
                className="input input-bordered w-full"
                placeholder={t('previous_td_taken_count_placeholder')}
              />
              {errors.previousTDTakenCount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {t('previous_td_taken_count_error')}
                  </span>
                </label>
              )}
            </div>
          </div>
        </section>

        <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
          <h3 className="text-lg font-medium text-base-content mb-3">
            {t('td_vaccination_history')}
          </h3>
          <p className="text-sm text-base-content/70 mb-4">
            {t('td_vaccination_description')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* TD Dose 1 */}
            <div className="form-control">
              <label className="label" htmlFor="tdDose1">
                <span className="label-text">{t('td_dose_1')}</span>
              </label>
              <div className="relative">
                <Controller
                  name="tdDose1"
                  control={control}
                  render={({ field }) => (
                    <>
                      <NepaliDatePicker
                        {...field}
                        inputClassName="input input-bordered w-full pr-8"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full"
                        style={{ cursor: 'pointer' }}
                        placeholder={t('date_placeholder')}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => setValue('tdDose1', '')}
                          className="absolute right-3 top-1/2 flex h-6 w-6 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                          title={t('clear_date')}
                        >
                          ✕
                        </button>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* TD Dose 2 */}
            <div className="form-control">
              <label className="label" htmlFor="tdDose2">
                <span className="label-text">{t('td_dose_2')}</span>
              </label>
              <div className="relative">
                <Controller
                  name="tdDose2"
                  control={control}
                  render={({ field }) => (
                    <>
                      <NepaliDatePicker
                        {...field}
                        inputClassName="input input-bordered w-full pr-8"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full"
                        style={{ cursor: 'pointer' }}
                        placeholder={t('date_placeholder')}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => setValue('tdDose2', '')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                          title={t('clear_date')}
                        >
                          ✕
                        </button>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* TD Dose 2+ / Booster */}
            <div className="form-control">
              <label className="label" htmlFor="tdDose2Plus">
                <span className="label-text">{t('td_dose_2_plus')}</span>
              </label>
              <div className="relative">
                <Controller
                  name="tdDose2Plus"
                  control={control}
                  render={({ field }) => (
                    <>
                      <NepaliDatePicker
                        {...field}
                        inputClassName="input input-bordered w-full pr-8"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="w-full"
                        style={{ cursor: 'pointer' }}
                        placeholder={t('date_placeholder')}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() => setValue('tdDose2Plus', '')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                          title={t('clear_date')}
                        >
                          ✕
                        </button>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Administered By */}
            {(watch('tdDose1') || watch('tdDose2') || watch('tdDose2Plus')) && (
              <div className="form-control">
                <label className="label" htmlFor="administeredById">
                  <span className="label-text">
                    {t('administered_by')} <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  id="administeredById"
                  {...register('administeredById', { required: true, valueAsNumber: true })}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t('administered_by_placeholder')}
                  </option>
                  {healthWorkers.map(worker => (
                    <option key={worker.id} value={worker.id}>
                      {worker.fullName}
                    </option>
                  ))}
                </select>
                {errors.administeredById && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {t('administered_by_error')}
                    </span>
                  </label>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
          <div className="form-control">
            <label className="label" htmlFor="remarks">
              <span className="label-text">{t('remarks')}</span>
            </label>
            <textarea
              id="remarks"
              {...register('remarks')}
              rows={4}
              className="textarea textarea-bordered h-24 w-full"
              placeholder={t('remarks_placeholder')}
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
            {isSubmitting ? t('saving') : t('save')}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn flex-1 btn-secondary text-base font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </>
  );
}