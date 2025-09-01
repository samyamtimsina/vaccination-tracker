import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Shield, Clock, AlertCircle, Edit2, Trash2, Save, X, Eye, CheckCircle, Ban } from 'lucide-react';

import axiosClient from '../api/axiosClient.js';

const VaccineScheduleManager = () => {
    const [versions, setVersions] = useState([]);
    const [vaccineTypes, setVaccineTypes] = useState([]);
    const [activeTab, setActiveTab] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingDose, setEditingDose] = useState(null);
    const [editingRule, setEditingRule] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ type: null, id: null });
    const [confirmAction, setConfirmAction] = useState({
        type: null,
        id: null,
        message: '',
        confirmText: '',
        buttonClass: ''
    });
    const [editValues, setEditValues] = useState({});
    const [newVersion, setNewVersion] = useState({
        doses: [],
        catchUpRules: []
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [newVaccineType, setNewVaccineType] = useState({ name: '', isActive: true });
    const [showNewVaccineModal, setShowNewVaccineModal] = useState(false);
    const [copyFromVersionId, setCopyFromVersionId] = useState('');

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    // API endpoints
    const fetchVersions = async () => {
        try {
            const response = await axiosClient.get('/api/vaccine-schedule/all');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch versions:', error);
            throw new Error('Failed to fetch versions');
        }
    };

    const fetchVaccineTypes = async () => {
        try {
            const response = await axiosClient.get('/api/vaccine-schedule/types');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch vaccine types:', error);
            throw new Error('Failed to fetch vaccine types');
        }
    };

    const createVaccineType = async (vaccineTypeData) => {
        try {
            setSaving(true);
            const response = await axiosClient.post('/api/vaccine-schedule/types', vaccineTypeData);
            const updatedTypes = await fetchVaccineTypes();
            setVaccineTypes(updatedTypes);
            showNotification('Vaccine type created successfully!');
            return response.data;
        } catch (error) {
            console.error('Failed to create vaccine type:', error);
            showNotification('Failed to create vaccine type. Please try again.', 'error');
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const createNewVersion = async (versionData) => {
        try {
            setSaving(true);
            // Structure the data to match your backend API
            const payload = {
                userId: 1, // You might want to get this from your auth context
                copyFromVersionId: versionData.copyFromVersionId || null,
                doses: versionData.doses,
                catchUpRules: versionData.catchUpRules
            };

            // CORRECTED: Changed the endpoint URL to /api/vaccine-schedule
            console.log('payload', payload)
            const response = await axiosClient.post('/api/vaccine-schedule/', payload);
            const versionsData = await fetchVersions();
            setVersions(versionsData);
            showNotification('New version created successfully!');
            return response.data;
        } catch (error) {
            console.error('Failed to create version:', error);
            showNotification('Failed to create version. Please try again.', 'error');
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const addDoseToCurrentVersion = async (doseData) => {
        try {
            setSaving(true);
            const latestVersion = getLatestVersion();
            if (!latestVersion) {
                throw new Error('No current version found');
            }

            const payload = {
                ...doseData,
                versionId: latestVersion.id
            };

            await axiosClient.post('/api/vaccine-schedule/dose', payload);
            const versionsData = await fetchVersions();
            setVersions(versionsData);
            showNotification('Dose added successfully!');
        } catch (error) {
            console.error('Failed to add dose:', error);
            showNotification('Failed to add dose. Please try again.', 'error');
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const addCatchUpRuleToCurrentVersion = async (ruleData) => {
        try {
            setSaving(true);
            const latestVersion = getLatestVersion();
            if (!latestVersion) {
                throw new Error('No current version found');
            }

            const payload = {
                ...ruleData,
                versionId: latestVersion.id
            };

            await axiosClient.post('/api/vaccine-schedule/catch-up-rules', payload);
            const versionsData = await fetchVersions();
            setVersions(versionsData);
            showNotification('Catch-up rule added successfully!');
        } catch (error) {
            console.error('Failed to add catch-up rule:', error);
            showNotification('Failed to add catch-up rule. Please try again.', 'error');
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const deleteDose = async (doseId) => {
        try {
            await axiosClient.delete(`/api/vaccine-schedule/dose/${doseId}`);
            const versionsData = await fetchVersions();
            setVersions(versionsData);
            showNotification('Dose deleted successfully!');
        } catch (error) {
            console.error('Failed to delete dose:', error);
            showNotification('Failed to delete dose. Please try again.', 'error');
        }
    };

    const deleteCatchUpRule = async (ruleId) => {
        try {
            await axiosClient.delete(`/api/vaccine-schedule/catch-up-rules/${ruleId}`);
            const versionsData = await fetchVersions();
            setVersions(versionsData);
            showNotification('Catch-up rule deleted successfully!');
        } catch (error) {
            console.error('Failed to delete catch-up rule:', error);
            showNotification('Failed to delete catch-up rule. Please try again.', 'error');
        }
    };

    const updateDoseAPI = async (doseId, updates) => {
        try {
            await axiosClient.put(`/api/vaccine-schedule/dose/${doseId}`, updates);
            const versionsData = await fetchVersions();
            setVersions(versionsData);
            showNotification('Dose updated successfully!');
        } catch (error) {
            console.error('Failed to update dose:', error);
            showNotification('Failed to update dose. Please try again.', 'error');
            throw error;
        }
    };

    const updateCatchUpRuleAPI = async (ruleId, updates) => {
        try {
            await axiosClient.put(`/api/vaccine-schedule/catch-up-rules/${ruleId}`, updates);
            const versionsData = await fetchVersions();
            setVersions(versionsData);
            showNotification('Catch-up rule updated successfully!');
        } catch (error) {
            console.error('Failed to update catch-up rule:', error);
            showNotification('Failed to update catch-up rule. Please try again.', 'error');
            throw error;
        }
    };

    // New API functions for vaccine types
    const updateVaccineTypeAPI = async (id, updates) => {
        try {
            await axiosClient.patch(`/api/vaccine-schedule/types/${id}`, updates);
            const updatedTypes = await fetchVaccineTypes();
            setVaccineTypes(updatedTypes);
            showNotification('Vaccine type updated successfully!');
        } catch (error) {
            console.error('Failed to update vaccine type:', error);
            showNotification('Failed to update vaccine type. Please try again.', 'error');
            throw error;
        }
    };

    const deleteVaccineTypeAPI = async (id) => {
        try {
            await axiosClient.delete(`/api/vaccine-schedule/types/${id}`);
            const updatedTypes = await fetchVaccineTypes();
            setVaccineTypes(updatedTypes);
            showNotification('Vaccine type deleted successfully!');
        } catch (error) {
            console.error('Failed to delete vaccine type:', error);
            showNotification('Failed to delete vaccine type. Please try again.', 'error');
            throw error;
        }
    };

    const enableVaccineTypeAPI = async (id) => {
        try {
            await axiosClient.patch(`/api/vaccine-schedule/types/enable/${id}`);
            const updatedTypes = await fetchVaccineTypes();
            setVaccineTypes(updatedTypes);
            showNotification('Vaccine type enabled successfully!');
        } catch (error) {
            console.error('Failed to enable vaccine type:', error);
            showNotification('Failed to enable vaccine type. Please try again.', 'error');
            throw error;
        }
    };

    const disableVaccineTypeAPI = async (id) => {
        try {
            await axiosClient.patch(`/api/vaccine-schedule/types/disable/${id}`);
            const updatedTypes = await fetchVaccineTypes();
            setVaccineTypes(updatedTypes);
            showNotification('Vaccine type disabled successfully!');
        } catch (error) {
            console.error('Failed to disable vaccine type:', error);
            showNotification('Failed to disable vaccine type. Please try again.', 'error');
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [versionsData, vaccineTypesData] = await Promise.all([
                    fetchVersions(),
                    fetchVaccineTypes()
                ]);
                setVersions(versionsData);
                setVaccineTypes(vaccineTypesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Failed to load data. Please refresh the page.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatAge = (dose) => {
        if (dose.recommendedAtDays === 0) return 'Birth';
        if (dose.recommendedAtDays) return `${dose.recommendedAtDays} days`;
        if (dose.recommendedAtWeeks) return `${dose.recommendedAtWeeks} weeks`;
        if (dose.recommendedAtMonths) return `${dose.recommendedAtMonths} months`;
        if (dose.recommendedAtYears) return `${dose.recommendedAtYears} years`;
        return 'Not specified';
    };

    const formatMaxAge = (rule) => {
        if (rule.maxAgeDays) return `${rule.maxAgeDays} days`;
        if (rule.maxAgeWeeks) return `${rule.maxAgeWeeks} weeks`;
        if (rule.maxAgeMonths) return `${rule.maxAgeMonths} months`;
        if (rule.maxAgeYears) return `${rule.maxAgeYears} years`;
        return 'No limit';
    };

    const getLatestVersion = () => {
        if (!Array.isArray(versions) || versions.length === 0) return null;
        return versions[0];
    };

    const handleCreateVaccineType = async () => {
        if (!newVaccineType.name.trim()) {
            showNotification('Please enter a vaccine name.', 'error');
            return;
        }

        try {
            await createVaccineType({
                name: newVaccineType.name.trim(),
                isActive: newVaccineType.isActive
            });
            setShowNewVaccineModal(false);
            setNewVaccineType({ name: '', isActive: true });
        } catch (error) {
            // Error handling already done in createVaccineType
        }
    };

    const handleConfirmAction = (actionType, id) => {
        let message = '';
        let confirmText = '';
        let buttonClass = '';

        if (actionType === 'deleteDose') {
            message = 'Are you sure you want to delete this dose? This action cannot be undone and may affect the vaccine schedule.';
            confirmText = 'Delete Permanently';
            buttonClass = 'btn-error';
        } else if (actionType === 'deleteRule') {
            message = 'Are you sure you want to delete this catch-up rule? This action cannot be undone and may affect the vaccine schedule.';
            confirmText = 'Delete Permanently';
            buttonClass = 'btn-error';
        } else if (actionType === 'deleteType') {
            message = 'Are you sure you want to delete this vaccine type? This action cannot be undone and may affect associated schedules.';
            confirmText = 'Delete Permanently';
            buttonClass = 'btn-error';
        } else if (actionType === 'enableType') {
            message = 'Are you sure you want to enable this vaccine type? It will become available for new schedule entries.';
            confirmText = 'Enable';
            buttonClass = 'btn-success';
        } else if (actionType === 'disableType') {
            message = 'Are you sure you want to disable this vaccine type? It will not be available for new schedule entries but will remain in old versions.';
            confirmText = 'Disable';
            buttonClass = 'btn-warning';
        }

        setConfirmAction({
            type: actionType,
            id: id,
            message: message,
            confirmText: confirmText,
            buttonClass: buttonClass
        });
    };

    const handleExecuteAction = async () => {
        const { type, id } = confirmAction;
        setSaving(true);
        try {
            if (type === 'deleteDose') {
                await deleteDose(id);
            } else if (type === 'deleteRule') {
                await deleteCatchUpRule(id);
            } else if (type === 'deleteType') {
                await deleteVaccineTypeAPI(id);
            } else if (type === 'enableType') {
                await enableVaccineTypeAPI(id);
            } else if (type === 'disableType') {
                await disableVaccineTypeAPI(id);
            }
        } finally {
            setSaving(false);
            setConfirmAction({ type: null, id: null, message: '', confirmText: '', buttonClass: '' });
        }
    };

    const handleCancelAction = () => {
        setConfirmAction({ type: null, id: null, message: '', confirmText: '', buttonClass: '' });
    };

    const handleEditDose = (dose) => {
        setEditingDose(dose.id);
        setEditValues({
            vaccineTypeId: dose.vaccineTypeId,
            doseNumber: dose.doseNumber,
            recommendedAtDays: dose.recommendedAtDays || '',
            recommendedAtWeeks: dose.recommendedAtWeeks || '',
            recommendedAtMonths: dose.recommendedAtMonths || '',
            recommendedAtYears: dose.recommendedAtYears || '',
            isBooster: dose.isBooster
        });
    };

    const handleEditCatchUpRule = (rule) => {
        setEditingRule(rule.id);
        setEditValues({
            vaccineTypeId: rule.vaccineTypeId,
            maxAgeDays: rule.maxAgeDays || '',
            maxAgeWeeks: rule.maxAgeWeeks || '',
            maxAgeMonths: rule.maxAgeMonths || '',
            maxAgeYears: rule.maxAgeYears || '',
            minIntervalWeeks: rule.minIntervalWeeks || '',
            totalDoses: rule.totalDoses
        });
    };

    const handleSaveDose = async () => {
        try {
            const latestVersion = getLatestVersion();
            const dosesWithoutEdited = latestVersion.doses.filter(d => d.id !== editingDose);

            const updatedDose = {
                vaccineTypeId: parseInt(editValues.vaccineTypeId),
                doseNumber: parseInt(editValues.doseNumber),
                recommendedAtDays: editValues.recommendedAtDays ? parseInt(editValues.recommendedAtDays) : null,
                recommendedAtWeeks: editValues.recommendedAtWeeks ? parseInt(editValues.recommendedAtWeeks) : null,
                recommendedAtMonths: editValues.recommendedAtMonths ? parseInt(editValues.recommendedAtMonths) : null,
                recommendedAtYears: editValues.recommendedAtYears ? parseFloat(editValues.recommendedAtYears) : null,
                isBooster: Boolean(editValues.isBooster)
            };

            const payload = {
                copyFromVersionId: latestVersion.id,
                doses: [...dosesWithoutEdited, updatedDose],
                catchUpRules: latestVersion.catchUpRules
            };

            await createNewVersion(payload);
            setEditingDose(null);
            setEditValues({});
        } catch (error) {
            console.error('Failed to update dose:', error);
            showNotification('Failed to update dose. Please try again.', 'error');
        }
    };

    const handleSaveCatchUpRule = async () => {
        try {
            const latestVersion = getLatestVersion();
            const rulesWithoutEdited = latestVersion.catchUpRules.filter(r => r.id !== editingRule);

            const updatedRule = {
                vaccineTypeId: parseInt(editValues.vaccineTypeId),
                maxAgeMonths: editValues.maxAgeMonths ? parseInt(editValues.maxAgeMonths) : null,
                minIntervalWeeks: editValues.minIntervalWeeks ? parseInt(editValues.minIntervalWeeks) : null,
                totalDoses: parseInt(editValues.totalDoses)
            };

            const payload = {
                copyFromVersionId: latestVersion.id,
                doses: latestVersion.doses,
                catchUpRules: [...rulesWithoutEdited, updatedRule]
            };

            await createNewVersion(payload);
            setEditingRule(null);
            setEditValues({});
        } catch (error) {
            console.error('Failed to update catch-up rule:', error);
            showNotification('Failed to update catch-up rule. Please try again.', 'error');
        }
    };

    const handleCancelEdit = () => {
        setEditingDose(null);
        setEditingRule(null);
        setEditValues({});
    };

    const updateEditValue = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    // New Version Form Functions
    const addNewDose = () => {
        setNewVersion(prev => ({
            ...prev,
            doses: [...prev.doses, {
                vaccineTypeId: '',
                doseNumber: 1,
                recommendedAtDays: '',
                recommendedAtWeeks: '',
                recommendedAtMonths: '',
                recommendedAtYears: '',
                isBooster: false
            }]
        }));
    };

    const addNewCatchUpRule = () => {
        setNewVersion(prev => ({
            ...prev,
            catchUpRules: [...prev.catchUpRules, {
                vaccineTypeId: '',
                maxAgeMonths: '',
                minIntervalWeeks: '',
                totalDoses: 1
            }]
        }));
    };

    const updateDose = (index, field, value) => {
        setNewVersion(prev => ({
            ...prev,
            doses: prev.doses.map((dose, i) =>
                i === index ? { ...dose, [field]: value } : dose
            )
        }));
    };

    const updateCatchUpRule = (index, field, value) => {
        setNewVersion(prev => ({
            ...prev,
            catchUpRules: prev.catchUpRules.map((rule, i) =>
                i === index ? { ...rule, [field]: value } : rule
            )
        }));
    };

    const removeDose = (index) => {
        setNewVersion(prev => ({
            ...prev,
            doses: prev.doses.filter((_, i) => i !== index)
        }));
    };

    const removeCatchUpRule = (index) => {
        setNewVersion(prev => ({
            ...prev,
            catchUpRules: prev.catchUpRules.filter((_, i) => i !== index)
        }));
    };

    const handleSaveNewVersion = async () => {
        if (newVersion.doses.length === 0 && !copyFromVersionId) {
            showNotification('Please add at least one dose or select a version to copy from.', 'error');
            return;
        }

        if (newVersion.doses.length > 0) {
            const invalidDoses = newVersion.doses.some(dose =>
                !dose.vaccineTypeId || !dose.doseNumber
            );

            if (invalidDoses) {
                showNotification('Please fill in all required fields for doses.', 'error');
                return;
            }
        }

        try {
            const versionPayload = {
                copyFromVersionId: copyFromVersionId ? parseInt(copyFromVersionId) : null,
                doses: newVersion.doses.length > 0 ? newVersion.doses.map(dose => ({
                    vaccineTypeId: parseInt(dose.vaccineTypeId),
                    doseNumber: parseInt(dose.doseNumber),
                    recommendedAtDays: dose.recommendedAtDays ? parseInt(dose.recommendedAtDays) : null,
                    recommendedAtWeeks: dose.recommendedAtWeeks ? parseInt(dose.recommendedAtWeeks) : null,
                    recommendedAtMonths: dose.recommendedAtMonths ? parseInt(dose.recommendedAtMonths) : null,
                    recommendedAtYears: dose.recommendedAtYears ? parseFloat(dose.recommendedAtYears) : null,
                    isBooster: Boolean(dose.isBooster)
                })) : [],
                catchUpRules: newVersion.catchUpRules.length > 0 ? newVersion.catchUpRules.map(rule => ({
                    vaccineTypeId: parseInt(rule.vaccineTypeId),
                    maxAgeDays: rule.maxAgeDays ? parseInt(rule.maxAgeDays) : null,
                    maxAgeWeeks: rule.maxAgeWeeks ? parseInt(rule.maxAgeWeeks) : null,
                    maxAgeMonths: rule.maxAgeMonths ? parseInt(rule.maxAgeMonths) : null,
                    maxAgeYears: rule.maxAgeYears ? parseFloat(rule.maxAgeYears) : null,
                    minIntervalWeeks: rule.minIntervalWeeks ? parseInt(rule.minIntervalWeeks) : null,
                    totalDoses: parseInt(rule.totalDoses)
                })) : []
            };

            await createNewVersion(versionPayload);
            setNewVersion({ doses: [], catchUpRules: [] });
            setCopyFromVersionId('');
            setActiveTab('latest');
        } catch (error) {
            // Error handling already done in createNewVersion
        }
    };

    // Quick Add functions for current version
    const [quickAddDose, setQuickAddDose] = useState({
        vaccineTypeId: '',
        doseNumber: 1,
        recommendedAtDays: '',
        recommendedAtWeeks: '',
        recommendedAtMonths: '',
        recommendedAtYears: '',
        isBooster: false,
        show: false
    });

    const [quickAddRule, setQuickAddRule] = useState({
        vaccineTypeId: '',
        maxAgeMonths: '',
        minIntervalWeeks: '',
        totalDoses: 1,
        show: false
    });

    const handleQuickAddDose = async () => {
        if (!quickAddDose.vaccineTypeId || !quickAddDose.doseNumber) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const latestVersion = getLatestVersion();
            const baseDoses = latestVersion ? latestVersion.doses.map(d => ({
                vaccineTypeId: d.vaccineTypeId,
                doseNumber: d.doseNumber,
                recommendedAtDays: d.recommendedAtDays,
                recommendedAtWeeks: d.recommendedAtWeeks,
                recommendedAtMonths: d.recommendedAtMonths,
                recommendedAtYears: d.recommendedAtYears,
                isBooster: d.isBooster
            })) : [];

            const newDose = {
                vaccineTypeId: parseInt(quickAddDose.vaccineTypeId),
                doseNumber: parseInt(quickAddDose.doseNumber),
                recommendedAtDays: quickAddDose.recommendedAtDays ? parseInt(quickAddDose.recommendedAtDays) : null,
                recommendedAtWeeks: quickAddDose.recommendedAtWeeks ? parseInt(quickAddDose.recommendedAtWeeks) : null,
                recommendedAtMonths: quickAddDose.recommendedAtMonths ? parseInt(quickAddDose.recommendedAtMonths) : null,
                recommendedAtYears: quickAddDose.recommendedAtYears ? parseFloat(quickAddDose.recommendedAtYears) : null,
                isBooster: Boolean(quickAddDose.isBooster)
            };

            const payload = {
                copyFromVersionId: latestVersion ? latestVersion.id : null,
                doses: [...baseDoses, newDose],
                catchUpRules: latestVersion ? latestVersion.catchUpRules : []
            };

            await createNewVersion(payload);
            setQuickAddDose({
                vaccineTypeId: '',
                doseNumber: 1,
                recommendedAtDays: '',
                recommendedAtWeeks: '',
                recommendedAtMonths: '',
                recommendedAtYears: '',
                isBooster: false,
                show: false
            });
        } catch (error) {
            console.error('Failed to add dose:', error);
            showNotification('Failed to add dose. Please try again.', 'error');
        }
    };

    const handleQuickAddRule = async () => {
        if (!quickAddRule.vaccineTypeId || !quickAddRule.totalDoses) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const latestVersion = getLatestVersion();
            const baseRules = latestVersion ? latestVersion.catchUpRules.map(r => ({
                vaccineTypeId: r.vaccineTypeId,
                maxAgeDays: r.maxAgeDays,
                maxAgeWeeks: r.maxAgeWeeks,
                maxAgeMonths: r.maxAgeMonths,
                maxAgeYears: r.maxAgeYears,
                minIntervalWeeks: r.minIntervalWeeks,
                totalDoses: r.totalDoses
            })) : [];

            const newRule = {
                vaccineTypeId: parseInt(quickAddRule.vaccineTypeId),
                maxAgeMonths: quickAddRule.maxAgeMonths ? parseInt(quickAddRule.maxAgeMonths) : null,
                minIntervalWeeks: quickAddRule.minIntervalWeeks ? parseInt(quickAddRule.minIntervalWeeks) : null,
                totalDoses: parseInt(quickAddRule.totalDoses)
            };

            const payload = {
                copyFromVersionId: latestVersion ? latestVersion.id : null,
                doses: latestVersion ? latestVersion.doses : [],
                catchUpRules: [...baseRules, newRule]
            };

            await createNewVersion(payload);
            setQuickAddRule({
                vaccineTypeId: '',
                maxAgeMonths: '',
                minIntervalWeeks: '',
                totalDoses: 1,
                show: false
            });
        } catch (error) {
            console.error('Failed to add rule:', error);
            showNotification('Failed to add rule. Please try again.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-base-content/70">Loading vaccine schedule data...</p>
                </div>
            </div>
        );
    }

    const latestVersion = getLatestVersion();

    return (
        <div className="min-h-screen bg-base-100">
            {/* Notification */}
            {notification.show && (
                <div className={`alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'} fixed top-4 right-4 z-50 w-auto max-w-md shadow-lg`}>
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="container mx-auto p-6">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-base-content mb-2 flex items-center justify-center gap-3">
                        <Shield className="w-10 h-10 text-primary" />
                        Vaccine Schedule Manager
                    </h1>
                    <p className="text-base-content/70 text-lg">Manage vaccination schedules and catch-up rules for optimal immunization coverage</p>
                </div>

                {/* Centralized Confirmation Modal */}
                {confirmAction.type && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className={`font-bold text-lg ${confirmAction.buttonClass === 'btn-error' ? 'text-error' : 'text-warning'}`}>Confirm Action</h3>
                            <p className="py-4">{confirmAction.message}</p>
                            <div className="modal-action">
                                <button
                                    className={`btn ${confirmAction.buttonClass} ${saving ? 'loading' : ''}`}
                                    onClick={handleExecuteAction}
                                    disabled={saving}
                                >
                                    {saving ? 'Processing...' : confirmAction.confirmText}
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={handleCancelAction}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* New Vaccine Type Modal */}
                {showNewVaccineModal && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Create New Vaccine Type</h3>
                            <div className="py-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Vaccine Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        placeholder="e.g. COVID-19"
                                        value={newVaccineType.name}
                                        onChange={(e) => setNewVaccineType(prev => ({ ...prev, name: e.target.value }))}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCreateVaccineType()}
                                    />
                                </div>
                                <div className="form-control mt-4">
                                    <label className="cursor-pointer label">
                                        <span className="label-text font-medium">Active</span>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            checked={newVaccineType.isActive}
                                            onChange={(e) => setNewVaccineType(prev => ({ ...prev, isActive: e.target.checked }))}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="modal-action">
                                <button
                                    className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                    onClick={handleCreateVaccineType}
                                    disabled={!newVaccineType.name.trim() || saving}
                                >
                                    {!saving && <Plus className="w-4 h-4 mr-2" />}
                                    {saving ? 'Creating...' : 'Create Vaccine Type'}
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setShowNewVaccineModal(false);
                                        setNewVaccineType({ name: '', isActive: true });
                                    }}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Add Dose Modal */}
                {quickAddDose.show && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Add New Dose to Current Schedule</h3>
                            <div className="py-4 space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Vaccine Type *</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            className="select select-bordered flex-1"
                                            value={quickAddDose.vaccineTypeId}
                                            onChange={(e) => setQuickAddDose(prev => ({ ...prev, vaccineTypeId: e.target.value }))}
                                        >
                                            <option value="">Select vaccine</option>
                                            {vaccineTypes.filter(vt => vt.isActive).map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-primary tooltip"
                                            data-tip="Add new vaccine type"
                                            onClick={() => setShowNewVaccineModal(true)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Dose Number *</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            value={quickAddDose.doseNumber}
                                            onChange={(e) => setQuickAddDose(prev => ({ ...prev, doseNumber: parseInt(e.target.value) }))}
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="cursor-pointer label">
                                            <span className="label-text font-medium">Is Booster</span>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={quickAddDose.isBooster}
                                                onChange={(e) => setQuickAddDose(prev => ({ ...prev, isBooster: e.target.checked }))}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="divider">Recommended Age</div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-xs">Days</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="input input-bordered input-sm"
                                            value={quickAddDose.recommendedAtDays}
                                            onChange={(e) => setQuickAddDose(prev => ({ ...prev, recommendedAtDays: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-xs">Weeks</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="input input-bordered input-sm"
                                            value={quickAddDose.recommendedAtWeeks}
                                            onChange={(e) => setQuickAddDose(prev => ({ ...prev, recommendedAtWeeks: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-xs">Months</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="input input-bordered input-sm"
                                            value={quickAddDose.recommendedAtMonths}
                                            onChange={(e) => setQuickAddDose(prev => ({ ...prev, recommendedAtMonths: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label py-1">
                                            <span className="label-text text-xs">Years</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            className="input input-bordered input-sm"
                                            value={quickAddDose.recommendedAtYears}
                                            onChange={(e) => setQuickAddDose(prev => ({ ...prev, recommendedAtYears: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-action">
                                <button
                                    className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                    onClick={handleQuickAddDose}
                                    disabled={!quickAddDose.vaccineTypeId || saving}
                                >
                                    {!saving && <Plus className="w-4 h-4 mr-2" />}
                                    {saving ? 'Adding...' : 'Add Dose'}
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setQuickAddDose(prev => ({ ...prev, show: false }))}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Add Rule Modal */}
                {quickAddRule.show && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Add New Catch-up Rule</h3>
                            <div className="py-4 space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Vaccine Type *</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            className="select select-bordered flex-1"
                                            value={quickAddRule.vaccineTypeId}
                                            onChange={(e) => setQuickAddRule(prev => ({ ...prev, vaccineTypeId: e.target.value }))}
                                        >
                                            <option value="">Select vaccine</option>
                                            {vaccineTypes.filter(vt => vt.isActive).map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-primary tooltip"
                                            data-tip="Add new vaccine type"
                                            onClick={() => setShowNewVaccineModal(true)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="form-control col-span-2">
                                        <label className="label">
                                            <span className="label-text font-medium">Max Age (Months)</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            value={quickAddRule.maxAgeMonths}
                                            onChange={(e) => setQuickAddRule(prev => ({ ...prev, maxAgeMonths: e.target.value }))}
                                            placeholder="Enter max age"
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Min Interval (Weeks)</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            value={quickAddRule.minIntervalWeeks}
                                            onChange={(e) => setQuickAddRule(prev => ({ ...prev, minIntervalWeeks: e.target.value }))}
                                            placeholder="Enter interval"
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Total Doses *</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            value={quickAddRule.totalDoses}
                                            onChange={(e) => setQuickAddRule(prev => ({ ...prev, totalDoses: e.target.value }))}
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-action">
                                <button
                                    className={`btn btn-warning ${saving ? 'loading' : ''}`}
                                    onClick={handleQuickAddRule}
                                    disabled={!quickAddRule.vaccineTypeId || saving}
                                >
                                    {!saving && <Plus className="w-4 h-4 mr-2" />}
                                    {saving ? 'Adding...' : 'Add Rule'}
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setQuickAddRule(prev => ({ ...prev, show: false }))}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Tab Navigation */}
                <div role="tablist" className="tabs tabs-boxed mb-8">
                    <a role="tab" className={`tab ${activeTab === 'latest' ? 'tab-active' : ''}`} onClick={() => setActiveTab('latest')} > Current Schedule </a>
                    <a role="tab" className={`tab ${activeTab === 'create' ? 'tab-active' : ''}`} onClick={() => setActiveTab('create')} > Create New Version </a>
                    <a role="tab" className={`tab ${activeTab === 'history' ? 'tab-active' : ''}`} onClick={() => setActiveTab('history')} > Version History </a>
                    <a role="tab" className={`tab ${activeTab === 'types' ? 'tab-active' : ''}`} onClick={() => setActiveTab('types')}>
                        Vaccine Types
                    </a>
                </div>

                {/* Tab Content */}
                {activeTab === 'latest' && (
                    <>
                        {latestVersion ? (
                            <>
                                {/* Quick Actions */}
                                <div className="flex justify-end gap-2 mb-4">
                                    <button className="btn btn-outline btn-primary" onClick={() => setQuickAddDose(prev => ({ ...prev, show: true }))} >
                                        <Plus className="w-4 h-4" /> Add Dose
                                    </button>
                                    <button className="btn btn-outline btn-warning" onClick={() => setQuickAddRule(prev => ({ ...prev, show: true }))} >
                                        <Plus className="w-4 h-4" /> Add Catch-up Rule
                                    </button>
                                </div>

                                {/* Vaccination Schedule */}
                                <div className="card bg-base-200 shadow-xl">
                                    <div className="card-body">
                                        <h3 className="card-title text-2xl mb-6 flex items-center gap-2">
                                            <Calendar className="w-6 h-6 text-secondary" /> Vaccination Schedule ({Array.isArray(latestVersion.doses) ? latestVersion.doses.length : 0} doses)
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra w-full">
                                                <thead>
                                                    <tr className="text-base">
                                                        <th>Vaccine</th>
                                                        <th>Dose Number</th>
                                                        <th>Recommended Age</th>
                                                        <th>Type</th>
                                                        <th className="text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(latestVersion.doses) && latestVersion.doses.map(dose => (
                                                        <tr key={dose.id} className="hover">
                                                            <td>
                                                                {editingDose === dose.id ? (
                                                                    <select className="select select-bordered w-full max-w-xs" value={editValues.vaccineTypeId} onChange={(e) => updateEditValue('vaccineTypeId', parseInt(e.target.value))} >
                                                                        {vaccineTypes.filter(vt => vt.isActive).map(type => (
                                                                            <option key={type.id} value={type.id}>{type.name}</option>
                                                                        ))}
                                                                    </select>
                                                                ) : (
                                                                    <div className="font-semibold text-lg">{dose.vaccineName}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingDose === dose.id ? (
                                                                    <input type="number" className="input input-bordered w-20" value={editValues.doseNumber} onChange={(e) => updateEditValue('doseNumber', parseInt(e.target.value))} min="1" />
                                                                ) : (
                                                                    <div className="badge badge-outline badge-lg"> #{dose.doseNumber} </div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingDose === dose.id ? (
                                                                    <div className="flex flex-wrap gap-2">
                                                                        <div className="form-control">
                                                                            <label className="label py-1">
                                                                                <span className="label-text text-xs">Days</span>
                                                                            </label>
                                                                            <input type="number" placeholder="0" className="input input-bordered input-sm w-16" value={editValues.recommendedAtDays} onChange={(e) => updateEditValue('recommendedAtDays', e.target.value ? parseInt(e.target.value) : '')} />
                                                                        </div>
                                                                        <div className="form-control">
                                                                            <label className="label py-1">
                                                                                <span className="label-text text-xs">Weeks</span>
                                                                            </label>
                                                                            <input type="number" placeholder="0" className="input input-bordered input-sm w-16" value={editValues.recommendedAtWeeks} onChange={(e) => updateEditValue('recommendedAtWeeks', e.target.value ? parseInt(e.target.value) : '')} />
                                                                        </div>
                                                                        <div className="form-control">
                                                                            <label className="label py-1">
                                                                                <span className="label-text text-xs">Months</span>
                                                                            </label>
                                                                            <input type="number" placeholder="0" className="input input-bordered input-sm w-16" value={editValues.recommendedAtMonths} onChange={(e) => updateEditValue('recommendedAtMonths', e.target.value ? parseInt(e.target.value) : '')} />
                                                                        </div>
                                                                        <div className="form-control">
                                                                            <label className="label py-1">
                                                                                <span className="label-text text-xs">Years</span>
                                                                            </label>
                                                                            <input type="number" step="0.1" placeholder="0" className="input input-bordered input-sm w-16" value={editValues.recommendedAtYears} onChange={(e) => updateEditValue('recommendedAtYears', e.target.value ? parseFloat(e.target.value) : '')} />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="font-medium">{formatAge(dose)}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingDose === dose.id ? (
                                                                    <div className="form-control">
                                                                        <label className="cursor-pointer label">
                                                                            <span className="label-text mr-2">Booster</span>
                                                                            <input type="checkbox" className="checkbox checkbox-primary" checked={editValues.isBooster} onChange={(e) => updateEditValue('isBooster', e.target.checked)} />
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    dose.isBooster ? (
                                                                        <div className="badge badge-secondary badge-lg">Booster</div>
                                                                    ) : (
                                                                        <div className="badge badge-primary badge-lg">Primary</div>
                                                                    )
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="flex gap-2 justify-center">
                                                                    {editingDose === dose.id ? (
                                                                        <>
                                                                            <button className="btn btn-success btn-sm tooltip" data-tip="Save Changes" onClick={handleSaveDose}>
                                                                                <Save className="w-4 h-4" />
                                                                            </button>
                                                                            <button className="btn btn-ghost btn-sm tooltip" data-tip="Cancel" onClick={handleCancelEdit}>
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button className="btn btn-primary btn-sm tooltip" data-tip="Edit Dose" onClick={() => handleEditDose(dose)}>
                                                                                <Edit2 className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-error btn-sm tooltip"
                                                                                data-tip="Delete Dose"
                                                                                onClick={() => handleConfirmAction('deleteDose', dose.id)}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Catch-up Rules */}
                                <div className="card bg-base-200 shadow-xl mt-6">
                                    <div className="card-body">
                                        <h3 className="card-title text-2xl mb-6 flex items-center gap-2">
                                            <AlertCircle className="w-6 h-6 text-warning" /> Catch-up Rules ({Array.isArray(latestVersion.catchUpRules) ? latestVersion.catchUpRules.length : 0} rules)
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra w-full">
                                                <thead>
                                                    <tr className="text-base">
                                                        <th>Vaccine</th>
                                                        <th>Max Age</th>
                                                        <th>Min Interval</th>
                                                        <th>Total Doses</th>
                                                        <th className="text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.isArray(latestVersion.catchUpRules) && latestVersion.catchUpRules.map(rule => (
                                                        <tr key={rule.id} className="hover">
                                                            <td>
                                                                {editingRule === rule.id ? (
                                                                    <select className="select select-bordered w-full max-w-xs" value={editValues.vaccineTypeId} onChange={(e) => updateEditValue('vaccineTypeId', parseInt(e.target.value))} >
                                                                        {vaccineTypes.filter(vt => vt.isActive).map(type => (
                                                                            <option key={type.id} value={type.id}>{type.name}</option>
                                                                        ))}
                                                                    </select>
                                                                ) : (
                                                                    <div className="font-semibold text-lg">{rule.vaccineName}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingRule === rule.id ? (
                                                                    <div className="form-control">
                                                                        <label className="label py-1">
                                                                            <span className="label-text text-xs">Months</span>
                                                                        </label>
                                                                        <input type="number" className="input input-bordered input-sm" value={editValues.maxAgeMonths} onChange={(e) => updateEditValue('maxAgeMonths', e.target.value ? parseInt(e.target.value) : '')} placeholder="N/A" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="font-medium">{formatMaxAge(rule)}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingRule === rule.id ? (
                                                                    <div className="form-control">
                                                                        <label className="label py-1">
                                                                            <span className="label-text text-xs">Weeks</span>
                                                                        </label>
                                                                        <input type="number" className="input input-bordered input-sm" value={editValues.minIntervalWeeks} onChange={(e) => updateEditValue('minIntervalWeeks', e.target.value ? parseInt(e.target.value) : '')} placeholder="N/A" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="font-medium">{rule.minIntervalWeeks ? `${rule.minIntervalWeeks} weeks` : 'None'}</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {editingRule === rule.id ? (
                                                                    <input type="number" className="input input-bordered w-20" value={editValues.totalDoses} onChange={(e) => updateEditValue('totalDoses', parseInt(e.target.value))} min="1" />
                                                                ) : (
                                                                    <div className="badge badge-outline badge-lg">{rule.totalDoses} doses</div>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="flex gap-2 justify-center">
                                                                    {editingRule === rule.id ? (
                                                                        <>
                                                                            <button className="btn btn-success btn-sm tooltip" data-tip="Save Changes" onClick={handleSaveCatchUpRule}>
                                                                                <Save className="w-4 h-4" />
                                                                            </button>
                                                                            <button className="btn btn-ghost btn-sm tooltip" data-tip="Cancel" onClick={handleCancelEdit}>
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button className="btn btn-primary btn-sm tooltip" data-tip="Edit Rule" onClick={() => handleEditCatchUpRule(rule)}>
                                                                                <Edit2 className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-error btn-sm tooltip"
                                                                                data-tip="Delete Rule"
                                                                                onClick={() => handleConfirmAction('deleteRule', rule.id)}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-base-content/70 py-16">
                                <AlertCircle className="w-20 h-20 mx-auto mb-6 opacity-30" />
                                <h3 className="text-2xl font-semibold mb-4">No Current Schedule</h3>
                                <p className="text-lg">Start by creating a new version to manage doses and catch-up rules</p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'create' && (
                    <div className="card bg-base-200 shadow-xl p-6">
                        {/* New Version Form */}
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-primary" /> Create New Schedule Version
                        </h3>
                        <p className="text-base-content/70 mb-4">
                            Create a new version of the vaccine schedule. You can start from a blank slate or copy an existing version as a starting point.
                        </p>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Copy from existing version (optional)</span>
                            </label>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={copyFromVersionId}
                                onChange={(e) => setCopyFromVersionId(e.target.value)}
                            >
                                <option value="">Select a version</option>
                                {versions.map(version => (
                                    <option key={version.id} value={version.id}>
                                        Version {version.id} (Created: {new Date(version.createdAt).toLocaleDateString()})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="divider">Doses</div>
                        {newVersion.doses.map((dose, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 border rounded-lg border-base-content/20">
                                <div className="flex-1 space-y-2 w-full">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Vaccine Type *</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={dose.vaccineTypeId}
                                            onChange={(e) => updateDose(index, 'vaccineTypeId', e.target.value)}
                                        >
                                            <option value="">Select vaccine</option>
                                            {vaccineTypes.filter(vt => vt.isActive).map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="form-control flex-1">
                                            <label className="label">
                                                <span className="label-text">Dose Number *</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={dose.doseNumber}
                                                onChange={(e) => updateDose(index, 'doseNumber', parseInt(e.target.value))}
                                                min="1"
                                            />
                                        </div>
                                        <div className="form-control flex-1">
                                            <label className="cursor-pointer label">
                                                <span className="label-text">Is Booster</span>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-primary"
                                                    checked={dose.isBooster}
                                                    onChange={(e) => updateDose(index, 'isBooster', e.target.checked)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="divider text-sm">Recommended Age (optional)</div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <div className="form-control">
                                            <label className="label py-1 text-xs">Days</label>
                                            <input
                                                type="number"
                                                className="input input-bordered input-sm"
                                                value={dose.recommendedAtDays}
                                                onChange={(e) => updateDose(index, 'recommendedAtDays', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label py-1 text-xs">Weeks</label>
                                            <input
                                                type="number"
                                                className="input input-bordered input-sm"
                                                value={dose.recommendedAtWeeks}
                                                onChange={(e) => updateDose(index, 'recommendedAtWeeks', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label py-1 text-xs">Months</label>
                                            <input
                                                type="number"
                                                className="input input-bordered input-sm"
                                                value={dose.recommendedAtMonths}
                                                onChange={(e) => updateDose(index, 'recommendedAtMonths', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label py-1 text-xs">Years</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="input input-bordered input-sm"
                                                value={dose.recommendedAtYears}
                                                onChange={(e) => updateDose(index, 'recommendedAtYears', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-error md:self-start md:mt-10" onClick={() => removeDose(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button className="btn btn-outline btn-sm btn-primary mt-2" onClick={addNewDose}>
                            <Plus className="w-4 h-4" /> Add New Dose
                        </button>

                        <div className="divider">Catch-Up Rules</div>
                        {newVersion.catchUpRules.map((rule, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 border rounded-lg border-base-content/20">
                                <div className="flex-1 space-y-2 w-full">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Vaccine Type *</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={rule.vaccineTypeId}
                                            onChange={(e) => updateCatchUpRule(index, 'vaccineTypeId', e.target.value)}
                                        >
                                            <option value="">Select vaccine</option>
                                            {vaccineTypes.filter(vt => vt.isActive).map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Max Age (Months)</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={rule.maxAgeMonths}
                                                onChange={(e) => updateCatchUpRule(index, 'maxAgeMonths', e.target.value)}
                                                placeholder="Enter max age"
                                                min="1"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Min Interval (Weeks)</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={rule.minIntervalWeeks}
                                                onChange={(e) => updateCatchUpRule(index, 'minIntervalWeeks', e.target.value)}
                                                placeholder="Enter interval"
                                                min="1"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Total Doses *</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={rule.totalDoses}
                                                onChange={(e) => updateCatchUpRule(index, 'totalDoses', e.target.value)}
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-sm btn-error md:self-start md:mt-10" onClick={() => removeCatchUpRule(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button className="btn btn-outline btn-sm btn-warning mt-2" onClick={addNewCatchUpRule}>
                            <Plus className="w-4 h-4" /> Add New Catch-up Rule
                        </button>
                        <div className="modal-action mt-6">
                            <button
                                className={`btn btn-primary btn-block md:btn-wide ${saving ? 'loading' : ''}`}
                                onClick={handleSaveNewVersion}
                                disabled={saving}
                            >
                                {!saving && <Save className="w-4 h-4 mr-2" />}
                                {saving ? 'Creating Version...' : 'Save New Version'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="mt-8">
                        {versions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {versions.map(version => (
                                    <div key={version.id} className="card bg-base-200 shadow-xl">
                                        <div className="card-body">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-5 h-5 text-accent" />
                                                <h4 className="card-title text-xl">Version {version.id}</h4>
                                            </div>
                                            <p className="text-sm text-base-content/70">
                                                Created: {new Date(version.createdAt).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-base-content/70">
                                                Last Modified: {new Date(version.updatedAt).toLocaleString()}
                                            </p>
                                            {version.copiedFromVersionId && (
                                                <p className="text-sm text-base-content/70">
                                                    Copied from: Version {version.copiedFromVersionId}
                                                </p>
                                            )}
                                            <div className="mt-4">
                                                <h5 className="font-semibold mb-1">Doses ({version.doses.length})</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {version.doses?.slice(0, 3).map(dose => (
                                                        <div key={dose.id} className="badge badge-lg badge-outline badge-primary">
                                                            {dose.vaccineName} #{dose.doseNumber}
                                                        </div>
                                                    ))}
                                                </div>
                                                {version.doses?.length > 3 && (
                                                    <div className="text-xs text-center text-base-content/50 py-2">
                                                        +{version.doses.length - 3} more doses...
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4">
                                                <h5 className="font-semibold mb-1">Catch-up Rules ({version.catchUpRules.length})</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {version.catchUpRules?.slice(0, 3).map(rule => (
                                                        <div key={rule.id} className="badge badge-lg badge-outline badge-warning">
                                                            {rule.vaccineName} ({rule.totalDoses} doses)
                                                        </div>
                                                    ))}
                                                </div>
                                                {version.catchUpRules?.length > 3 && (
                                                    <div className="text-xs text-center text-base-content/50 py-2">
                                                        +{version.catchUpRules.length - 3} more rules...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-base-content/70 py-16">
                                <Calendar className="w-20 h-20 mx-auto mb-6 opacity-30" />
                                <h3 className="text-2xl font-semibold mb-4">No Version History</h3>
                                <p className="text-lg">Create your first vaccine schedule to start tracking versions</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'types' && (
                    <div className="card bg-base-200 shadow-xl mt-6">
                        <div className="card-body">
                            <h3 className="card-title text-2xl mb-6 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-primary" /> Manage Vaccine Types
                            </h3>
                            <div className="flex justify-end mb-4">
                                <button className="btn btn-primary" onClick={() => setShowNewVaccineModal(true)}>
                                    <Plus className="w-4 h-4" /> Add New Vaccine Type
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="text-base">
                                            <th>Vaccine Name</th>
                                            <th>Status</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(vaccineTypes) && vaccineTypes.map(type => (
                                            <tr key={type.id} className="hover">
                                                <td className="font-semibold">{type.name}</td>
                                                <td>
                                                    {type.isActive ? (
                                                        <div className="badge badge-success badge-lg">Active</div>
                                                    ) : (
                                                        <div className="badge badge-error badge-lg">Inactive</div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2 justify-center">
                                                        <div className="tooltip" data-tip={type.isActive ? 'Disable' : 'Enable'}>
                                                            <button
                                                                className={`btn btn-sm ${type.isActive ? 'btn-warning' : 'btn-success'}`}
                                                                onClick={() => handleConfirmAction(type.isActive ? 'disableType' : 'enableType', type.id)}
                                                            >
                                                                {type.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                        <div className="tooltip" data-tip="Delete">
                                                            <button
                                                                className="btn btn-sm btn-error"
                                                                onClick={() => handleConfirmAction('deleteType', type.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaccineScheduleManager;