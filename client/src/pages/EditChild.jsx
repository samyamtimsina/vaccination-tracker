import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
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
  FaExclamationTriangle,
  FaHistory,
  FaCheckCircle,
  FaLock,
  FaSearch,
} from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChildSchema } from '../schemas/childSchema.js'; // Reuse schema, or create edit-specific if needed
import { useChildContext } from '../context/ChildContext';
import { useTheme } from '../context/ThemeContext';
import { calculateAge } from '../../helpers/calculateAge.jsx';
import { getFirstErrorMessage } from '../../helpers/getFirstErrorMessage.jsx';
import { useTranslation } from 'react-i18next';
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
import ChildSearch from '../components/ChildSearch'

// Add this helper function at the top
const safeFormatDateYYMMDD = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

// Enhanced vaccine categorization logic (same as AddChild)
const getVaccineStatus = (dose, childAge) => {
  const ageInDays = childAge.days;

  // Calculate recommended age in days
  let recommendedAgeDays = 0;
  if (dose.recommendedAtDays !== undefined) recommendedAgeDays = dose.recommendedAtDays;
  if (dose.recommendedAtWeeks !== undefined) recommendedAgeDays = dose.recommendedAtWeeks * 7;
  if (dose.recommendedAtMonths !== undefined) recommendedAgeDays = dose.recommendedAtMonths * 30;
  if (dose.recommendedAtYears !== undefined) recommendedAgeDays = dose.recommendedAtYears * 365;

  const daysDifference = ageInDays - recommendedAgeDays;

  // Status categories with grace periods
  if (daysDifference < -30) return {
    status: 'NOT_YET_ELIGIBLE',
    priority: 4,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  };
  if (daysDifference >= -30 && daysDifference <= 30) return {
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

const categorizeVaccines = (vaccineSchedule, childAge, gender) => {
  const categories = {
    CURRENT: { vaccines: [], count: 0, icon: FaExclamationTriangle, color: 'text-red-600', title: 'Current & Overdue' },
    CATCH_UP: { vaccines: [], count: 0, icon: FaHistory, color: 'text-orange-600', title: 'Catch-up' },
    NOT_APPLICABLE: { vaccines: [], count: 0, icon: FaLock, color: 'text-gray-400', title: 'Not Applicable' }
  };

  Object.entries(vaccineSchedule).forEach(([vaccineName, doses]) => {
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
        dose: dose.dose,
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

// Vaccine Card Component (same as AddChild)
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
              {t('vaccine_card.recommended_at')}{
                dose.doseInfo.recommendedAtMonths
                  ? t('vaccine_card.months', { count: dose.doseInfo.recommendedAtMonths })
                  : dose.doseInfo.recommendedAtWeeks
                    ? t('vaccine_card.weeks', { count: dose.doseInfo.recommendedAtWeeks })
                    : dose.doseInfo.recommendedAtYears
                      ? t('vaccine_card.years', { count: dose.doseInfo.recommendedAtYears })
                      : t('vaccine_card.days', { count: dose.doseInfo.recommendedAtDays })
              }
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
            render={({ field }) => (
              <div className="relative">
                {isAccessible ? (
                  <>
                    <NepaliDatePicker
                      className="w-full"
                      inputClassName="input input-bordered input-sm w-full pr-8"
                      value={field.value || ''}
                      onChange={(value) => field.onChange(value)}
                      language="ne"
                      theme={theme}
                      placeholder={t('vaccine_card.date_placeholder')}
                    />
                    {field.value && (
                      <button
                        type="button"
                        onClick={() => setValue(
                          `vaccines.${vaccineName}.${dose.doseIndex}.date`,
                          ''
                        )}
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
                    placeholder={
                      t('vaccine_card.unavailable_placeholder', {
                        age: dose.doseInfo.recommendedAtMonths
                          ? t('vaccine_card.months', { count: dose.doseInfo.recommendedAtMonths })
                          : dose.doseInfo.recommendedAtWeeks
                            ? t('vaccine_card.weeks', { count: dose.doseInfo.recommendedAtWeeks })
                            : t('vaccine_card.years', { count: dose.doseInfo.recommendedAtYears })
                      })
                    }
                  />
                )}
              </div>
            )}
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
              <span className={`text-xs transform transition-transform ${showRemark ? 'rotate-180' : ''
                }`}>
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

// Vaccine Section Component (same as AddChild)
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

  // Add this to your translation file or handle it in the component
  const tt = useTranslation('addChild').t;

  // Add fallback for missing translation
  const getSectionTitle = (key) => {
    const titles = {
      CURRENT: tt('vaccine_section.current', { count: 0 }) || 'Current',
      CATCH_UP: tt('vaccine_section.catch_up', { count: 0 }) || 'Catch Up',
      NOT_APPLICABLE: tt('vaccine_section.not_applicable', { count: 0 }) || 'Not Applicable'
    };
    return titles[key] || key;
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
  const { t, i18n } = useTranslation('addChild'); // Reuse translation namespace, adjust if needed
  const { theme } = useTheme();
  const { updateChildInState } = useChildContext(); // Assume context has update method
  const { childrenData, loading, fetchChildren } = useChildContext();
  const MOCK_CURRENT_USER_ID = 2;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(createChildSchema), // Reuse, or adjust for edit
    defaultValues: {
      isFromOtherMunicipality: false,
      birthDate: '',
      administeredById: '',
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

  // State management
  const [healthWorkers, setHealthWorkers] = useState([]);
  const [showRemarks, setShowRemarks] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    CURRENT: true,
    CATCH_UP: false,
    NOT_APPLICABLE: false
  });
  const [activeTab, setActiveTab] = useState('CURRENT');
  const [sewaDartaNumber, setSewaDartaNumber] = useState('');
  const [fetchedChild, setFetchedChild] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // New states for enhanced search
  const [showSearch, setShowSearch] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [filters, setFilters] = useState({
    searchText: '',
    wardNumber: '',
    createdByMe: false,
    gender: '',
    isComplete: false
  });

  // Add these states at the top of your component
  const [showSearchSection, setShowSearchSection] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Fetch health workers (same)
  useEffect(() => {
    const fetchHealthWorkers = async () => {
      try {
        const res = await axiosClient.get('/api/users?role=ward_officer');
        setHealthWorkers(res.data);
      } catch (err) {
        console.error('Failed to fetch health workers:', err);
      }
    };
    fetchHealthWorkers();
  }, []);

  // Use useFieldArray to manage the weightRecords array
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'weightRecords',
  });

  // Fetch children data on component mount
  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const toggleRemarks = (vaccineName, doseIndex) => {
    const key = `${vaccineName}-${doseIndex}`;
    setShowRemarks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = childrenData.filter(child =>
      child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.sewaDartaNumber.toString().includes(searchTerm) ||
      (child.phoneNumber && child.phoneNumber.includes(searchTerm))
    );
    setSearchResults(results);
  };

  const handleSearchInputChange = (value) => {
    setSearchTerm(value);
    if (value.length >= 2) { // Only search if 2 or more characters
      const results = childrenData.filter(child =>
        child.fullName.toLowerCase().includes(value.toLowerCase()) ||
        child.sewaDartaNumber.toString().includes(value) ||
        (child.phoneNumber && child.phoneNumber.includes(value))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchButtonClick = () => {
    setShowResults(true);
    handleSearch();
  };

  // Add this function to handle child selection
  const handleChildSelect = (child) => {
    if (!child) return;

    setSelectedChild(child);
    setShowSearchSection(false);
    setFetchedChild(child);
    setSewaDartaNumber(child.sewaDartaNumber.toString());

    // Reset form before setting new values
    reset({
      firstName: child.fullName.split(' ')[0],
      lastName: child.fullName.split(' ').slice(1).join(' '),
      wardNumber: child.wardNumber.toString(),
      casteCode: child.casteCode.toString(),
      gender: child.gender,
      parentName: child.parentName,
      tole: child.tole,
      phoneNumber: child.phoneNumber || '',
      birthDate: adToBs(safeFormatDateYYMMDD(child.birthDate)),
      isFromOtherMunicipality: child.isFromOtherMunicipality,
      remarks: child.remarks || '',
      administeredById: child.createdById.toString(),
      vaccines: Object.fromEntries(
        Object.entries(vaccineSchedule).map(([vaccineName, doses]) => [
          vaccineName,
          doses.map(() => ({ date: '', remarks: '' }))
        ])
      ),
      weightRecords: child.weightRecords.map(rec => ({
        date: adToBs(safeFormatDateYYMMDD(rec.date)),
        weight: rec.weight.toString()
      })) || [{ date: '', weight: '' }]
    });

    // Update vaccines after reset
    child.vaccinations.forEach(vac => {
      const vaccineName = vac.vaccineType;
      const doses = vaccineSchedule[vaccineName];
      if (doses) {
        const index = doses.findIndex(d => d.dose === vac.doseNumber);
        if (index !== -1) {
          setValue(
            `vaccines.${vaccineName}.${index}.date`,
            adToBs(safeFormatDateYYMMDD(vac.dateGiven))
          );
          setValue(
            `vaccines.${vaccineName}.${index}.remarks`,
            vac.remarks || ''
          );
        }
      }
    });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 100);
  };

  const handleSearchResultMouseEnter = (index) => {
    const results = document.querySelectorAll('.search-result-item');
    if (results[index]) {
      results[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSearchResultMouseLeave = () => {
    const results = document.querySelectorAll('.search-result-item');
    results.forEach(result => {
      result.classList.remove('bg-base-200');
    });
  };

  const handleSearchResultClick = (child) => {
    handleChildSelect(child);
  };

  const handleSearchResultKeyDown = (e, child) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleChildSelect(child);
    }
  };

  const handleSearchResultTouchStart = (e) => {
    e.preventDefault();
  };

  const handleSearchResultTouchEnd = (e, child) => {
    e.preventDefault();
    handleChildSelect(child);
  };

  const handleSearchResultTouchMove = (e) => {
    e.preventDefault();
  };

  const onSubmit = async (data) => {
    if (!fetchedChild) {
      toast.error(t('submitSection.no_child_loaded'));
      return;
    }

    try {
      const filteredWeightRecords = data.weightRecords.filter(
        (record) => record.date && record.weight,
      );

      const filteredVaccines = {};
      Object.entries(data.vaccines).forEach(([vaccineName, doses]) => {
        const administeredDoses = [];
        doses.forEach((dose, index) => {
          if (dose.date) {
            const scheduleDose = vaccineSchedule[vaccineName][index];
            administeredDoses.push({
              ...dose,
              doseNumber: scheduleDose.dose,
              type: scheduleDose.isBooster ? 'booster' : 'current'
            });
          }
        });
        if (administeredDoses.length > 0) {
          filteredVaccines[vaccineName] = administeredDoses;
        }
      });

      const payload = {
        ...data,
        vaccines: filteredVaccines,
        weightRecords: filteredWeightRecords,
        administeredById: parseInt(data.administeredById),
      };
      console.log('Submitting payload:', payload);
      const res = await axiosClient.put(`/api/child/${sewaDartaNumber}`, payload);
      updateChildInState(res.data);
      toast.success(t('toast.update_success'));
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(t('toast.error'));
    }
  };

  const onErrors = (errors) => {
    const errorMessage = getFirstErrorMessage(errors);
    toast.error(t('toast.validation_error', { message: errorMessage }));
  };

  const age = calculateAge(birthDate);

  // Categorize vaccines based on age and gender
  const categorizedVaccines = useMemo(() => {
    if (!birthDate || !gender) {
      return {
        CURRENT: { vaccines: [], count: 0, icon: FaExclamationTriangle, color: 'text-red-600', title: 'Current & Overdue' },
        CATCH_UP: { vaccines: [], count: 0, icon: FaHistory, color: 'text-orange-600', title: 'Catch-up' },
        NOT_APPLICABLE: { vaccines: [], count: 0, icon: FaLock, color: 'text-gray-400', title: 'Not Applicable' }
      };
    }
    return categorizeVaccines(vaccineSchedule, age, gender);
  }, [age, gender, birthDate]);

  const totalVaccines = Object.values(categorizedVaccines).reduce((sum, cat) => sum + cat.count, 0);

  // Update the filterChildren function
  const filterChildren = () => {
    if (!childrenData) return [];
    
    let results = [...childrenData];
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

    // Text search
    if (filters.searchText) {
      const searchTerm = filters.searchText.toLowerCase();
      results = results.filter(child => 
        child.fullName.toLowerCase().includes(searchTerm) ||
        child.sewaDartaNumber.toString().includes(searchTerm) ||
        (child.phoneNumber && child.phoneNumber.includes(searchTerm))
      );
    }

    // Ward filter
    if (filters.wardNumber) {
      results = results.filter(child => 
        child.wardNumber === parseInt(filters.wardNumber)
      );
    }

    // Gender filter
    if (filters.gender) {
      results = results.filter(child => 
        child.gender === filters.gender
      );
    }

    // Created by me filter
    if (filters.createdByMe) {
      results = results.filter(child => 
        child.createdById === userInfo.id
      );
    }

    return results;
  };

  // Add this function to handle pagination
  const getPaginatedResults = () => {
    const filteredResults = childrenData.filter(child => {
      // Text search
      const matchesSearch = !filters.searchText ||
        child.fullName.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        child.sewaDartaNumber.toString().includes(filters.searchText) ||
        (child.phoneNumber && child.phoneNumber.includes(filters.searchText));

      // Other filters
      const matchesWard = !filters.wardNumber || child.wardNumber.toString() === filters.wardNumber;
      const matchesGender = !filters.gender || child.gender === filters.gender;
      const matchesCreatedByMe = !filters.createdByMe || child.createdById === MOCK_CURRENT_USER_ID;

      return matchesSearch && matchesWard && matchesGender && matchesCreatedByMe;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

    return { paginatedResults, totalResults: filteredResults.length, totalPages };
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
                  {t('header.edit_title')} {/* Adjusted for edit */}
                </h1>
                <p className="text-base text-base-content/70">
                  {t('header.edit_description')} {/* Adjust translation if needed */}
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

      {/* Enhanced Search Section */}
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

            {/* Search Input and Filters - Keep your existing code */}
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text font-medium">नाम, सेवा दर्ता नं, वा फोन नम्बर</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={filters.searchText}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    searchText: e.target.value
                  }))}
                  className="input input-bordered w-full"
                  placeholder="खोज्नुहोस्..."
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleSearch()}
                >
                  <FaSearch className="mr-2" />
                  खोज्नुहोस्
                </button>
              </div>
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
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    wardNumber: e.target.value
                  }))}
                  className="select select-bordered w-full"
                >
                  <option value="">सबै वडा</option>
                  {[...Array(15)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>वडा नं. {i + 1}</option>
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
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    gender: e.target.value
                  }))}
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
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      createdByMe: e.target.checked
                    }))}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">मैले दर्ता गरेको</span>
                </label>
              </div>

              {/* Complete Vaccination Filter */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    checked={filters.isComplete}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      isComplete: e.target.checked
                    }))}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">पूर्ण खोप लगाएको</span>
                </label>
              </div>
            </div>

            {/* Results Section */}
            {!loading && (
              <>
                {/* Results Table */}
                {(() => {
                  const { paginatedResults, totalResults, totalPages } = getPaginatedResults();

                  return (
                    <>
                      {totalResults > 0 ? (
                        <>
                          <div className="text-sm text-base-content/70 mb-4">
                            कुल नतिजाहरू: {totalResults}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                              <thead>
                                <tr>
                                  <th>सेवा दर्ता नं.</th>
                                  <th>नाम</th>
                                  <th>वडा नं.</th>
                                  <th>लिङ्ग</th>
                                  <th>जन्म मिति</th>
                                  <th>कार्य</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedResults.map(child => (
                                  <tr key={child.id}>
                                    <td>{child.sewaDartaNumber}</td>
                                    <td>{child.fullName}</td>
                                    <td>{child.wardNumber}</td>
                                    <td>
                                      {child.gender === 'MALE' ? 'छात्र' :
                                        child.gender === 'FEMALE' ? 'छात्रा' : 'अन्य'}
                                    </td>
                                    <td>{adToBs(safeFormatDateYYMMDD(child.birthDate))}</td>
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
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                              <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="btn btn-sm"
                              >
                                पछिल्लो
                              </button>
                              <span className="flex items-center px-4 text-sm">
                                पृष्ठ {currentPage} / {totalPages}
                              </span>
                              <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="btn btn-sm"
                              >
                                अर्को
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-base-content/70">कुनै नतिजा फेला परेन</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        ) : (
          // Show this when a child is selected
          <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 p-4 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FaUser className="text-primary text-lg" />
                </div>
                <div>
                  <h3 className="font-medium">छानिएको बच्चा: {selectedChild?.fullName}</h3>
                  <p className="text-sm text-base-content/70">
                    सेवा दर्ता नं.: {selectedChild?.sewaDartaNumber} |
                    वडा नं.: {selectedChild?.wardNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSearchSection(true);
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
      </div>

      {/* Main Form (only show if fetched) */}
      {fetchedChild && (
        <div className="max-w-6xl mx-auto px-6 py-8">
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
                      className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''
                        }`}
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
                      className={`select select-bordered w-full ${errors.gender ? 'select-error' : ''
                        }`}
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
                      className={`input input-bordered w-full ${errors.wardNumber ? 'input-error' : ''
                        }`}
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
                      className={`input input-bordered w-full ${errors.casteCode ? 'input-error' : ''
                        }`}
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
                      className={`input input-bordered w-full ${errors.parentName ? 'input-error' : ''
                        }`}
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
                      className={`input input-bordered w-full ${errors.tole ? 'input-error' : ''
                        }`}
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
                          {t('personalInfo.age', { months: age.months, days: age.days })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Administered By Section */}
                <div className="mt-8">
                  <label className="label">
                    <span className="label-text text-base font-medium">
                      {t('personalInfo.administered_by.label')} <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    {...register('administeredById')}
                    className={`select select-bordered w-full max-w-xs ${errors.administeredById ? 'select-error' : ''
                      }`}
                    defaultValue=""
                  >
                    <option value="" disabled>{t('personalInfo.administered_by.placeholder')}</option>
                    {healthWorkers.map(worker => (
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
                                message: t('weightTracking.errors.weight_positive'),
                              },
                              max: {
                                value: 50,
                                message: t('weightTracking.errors.weight_too_large'),
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
                              onClick={() => append({ date: '', weight: '' })}
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
                          {t('vaccine_section.age_gender', { months: age.months, days: age.days % 30, gender: t(`personalInfo.form.gender.options.${gender.toLowerCase()}`) })}
                        </p>
                      )}
                    </div>
                  </div>
                  {birthDate && gender && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{totalVaccines}</div>
                      <div className="text-sm text-base-content/70">{t('vaccine_section.total_vaccines')}</div>
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
                      {Object.entries(categorizedVaccines).map(([sectionKey, sectionData]) => {
                        if (sectionData.count > 0 || sectionKey === 'NOT_APPLICABLE') {
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
                        }
                        return null;
                      })}
                    </div>
                    {Object.entries(categorizedVaccines).map(([sectionKey, sectionData]) => (
                      activeTab === sectionKey && (
                        <VaccineSection
                          key={sectionKey}
                          sectionKey={sectionKey}
                          sectionData={sectionData}
                          expandedSections={expandedSections}
                          toggleSection={(section) => setExpandedSections(prev => ({
                            ...prev,
                            [section]: !prev[section]
                          }))}
                          control={control}
                          register={register}
                          setValue={setValue}
                          showRemarks={showRemarks}
                          toggleRemarks={toggleRemarks}
                          theme={theme}
                          t={t}
                        />
                      )
                    ))}
                  </>
                )}


                {/* Summary for completed vaccines */}
                {birthDate && gender && categorizedVaccines.CURRENT.count === 0 && (
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
                            NOT_APPLICABLE: false
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
        </div>
      )}

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