import { useMemo, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  FaSpinner,
  FaChevronLeft,
  FaBaby,
  FaEye,
  FaBirthdayCake,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSyringe,
  FaPrint,
  FaCheckCircle,
  FaPlus,
  FaSearch,
  FaStickyNote,
  FaVenusMars,
  FaWeight,
  FaClock,
  FaUserMd,
  FaCalendarAlt,
} from 'react-icons/fa';
import {
  safeCalculateAge,
  safeFormatDate,
  safeFormatDateYYMMDD,
} from '../utils/date.js';
import { vaccineSchedule} from '../utils/vaccineSchedule.js';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import VaccinationCardOverlay from '../components/print';
import { useChildContext } from '../context/ChildContext';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

export default function AllChildren() {
const navigate = useNavigate();
  const { t, i18n } = useTranslation('viewChildren');
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { childrenData, error, loading, fetchChildren } = useChildContext();

  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    fetchChildren();
    ('childrenData updated:', childrenData);
  }, [fetchChildren]);

  const filteredChildren = useMemo(() => {
    if (!childrenData) {
      return [];
    }
    return childrenData.filter(
      (child) =>
        child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (child.lastName &&
          child.lastName.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [childrenData, searchTerm]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filteredChildren, currentPage, itemsPerPage]);

  const currentChildren = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredChildren.slice(indexOfFirst, indexOfLast);
  }, [filteredChildren, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

  const getRecommendedAgeText = (scheduleItem) => {
    if (scheduleItem.recommendedAtDays !== undefined) {
      return scheduleItem.recommendedAtDays === 0
        ? t('childDetails.vaccinationRecords.recommendedAt.atBirth')
        : t('childDetails.vaccinationRecords.recommendedAt.days', { value: scheduleItem.recommendedAtDays });
    }
    if (scheduleItem.recommendedAtWeeks !== undefined) {
      return t('childDetails.vaccinationRecords.recommendedAt.weeks', { value: scheduleItem.recommendedAtWeeks });
    }
    if (scheduleItem.recommendedAtMonths !== undefined) {
      return t('childDetails.vaccinationRecords.recommendedAt.months', { value: scheduleItem.recommendedAtMonths });
    }
    return t('childDetails.vaccinationRecords.recommendedAt.unknown');
  };

   const handleButtonClick = () => {
    console.log('selectedChild:', selectedChild);
  navigate('/graph', { state: { childrenData: selectedChild } });
  };


  const getVaccineTypeLabel = (type) => {
    switch (type) {
      case 'routine':
        return { label: t('childDetails.vaccinationRecords.vaccineType.routine'), class: 'bg-blue-100 text-blue-800' };
      case 'current':
        return { label: t('childDetails.vaccinationRecords.vaccineType.current'), class: 'bg-green-100 text-green-800' };
      case 'booster':
        return { label: t('childDetails.vaccinationRecords.vaccineType.booster'), class: 'bg-orange-100 text-orange-800' };
      default:
        return { label: t('childDetails.vaccinationRecords.vaccineType.unknown'), class: 'bg-gray-100 text-gray-800' };
    }
  };


  const getOverallVaccinationStats = (child) => {
    const givenVaccinations = child.vaccinations || [];
    const vaccinationMap = {};
    givenVaccinations.forEach((vacc) => {
      const vaccineType = vacc.vaccineType;
      if (!vaccinationMap[vaccineType]) {
        vaccinationMap[vaccineType] = [];
      }
      vaccinationMap[vaccineType].push({
        date: vacc.dateGiven || vacc.givenDate || vacc.createdAt,
        dose: vacc.doseNumber || vaccinationMap[vaccineType].length + 1,
        createdById: vacc.createdById,
        createdAt: vacc.createdAt,
        remarks: vacc.remarks,
        isComplete: vacc.isComplete,
        customVaccineName: vacc.customVaccineName,
        createdBy: vacc.createdBy, // Include createdBy
        type: vacc.type, // Include vaccine type
      });
    });

    Object.keys(vaccinationMap).forEach((vaccine) => {
      vaccinationMap[vaccine].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
    });

    let totalGiven = 0;
    let totalRequired = 0;
    let completeVaccines = 0;
    let inProgressVaccines = 0;
    let notStartedVaccines = 0;

    Object.entries(vaccineSchedule).forEach(([vaccineName, schedule]) => {
      const givenDoses = vaccinationMap[vaccineName] || [];
      const given = givenDoses.length;
      const required = schedule.length;

      totalGiven += given;
      totalRequired += required;

      if (given === required) completeVaccines++;
      else if (given > 0) inProgressVaccines++;
      else notStartedVaccines++;
    });

    return {
      totalGiven,
      totalRequired,
      completeVaccines,
      inProgressVaccines,
      notStartedVaccines,
      overallPercentage: Math.round((totalGiven / totalRequired) * 100) || 0,
      vaccinationMap,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-3" />
          <p className="text-base-content">{t('loading.message')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-error/20 max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-base-content mb-2">
              {t('error.title')}
            </h2>
            <p className="text-base-content text-sm">{t('error.message', { error })}</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedChild) {
    const age = safeCalculateAge(selectedChild.birthDate);
    const vaccinationStats = getOverallVaccinationStats(selectedChild);
    const { vaccinationMap } = vaccinationStats;

    return (
      <div className="min-h-screen bg-base-200 min-w-[20rem]">
        <div className="bg-base-100 shadow-sm border-b border-base-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between">
            <button
              onClick={() => setSelectedChild(null)}
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-focus transition-colors font-medium cursor-pointer"
            >
              <FaChevronLeft className="text-sm" />
              <span>{t('childDetails.back')}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-content transition-all duration-200 hover:bg-primary-focus hover:shadow-lg cursor-pointer"
            >
              <FaPrint className="text-lg" />
              <span>{t('childDetails.print')}</span>
            </button>
          </div>
        </div>

        {showPrintComponent ? (
          <VaccinationCardOverlay
            data={{
              ...selectedChild,
              birthDate: adToBs(safeFormatDateYYMMDD(selectedChild.birthDate)),
              vaccinations: selectedChild.vaccinations.map((vaccine) => ({
                ...vaccine,
                dateGiven: adToBs(safeFormatDateYYMMDD(vaccine.dateGiven)),
              })),
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-4 space-y-4">
                {/* Child Basic Info */}
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden">
                  <div className="bg-primary text-primary-content p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <FaBaby className="text-lg" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-xl font-bold">
                          {selectedChild.fullName}{' '}
                          {selectedChild.lastName || ''}
                        </h1>
                        <p className="text-primary-content/90 text-sm">
                          {t('childDetails.age', { formatted: age.formatted })}
                        </p>
                        <div className="flex items-center space-x-3 mt-2 text-xs">
                          <span className="flex items-center space-x-1">
                            <FaMapMarkerAlt />
                            <span>{t('childCard.ward')} {selectedChild.wardNumber}</span>
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${selectedChild.purnaKhop
                              ? 'bg-success text-success-content'
                              : 'bg-warning text-warning-content'
                              }`}
                          >
                            {selectedChild.purnaKhop
                              ? t('childDetails.fullyVaccinated')
                              : t('childDetails.incomplete')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                  <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                    <FaUser className="text-primary" />
                    <span>{t('childDetails.personalInfo.title')}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        {t('childDetails.personalInfo.serviceRegistration')}
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        #{selectedChild.sewaDartaNumber}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider flex items-center space-x-1">
                        <FaVenusMars className="text-xs" />
                        <span>{t('childDetails.personalInfo.gender')}</span>
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.gender}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        {t('childDetails.personalInfo.parentName')}
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.parentName}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        {t('childDetails.personalInfo.tole')}
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.tole}
                      </p>
                    </div>

                    {selectedChild.phoneNumber && (
                      <div>
                        <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                          {t('childDetails.personalInfo.phone')}
                        </label>
                        <p className="font-semibold text-base-content mt-1">
                          {selectedChild.phoneNumber}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        {t('childDetails.personalInfo.municipalityLabel')}
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.isFromOtherMunicipality
                          ? t('childDetails.personalInfo.municipality.other')
                          : t('childDetails.personalInfo.municipality.local')}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        {t('childDetails.personalInfo.casteCode')}
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.casteCode}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider flex items-center space-x-1">
                        <FaBirthdayCake className="text-xs" />
                        <span>{t('childDetails.personalInfo.birthDate')}</span>
                      </label>
                      <div className="flex space-x-4 mt-1">
                        <span className="font-semibold text-base-content">
                          {t('childCard.birthDateBS')}: {adToBs(safeFormatDateYYMMDD(selectedChild.birthDate))}
                        </span>
                        <span className="font-semibold text-base-content">
                          {t('childCard.birthDateAD')}: {safeFormatDate(selectedChild.birthDate)}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 pt-3 border-t border-base-300">
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider flex items-center space-x-1">
                        <FaUserMd className="text-xs" />
                        <span>{t('childDetails.personalInfo.recordInfo')}</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs">
<div>
  <span className="text-base-content/70">
    {t('childDetails.personalInfo.createdBy')}:
  </span>
  <span 
    className="font-semibold text-base-content ml-2 hover:text-primary hover:underline cursor-pointer"
    onClick={() => navigate(`/users/${selectedChild.createdBy.id}`)}
  >
    {selectedChild.createdBy.name}
  </span>
</div>
                        <div>
                          <span className="text-base-content/70">{t('childDetails.personalInfo.createdOn')}:</span>
                          <span className="font-semibold text-base-content ml-2">
                            {safeFormatDate(selectedChild.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vaccination Summary */}
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                  <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                    <FaShieldAlt className="text-primary" />
                    <span>{t('childDetails.vaccinationSummary.title')}</span>
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-16 h-16">
                      <svg
                        className="w-16 h-16 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-base-300"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            vaccinationStats.overallPercentage === 100
                              ? 'text-success'
                              : 'text-primary'
                          }
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${vaccinationStats.overallPercentage}, 100`}
                          strokeLinecap="round"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-sm font-bold ${vaccinationStats.overallPercentage === 100 ? 'text-success' : 'text-primary'}`}
                        >
                          {vaccinationStats.overallPercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-base-content/70">
                        {t('childDetails.vaccinationSummary.overallProgress')}
                      </p>
                      <p className="font-semibold text-base-content">
                        {t('childDetails.vaccinationSummary.dosesGiven', {
                          given: vaccinationStats.totalGiven,
                          required: vaccinationStats.totalRequired,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-success/10 rounded-lg p-2">
                      <p className="text-xl font-bold text-success">
                        {vaccinationStats.completeVaccines}
                      </p>
                      <p className="text-xs text-base-content/80">{t('childDetails.vaccinationSummary.complete')}</p>
                    </div>
                    <div className="bg-warning/10 rounded-lg p-2">
                      <p className="text-xl font-bold text-warning">
                        {vaccinationStats.inProgressVaccines}
                      </p>
                      <p className="text-xs text-base-content/80">{t('childDetails.vaccinationSummary.progress')}</p>
                    </div>
                    <div className="bg-base-300 rounded-lg p-2">
                      <p className="text-xl font-bold text-base-content">
                        {vaccinationStats.notStartedVaccines}
                      </p>
                      <p className="text-xs text-base-content/80">{t('childDetails.vaccinationSummary.pending')}</p>
                    </div>
                  </div>
                </div>

                {/* Weight Records */}
                {selectedChild.weightRecords && selectedChild.weightRecords.length > 0 && (
                  <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                    <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">

                      <FaWeight className="text-primary" />
                      <span>{t('childDetails.weightTracking.title')}</span>
                    </h3>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedChild.weightRecords
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((record, index) => (
                          <div key={record.id} className="bg-base-50 border border-base-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-primary">
                                  {record.weight} kg
                                </span>
                                {index === 0 && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                    {t('childDetails.weightTracking.latest')}
                                  </span>
                                )}
                              </div>
                              <div className="text-right text-xs text-base-content/70">
                                <div>{t('childCard.birthDateBS')}: {adToBs(safeFormatDateYYMMDD(record.date))}</div>
                                <div>{t('childCard.birthDateAD')}: {safeFormatDate(record.date)}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-base-content/60">
                              <div className="flex items-center space-x-1">
  <FaUserMd />
  <span 
    className="hover:text-primary hover:underline cursor-pointer"
    onClick={() => navigate(`/users/${record.createdBy.id}`)}
  >
    {t('childDetails.weightTracking.recordedBy')}: {record.createdBy.name}
  </span>
</div>
                              <div className="flex items-center space-x-1">
                                <FaClock />
                                <span>{t('childDetails.weightTracking.recordedOn')} {safeFormatDate(record.createdAt)}</span>

                    <button className='btn btn-primary' onClick={handleButtonClick}>Show graph</button>
                              </div>
                            </div>

                          </div>

                        ))}
                    </div>
                  </div>
                )}

                {/* Notes/Remarks */}
                {selectedChild.remarks && (
                  <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                    <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                      <FaStickyNote className="text-primary" />
                      <span>{t('childDetails.notes.title')}</span>
                    </h3>
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <p className="text-base-content text-sm leading-relaxed">
                        {selectedChild.remarks}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vaccination Records */}
              <div className="xl:col-span-8">
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden">
                  <div className="bg-primary text-primary-content px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold flex items-center space-x-2">
                          <FaSyringe />
                          <span>{t('childDetails.vaccinationRecords.title')}</span>
                        </h2>
                        <p className="text-primary-content/90 text-xs mt-1">
                          {t('childDetails.vaccinationRecords.description')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>{t('childDetails.vaccinationRecords.legend.given')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                          <span>{t('childDetails.vaccinationRecords.legend.pending')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {Object.entries(vaccineSchedule).map(
                        ([vaccineName, schedule]) => {
                          const givenDoses = vaccinationMap[vaccineName] || [];
                          const totalGiven = givenDoses.length;
                          const totalRequired = schedule.length;
                          const completionPercentage = Math.round(
                            (totalGiven / totalRequired) * 100,
                          );

                          return (
                            <div
                              key={vaccineName}
                              className="border border-base-300 rounded-lg p-3 bg-base-50"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-base-content text-sm">
                                  {vaccineName}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${totalGiven === totalRequired
                                      ? 'bg-success/20 text-success'
                                      : totalGiven > 0
                                        ? 'bg-warning/20 text-warning'
                                        : 'bg-base-300 text-base-content'
                                      }`}
                                  >
                                    {totalGiven}/{totalRequired}
                                  </span>
                                  <span className="text-xs font-medium text-base-content">
                                    {completionPercentage}%
                                  </span>
                                </div>
                              </div>

                              <div className="w-full bg-base-300 rounded-full h-1 mb-3">
                                <div
                                  className={`h-1 rounded-full transition-all ${completionPercentage === 100
                                    ? 'bg-success'
                                    : 'bg-primary'
                                    }`}
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>

                              <div className="space-y-2">
                                {schedule.map((scheduleItem, index) => {
                                  const dose = givenDoses[index];
                                  const isGiven = dose !== undefined;

                                  return (
                                    <div
                                      key={index}
                                      className="bg-base-200 rounded-lg p-3 space-y-2"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <div
                                            className={`w-2 h-2 rounded-full ${isGiven ? 'bg-success' : 'bg-base-content/30'}`}
                                          />
                                          <span className="font-medium text-sm">
                                            {t('childDetails.vaccinationRecords.dose', { dose: scheduleItem.dose })}
                                          </span>
                                          <span className="text-base-content/60 bg-base-300 px-2 py-1 rounded text-xs">
                                            {getRecommendedAgeText(scheduleItem)}
                                          </span>
                                        </div>
                                        {isGiven && dose.isComplete && (
                                          <FaCheckCircle className="text-success text-sm" />
                                        )}
                                      </div>

                                      {isGiven ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                          <div className="space-y-1">
                                            <div className="font-medium text-base-content">
                                              {t('childDetails.vaccinationRecords.givenOnBS', { date: adToBs(safeFormatDateYYMMDD(dose.date)) })}
                                            </div>
                                            <div className="text-base-content/60">
                                              {t('childDetails.vaccinationRecords.givenOnAD', { date: safeFormatDate(dose.date) })}
                                            </div>
                                            {dose.type && (
                                              <div className="mt-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVaccineTypeLabel(dose.type).class}`}>
                                                  {getVaccineTypeLabel(dose.type).label}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="space-y-1">
                                            <div className="flex items-center space-x-1 text-base-content/70">
  <FaUserMd className="text-xs" />
  <span 
    className="hover:text-primary hover:underline cursor-pointer"
    onClick={() => navigate(`/users/${dose.createdById}`)}
  >
    {t('childDetails.vaccinationRecords.givenBy')}: {dose.createdBy.name}
  </span>
</div>
                                            <div className="flex items-center space-x-1 text-base-content/70">
                                              <FaClock className="text-xs" />
                                              <span>{t('childDetails.vaccinationRecords.recorded', { date: safeFormatDate(dose.createdAt) })}</span>
                                            </div>
                                          </div>
                                          {dose.remarks && (
                                            <div className="md:col-span-2 mt-2 p-2 bg-base-100 rounded border-l-2 border-primary">
                                              <div className="text-xs text-base-content/70 mb-1">{t('childDetails.vaccinationRecords.remarks')}</div>
                                              <div className="text-sm text-base-content">{dose.remarks}</div>
                                            </div>
                                          )}
                                          {dose.customVaccineName && (
                                            <div className="md:col-span-2 mt-1">
                                              <span className="text-xs bg-info/20 text-info px-2 py-1 rounded">
                                                {t('childDetails.vaccinationRecords.customVaccine', { name: dose.customVaccineName })}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-center py-2">
                                          <span className="text-base-content/50 italic text-sm">
                                            {t('childDetails.vaccinationRecords.notAdministered')}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 min-w-[20rem]">
      <div className="bg-base-100 shadow-sm border-b border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-base-content mb-1">
                {t('header.title')}
              </h1>
              <p className="text-base-content/70 text-sm">
                {t('header.description')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => changeLanguage('en')}
                className={`text-sm font-medium ${i18n.language === 'en' ? 'text-primary' : 'text-base-content/60'}`}
              >
                English
              </button>
              <span className="text-base-content/30">|</span>
              <button 
                onClick={() => changeLanguage('ne')}
                className={`text-sm font-medium ${i18n.language === 'ne' ? 'text-primary' : 'text-base-content/60'}`}
              >
                नेपाली
              </button>
              <button className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer">
                <FaPlus />
                <span>{t('addChildButton.label')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-base-content placeholder:text-base-content/60"
              />
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FaBaby className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {childrenData.length}
                </p>
                <p className="text-xs text-base-content/70">{t('stats.totalChildren')}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-success/10 p-2 rounded-lg">
                <FaCheckCircle className="text-success text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {childrenData.filter((child) => child.purnaKhop).length}
                </p>
                <p className="text-xs text-base-content/70">{t('stats.fullyVaccinated')}</p>
              </div>
            </div>
          </div>
        </div>

        {filteredChildren.length === 0 ? (
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-8 text-center">
            <FaBaby className="text-4xl text-base-content/40 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-base-content mb-2">
              {searchTerm
                ? t('noResults.title_with_search')
                : t('noResults.title_no_data')}
            </h2>
            <p className="text-base-content/70 text-sm mb-4">
              {searchTerm
                ? t('noResults.description_with_search')
                : t('noResults.description_no_data')}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {t('noResults.clear_search')}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentChildren.map((child) => {
                const age = safeCalculateAge(child.birthDate);
                const hasWeightRecords = child.weightRecords && child.weightRecords.length > 0;
                const latestWeight = hasWeightRecords ?
                  child.weightRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;

                return (
                  <div
                    key={child.id}
                    className="bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-base-300 overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedChild(child)}
                  >
                    <div className="bg-base-200 border-b border-base-300 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FaBaby className="text-primary" />
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${child.purnaKhop
                            ? 'bg-success/20 text-success border border-success/30'
                            : 'bg-warning/20 text-warning border border-warning/30'
                            }`}
                        >
                          {child.purnaKhop ? t('childCard.vaccinated') : t('childCard.pending')}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-base-content">
                        {child.fullName} {child.lastName || ''}
                      </h3>
                      <p className="text-base-content/70 text-sm">
                        {t('childDetails.age', { formatted: age.formatted })}
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">
                            {t('childCard.birthDateBS')}
                          </span>
                          <span className="font-medium text-base-content">
                            {adToBs(safeFormatDateYYMMDD(child.birthDate))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">
                            {t('childCard.birthDateAD')}
                          </span>
                          <span className="font-medium text-base-content">
                            {safeFormatDate(child.birthDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">{t('childCard.ward')}</span>
                          <span className="font-medium text-base-content">
                            {child.wardNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">{t('childCard.vaccinations')}</span>
                          <span className="font-medium text-base-content">
                            {child.vaccinations ? child.vaccinations.length : 0} {t('childCard.vaccinations')}
                          </span>
                        </div>
                        {latestWeight && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-base-content/70 flex items-center space-x-1">
                              <FaWeight className="text-xs" />
                              <span>{t('childCard.latestWeight')}</span>
                            </span>
                            <span className="font-medium text-base-content">
                              {latestWeight.weight} kg
                            </span>
                          </div>
                        )}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-base-300">
  <span className="text-base-content/60 flex items-center space-x-1">
    <FaUserMd className="text-xs" />
    <span 
      className="hover:text-primary hover:underline cursor-pointer"
      onClick={() => navigate(`/users/${child.createdBy.id}`)}
    >
      {t('childCard.createdBy')}: {child.createdBy.name}
    </span>
  </span>
</div>
                      </div>
                      <button className="w-full bg-base-200 hover:bg-primary hover:text-primary-content text-base-content py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-base-300 group-hover:bg-primary group-hover:text-primary-content">
                        <FaEye />
                        <span>{t('childCard.viewDetails')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {t('pagination.previous')}
                </button>
                <span className="text-base-content">
                  {t('pagination.page', { current: currentPage, total: totalPages })}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {t('pagination.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
