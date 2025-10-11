import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
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
  FaSearch,
  FaExclamationTriangle,
  FaHistory,
  FaLock,
  FaCheckCircle,
} from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateChildSchema } from '../schemas/childSchema.js';
import { useChildContext } from '../context/ChildContext';
import { useVaccineScheduleContext } from '../context/VaccineScheduleContext';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import { getFirstErrorMessage } from '../../helpers/getFirstErrorMessage.jsx';
import { useTranslation } from 'react-i18next';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
import { calculateAge, currentBSYear } from '../../helpers/calculateAge.jsx';

// Helper functions (unchanged)
const safeFormatDateYYMMDD = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

// Fixed calculateAge function


const getVaccineStatus = (dose, childAge) => {
  // Calculate child's total age in days
  const ageInDays = (childAge.years || 0) * 365.25 +
    (childAge.months || 0) * 30.44 +
    (childAge.days || 0);

  // Calculate recommended age in days from the dose info
  let recommendedAgeDays = 0;
  if (dose.recommendedAtDays !== null && dose.recommendedAtDays !== undefined) {
    recommendedAgeDays = dose.recommendedAtDays;
  } else if (dose.recommendedAtWeeks !== null && dose.recommendedAtWeeks !== undefined) {
    recommendedAgeDays = dose.recommendedAtWeeks * 7;
  } else if (dose.recommendedAtMonths !== null && dose.recommendedAtMonths !== undefined) {
    recommendedAgeDays = dose.recommendedAtMonths * 30.44;
  } else if (dose.recommendedAtYears !== null && dose.recommendedAtYears !== undefined) {
    recommendedAgeDays = dose.recommendedAtYears * 365.25;
  }

  const daysDifference = ageInDays - recommendedAgeDays;

  // Status categories with appropriate grace periods
  // If child is more than 7 days younger than recommended age, not yet eligible
  if (daysDifference < -7) return {
    status: 'NOT_YET_ELIGIBLE',
    priority: 4,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  };
  // If within 7 days before to 30 days after recommended age, it's due now
  if (daysDifference >= -7 && daysDifference <= 30) return {
    status: 'DUE_NOW',
    priority: 2,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300'
  };
  if (daysDifference > 30 && daysDifference <= 90) return {
    status: 'OVERDUE',
    priority: 1,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300'
  };
  if (daysDifference > 90) return {
    status: 'SEVERELY_OVERDUE',
    priority: 1,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  };

  return {
    status: 'ACCESSIBLE',
    priority: 3,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300'
  };
};

// Helper functions for requirement checks
const matchesRequiredGender = (dose, gender) => {
  if (!dose.requiredGender) return true;
  return dose.requiredGender.toLowerCase() === gender?.toLowerCase();
};
const matchesSchoolClass = (dose, schoolClass) => {
  if (dose.minSchoolClass && (!schoolClass || schoolClass < dose.minSchoolClass)) return false;
  if (dose.maxSchoolClass && (!schoolClass || schoolClass > dose.maxSchoolClass)) return false;
  return true;
};
const matchesBirthYear = (dose, birthYear) => {
  if (dose.minBirthYear && (!birthYear || birthYear < dose.minBirthYear)) return false;
  return true;
};

// Enhanced categorizeVaccines: always show doses with a date, even if requirements don't match
const categorizeVaccines = (
  vaccineSchedule,
  childAge,
  gender,
  schoolClass,
  birthYear,
  formVaccines = {},
  dbVaccinations = []
) => {
  const categories = {
    CURRENT: { vaccines: [], count: 0, icon: FaExclamationTriangle, color: 'text-red-600', title: 'Current & Overdue' },
    CATCH_UP: { vaccines: [], count: 0, icon: FaHistory, color: 'text-orange-600', title: 'Catch-up' },
    NOT_APPLICABLE: { vaccines: [], count: 0, icon: FaLock, color: 'text-gray-400', title: 'Not Applicable' }
  };

  Object.entries(vaccineSchedule.doses).forEach(([vaccineName, doses]) => {
    // Filter out doses that do not match requiredGender
    const genderFilteredDoses = doses.filter(dose =>
      !dose.requiredGender || dose.requiredGender.toLowerCase() === gender?.toLowerCase()
    );

    if (genderFilteredDoses.length === 0) return; // Don't show this vaccine at all if no doses match gender

    const vaccineDoses = genderFilteredDoses.map((dose, index) => {
      // Check for date in form state
      const formDose = formVaccines?.[vaccineName]?.[index];
      const hasFormDate = formDose && formDose.date;

      // Check for date in DB vaccinations
      const dbDose = dbVaccinations.find(
        v =>
          v.vaccineType?.name === vaccineName &&
          v.doseNumber === dose.doseNumber
      );
      const hasDbDate = dbDose && dbDose.dateGiven;

      // If date exists in form or DB, always show as completed
      if (hasFormDate || hasDbDate) {
        return {
          ...dose,
          doseIndex: index,
          status: 'COMPLETED',
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          doseType: dose.isBooster ? 'booster' : 'current',
          date: hasFormDate ? formDose.date : dbDose.dateGiven,
          remarks: hasFormDate ? formDose.remarks : dbDose.remarks,
        };
      }

      // Show all doses, but visually indicate if not applicable by age/schoolClass/birthYear
      let notApplicable = false;
      let reason = '';
      if (!matchesSchoolClass(dose, schoolClass)) {
        notApplicable = true;
        reason = 'Only applicable for specific school class';
      } else if (!matchesBirthYear(dose, birthYear)) {
        notApplicable = true;
        reason = 'Only applicable for specific birth year';
      }

      const statusInfo = getVaccineStatus(dose, childAge);

      return {
        doseIndex: index,
        dose: dose.doseNumber,
        doseInfo: dose,
        ...statusInfo,
        doseType: dose.isBooster ? 'booster' : 'current',
        status: notApplicable ? 'NOT_APPLICABLE' : statusInfo.status,
        reason: notApplicable ? reason : undefined,
        color: notApplicable ? 'text-gray-400' : statusInfo.color,
        bgColor: notApplicable ? 'bg-gray-50' : statusInfo.bgColor,
        borderColor: notApplicable ? 'border-gray-200' : statusInfo.borderColor,
      };
    });

    // Show all doses in their respective categories
    const currentDoses = vaccineDoses.filter(d => d.doseType === 'current');
    const boosterDoses = vaccineDoses.filter(d => d.doseType === 'booster');
    const notApplicableDoses = vaccineDoses.filter(d => d.status === 'NOT_APPLICABLE');

    if (currentDoses.length > 0) {
      categories.CURRENT.vaccines.push({ vaccineName, doses: currentDoses });
      categories.CURRENT.count += currentDoses.length;
    }
    if (boosterDoses.length > 0) {
      categories.CATCH_UP.vaccines.push({ vaccineName, doses: boosterDoses });
      categories.CATCH_UP.count += boosterDoses.length;
    }
    if (notApplicableDoses.length > 0) {
      categories.NOT_APPLICABLE.vaccines.push({ vaccineName, doses: notApplicableDoses });
      categories.NOT_APPLICABLE.count += notApplicableDoses.length;
    }
  });

  return categories;
};

