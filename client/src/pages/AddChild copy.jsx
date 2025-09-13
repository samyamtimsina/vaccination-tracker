<DOCUMENT filename="EditChild.jsx">
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
// import { vaccineSchedule } from '../utils/vaccineSchedule';
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
import { calculateAge } from '../../helpers/calculateAge.jsx';
import { getFirstErrorMessage } from '../../helpers/getFirstErrorMessage.jsx';
import { useTranslation } from 'react-i18next';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';

// Add this helper function at the top
const safeFormatDateYYMMDD = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

// Enhanced vaccine categorization logic (ported from AddChild.jsx)
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
    borderColor: 'border-blue-200'
  };
};

const categorizeVaccines = (vaccineSchedule, childAge, gender) => {
  const categories = {
    CURRENT: { vaccines: [], count: 0, icon: FaExclamationTriangle, color: 'text-red-600', title: 'Current & Overdue' },
    CATCH_UP: { vaccines: [], count: 0, icon: FaHistory, color: 'text-orange-600', title: 'Catch-up' },
    NOT_APPLICABLE: { vaccines: [], count: 0, icon: FaLock, color: 'text-gray-400', title: 'Not Applicable' }
  };

  Object.entries(vaccineSchedule.doses).forEach(([vaccineName, doses]) => {
    // Gender-specific filtering
    if (vaccineName === 'HPV' && gender !== 'FEMALE') {
      categories.NOT_APPLICABLE.vaccines.push({
        vaccineName,
        reason: 'Only applicable to females',
        doses: []
      });
      return;
    }

    const vaccineDoses = doses.map((dose, index) => {
      const statusInfo = getVaccineStatus(dose, childAge);
      return {
        doseIndex: index,
        dose: dose.doseNumber,
        doseInfo: dose,
        ...statusInfo,
        doseType: dose.isBooster ? 'booster' : 'current'
      };
    });

    const currentDoses = vaccineDoses.filter(d => d.doseType === 'current');
    const boosterDoses = vaccineDoses.filter(d => d.doseType === 'booster');

    if (currentDoses.length > 0) {
      categories.CURRENT.vaccines.push({ vaccineName, doses: currentDoses });
      categories.CURRENT.count += currentDoses.length;
    }

    if (boosterDoses.length > 0) {
      categories.CATCH_UP.vaccines.push({ vaccineName, doses: boosterDoses });
      categories.CATCH_UP.count += boosterDoses.length;
    }
  });

  return categories;
};


