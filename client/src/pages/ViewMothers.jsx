import { useState, useEffect } from 'react';
import {
  FaSpinner,
  FaChevronLeft,
  FaPlus,
  FaSearch,
  FaPrint,
  FaFemale,
  FaEye,
  FaStickyNote,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserMd,
  FaSyringe,
  FaClipboardList,
  FaChevronDown,
  FaCheckCircle,
} from 'react-icons/fa';
import {
  safeCalculateAge,
  safeFormatDate,
  safeFormatDateYYMMDD,
} from '../utils/date.js';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { useMotherContext } from '../context/motherContext.jsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function AllMothers() {
  const { t } = useTranslation('viewMothers');
  const [selectedMother, setSelectedMother] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all'); // <-- Add this
  const [sortBy, setSortBy] = useState('name'); // <-- And this
  const itemsPerPage = 20;
  const navigate = useNavigate();

  const { mothersData, fetchMotherDetails, pagination, loading, error, fetchMothers } = useMotherContext();

  const handleViewDetails = async (mother) => {
    const fullMother = await fetchMotherDetails(mother.sewaDartaNumber);
    if (fullMother) setSelectedMother(fullMother);
  };

  // Stats
  const vaccinatedCount = mothersData ? mothersData.filter(mother =>
    mother.tdDoses && mother.tdDoses.length >= 3
  ).length : 0;
  const pendingCount = mothersData ? mothersData.length - vaccinatedCount : 0;
  const totalPages = Math.ceil((pagination?.total || 0) / itemsPerPage);

  // Optionally, filter/search on backend for large lists
  const filteredMothers = mothersData.filter(
    (mother) =>
      !searchTerm ||
      (mother.name && mother.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchMothers(currentPage, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

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
            <p className="text-base-content text-sm mb-4">{t('error.message', { error })}</p>
            <button
              onClick={() => fetchMothers(currentPage, itemsPerPage)}
              className="btn btn-primary btn-sm"
            >
              {t('error.try_again')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMother) {
    const tdDoses = selectedMother.tdDoses.map((dose, index) => ({
      name: t('motherDetails.tdDose.dose', { dose: dose.doseNumber }),
      date: dose.dateGiven,
      createdBy: dose.createdBy,
      administeredBy: dose.administeredBy,
      remarks: dose.remarks,
    }));

    return (
      <div className="min-h-screen bg-base-200 min-w-[20rem]">
        <div className="bg-base-100 shadow-sm border-b border-base-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between">
            <button
              onClick={() => setSelectedMother(null)}
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-focus transition-colors font-medium cursor-pointer"
            >
              <FaChevronLeft className="text-sm" />
              <span>{t('motherDetails.back')}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-content transition-all duration-200 hover:bg-primary-focus hover:shadow-lg cursor-pointer"
            >
              <FaPrint className="text-lg" />
              <span>{t('motherDetails.print')}</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden">
                <div className="bg-primary text-primary-content p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FaFemale className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-xl font-bold">
                        {selectedMother.name}
                      </h1>
                      <p className="text-primary-content/90 text-sm">
                        {t('motherDetails.age', { value: selectedMother.age })}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-xs">
                        <span className="flex items-center space-x-1">
                          <FaMapMarkerAlt />
                          <span>{t('motherDetails.ward', { number: selectedMother.wardNumber })}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaPhone />
                          <span>{selectedMother.phoneNumber}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                  <FaUserMd className="text-primary" />
                  <span>{t('motherDetails.personalInfo.title')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      {t('motherDetails.personalInfo.tole')}
                    </label>
                    <p className="font-semibold text-base-content mt-1">
                      {selectedMother.tole}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      {t('motherDetails.personalInfo.casteCode')}
                    </label>
                    <p className="font-semibold text-base-content mt-1">
                      {selectedMother.casteCode}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      {t('motherDetails.personalInfo.sewaDartaNumber')}
                    </label>
                    <p className="font-semibold text-base-content mt-1">
                      {t('motherDetails.personalInfo.sewaDartaNumberValue', { number: selectedMother.sewaDartaNumber })}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      {t('motherDetails.personalInfo.pregnancies')}
                    </label>
                    <p className="font-semibold text-base-content mt-1">
                      {selectedMother.pregnancyCount}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      {t('motherDetails.personalInfo.previousTD')}
                    </label>
                    <p className="font-semibold text-base-content mt-1">
                      {selectedMother.previousTDTakenCount}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      {t('motherDetails.personalInfo.municipalityLabel')}
                    </label>
                    <p className="font-semibold text-base-content mt-1">
                      {selectedMother.isFromOtherMunicipality
                        ? t('motherDetails.personalInfo.municipality.other')
                        : t('motherDetails.personalInfo.municipality.local')}
                    </p>
                  </div>

                  <div className="sm:col-span-2 pt-3 border-t border-base-300">
                    <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider flex items-center space-x-1">
                      <FaCalendarAlt className="text-xs" />
                      <span>{t('motherDetails.personalInfo.recordCreated')}</span>
                    </label>
                    <div className="flex space-x-4 mt-1">
                      <span className="font-semibold text-base-content text-sm">
                        {safeFormatDate(selectedMother.createdAt)}
                      </span>
                      <span className="flex items-center space-x-1 text-base-content/70">
                        <FaUserMd className="text-xs" />
                        <span
                          className="hover:text-primary hover:underline cursor-pointer"
                          onClick={() => navigate(`/users/${selectedMother.createdBy.id}`)}
                        >
                          {t('motherDetails.personalInfo.createdBy')}: {selectedMother.createdBy ? selectedMother.createdBy.name : t('motherCard.unknown')}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMother.remarks && (
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                  <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                    <FaStickyNote className="text-primary" />
                    <span>{t('motherDetails.notes.title')}</span>
                  </h3>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                    <p className="text-base-content text-sm leading-relaxed">
                      {selectedMother.remarks}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="xl:col-span-8">
              <div className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden">
                <div className="bg-success text-success-content px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold flex items-center space-x-2">
                        <FaSyringe />
                        <span>{t('motherDetails.tdVaccinationRecords.title')}</span>
                      </h2>
                      <p className="text-success-content/90 text-xs mt-1">
                        {t('motherDetails.tdVaccinationRecords.description')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>{t('motherDetails.tdVaccinationRecords.given')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                        <span>{t('motherDetails.tdVaccinationRecords.pending')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {tdDoses.map((dose, index) => {
                      const isGiven = dose.date !== undefined && dose.date !== null;

                      return (
                        <div
                          key={index}
                          className="border border-base-300 rounded-lg p-3 bg-base-50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-base-content text-sm">
                              {dose.name}
                            </h4>
                            <div
                              className={`w-2 h-2 rounded-full ${isGiven ? 'bg-success' : 'bg-base-content/30'}`}
                            />
                          </div>

                          {isGiven ? (
                            <div className="space-y-2">
                              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <FaCalendarAlt className="text-success text-sm" />
                                  <span className="font-medium text-sm text-success">
                                    {t('motherDetails.tdVaccinationRecords.administered')}
                                  </span>
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div className="font-medium text-base-content">
                                    {t('motherDetails.tdVaccinationRecords.bsDate', { date: adToBs(safeFormatDateYYMMDD(dose.date)) })}
                                  </div>
                                  <div className="text-base-content/60">
                                    {t('motherDetails.tdVaccinationRecords.adDate', { date: safeFormatDate(dose.date) })}
                                  </div>
                                </div>
                                <div className="space-y-1 text-xs mt-2">
                                  {dose.createdBy && (
                                    <div className="flex items-center space-x-1 text-base-content/70">
                                      <FaUserMd className="text-xs" />
                                      <span
                                        className="hover:text-primary hover:underline cursor-pointer"
                                        onClick={() => navigate(`/users/${dose.createdBy.id}`)}
                                      >
                                        {t('motherDetails.tdVaccinationRecords.createdBy')}: {dose.createdBy.name}
                                      </span>
                                    </div>
                                  )}
                                  {dose.administeredBy && (
                                    <div className="flex items-center space-x-1 text-base-content/70">
                                      <FaUserMd className="text-xs" />
                                      <span
                                        className="hover:text-primary hover:underline cursor-pointer"
                                        onClick={() => navigate(`/users/${dose.administeredBy.id}`)}
                                      >
                                        {t('motherDetails.tdVaccinationRecords.givenBy')}: {dose.administeredBy.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {dose.remarks && (
                                  <div className="mt-2 p-2 bg-base-100 rounded border-l-2 border-primary">
                                    <div className="text-xs text-base-content/70 mb-1">
                                      {t('motherDetails.tdVaccinationRecords.remarks')}
                                    </div>
                                    <div className="text-sm text-base-content">
                                      {dose.remarks}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <div className="w-8 h-8 mx-auto bg-base-300 rounded-full flex items-center justify-center mb-2">
                                <FaSyringe className="text-base-content/40 text-xs" />
                              </div>
                              <span className="text-base-content/50 italic text-sm">
                                {t('motherDetails.tdVaccinationRecords.notAdministered')}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <button
              onClick={() => navigate('/add-mother')}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <FaPlus />
              <span>{t('addMotherButton.label')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FaFemale className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {mothersData ? mothersData.length : 0}
                </p>
                <p className="text-xs text-base-content/70">{t('stats.totalMothers')}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-success/10 p-2 rounded-lg">
                <FaSyringe className="text-success text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {vaccinatedCount}
                </p>
                <p className="text-xs text-base-content/70">{t('stats.fullyVaccinated')}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-warning/10 p-2 rounded-lg">
                <FaClipboardList className="text-warning text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {pendingCount}
                </p>
                <p className="text-xs text-base-content/70">{t('stats.pending')}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-info/10 p-2 rounded-lg">
                <FaCheckCircle className="text-info text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {Math.round(vaccinatedCount / (mothersData?.length || 1) * 100)}%
                </p>
                <p className="text-xs text-base-content/70">{t('stats.completionRate')}</p>
              </div>
            </div>
          </div>
        </div>

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

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none bg-base-100 border border-base-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            >
              <option value="all">{t('filter.all')}</option>
              <option value="vaccinated">{t('filter.vaccinated')}</option>
              <option value="pending">{t('filter.pending')}</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-base-100 border border-base-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            >
              <option value="name">{t('sort.name')}</option>
              <option value="age">{t('sort.age')}</option>
              <option value="ward">{t('sort.ward')}</option>
              <option value="recent">{t('sort.recent')}</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 pointer-events-none" />
          </div>
        </div>

        {filteredMothers.length === 0 ? (
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-8 text-center">
            <FaFemale className="text-4xl text-base-content/40 mx-auto mb-3" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {filteredMothers.map((mother) => {
                const isTDFullyVaccinated = mother.tdDoses && mother.tdDoses.length >= 3;

                return (
                  <div
                    key={mother.id}
                    className="bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-base-300 overflow-hidden group cursor-pointer"
                    onClick={() => handleViewDetails(mother)}
                  >
                    <div className="bg-base-200 border-b border-base-300 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FaFemale className="text-primary" />
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${isTDFullyVaccinated
                            ? 'bg-success/20 text-success border border-success/30'
                            : 'bg-warning/20 text-warning border border-warning/30'
                            }`}
                        >
                          {isTDFullyVaccinated ? t('motherCard.vaccinated') : t('motherCard.pending')}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-base-content">
                        {mother.name}
                      </h3>
                      <p className="text-base-content/70 text-sm">
                        {t('motherCard.ageAndSeva', { age: mother.age, sewa: mother.sewaDartaNumber })}
                      </p>
                    </div>

                    <div className="p-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">{t('motherCard.ward')}</span>
                          <span className="font-medium text-base-content">{mother.wardNumber}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">{t('motherCard.tole')}</span>
                          <span className="font-medium text-base-content truncate ml-2">{mother.tole}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">{t('motherCard.pregnancy')}</span>
                          <span className="font-medium text-base-content">{mother.pregnancyCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">{t('motherCard.previousTD')}</span>
                          <span className="font-medium text-base-content">{mother.previousTDTakenCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">{t('motherCard.phone')}</span>
                          <span className="font-medium text-base-content">{mother.phoneNumber}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-base-300">
                          <span className="text-base-content/60 flex items-center space-x-1">
                            <FaUserMd className="text-xs" />
                            <span
                              className="hover:text-primary hover:underline cursor-pointer"
                              onClick={() => mother.createdBy && navigate(`/users/${mother.createdBy.id}`)}
                            >
                              {t('motherCard.createdBy')}: {mother.createdBy ? mother.createdBy.name : t('motherCard.unknown')}
                            </span>
                          </span>
                          <span className="text-base-content/60">
                            {safeFormatDate(mother.createdAt)}
                          </span>
                        </div>
                      </div>

                      <button className="w-full bg-base-200 hover:bg-primary hover:text-primary-content text-base-content py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-base-300 group-hover:bg-primary group-hover:text-primary-content">
                        <FaEye />
                        <span>{t('motherCard.viewDetails')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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