const VaccineCard = ({
  vaccineName,
  dose,
  sectionType,
  control,
  register,
  setValue,
  showRemarks,
  toggleRemarks,
  theme,
  t,
  isFullProfile,
}) => {
  const isServerDate = useWatch({
    control,
    name: `vaccines.${vaccineName}.${dose.doseIndex}.isServerDate`,
  });

  // Watch the live date for this vaccine dose
  const watchedDate = useWatch({
    control,
    name: `vaccines.${vaccineName}.${dose.doseIndex}.date`,
  });

  // Watch the remarks value (for updates as user types)
  const watchedRemarks = useWatch({
    control,
    name: `vaccines.${vaccineName}.${dose.doseIndex}.remarks`,
  });

  // ✅ Capture initial remarks only once (server-provided snapshot)
  const initialRemarks = useMemo(() => watchedRemarks, []);
  const isReadOnly = !isFullProfile && !!initialRemarks;

  const remarksKey = `${vaccineName}-${dose.doseIndex}`;
  const showRemark = showRemarks[remarksKey] || false;

  // If user has entered or already has a date, mark as completed
  const isCompleted = !!watchedDate;

  const displayStatus = isCompleted
    ? {
      ...dose,
      status: "COMPLETED",
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
    }
    : dose;

  // Helper function for recommended age label
  const getRecommendedAgeText = (doseInfo) => {
    // fallback to dose if doseInfo is undefined
    const d = doseInfo || dose;
    if (d.recommendedAtDays != null) {
      return t("vaccine_card.days", { count: d.recommendedAtDays });
    } else if (d.recommendedAtWeeks != null) {
      return t("vaccine_card.weeks", { count: d.recommendedAtWeeks });
    } else if (d.recommendedAtMonths != null) {
      return t("vaccine_card.months", { count: d.recommendedAtMonths });
    } else if (d.recommendedAtYears != null) {
      return t("vaccine_card.years", { count: d.recommendedAtYears });
    }
    return t("vaccine_card.birth");
  };

  return (
    <div
      className={`p-4 border rounded-lg transition-all ${displayStatus.bgColor} ${displayStatus.borderColor} border-l-4`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className={`font-medium ${displayStatus.color}`}>
              {vaccineName} - {t("vaccine_card.dose", { dose: displayStatus.dose })}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {t("vaccine_card.recommended_at")}{" "}
              {getRecommendedAgeText(displayStatus.doseInfo || displayStatus)}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`badge ${displayStatus.status === "SEVERELY_OVERDUE"
                ? "badge-error"
                : displayStatus.status === "OVERDUE"
                  ? "badge-warning"
                  : displayStatus.status === "DUE_NOW"
                    ? "badge-info"
                    : displayStatus.status === "ACCESSIBLE"
                      ? "badge-success"
                      : displayStatus.status === "COMPLETED"
                        ? "badge-success"
                        : "badge-neutral"
                } text-xs`}
            >
              {displayStatus.status === "COMPLETED"
                ? t("vaccine_card.status.completed", "Completed")
                : t(`vaccine_card.status.${displayStatus.status.toLowerCase()}`)}
            </span>
            {displayStatus.doseType === "booster" && (
              <span className="badge badge-outline badge-xs">
                {t("vaccine_card.booster")}
              </span>
            )}
          </div>
        </div>

        {/* Date Input */}
        <div>
          <Controller
            name={`vaccines.${vaccineName}.${displayStatus.doseIndex}.date`}
            control={control}
            render={({ field }) => (
              <div className="relative">
                {dose.status !== "NOT_YET_ELIGIBLE" ? (
                  (!isFullProfile && field.value) ? (
                    // readonly fallback for partial profiles with existing date
                    <input
                      type="text"
                      className="input input-bordered input-sm w-full bg-base-200 cursor-not-allowed"
                      value={field.value}
                      readOnly
                    />
                  ) : (
                    <>
                      <NepaliDatePicker
                        className="w-full"
                        inputClassName="input input-bordered input-sm w-full pr-8"
                        value={field.value || ""}
                        onChange={(value) => field.onChange(value)}
                        language="ne"
                        theme={theme}
                        placeholder={t("vaccine_card.date_placeholder")}
                        minYear={2000}           // example lower bound
                        maxYear={currentBSYear}
                      />
                      {field.value && (
                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              `vaccines.${vaccineName}.${displayStatus.doseIndex}.date`,
                              ""
                            )
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                          title={t("vaccine_card.clear_date_title")}
                        >
                          ✕
                        </button>
                      )}
                    </>
                  )
                ) : (
                  <input
                    type="text"
                    className="input input-bordered input-sm w-full input-disabled"
                    value=""
                    disabled
                    readOnly
                    placeholder={t("vaccine_card.unavailable_placeholder", {
                      age: getRecommendedAgeText(displayStatus.doseInfo),
                    })}
                  />
                )}
              </div>
            )}
          />
          {/* External Administered Toggle */}
          <div className="mt-3 flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(
                  `vaccines.${vaccineName}.${displayStatus.doseIndex}.isExternallyAdministered`
                )}
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className="text-sm text-base-content/80">Externally administered (outside this ward)</span>
            </label>

            {/* Text input only when checked */}
            {useWatch({
              control,
              name: `vaccines.${vaccineName}.${displayStatus.doseIndex}.isExternallyAdministered`,
            }) && (
                <input
                  type="text"
                  {...register(
                    `vaccines.${vaccineName}.${displayStatus.doseIndex}.externalAdministeredBy`
                  )}
                  placeholder="Enter hospital, center, or person name"
                  className="input input-bordered input-sm w-full"
                />
              )}
          </div>


          {/* Remarks Section */}
          {dose.status !== "NOT_YET_ELIGIBLE" && (
            <div className="pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => toggleRemarks(vaccineName, displayStatus.doseIndex)}
                className="btn btn-sm w-full justify-between p-2 bg-base-200 hover:bg-base-300"
              >
                <span className="flex items-center text-xs">
                  <FaClipboardList className="w-3 h-3 mr-1" />
                  {t("vaccine_card.remarks")}
                </span>
                <span
                  className={`text-xs transform transition-transform ${showRemark ? "rotate-180" : ""
                    }`}
                >
                  ▼
                </span>
              </button>

              {showRemark && (
                <div className="mt-2">
                  <textarea
                    {...register(
                      `vaccines.${vaccineName}.${displayStatus.doseIndex}.remarks`
                    )}
                    className="textarea textarea-bordered textarea-xs w-full"
                    placeholder={t("vaccine_card.remarks_placeholder")}
                    rows={2}
                    readOnly={!isFullProfile && isServerDate}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};





// Vaccine Section Component
const VaccineSection = ({
  sectionKey,
  sectionData,
  expandedSections,
  toggleSection,
  control,
  register,
  setValue,
  showRemarks,
  toggleRemarks,
  theme,
  t,
  isFullProfile,
  serverRemarks
}) => {
  const isExpanded = expandedSections[sectionKey];
  const isEmpty = sectionData.count === 0;
  const IconComponent = sectionData.icon;

  if (isEmpty) {
    return null;
  }

  const getSectionTitle = (key) => {
    const titles = {
      CURRENT: t('vaccine_section.current', { count: sectionData.count }),
      CATCH_UP: t('vaccine_section.catch_up', { count: sectionData.count }),
      NOT_APPLICABLE: t('vaccine_section.not_applicable', { count: sectionData.count })
    };
    return titles[key];
  };

  const getSectionDescription = () => {
    const descriptions = {
      CURRENT: 'These are routine doses for the child. Some may be due, overdue, or upcoming.',
      CATCH_UP: 'These are booster doses for the child. They are administered at specific ages.',
      NOT_APPLICABLE: 'These vaccines are not applicable for this child'
    };
    return descriptions[sectionKey];
  };

  return (
    <div className="mb-6">
      {isExpanded && !isEmpty && (
        <div className="mt-4 space-y-4">
          {sectionData.vaccines.map((vaccine) => (
            <div key={vaccine.vaccineName} className="ml-4">
              <h4 className="font-medium text-base mb-3 text-gray-700">
                {vaccine.vaccineName}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {vaccine.doses.map((dose) => (
                  <VaccineCard
                    key={`${vaccine.vaccineName}-${dose.doseIndex}`}
                    vaccineName={vaccine.vaccineName}
                    dose={dose}
                    sectionType={sectionKey}
                    control={control}
                    register={register}
                    setValue={setValue}
                    showRemarks={showRemarks}
                    toggleRemarks={toggleRemarks}
                    theme={theme}
                    t={t}
                    isFullProfile={isFullProfile}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isExpanded && isEmpty && (
        <div className="mt-4 ml-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-center">
            <FaCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
            <p className="text-green-700 font-medium">{t('vaccine_section.no_vaccines_in_category')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function EditChild() {
  const { user } = useAuth();

  const location = useLocation();
  useEffect(() => {
    if (location.state?.selectedChild) {
      setSelectedChild(location.state.selectedChild);
      setShowSearchSection(false);
    }
  }, [location.state]);

  const { t } = useTranslation('addChild');
  const { theme } = useTheme();
  const { updateChildInState } = useChildContext();
  const { vaccineSchedule, loading } = useVaccineScheduleContext();
  console.log('vaccineschedule ', vaccineSchedule)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(updateChildSchema),
    defaultValues: {
      isFromOtherMunicipality: false,
      birthDate: '',
      administeredById: '',
      vaccines: {},
      weightRecords: [{ id: null, date: '', weight: '' }],
    },
  });

  const navigate = useNavigate();
  const gender = useWatch({ control, name: 'gender', defaultValue: '' });
  const birthDate = useWatch({ control, name: 'birthDate', defaultValue: '' });
  const schoolClass = useWatch({ control, name: 'schoolClass', defaultValue: '' });
  const birthYear = birthDate ? new Date(bsToAd(birthDate)).getFullYear() : undefined;

  const [selectedChild, setSelectedChild] = useState(null);
  const [showSearchSection, setShowSearchSection] = useState(true);
  const [isFullProfile, setIsFullProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedChild, setFetchedChild] = useState(null);
  const [healthWorkers, setHealthWorkers] = useState([]);
  const [serverRemarks, setServerRemarks] = useState({});
  const [showRemarks, setShowRemarks] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    CURRENT: true,
    CATCH_UP: false,
    NOT_APPLICABLE: false,
  });
  const [activeTab, setActiveTab] = useState('CURRENT');
  const [sewaDartaNumber, setSewaDartaNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    serviceRegistrationNumber: '',
    phoneNumber: '',
    wardNumber: '',
    createdByMe: false,
    gender: '',
    isComplete: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'weightRecords',
  });

  // Initialize vaccine default values after vaccineSchedule is available
  useEffect(() => {
    if (vaccineSchedule && vaccineSchedule.doses) {
      setValue('vaccines', Object.fromEntries(
        Object.entries(vaccineSchedule.doses).map(([vaccineName, doses]) => [
          vaccineName,
          doses.map(() => ({ date: '', remarks: '' })),
        ])
      ));
    }
  }, [vaccineSchedule, setValue]);

  useEffect(() => {
    const fetchHealthWorkers = async () => {
      try {
        let url = '/api/users?role=WARD_OFFICER';

        if (user?.role === 'SUPER_ADMIN') {
          url = '/api/users';
        }

        const res = await axiosClient.get(url);
        setHealthWorkers(res.data);
      } catch (err) {
        console.error('Failed to fetch health workers:', err);
      }
    };

    fetchHealthWorkers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const hasSearchFilters = filters.name || filters.serviceRegistrationNumber || filters.phoneNumber || filters.gender || filters.wardNumber || filters.isComplete || filters.createdByMe;
      if (!hasSearchFilters) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await axiosClient.get('/api/child/search', {
          params: {
            name: filters.name,
            phoneNumber: filters.phoneNumber,
            sewaDartaNumber: filters.serviceRegistrationNumber,
            gender: filters.gender,
            wardId: filters.wardNumber || 'all',
            createdByMe: filters.createdByMe,
            isComplete: filters.isComplete,
          },
        });

        let results = [];
        if (Array.isArray(res.data)) {
          results = res.data;
        } else if (res.data && Array.isArray(res.data.children)) {
          results = res.data.children;
        } else if (res.data && Array.isArray(res.data.data)) {
          results = res.data.data;
        } else if (res.data && Array.isArray(res.data.items)) {
          results = res.data.items;
        }

        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
        toast.error('खोज्दा त्रुटि भयो');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [filters]);

  useEffect(() => {
    const fetchChildData = async () => {
      if (!selectedChild) return;
      setIsLoading(true);

      try {
        const res = await axiosClient.get(`/api/child/${selectedChild.sewaDartaNumber}`);
        const childData = res.data;
        console.log('childData fetched:', childData);

        const fullProfile = !!childData.parentName;
        setIsFullProfile(fullProfile);
        setFetchedChild(childData);

        const defaultFormValues = {
          firstName: childData.fullName.split(' ')[0],
          lastName: childData.fullName.split(' ').slice(1).join(' '),
          gender: childData.gender,
          birthDate: adToBs(safeFormatDateYYMMDD(childData.birthDate)),
          administeredById: childData.createdById?.toString(),
          ...(fullProfile && {
            wardNumber: childData.wardNumber.toString(),
            casteCode: childData.casteCode.toString(),
            parentName: childData.parentName,
            tole: childData.tole,
            phoneNumber: childData.phoneNumber || '',
            isFromOtherMunicipality: childData.isFromOtherMunicipality,
            remarks: childData.remarks || '',
          }),
          vaccines: Object.fromEntries(
            Object.entries(vaccineSchedule?.doses || {}).map(([vaccineName, doses]) => [
              vaccineName,
              doses.map(() => ({ date: '', remarks: '' })),
            ])
          ),
        };

        reset(defaultFormValues);

        const newWeightRecords = childData.weightRecords.length > 0
          ? childData.weightRecords.map((rec) => ({
            dbId: rec.id ? rec.id.toString() : null,
            date: adToBs(safeFormatDateYYMMDD(rec.date)),
            weight: rec.weight.toString(),
          }))
          : [{ dbId: null, date: '', weight: '' }];

        replace(newWeightRecords);

        const vaccineTypeIdToName = {};
        Object.entries(vaccineSchedule?.doses || {}).forEach(([vaccineName, doses]) => {
          if (doses.length > 0 && doses[0].vaccineTypeId) {
            vaccineTypeIdToName[doses[0].vaccineTypeId] = vaccineName;
          }
        });

        childData.vaccinations.forEach((vac) => {
          const vaccineName = vaccineTypeIdToName[vac.vaccineType.id];
          if (!vaccineName) {
            console.warn(`Vaccine type ID ${vac.vaccineTypeId} not found in mapping`);
            return;
          }

          const doses = vaccineSchedule?.doses[vaccineName];
          if (doses) {
            const doseIndex = doses.findIndex((d) => d.doseNumber === vac.doseNumber);
            if (doseIndex !== -1) {
              setValue(
                `vaccines.${vaccineName}.${doseIndex}.date`,
                adToBs(safeFormatDateYYMMDD(vac.dateGiven))
              );
              setValue(
                `vaccines.${vaccineName}.${doseIndex}.remarks`,
                vac.remarks || ''
              );
              setValue(
                `vaccines.${vaccineName}.${doseIndex}.isServerDate`,
                true
              );
              setValue(
                `vaccines.${vaccineName}.${doseIndex}.isExternallyAdministered`,
                vac.isExternallyAdministered || false
              );
              setValue(
                `vaccines.${vaccineName}.${doseIndex}.externalAdministeredBy`,
                vac.externalAdministeredBy || ''
              );

            }

          }
        });


        setSewaDartaNumber(childData.sewaDartaNumber.toString());
      } catch (err) {
        console.error('Failed to fetch child data:', err);
        toast.error(t('toast.fetch_error') || 'Failed to retrieve child data.');
        setShowSearchSection(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [selectedChild, reset, setValue, replace, t, vaccineSchedule]);

  const toggleRemarks = (vaccineName, doseIndex) => {
    const key = `${vaccineName}-${doseIndex}`;
    setShowRemarks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChildSelect = (child) => {
    if (!child) return;
    setSelectedChild(child);
    console.log('selected child', child)
    setShowSearchSection(false);
  };

  const onSubmit = async (data) => {
    if (!fetchedChild) {
      toast.error(t('submitSection.no_child_loaded'));
      return;
    }

    try {
      const filteredWeightRecords = data.weightRecords
        .filter((record) => record.date && record.weight)
        .map((rec) => {
          const weightRecord = {
            date: rec.date,
            weight: parseFloat(rec.weight),
          };

          if (rec.dbId && rec.dbId !== 'null' && rec.dbId !== '' && rec.dbId !== null) {
            weightRecord.id = parseInt(rec.dbId);
          }

          return weightRecord;
        });

      // Create vaccine type ID to name mapping
      const vaccineTypeIdToName = {};
      Object.entries(vaccineSchedule.doses).forEach(([vaccineName, doses]) => {
        if (doses.length > 0 && doses[0].vaccineTypeId) {
          vaccineTypeIdToName[vaccineName] = doses[0].vaccineTypeId;
        }
      });

      const filteredVaccinations = Object.entries(data.vaccines)
        .flatMap(([vaccineName, doses]) =>
          doses
            .filter((dose) => dose.date)
            .map((dose, index) => {
              const scheduleDose = vaccineSchedule.doses[vaccineName][index];
              const vaccineTypeId = vaccineTypeIdToName[vaccineName];
              if (!vaccineTypeId) {
                console.error(`Vaccine type ID not found for ${vaccineName}`);
                return null;
              }

              const isExternal = !!dose.isExternallyAdministered;
              const externalBy = dose.externalAdministeredBy?.trim() || null;

              return {
                vaccineTypeId,
                doseNumber: scheduleDose.doseNumber,
                dateGiven: dose.date,
                remarks: dose.remarks || null,
                type: scheduleDose.isBooster ? 'booster' : 'current',
                isExternallyAdministered: isExternal,
                externalAdministeredBy: externalBy,
              };
            })
        )
        .filter(Boolean);

      const administeredById = data.administeredById;

      let payload = {};

      if (isFullProfile) {
        payload = {
          weightRecords: filteredWeightRecords,
          vaccinations: filteredVaccinations,
          administeredById: parseInt(administeredById),
          remarks: data.remarks || null,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          birthDate: data.birthDate,
          wardNumber: parseInt(data.wardNumber),
          casteCode: parseInt(data.casteCode),
          parentName: data.parentName,
          tole: data.tole,
          phoneNumber: data.phoneNumber || null,
          isFromOtherMunicipality: data.isFromOtherMunicipality,
        };
      } else {
        payload = {
          weightRecords: filteredWeightRecords,
          vaccinations: filteredVaccinations,
          administeredById:
            data.administeredById && data.administeredById !== 'outside'
              ? parseInt(data.administeredById)
              : null,
          externalAdministeredBy:
            data.administeredById === 'outside'
              ? data.externalAdministeredBy?.trim() || null
              : null,

          remarks: data.remarks || null,
        };
      }

      // Build a set of all existing vaccinations in the DB
      const existingVaccinations = (fetchedChild?.vaccinations || []).map(v => ({
        vaccineTypeId: v.vaccineType?.id,
        doseNumber: v.doseNumber,
        id: v.id,
      }));

      // Build a set of all vaccinations being submitted (with a date)
      const submittedVaccinations = Object.entries(data.vaccines)
        .flatMap(([vaccineName, doses]) =>
          doses
            .filter((dose) => dose.date)
            .map((dose, index) => {
              const scheduleDose = vaccineSchedule.doses[vaccineName][index];
              const vaccineTypeId = vaccineTypeIdToName[vaccineName];
              return {
                vaccineTypeId,
                doseNumber: scheduleDose.doseNumber,
              };
            })
        );

      // Find vaccinations that exist in DB but are now cleared (no date in form)
      const removedVaccinations = existingVaccinations.filter(ev =>
        !submittedVaccinations.some(sv =>
          sv.vaccineTypeId === ev.vaccineTypeId && sv.doseNumber === ev.doseNumber
        )
      );

      // Add to payload: removed vaccinations
      payload.removedVaccinations = removedVaccinations.map(v => ({
        vaccineTypeId: v.vaccineTypeId,
        doseNumber: v.doseNumber,
      }));

      const res = await axiosClient.put(`/api/child/${fetchedChild.sewaDartaNumber}`, payload);
      updateChildInState(res.data);
      toast.success(t('toast.update_success'));
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(t('toast.error'));
    }
  };

  const onErrors = (errors) => {
    console.log('Validation errors:', errors);
    const errorMessage = getFirstErrorMessage(errors);
    toast.error(t('toast.validation_error', { errors }));
  };

  const age = calculateAge(birthDate);

  const categorizedVaccines = useMemo(() => {
    if (!birthDate || !gender || !vaccineSchedule || loading) {
      return {
        CURRENT: {
          vaccines: [],
          count: 0,
          icon: FaExclamationTriangle,
          color: 'text-red-600',
          title: 'Current & Overdue',
        },
        CATCH_UP: {
          vaccines: [],
          count: 0,
          icon: FaHistory,
          color: 'text-orange-600',
          title: 'Catch-up',
        },
        NOT_APPLICABLE: {
          vaccines: [],
          count: 0,
          icon: FaLock,
          color: 'text-gray-400',
          title: 'Not Applicable',
        },
      };
    }
    return categorizeVaccines(
      vaccineSchedule,
      age,
      gender,
      schoolClass ? parseInt(schoolClass) : undefined,
      birthYear,
      getValues('vaccines'),
      fetchedChild?.vaccinations || []
    );
  }, [birthDate, gender, schoolClass, birthYear, vaccineSchedule, loading, age, getValues, fetchedChild]);

  const totalVaccines = Object.values(categorizedVaccines).reduce(
    (sum, cat) => sum + cat.count,
    0
  );
  const totalResults = Array.isArray(searchResults) ? searchResults.length : 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const paginatedResults = Array.isArray(searchResults)
    ? searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
    : [];

  // Early return for loading state
  if (loading || !vaccineSchedule) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading vaccine schedule...</p>
        </div>
      </div>
    );
  }

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
                  {t('header.edit_title')}
                </h1>
                <p className="text-base text-base-content/70">
                  {t('header.edit_description')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline btn-primary"
              title={t('dashboard_button.title')}
            >
              <FaArrowLeft className="mr-2" />
              {t('dashboard_button.label')}
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {showSearchSection ? (
          <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 p-6 mb-8">
            <div className="flex items-center mb-4">
              <FaSearch className="text-primary text-lg mr-2" />
              <h2 className="text-lg font-medium text-base-content">बच्चाको खोजी</h2>
            </div>

            {/* Compact Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="form-control">
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                  className="input input-bordered input-sm"
                  placeholder="नाम..."
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  value={filters.serviceRegistrationNumber}
                  onChange={(e) => setFilters((prev) => ({ ...prev, serviceRegistrationNumber: e.target.value }))}
                  className="input input-bordered input-sm"
                  placeholder="सेवा दर्ता नं..."
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  value={filters.phoneNumber}
                  onChange={(e) => setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="input input-bordered input-sm"
                  placeholder="फोन नम्बर..."
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 items-end">
              <div className="form-control">
                <select
                  value={filters.wardNumber}
                  onChange={(e) => setFilters((prev) => ({ ...prev, wardNumber: e.target.value }))}
                  className="select select-bordered select-sm"
                >
                  <option value="">वडा - सबै</option>
                  {[...Array(13)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      वडा {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                  className="select select-bordered select-sm"
                >
                  <option value="">लिङ्ग - सबै</option>
                  <option value="MALE">पुरुष</option>
                  <option value="FEMALE">महिला</option>
                  <option value="OTHER">अन्य</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start py-2">
                  <input
                    type="checkbox"
                    checked={filters.createdByMe}
                    onChange={(e) => setFilters((prev) => ({ ...prev, createdByMe: e.target.checked }))}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="label-text text-sm ml-2">मैले दर्ता गरेको</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start py-2">
                  <input
                    type="checkbox"
                    checked={filters.isComplete}
                    onChange={(e) => setFilters((prev) => ({ ...prev, isComplete: e.target.checked }))}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="label-text text-sm ml-2">पूर्ण विवरण</span>
                </label>
              </div>
            </div>

            {/* Results Section */}
            {isLoading ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            ) : paginatedResults.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="table table-sm w-full table-zebra">
                    <thead>
                      <tr className="text-xs">
                        <th className="py-2">सेवा दर्ता नं.</th>
                        <th className="py-2">नाम</th>
                        <th className="py-2">लिङ्ग</th>
                        <th className="py-2">जन्म मिति</th>
                        <th className="py-2">वडा नं.</th>
                        <th className="py-2 text-center">क्रिया</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedResults.map((child) => (
                        <tr key={child.sewaDartaNumber} className="hover">
                          <td className="py-2 text-sm font-mono">{child.sewaDartaNumber}</td>
                          <td className="py-2 text-sm font-medium">{child.fullName}</td>
                          <td className="py-2 text-sm">
                            {child.gender === 'MALE' ? 'पुरुष' : child.gender === 'FEMALE' ? 'महिला' : 'अन्य'}
                          </td>
                          <td className="py-2 text-sm">{adToBs(safeFormatDateYYMMDD(child.birthDate))}</td>
                          <td className="py-2 text-sm text-center">{child.wardNumber}</td>
                          <td className="py-2 text-center">
                            <button
                              onClick={() => handleChildSelect(child)}
                              className="btn btn-primary btn-xs"
                            >
                              छान्नुहोस्
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Compact Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="join">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <FaInfoCircle className="text-4xl text-base-content/40 mx-auto mb-2" />
                <p className="text-sm text-base-content/70">कुनै बच्चा फेला परेन</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/70">बच्चाको विवरण लोड हुँदैछ...</p>
              </div>
            ) : fetchedChild ? (
              <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 min-w-[20rem]">
                <form
                  onSubmit={handleSubmit(onSubmit, onErrors)}
                  className="p-8 space-y-12"
                >
                  <div>
                    <div className="flex items-center mb-8">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <FaUser className="text-primary text-lg" />
                      </div>
                      <h2 className="text-xl font-medium text-base-content">
                        {t('personalInfo.title')}
                      </h2>
                    </div>
                    {isFullProfile ? (
                      <>
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
                              {t('personalInfo.municipality.label')}
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.firstName.label')} <span className="text-error">*</span>
                              </span>
                            </label>
                            <input
                              {...register('firstName')}
                              className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                              placeholder={t('personalInfo.form.firstName.placeholder')}
                            />
                            {errors.firstName && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.firstName.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.lastName.label')}
                              </span>
                            </label>
                            <input
                              {...register('lastName')}
                              className="input input-bordered w-full"
                              placeholder={t('personalInfo.form.lastName.placeholder')}
                            />
                            {errors.lastName && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.lastName.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.gender.label')} <span className="text-error">*</span>
                              </span>
                            </label>
                            <select
                              {...register('gender')}
                              className={`select select-bordered w-full ${errors.gender ? 'select-error' : ''}`}
                            >
                              <option value="">{t('personalInfo.form.gender.placeholder')}</option>
                              <option value="MALE">{t('personalInfo.form.gender.options.male')}</option>
                              <option value="FEMALE">{t('personalInfo.form.gender.options.female')}</option>
                              <option value="OTHER">{t('personalInfo.form.gender.options.other')}</option>
                            </select>
                            {errors.gender && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.gender.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.wardNumber.label')} <span className="text-error">*</span>
                              </span>
                            </label>
                            <input
                              {...register('wardNumber')}
                              className={`input input-bordered w-full ${errors.wardNumber ? 'input-error' : ''}`}
                              placeholder={t('personalInfo.form.wardNumber.placeholder')}
                            />
                            {errors.wardNumber && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.wardNumber.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.casteCode.label')} <span className="text-error">*</span>
                              </span>
                            </label>
                            <input
                              type="number"
                              {...register('casteCode')}
                              className={`input input-bordered w-full ${errors.casteCode ? 'input-error' : ''}`}
                              placeholder={t('personalInfo.form.casteCode.placeholder')}
                            />
                            {errors.casteCode && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.casteCode.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.parentName.label')} <span className="text-error">*</span>
                              </span>
                            </label>
                            <input
                              {...register('parentName')}
                              className={`input input-bordered w-full ${errors.parentName ? 'input-error' : ''}`}
                              placeholder={t('personalInfo.form.parentName.placeholder')}
                            />
                            {errors.parentName && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.parentName.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.tole.label')} <span className="text-error">*</span>
                              </span>
                            </label>
                            <input
                              {...register('tole')}
                              className={`input input-bordered w-full ${errors.tole ? 'input-error' : ''}`}
                              placeholder={t('personalInfo.form.tole.placeholder')}
                            />
                            {errors.tole && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.tole.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.phoneNumber.label')}
                              </span>
                            </label>
                            <input
                              {...register('phoneNumber')}
                              className="input input-bordered w-full"
                              placeholder={t('personalInfo.form.phoneNumber.placeholder')}
                            />
                            {errors.phoneNumber && (
                              <p className="text-error text-sm mt-1">
                                {t('personalInfo.form.phoneNumber.required')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-base font-medium">
                                {t('personalInfo.form.birthDate.label')} <span className="text-error">*</span>
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
                                      inputClassName={`input input-bordered w-full pr-10 ${errors.birthDate ? 'input-error' : ''}`}
                                      value={field.value || ''}
                                      onChange={(value) => field.onChange(value)}
                                      language="ne"
                                      theme={theme}
                                      minYear={2000}           // example lower bound
                                      maxYear={currentBSYear}
                                    />
                                    {field.value && (
                                      <button
                                        type="button"
                                        onClick={() => setValue('birthDate', '')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-error transition-colors"
                                        title={t('personalInfo.form.birthDate.clear_title')}
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
                                {t('personalInfo.form.birthDate.required')}
                              </p>
                            )}
                            {birthDate && (
                              <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
                                <div className="text-base text-success font-medium">
                                  {t('personalInfo.age', { years: age.years, months: age.months, days: age.days })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">सेवा दर्ता नं.</span></label>
                          <p className="p-3 border rounded-lg bg-base-200 font-semibold">{fetchedChild.sewaDartaNumber}</p>
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">नाम</span></label>
                          <p className="p-3 border rounded-lg bg-base-200 font-semibold">{fetchedChild.fullName}</p>
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">लिङ्ग</span></label>
                          <p className="p-3 border rounded-lg bg-base-200 font-semibold">
                            {fetchedChild.gender === 'MALE'
                              ? t('personalInfo.form.gender.options.male')
                              : fetchedChild.gender === 'FEMALE'
                                ? t('personalInfo.form.gender.options.female')
                                : t('personalInfo.form.gender.options.other')}
                          </p>
                        </div>
                        <div className="form-control">
                          <label className="label"><span className="label-text font-medium">जन्म मिति</span></label>
                          <p className="p-3 border rounded-lg bg-base-200 font-semibold">{adToBs(safeFormatDateYYMMDD(fetchedChild.birthDate))}</p>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">उमेर</span>
                          </label>
                          {birthDate && (
                            <p className="p-3 border rounded-lg bg-base-200 font-semibold">
                              {t('personalInfo.age', { months: age.months, days: age.days })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-8">
                      <label className="label">
                        <span className="label-text text-base font-medium">
                          {t('personalInfo.administered_by.label')} <span className="text-error">*</span>
                        </span>
                      </label>
                      <select
                        {...register('administeredById')}
                        className={`select select-bordered w-full max-w-xs ${errors.administeredById ? 'select-error' : ''}`}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {t('personalInfo.administered_by.placeholder')}
                        </option>

                        {healthWorkers
                          .sort((a, b) => {
                            // Sort by wardId first (nulls at the end), then by name
                            const wardA = a.wardId ?? Infinity;
                            const wardB = b.wardId ?? Infinity;
                            if (wardA !== wardB) return wardA - wardB;
                            return a.name.localeCompare(b.name);
                          })
                          .map((worker) => (
                            <option key={worker.id} value={worker.id}>
                              {worker.wardId ? `Ward ${worker.wardId} — ` : ''}
                              {worker.name}
                              {worker.role ? ` [${worker.role}]` : ''}
                            </option>
                          ))}
                      </select>

                      {errors.administeredById && (
                        <p className="text-error text-sm mt-1">
                          {t('personalInfo.administered_by.required')}
                        </p>
                      )}



                    </div>
                  </div>
                  <div className="border-t border-base-300 pt-12">
                    <div className="flex items-center mb-8">
                      <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                        <FaWeight className="text-warning text-lg" />
                      </div>
                      <h2 className="text-xl font-medium text-base-content">
                        {t('weightTracking.title')}
                      </h2>
                    </div>
                    <div className="space-y-6">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="p-6 bg-base-200 rounded-lg border border-base-300"
                        >
                          <input
                            type="hidden"
                            {...register(`weightRecords.${index}.dbId`)}
                            value={field.dbId || ''}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div>
                              <label className="label">
                                <span className="label-text text-base font-medium">
                                  {t('weightTracking.date_label', { index: index + 1 })}
                                </span>
                              </label>
                              <Controller
                                name={`weightRecords.${index}.date`}
                                control={control}
                                render={({ field }) => (
                                  (!isFullProfile && field.value) ? (
                                    <input
                                      type="text"
                                      className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                                      value={field.value}
                                      readOnly
                                    />
                                  ) : (
                                    <NepaliDatePicker
                                      className="w-full"
                                      inputClassName="input input-bordered w-full"
                                      value={field.value || ''}
                                      onChange={(value) => field.onChange(value)}
                                      language="ne"
                                      theme={theme}
                                      minYear={2000}           // example lower bound
                                      maxYear={currentBSYear}
                                    />
                                  )
                                )}
                              />

                              {errors.weightRecords?.[index]?.date && (
                                <p className="text-error text-sm mt-1">
                                  {t('weightTracking.errors.date_required')}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="label">
                                <span className="label-text text-base font-medium">
                                  {t('weightTracking.weight_label')}
                                </span>
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                {...register(`weightRecords.${index}.weight`, {
                                  min: { value: 0, message: t('weightTracking.errors.weight_positive') },
                                  max: { value: 50, message: t('weightTracking.errors.weight_too_large') },
                                })}
                                className="input input-bordered w-full"
                                placeholder={t('weightTracking.weight_label')}
                                disabled={!isFullProfile && field.dbId}
                              />
                              {errors.weightRecords?.[index]?.weight && (
                                <p className="text-error text-sm mt-1">
                                  {errors.weightRecords[index].weight.message}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-3">
                              {isFullProfile && fields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="btn btn-outline btn-error btn-sm"
                                  title={t('weightTracking.remove_button_title')}
                                >
                                  <FaMinus className="w-4 h-4" />
                                </button>
                              )}
                              {index === fields.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => append({ dbId: null, date: '', weight: '' })}
                                  className="btn btn-outline btn-success btn-sm"
                                  title={t('weightTracking.add_more_button_title')}
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
                            {t('weightTracking.add_button')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-base-300 pt-12">
                    <div className="flex items-center mb-8">
                      <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                        <FaSyringe className="text-secondary text-lg" />
                      </div>
                      <div>
                        <h2 className="text-xl font-medium text-base-content">
                          {t('vaccine_section.title')}
                        </h2>
                        {age.months >= 0 && birthDate && (
                          <p className="text-sm text-base-content/70">
                            बच्चाको उमेर: {age.months} महिना, {age.days} दिन
                          </p>
                        )}

                      </div>
                    </div>
                    {(!birthDate || !gender) && (
                      <div className="text-center py-12 bg-base-200 rounded-lg border-2 border-dashed border-base-300">
                        <FaInfoCircle className="text-4xl text-base-content/40 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-base-content/60 mb-2">
                          {t('vaccine_section.unavailable.title')}
                        </h3>
                        <p className="text-base-content/50">{t('vaccine_section.unavailable.description')}</p>
                      </div>
                    )}
                    {birthDate && gender && (
                      <>
                        <div className="tabs tabs-boxed mb-6">
                          {Object.entries(categorizedVaccines).map(([sectionKey, sectionData]) => {
                            // Show all tabs (even if count is 0) for consistent UX, as in AddChild
                            const IconComponent = sectionData.icon;
                            return (
                              <button
                                key={sectionKey}
                                type="button"
                                onClick={() => setActiveTab(sectionKey)}
                                className={`tab flex items-center gap-2 ${activeTab === sectionKey ? 'tab-active' : ''}`}
                              >
                                <IconComponent className={`text-xl ${sectionData.color}`} />
                                {t(`vaccine_section.tabs.${sectionKey.toLowerCase()}`, { count: sectionData.count })}
                              </button>
                            );
                          })}
                        </div>
                        {Object.entries(categorizedVaccines).map(([sectionKey, sectionData]) =>
                          activeTab === sectionKey && (
                            <VaccineSection
                              key={sectionKey}
                              sectionKey={sectionKey}
                              sectionData={sectionData}
                              expandedSections={{ [sectionKey]: true }}
                              toggleSection={() => { }}
                              control={control}
                              register={register}
                              setValue={setValue}
                              showRemarks={showRemarks}
                              toggleRemarks={toggleRemarks}
                              theme={theme}
                              t={t}
                              isFullProfile={isFullProfile}
                              serverRemarks={serverRemarks}
                            />
                          )
                        )}
                      </>
                    )}
                    {birthDate && gender && categorizedVaccines.CURRENT.count === 0 && (
                      <div className="text-center py-8 mt-8 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-xl font-semibold text-green-600 mb-2">
                          {t('vaccine_section.all_up_to_date.title')}
                        </h3>
                        <p className="text-base-content/70">{t('vaccine_section.all_up_to_date.description')}</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-base-300 pt-12">
                    <div className="flex items-center mb-8">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                        <FaClipboardList className="text-accent text-lg" />
                      </div>
                      <h2 className="text-xl font-medium text-base-content">
                        {t('generalRemarks.title')}
                      </h2>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-base font-medium">
                          {t('generalRemarks.label')}
                        </span>
                      </label>
                      <textarea
                        {...register('remarks')}
                        rows={6}
                        className="textarea textarea-bordered w-full"
                        placeholder={t('generalRemarks.placeholder')}
                      />
                      <p className="text-sm text-base-content/60 mt-2">
                        {t('generalRemarks.optional_note')}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-base-300 pt-12">
                    <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-base-content">
                          {t('submitSection.title')}
                        </h3>
                        <p className="text-base text-base-content/70">
                          {t('submitSection.description')}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="loading loading-spinner"></span>
                              {t('submitSection.saving')}
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {t('submitSection.save_button')}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 p-4 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FaUser className="text-primary text-lg" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        छानिएको बच्चा: {selectedChild?.fullName || 'उपलब्ध छैन'}
                      </h3>
                      <p className="text-sm text-base-content/70">
                        सेवा दर्ता नं.: {selectedChild?.sewaDartaNumber || 'उपलब्ध छैन'} | वडा नं.:{' '}
                        {selectedChild?.wardNumber || 'उपलब्ध छैन'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowSearchSection(true);
                      setSelectedChild(null);
                      setFetchedChild(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    <FaSearch className="mr-2" />
                    अर्को बच्चा खोज्नुहोस्
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 btn btn-primary btn-circle shadow-lg"
        title={t('scrollToTop.title')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}