// Vaccine Card Component (ported from AddChild.jsx)
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
  t
}) => {
  const isAccessible = dose.status !== 'NOT_YET_ELIGIBLE';
  const remarksKey = `${vaccineName}-${dose.doseIndex}`;
  const showRemark = showRemarks[remarksKey] || false;

  // Helper function to format recommended age text
  const getRecommendedAgeText = (doseInfo) => {
    if (doseInfo.recommendedAtDays !== null && doseInfo.recommendedAtDays !== undefined) {
      return t('vaccine_card.days', { count: doseInfo.recommendedAtDays });
    } else if (doseInfo.recommendedAtWeeks !== null && doseInfo.recommendedAtWeeks !== undefined) {
      return t('vaccine_card.weeks', { count: doseInfo.recommendedAtWeeks });
    } else if (doseInfo.recommendedAtMonths !== null && doseInfo.recommendedAtMonths !== undefined) {
      return t('vaccine_card.months', { count: doseInfo.recommendedAtMonths });
    } else if (doseInfo.recommendedAtYears !== null && doseInfo.recommendedAtYears !== undefined) {
      return t('vaccine_card.years', { count: doseInfo.recommendedAtYears });
    }
    return t('vaccine_card.birth');
  };

  return (
    <div className={`p-4 border rounded-lg transition-all ${dose.bgColor} ${dose.borderColor} border-l-4`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className={`font-medium ${dose.color}`}>
              {vaccineName} - {t('vaccine_card.dose', { dose: dose.dose })}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {t('vaccine_card.recommended_at')} {getRecommendedAgeText(dose.doseInfo)}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className={`badge ${dose.status === 'SEVERELY_OVERDUE'
              ? 'badge-error'
              : dose.status === 'OVERDUE'
                ? 'badge-warning'
                : dose.status === 'DUE_NOW'
                  ? 'badge-info'
                  : dose.status === 'ACCESSIBLE'
                    ? 'badge-success'
                    : 'badge-neutral'
              } text-xs`}>
              {t(`vaccine_card.status.${dose.status.toLowerCase()}`)}
            </span>
            {dose.doseType === 'booster' && (
              <span className="badge badge-outline badge-xs">{t('vaccine_card.booster')}</span>
            )}
          </div>
        </div>

        {/* Date Input */}
        <div>
          <Controller
            name={`vaccines.${vaccineName}.${dose.doseIndex}.date`}
            control={control}
            render={({ field }) => {
              // Validate date format
              const isValidDate = field.value && /^\d{4}\.\d{2}\.\d{2}$/.test(field.value);
              console.log(`VaccineCard ${vaccineName} dose ${dose.doseIndex}: field.value = ${field.value}, isValidDate = ${isValidDate}`);

              return (
                <div className="relative">
                  {isAccessible ? (
                    <>
                      <NepaliDatePicker
                        className="w-full"
                        inputClassName="input input-bordered input-sm w-full pr-8"
                        value={isValidDate ? field.value : ''}
                        onChange={(value) => {
                          console.log(`NepaliDatePicker onChange: ${vaccineName} dose ${dose.doseIndex} = ${value}`);
                          field.onChange(value);
                        }}
                        language="ne"
                        theme={theme}
                        placeholder={t('vaccine_card.date_placeholder')}
                      />
                      {field.value && isValidDate && (
                        <button
                          type="button"
                          onClick={() => {
                            setValue(
                              `vaccines.${vaccineName}.${dose.doseIndex}.date`,
                              ''
                            );
                            console.log(`Cleared date for ${vaccineName} dose ${dose.doseIndex}`);
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                          title={t('vaccine_card.clear_date_title')}
                        >
                          ✕
                        </button>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      className="input input-bordered input-sm w-full input-disabled"
                      value=""
                      disabled
                      readOnly
                      placeholder={t('vaccine_card.unavailable_placeholder', {
                        age: getRecommendedAgeText(dose.doseInfo)
                      })}
                    />
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Remarks Section */}
        {isAccessible && (
          <div className="pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => toggleRemarks(vaccineName, dose.doseIndex)}
              className="btn btn-ghost btn-xs w-full justify-between p-2"
            >
              <span className="flex items-center text-xs">
                <FaClipboardList className="w-3 h-3 mr-1" />
                {t('vaccine_card.remarks')}
              </span>
              <span className={`text-xs transform transition-transform ${showRemark ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showRemark && (
              <div className="mt-2">
                <textarea
                  {...register(`vaccines.${vaccineName}.${dose.doseIndex}.remarks`)}
                  className="textarea textarea-bordered textarea-xs w-full"
                  placeholder={t('vaccine_card.remarks_placeholder')}
                  rows={2}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Vaccine Section Component (aligned with AddChild.jsx)
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
  t
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

  const { vaccineSchedule, loading } = useVaccineScheduleContext();
  console.log('vaccineSchedule in EditChild:', vaccineSchedule);

  if (loading || !vaccineSchedule) return <div>Loading schedule...</div>;
  const { t, i18n } = useTranslation('addChild');
  const { theme } = useTheme();
  const { updateChildInState } = useChildContext();

  const MOCK_CURRENT_USER_ID = 2; // This should be replaced with actual user info
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
      vaccines: Object.fromEntries(
        Object.entries(vaccineSchedule.doses).map(([vaccineName, doses]) => [
          vaccineName,
          doses.map(() => ({ date: '', remarks: '' })),
        ])
      ),
      weightRecords: [{ id: null, date: '', weight: '' }],
    },
  });

  const navigate = useNavigate();
  const gender = useWatch({ control, name: 'gender', defaultValue: '' });
  const birthDate = useWatch({ control, name: 'birthDate', defaultValue: '' });

  // Add new states for the enhanced workflow
  const [selectedChild, setSelectedChild] = useState(null);
  const [showSearchSection, setShowSearchSection] = useState(true);
  const [isFullProfile, setIsFullProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedChild, setFetchedChild] = useState(null);

  // State management
  const [healthWorkers, setHealthWorkers] = useState([]);
  const [showRemarks, setShowRemarks] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    CURRENT: true,
    CATCH_UP: false,
    NOT_APPLICABLE: false,
  });
  const [activeTab, setActiveTab] = useState('CURRENT');
  const [sewaDartaNumber, setSewaDartaNumber] = useState('');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // New states for enhanced search
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
        setSearchResults(res.data);
      } catch (err) {
        console.error('Search failed:', err);
        toast.error('खोज्दा त्रुटि भयो');
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [filters]);

  // Use useFieldArray to manage the weightRecords array
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'weightRecords',
  });

  // New useEffect to fetch child data from API when a child is selected
  useEffect(() => {
    const fetchChildData = async () => {
      if (!selectedChild) return;
      setIsLoading(true);

      try {
        const res = await axiosClient.get(`/api/child/${selectedChild.sewaDartaNumber}`);
        const childData = res.data;
        console.log('Fetched child data:', childData);

        const fullProfile = !!childData.parentName;
        setIsFullProfile(fullProfile);
        setFetchedChild(childData);
        console.log('vaccineSchedule in EditChild useEffect:', vaccineSchedule)

        // Normalize BS dates with replace first
        let childBirthAD = safeFormatDateYYMMDD(childData.birthDate);
        let childBirthBS = adToBs(childBirthAD) || '';
        childBirthBS = childBirthBS.replace(/-/g, '.');

        // Create a mapping of vaccineTypeId to vaccineName
        const vaccineTypeIdToName = Object.keys(vaccineSchedule.doses).reduce((map, vaccineName) => {
          const firstDose = vaccineSchedule.doses[vaccineName][0];
          if (firstDose && firstDose.vaccineTypeId) {
            map[firstDose.vaccineTypeId] = vaccineName;
          }
          return map;
        }, {});

        const defaultFormValues = {
          firstName: childData.fullName.split(' ')[0],
          lastName: childData.fullName.split(' ').slice(1).join(' '),
          gender: childData.gender,
          birthDate: childBirthBS,
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
            Object.entries(vaccineSchedule.doses).map(([vaccineName, doses]) => [
              vaccineName,
              doses.map(() => ({ date: '', remarks: '' })),
            ])
          ),
        };

        reset(defaultFormValues);

        const newWeightRecords = childData.weightRecords.length > 0
          ? childData.weightRecords.map((rec) => {
              let weightDateAD = safeFormatDateYYMMDD(rec.date);
              let weightDateBS = adToBs(weightDateAD) || '';
              weightDateBS = weightDateBS.replace(/-/g, '.');
              return {
                dbId: rec.id ? rec.id.toString() : null,
                date: weightDateBS,
                weight: rec.weight.toString(),
              };
            })
          : [{ dbId: null, date: '', weight: '' }];

        console.log('Weight records before replace:', newWeightRecords);

        // Clear existing records and replace with new ones
        replace([]); // Clear first
        setTimeout(() => {
          replace(newWeightRecords); // Then replace
        }, 0);

        console.log('Form state after replace:', getValues('weightRecords'));

        // Populate vaccine dates
        childData.vaccinations.forEach((vac) => {
          const vaccineName = vaccineTypeIdToName[vac.vaccineTypeId];
          const doses = vaccineSchedule.doses[vaccineName];
          if (doses) {
            const index = doses.findIndex((d) => d.doseNumber === vac.doseNumber);
            if (index !== -1) {
              const adDate = safeFormatDateYYMMDD(vac.dateGiven); // e.g., "2025-08-17"
              let bsDate = '';
              try {
                bsDate = adToBs(adDate);
                if (bsDate) {
                  bsDate = bsDate.replace(/-/g, '.'); // Normalize to YYYY.MM.DD
                }
                if (!bsDate || !/^\d{4}\.\d{2}\.\d{2}$/.test(bsDate)) {
                  console.warn(`Invalid BS date after replace for ${vaccineName} dose ${vac.doseNumber}: ${bsDate}`);
                  bsDate = '';
                }
              } catch (error) {
                console.error(`Error converting AD date ${adDate} to BS for ${vaccineName} dose ${vac.doseNumber}:`, error);
                bsDate = '';
              }
              setValue(
                `vaccines.${vaccineName}.${index}.date`,
                bsDate
              );
              setValue(
                `vaccines.${vaccineName}.${index}.remarks`,
                vac.remarks || ''
              );
              console.log(`Setting vaccine date: vaccines.${vaccineName}.${index}.date = ${bsDate}`);
            } else {
              console.warn(`Dose number ${vac.doseNumber} not found for vaccine ${vaccineName}`);
            }
          } else {
            console.warn(`Vaccine name not found for vaccineTypeId ${vac.vaccineTypeId} in vaccineSchedule`);
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

  // Fetch children data on component mount

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


  // Simplified handleChildSelect to just set the selected child
  const handleChildSelect = (child) => {
    if (!child) return;
    setSelectedChild(child);
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
            date: bsToAd(rec.date.replace(/\./g, '-')), // Convert BS to AD if API expects AD
            weight: parseFloat(rec.weight),
          };

          // Only add id if dbId exists and is not null/undefined/empty
          if (rec.dbId && rec.dbId !== 'null' && rec.dbId !== '' && rec.dbId !== null) {
            weightRecord.id = parseInt(rec.dbId);
          }

          return weightRecord;
        });

      // Filter out vaccines that have no date
      const filteredVaccinations = Object.entries(data.vaccines)
        .flatMap(([vaccineName, doses]) =>
          doses
            .filter((dose) => dose.date)
            .map((dose, index) => {
              const scheduleDose = vaccineSchedule.doses[vaccineName][index];
              return {
                vaccineType: vaccineName,
                doseNumber: scheduleDose.doseNumber,
                dateGiven: bsToAd(dose.date.replace(/\./g, '-')), // Convert BS to AD
                remarks: dose.remarks || null,
              };
            })
        );

      const payload = {
        weightRecords: filteredWeightRecords,
        vaccinations: filteredVaccinations,
        administeredById: parseInt(data.administeredById),
        remarks: data.remarks || null,
      };

      // Only include demographic data if it's a full profile
      if (isFullProfile) {
        payload.firstName = data.firstName;
        payload.lastName = data.lastName;
        payload.gender = data.gender;
        payload.birthDate = bsToAd(data.birthDate.replace(/\./g, '-')); // Convert BS to AD
        payload.wardNumber = parseInt(data.wardNumber);
        payload.casteCode = parseInt(data.casteCode);
        payload.parentName = data.parentName;
        payload.tole = data.tole;
        payload.phoneNumber = data.phoneNumber || null;
        payload.isFromOtherMunicipality = data.isFromOtherMunicipality;
      }

      console.log('Submitting payload:', payload);

      const res = await axiosClient.put(
        `/api/child/${fetchedChild.sewaDartaNumber}`,
        payload
      );
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

  // Categorize vaccines based on age and gender
  const categorizedVaccines = useMemo(() => {
    if (!birthDate || !gender) {
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
    return categorizeVaccines(vaccineSchedule, age, gender);
  }, [age, gender, birthDate, vaccineSchedule]);

  const totalVaccines = Object.values(categorizedVaccines).reduce(
    (sum, cat) => sum + cat.count,
    0
  );
  const totalResults = searchResults.total; // Use the total count from the object
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const paginatedResults = searchResults?.children?.slice( // Correctly access the children array
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );


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
          <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaSearch className="text-primary text-xl mr-3" />
                <h2 className="text-xl font-medium text-base-content">
                  बच्चाको खोजी
                </h2>
              </div>
            </div>

            {/* Search Input and Filters */}
            {/* Search Input for Name */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">नाम</span>
              </label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input input-bordered w-full"
                placeholder="नाम..."
              />
            </div>

            {/* Search Input for Service Registration Number */}
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text font-medium">सेवा दर्ता नं.</span>
              </label>
              <input
                type="text"
                value={filters.serviceRegistrationNumber}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    serviceRegistrationNumber: e.target.value,
                  }))
                }
                className="input input-bordered w-full"
                placeholder="सेवा दर्ता नम्बर..."
              />
            </div>

            {/* Search Input for Phone Number */}
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text font-medium">फोन नम्बर</span>
              </label>
              <input
                type="text"
                value={filters.phoneNumber}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                className="input input-bordered w-full"
                placeholder="फोन नम्बर..."
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Ward Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">वडा नं.</span>
                </label>
                <select
                  value={filters.wardNumber}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      wardNumber: e.target.value,
                    }))
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">सबै वडा</option>
                  {[...Array(15)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      वडा नं. {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">लिङ्ग</span>
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">सबै</option>
                  <option value="MALE">छात्र</option>
                  <option value="FEMALE">छात्रा</option>
                  <option value="OTHER">अन्य</option>
                </select>
              </div>

              {/* Created By Me Filter */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={filters.createdByMe}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        createdByMe: e.target.checked,
                      }))
                    }
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">म द्वारा सिर्जित</span>
                </label>
              </div>

              {/* Complete Profile Filter */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={filters.isComplete}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isComplete: e.target.checked,
                      }))
                    }
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">पूर्ण प्रोफाइल</span>
                </label>
              </div>

            </div>

            {/* Search Results */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="mt-4 text-base-content/70">खोज्दै...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>सेवा दर्ता नं.</th>
                      <th>नाम</th>
                      <th>लिङ्ग</th>
                      <th>जन्म मिति</th>
                      <th>वडा नं.</th>
                      <th>कार्य</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedResults.map((child) => (
                      <tr key={child.sewaDartaNumber}>
                        <td>{child.sewaDartaNumber}</td>
                        <td>{child.fullName}</td>
                        <td>{child.gender}</td>
                        <td>{child.birthDate}</td>
                        <td>{child.wardNumber}</td>
                        <td>
                          <button
                            onClick={() => handleChildSelect(child)}
                            className="btn btn-primary btn-sm"
                          >
                            छान्नुहोस्
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginatedResults.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-8">
                          कुनै बच्चा फेला परेन
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                  <div className="join">
                    <button
                      className="join-item btn btn-outline"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>
                    <button className="join-item btn btn-outline">
                      पृष्ठ {currentPage}
                    </button>
                    <button
                      className="join-item btn btn-outline"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 p-8 mb-8">
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
        {/* Form Section */}
        {!showSearchSection && fetchedChild && (
          <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 min-w-[20rem]">
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
                    {t('personalInfo.title')}
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
                      {t('personalInfo.municipality.label')}
                    </label>
                  </div>
                </div>

                {/* Personal Info Grid */}
                {isFullProfile ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="label">
                          <span className="label-text text-base font-medium">
                            {t('personalInfo.form.firstName.label')}{' '}
                            <span className="text-error">*</span>
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
                            {t('personalInfo.form.gender.label')}{' '}
                            <span className="text-error">*</span>
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
                            {t('personalInfo.form.wardNumber.label')}{' '}
                            <span className="text-error">*</span>
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
                            {t('personalInfo.form.casteCode.label')}{' '}
                            <span className="text-error">*</span>
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
                            {t('personalInfo.form.parentName.label')}{' '}
                            <span className="text-error">*</span>
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
                            {t('personalInfo.form.tole.label')}{' '}
                            <span className="text-error">*</span>
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
                            {t('personalInfo.form.birthDate.label')}{' '}
                            <span className="text-error">*</span>
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
                              {t('personalInfo.age', {
                                months: age.months,
                                days: age.days,
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // Read-only view for limited profiles
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

                {/* Administered By Section */}
                <div className="mt-8">
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      {t('personalInfo.administered_by.label')}{' '}
                      <span className="text-error">*</span>
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
                    {healthWorkers.map((worker) => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name}
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

              {/* Weight Tracking */}
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
                      {/* Hidden input to preserve the DB id */}
                      <input
                        type="hidden"
                        {...register(`weightRecords.${index}.dbId`)}
                        value={field.dbId || ''}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div>
                          <label className="label">
                            <span className="label-text text-base font-medium">
                              {t('weightTracking.date_label', {
                                index: index + 1,
                              })}
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
                              min: {
                                value: 0,
                                message: t(
                                  'weightTracking.errors.weight_positive'
                                ),
                              },
                              max: {
                                value: 50,
                                message: t(
                                  'weightTracking.errors.weight_too_large'
                                ),
                              },
                            })}
                            className="input input-bordered w-full"
                            placeholder={t('weightTracking.weight_label')}
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

              {/* Enhanced Vaccines Section */}
              <div className="border-t border-base-300 pt-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                      <FaSyringe className="text-secondary text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium text-base-content">
                        {t('vaccine_section.title')}
                      </h2>
                      {age.months >= 0 && birthDate && gender && (
                        <p className="text-sm text-base-content/70">
                          {t('vaccine_section.age_gender', {
                            months: age.months,
                            days: age.days % 30,
                            gender: t(
                              `personalInfo.form.gender.options.${gender.toLowerCase()}`
                            ),
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  {birthDate && gender && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {totalVaccines}
                      </div>
                      <div className="text-sm text-base-content/70">
                        {t('vaccine_section.total_vaccines')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Show message if birth date or gender not selected */}
                {(!birthDate || !gender) && (
                  <div className="text-center py-12 bg-base-200 rounded-lg border-2 border-dashed border-base-300">
                    <FaInfoCircle className="text-4xl text-base-content/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-base-content/60 mb-2">
                      {t('vaccine_section.unavailable.title')}
                    </h3>
                    <p className="text-base-content/50">
                      {t('vaccine_section.unavailable.description')}
                    </p>
                  </div>
                )}

                {/* Vaccine Tabs */}
                {birthDate && gender && (
                  <>
                    <div className="tabs tabs-boxed mb-6">
                      {Object.entries(categorizedVaccines).map(
                        ([sectionKey, sectionData]) => {
                          if (
                            sectionData.count > 0 ||
                            sectionKey === 'NOT_APPLICABLE'
                          ) {
                            const IconComponent = sectionData.icon;
                            return (
                              <button
                                key={sectionKey}
                                type="button"
                                onClick={() => setActiveTab(sectionKey)}
                                className={`tab flex items-center gap-2 ${activeTab === sectionKey ? 'tab-active' : ''
                                  }`}
                              >
                                <IconComponent
                                  className={`text-xl ${sectionData.color}`}
                                />
                                {t(
                                  `vaccine_section.tabs.${sectionKey.toLowerCase()}`,
                                  { count: sectionData.count }
                                )}
                              </button>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>
                    {Object.entries(categorizedVaccines).map(
                      ([sectionKey, sectionData]) =>
                        activeTab === sectionKey && (
                          <VaccineSection
                            key={sectionKey}
                            sectionKey={sectionKey}
                            sectionData={sectionData}
                            expandedSections={expandedSections}
                            toggleSection={(section) =>
                              setExpandedSections((prev) => ({
                                ...prev,
                                [section]: !prev[section],
                              }))
                            }
                            control={control}
                            register={register}
                            setValue={setValue}
                            showRemarks={showRemarks}
                            toggleRemarks={toggleRemarks}
                            theme={theme}
                            t={t}
                          />
                        )
                    )}
                  </>
                )}

                {/* Summary for completed vaccines */}
                {birthDate &&
                  gender &&
                  categorizedVaccines.CURRENT.count === 0 && (
                    <div className="text-center py-8 mt-8 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">
                        {t('vaccine_section.all_up_to_date.title')}
                      </h3>
                      <p className="text-base-content/70">
                        {t('vaccine_section.all_up_to_date.description')}
                      </p>
                    </div>
                  )}
              </div>

              {/* General Remarks */}
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

              {/* Submit Section */}
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
                      type="button"
                      onClick={() => {
                        if (window.confirm(t('submitSection.reset_confirm'))) {
                          reset();
                          setShowRemarks({});
                          setExpandedSections({
                            CURRENT: true,
                            CATCH_UP: false,
                            NOT_APPLICABLE: false,
                          });
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
                      {t('submitSection.reset_button')}
                    </button>

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
                          {t('submitSection.save_button')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 btn btn-primary btn-circle shadow-lg"
        title={t('scrollToTop.title')}
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
</DOCUMENT>