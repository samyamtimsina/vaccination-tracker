import React, { useEffect, useState } from "react";
import { Plus, Loader, CheckCircle, Edit, Calendar, Syringe, Clock, AlertTriangle, Search, Save, X, Trash2, Eye } from "lucide-react";

export default function SuperAdminSchedulePage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        versionName: "",
        doses: [],
        catchUpRules: []
    });

    const fetchSchedules = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/vaccine-schedule/all", {
                credentials: "include",
            });
            const data = await res.json();
            console.log("Fetched schedules:", data);

            // Add version names if not present
            const schedulesWithNames = data.map((schedule, index) => ({
                ...schedule,
                versionName: schedule.versionName || `Vaccine Schedule ${schedule.id || index + 1}`
            }));

            setSchedules(schedulesWithNames);
        } catch (err) {
            console.error("Error fetching schedules:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const formatAge = (dose) => {
        if (dose.recommendedAtDays !== null) {
            return dose.recommendedAtDays === 0 ? "Birth" : `${dose.recommendedAtDays} days`;
        }
        if (dose.recommendedAtWeeks !== null) {
            return `${dose.recommendedAtWeeks} weeks`;
        }
        if (dose.recommendedAtMonths !== null) {
            return `${dose.recommendedAtMonths} months`;
        }
        if (dose.recommendedAtYears !== null) {
            return `${dose.recommendedAtYears} years`;
        }
        return "N/A";
    };

    const getVaccineTypeColor = (type) => {
        const colors = {
            "BCG": "badge-primary",
            "DPT_HEPB_HIB": "badge-secondary",
            "ROTA": "badge-accent",
            "OPV": "badge-info",
            "FIPV": "badge-success",
            "PCV": "badge-warning",
            "MR": "badge-error",
            "JE": "badge-neutral",
            "TCV": "badge-ghost",
            "HPV": "badge-outline"
        };
        return colors[type] || "badge-outline";
    };

    const groupDosesByVaccine = (doses) => {
        return doses.reduce((acc, dose) => {
            if (!acc[dose.vaccineType]) {
                acc[dose.vaccineType] = [];
            }
            acc[dose.vaccineType].push(dose);
            return acc;
        }, {});
    };

    const formatCatchUpRule = (rule) => {
        let ruleText = `${rule.vaccineType.replace(/_/g, '-')}: `;

        if (rule.maxAgeDays) ruleText += `Max ${rule.maxAgeDays} days, `;
        else if (rule.maxAgeWeeks) ruleText += `Max ${rule.maxAgeWeeks} weeks, `;
        else if (rule.maxAgeMonths) ruleText += `Max ${rule.maxAgeMonths} months, `;
        else if (rule.maxAgeYears) ruleText += `Max ${rule.maxAgeYears} years, `;

        ruleText += `${rule.totalDoses} doses total`;

        if (rule.minIntervalWeeks) {
            ruleText += `, min ${rule.minIntervalWeeks} weeks interval`;
        }

        return ruleText;
    };

    const startEdit = (schedule) => {
        setEditingSchedule({ ...schedule });
    };

    const saveEdit = async () => {
        try {
            // Here you would make the API call to save the edited schedule
            console.log("Saving schedule:", editingSchedule);

            // Update local state
            setSchedules(schedules.map(s =>
                s.id === editingSchedule.id ? editingSchedule : s
            ));

            setEditingSchedule(null);
        } catch (err) {
            console.error("Error saving schedule:", err);
        }
    };

    const cancelEdit = () => {
        setEditingSchedule(null);
    };

    const addDose = (scheduleId) => {
        const newDose = {
            id: Date.now(), // Temporary ID
            vaccineType: "",
            doseNumber: 1,
            recommendedAtDays: null,
            recommendedAtWeeks: null,
            recommendedAtMonths: null,
            recommendedAtYears: null,
            isBooster: false,
            scheduleVersionId: scheduleId
        };

        if (editingSchedule && editingSchedule.id === scheduleId) {
            setEditingSchedule({
                ...editingSchedule,
                doses: [...editingSchedule.doses, newDose]
            });
        }
    };

    const removeDose = (scheduleId, doseId) => {
        if (editingSchedule && editingSchedule.id === scheduleId) {
            setEditingSchedule({
                ...editingSchedule,
                doses: editingSchedule.doses.filter(d => d.id !== doseId)
            });
        }
    };

    const updateDose = (scheduleId, doseId, field, value) => {
        if (editingSchedule && editingSchedule.id === scheduleId) {
            setEditingSchedule({
                ...editingSchedule,
                doses: editingSchedule.doses.map(d =>
                    d.id === doseId ? { ...d, [field]: value } : d
                )
            });
        }
    };

    const addCatchUpRule = (scheduleId) => {
        const newRule = {
            id: Date.now(),
            vaccineType: "",
            maxAgeDays: null,
            maxAgeWeeks: null,
            maxAgeMonths: null,
            maxAgeYears: null,
            minIntervalWeeks: null,
            totalDoses: 1,
            scheduleVersionId: scheduleId
        };

        if (editingSchedule && editingSchedule.id === scheduleId) {
            setEditingSchedule({
                ...editingSchedule,
                catchUpRules: [...editingSchedule.catchUpRules, newRule]
            });
        }
    };

    const removeCatchUpRule = (scheduleId, ruleId) => {
        if (editingSchedule && editingSchedule.id === scheduleId) {
            setEditingSchedule({
                ...editingSchedule,
                catchUpRules: editingSchedule.catchUpRules.filter(r => r.id !== ruleId)
            });
        }
    };

    const updateCatchUpRule = (scheduleId, ruleId, field, value) => {
        if (editingSchedule && editingSchedule.id === scheduleId) {
            setEditingSchedule({
                ...editingSchedule,
                catchUpRules: editingSchedule.catchUpRules.map(r =>
                    r.id === ruleId ? { ...r, [field]: value } : r
                )
            });
        }
    };

    const createNewSchedule = async () => {
        try {
            console.log("Creating new schedule:", newSchedule);

            // Simulate API call
            const createdSchedule = {
                ...newSchedule,
                id: Date.now(),
                lastModifiedAt: new Date().toISOString(),
                lastModifiedBy: 4
            };

            setSchedules([...schedules, createdSchedule]);
            setNewSchedule({ versionName: "", doses: [], catchUpRules: [] });
            setShowAddModal(false);
        } catch (err) {
            console.error("Error creating schedule:", err);
        }
    };

    const filteredSchedules = schedules.filter(schedule =>
        schedule.versionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.id.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center space-y-4">
                    <Loader className="animate-spin text-6xl text-primary mx-auto" />
                    <p className="text-lg">Loading vaccine schedules...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-content">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                <Syringe className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Vaccine Schedule Management</h1>
                                <p className="text-lg opacity-90">Manage immunization schedules and catch-up rules</p>
                            </div>
                        </div>
                        <div className="stats shadow bg-white bg-opacity-20">
                            <div className="stat">
                                <div className="stat-title text-primary-content opacity-80">Total Schedules</div>
                                <div className="stat-value text-primary-content">{schedules.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-60" size={20} />
                        <input
                            type="text"
                            placeholder="Search schedules..."
                            className="input input-bordered w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary gap-2"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus size={20} />
                        Add New Schedule
                    </button>
                </div>

                {/* Schedules Grid */}
                <div className="grid gap-8">
                    {filteredSchedules.map((schedule) => {
                        const isEditing = editingSchedule && editingSchedule.id === schedule.id;
                        const currentSchedule = isEditing ? editingSchedule : schedule;
                        const groupedDoses = groupDosesByVaccine(currentSchedule.doses);
                        const primaryDoses = currentSchedule.doses.filter(d => !d.isBooster);
                        const catchUpDoses = currentSchedule.doses.filter(d => d.isBooster);

                        return (
                            <div key={schedule.id} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow">
                                <div className="card-body">
                                    {/* Schedule Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className="input input-bordered text-2xl font-bold w-full"
                                                    value={currentSchedule.versionName}
                                                    onChange={(e) => setEditingSchedule({
                                                        ...editingSchedule,
                                                        versionName: e.target.value
                                                    })}
                                                />
                                            ) : (
                                                <h2 className="card-title text-2xl flex items-center gap-2">
                                                    <CheckCircle className="text-success" size={24} />
                                                    {schedule.versionName}
                                                </h2>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-sm opacity-70">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    Modified: {new Date(schedule.lastModifiedAt).toLocaleDateString()}
                                                </span>
                                                <span className="badge badge-outline">ID: {schedule.id}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        className="btn btn-success btn-sm gap-2"
                                                        onClick={saveEdit}
                                                    >
                                                        <Save size={16} />
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-outline btn-sm gap-2"
                                                        onClick={cancelEdit}
                                                    >
                                                        <X size={16} />
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-outline btn-primary btn-sm gap-2"
                                                        onClick={() => {
                                                            setSelectedSchedule(schedule);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </button>
                                                    <button
                                                        className="btn btn-outline btn-secondary btn-sm gap-2"
                                                        onClick={() => startEdit(schedule)}
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vaccine Overview */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Primary Vaccines */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    <Syringe className="text-primary" size={20} />
                                                    Primary Vaccines ({primaryDoses.length})
                                                </h3>
                                                {isEditing && (
                                                    <button
                                                        className="btn btn-xs btn-primary"
                                                        onClick={() => addDose(schedule.id)}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {primaryDoses.map((dose) => (
                                                    <div key={dose.id} className="p-3 bg-base-200 rounded-lg">
                                                        {isEditing ? (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <select
                                                                        className="select select-xs select-bordered"
                                                                        value={dose.vaccineType}
                                                                        onChange={(e) => updateDose(schedule.id, dose.id, 'vaccineType', e.target.value)}
                                                                    >
                                                                        <option value="">Select Vaccine</option>
                                                                        <option value="BCG">BCG</option>
                                                                        <option value="DPT_HEPB_HIB">DPT-HepB-Hib</option>
                                                                        <option value="ROTA">Rotavirus</option>
                                                                        <option value="OPV">OPV</option>
                                                                        <option value="FIPV">FIPV</option>
                                                                        <option value="PCV">PCV</option>
                                                                        <option value="MR">MR</option>
                                                                        <option value="JE">JE</option>
                                                                        <option value="TCV">TCV</option>
                                                                        <option value="HPV">HPV</option>
                                                                    </select>
                                                                    <button
                                                                        className="btn btn-xs btn-error"
                                                                        onClick={() => removeDose(schedule.id, dose.id)}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <input
                                                                        type="number"
                                                                        className="input input-xs"
                                                                        placeholder="Dose #"
                                                                        value={dose.doseNumber}
                                                                        onChange={(e) => updateDose(schedule.id, dose.id, 'doseNumber', parseInt(e.target.value) || 1)}
                                                                    />
                                                                    <select
                                                                        className="select select-xs"
                                                                        onChange={(e) => {
                                                                            const [field, value] = e.target.value.split(':');
                                                                            // Reset all age fields
                                                                            updateDose(schedule.id, dose.id, 'recommendedAtDays', null);
                                                                            updateDose(schedule.id, dose.id, 'recommendedAtWeeks', null);
                                                                            updateDose(schedule.id, dose.id, 'recommendedAtMonths', null);
                                                                            updateDose(schedule.id, dose.id, 'recommendedAtYears', null);
                                                                            // Set the selected field
                                                                            if (field && value) {
                                                                                updateDose(schedule.id, dose.id, field, parseFloat(value));
                                                                            }
                                                                        }}
                                                                    >
                                                                        <option value="">Select Age</option>
                                                                        <option value="recommendedAtDays:0">Birth</option>
                                                                        <option value="recommendedAtWeeks:6">6 weeks</option>
                                                                        <option value="recommendedAtWeeks:10">10 weeks</option>
                                                                        <option value="recommendedAtWeeks:14">14 weeks</option>
                                                                        <option value="recommendedAtMonths:9">9 months</option>
                                                                        <option value="recommendedAtMonths:12">12 months</option>
                                                                        <option value="recommendedAtMonths:15">15 months</option>
                                                                        <option value="recommendedAtMonths:18">18 months</option>
                                                                        <option value="recommendedAtMonths:24">24 months</option>
                                                                        <option value="recommendedAtYears:5">5 years</option>
                                                                        <option value="recommendedAtYears:10">10 years</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className={`badge ${getVaccineTypeColor(dose.vaccineType)} font-medium`}>
                                                                        {dose.vaccineType.replace(/_/g, '-')}
                                                                    </span>
                                                                    <span className="text-sm opacity-70">
                                                                        Dose {dose.doseNumber}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="badge badge-success badge-sm">
                                                                        {formatAge(dose)}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Catch-up Rules */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    <AlertTriangle className="text-warning" size={20} />
                                                    Catch-up Rules ({currentSchedule.catchUpRules.length})
                                                </h3>
                                                {isEditing && (
                                                    <button
                                                        className="btn btn-xs btn-warning"
                                                        onClick={() => addCatchUpRule(schedule.id)}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {currentSchedule.catchUpRules.map((rule) => (
                                                    <div key={rule.id} className="alert alert-info py-2 text-sm">
                                                        {isEditing ? (
                                                            <div className="w-full space-y-2">
                                                                <div className="flex justify-between">
                                                                    <select
                                                                        className="select select-xs select-bordered flex-1 mr-2"
                                                                        value={rule.vaccineType}
                                                                        onChange={(e) => updateCatchUpRule(schedule.id, rule.id, 'vaccineType', e.target.value)}
                                                                    >
                                                                        <option value="">Select Vaccine</option>
                                                                        <option value="BCG">BCG</option>
                                                                        <option value="DPT_HEPB_HIB">DPT-HepB-Hib</option>
                                                                        <option value="ROTA">Rotavirus</option>
                                                                        <option value="OPV">OPV</option>
                                                                        <option value="FIPV">FIPV</option>
                                                                        <option value="PCV">PCV</option>
                                                                        <option value="MR">MR</option>
                                                                        <option value="JE">JE</option>
                                                                        <option value="TCV">TCV</option>
                                                                        <option value="HPV">HPV</option>
                                                                    </select>
                                                                    <button
                                                                        className="btn btn-xs btn-error"
                                                                        onClick={() => removeCatchUpRule(schedule.id, rule.id)}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-1">
                                                                    <input
                                                                        type="number"
                                                                        className="input input-xs"
                                                                        placeholder="Max months"
                                                                        value={rule.maxAgeMonths || ''}
                                                                        onChange={(e) => updateCatchUpRule(schedule.id, rule.id, 'maxAgeMonths', parseInt(e.target.value) || null)}
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        className="input input-xs"
                                                                        placeholder="Total doses"
                                                                        value={rule.totalDoses}
                                                                        onChange={(e) => updateCatchUpRule(schedule.id, rule.id, 'totalDoses', parseInt(e.target.value) || 1)}
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        className="input input-xs"
                                                                        placeholder="Min weeks"
                                                                        value={rule.minIntervalWeeks || ''}
                                                                        onChange={(e) => updateCatchUpRule(schedule.id, rule.id, 'minIntervalWeeks', parseInt(e.target.value) || null)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className="font-medium">{rule.vaccineType.replace(/_/g, '-')}</div>
                                                                <div className="text-xs opacity-80">
                                                                    {formatCatchUpRule(rule)}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="stats stats-horizontal shadow-sm mt-6 bg-base-200">
                                        <div className="stat">
                                            <div className="stat-title text-xs">Primary Doses</div>
                                            <div className="stat-value text-lg">{primaryDoses.length}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title text-xs">Catch-up Vaccines</div>
                                            <div className="stat-value text-lg">{catchUpDoses.length}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title text-xs">Catch-up Rules</div>
                                            <div className="stat-value text-lg">{currentSchedule.catchUpRules.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredSchedules.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No schedules found</h3>
                        <p className="text-base-content opacity-60">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showModal && selectedSchedule && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-5xl max-h-screen overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">{selectedSchedule.versionName}</h3>
                            <button
                                className="btn btn-sm btn-circle btn-ghost"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Detailed Dose Timeline */}
                            <div>
                                <h4 className="font-semibold mb-3">Complete Vaccination Timeline</h4>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Vaccine</th>
                                                <th>Dose #</th>
                                                <th>Age</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSchedule.doses
                                                .sort((a, b) => {
                                                    const ageA = a.recommendedAtDays || (a.recommendedAtWeeks * 7) || (a.recommendedAtMonths * 30) || (a.recommendedAtYears * 365);
                                                    const ageB = b.recommendedAtDays || (b.recommendedAtWeeks * 7) || (b.recommendedAtMonths * 30) || (b.recommendedAtYears * 365);
                                                    return ageA - ageB;
                                                })
                                                .map((dose) => (
                                                    <tr key={dose.id}>
                                                        <td>
                                                            <span className={`badge ${getVaccineTypeColor(dose.vaccineType)}`}>
                                                                {dose.vaccineType.replace(/_/g, '-')}
                                                            </span>
                                                        </td>
                                                        <td>{dose.doseNumber}</td>
                                                        <td>{formatAge(dose)}</td>
                                                        <td>
                                                            {dose.isBooster ? (
                                                                <span className="badge badge-warning badge-sm">Catch-up</span>
                                                            ) : (
                                                                <span className="badge badge-success badge-sm">Primary</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Detailed Catch-up Rules */}
                            <div>
                                <h4 className="font-semibold mb-3">Catch-up Rules Details</h4>
                                <div className="grid gap-3">
                                    {selectedSchedule.catchUpRules.map((rule) => (
                                        <div key={rule.id} className="card bg-base-200">
                                            <div className="card-body py-3">
                                                <div className="flex items-center justify-between">
                                                    <span className={`badge ${getVaccineTypeColor(rule.vaccineType)} badge-lg`}>
                                                        {rule.vaccineType.replace(/_/g, '-')}
                                                    </span>
                                                    <div className="text-sm space-x-2">
                                                        {rule.maxAgeWeeks && <span className="badge badge-outline">Max: {rule.maxAgeWeeks}w</span>}
                                                        {rule.maxAgeMonths && <span className="badge badge-outline">Max: {rule.maxAgeMonths}m</span>}
                                                        {rule.maxAgeYears && <span className="badge badge-outline">Max: {rule.maxAgeYears}y</span>}
                                                        {rule.totalDoses && <span className="badge badge-outline">Doses: {rule.totalDoses}</span>}
                                                        {rule.minIntervalWeeks && <span className="badge badge-outline">Interval: {rule.minIntervalWeeks}w</span>}
                                                    </div>
                                                </div>
                                                <p className="text-sm mt-2 opacity-80">{formatCatchUpRule(rule)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Schedule Modal */}
            {showAddModal && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Create New Vaccine Schedule</h3>
                            <button
                                className="btn btn-sm btn-circle btn-ghost"
                                onClick={() => setShowAddModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="label">Schedule Name</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Enter schedule name..."
                                    value={newSchedule.versionName}
                                    onChange={(e) => setNewSchedule({
                                        ...newSchedule,
                                        versionName: e.target.value
                                    })}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label">Primary Vaccines</label>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => setNewSchedule({
                                            ...newSchedule,
                                            doses: [...newSchedule.doses, {
                                                id: Date.now(),
                                                vaccineType: "",
                                                doseNumber: 1,
                                                recommendedAtDays: null,
                                                recommendedAtWeeks: null,
                                                recommendedAtMonths: null,
                                                recommendedAtYears: null,
                                                isBooster: false
                                            }]
                                        })}
                                    >
                                        <Plus size={16} />
                                        Add Dose
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {newSchedule.doses.map((dose, index) => (
                                        <div key={dose.id} className="grid grid-cols-5 gap-2 p-2 bg-base-200 rounded">
                                            <select
                                                className="select select-sm select-bordered"
                                                value={dose.vaccineType}
                                                onChange={(e) => {
                                                    const updatedDoses = [...newSchedule.doses];
                                                    updatedDoses[index].vaccineType = e.target.value;
                                                    setNewSchedule({ ...newSchedule, doses: updatedDoses });
                                                }}
                                            >
                                                <option value="">Select Vaccine</option>
                                                <option value="BCG">BCG</option>
                                                <option value="DPT_HEPB_HIB">DPT-HepB-Hib</option>
                                                <option value="ROTA">Rotavirus</option>
                                                <option value="OPV">OPV</option>
                                                <option value="FIPV">FIPV</option>
                                                <option value="PCV">PCV</option>
                                                <option value="MR">MR</option>
                                                <option value="JE">JE</option>
                                                <option value="TCV">TCV</option>
                                                <option value="HPV">HPV</option>
                                            </select>
                                            <input
                                                type="number"
                                                className="input input-sm input-bordered"
                                                placeholder="Dose #"
                                                value={dose.doseNumber}
                                                onChange={(e) => {
                                                    const updatedDoses = [...newSchedule.doses];
                                                    updatedDoses[index].doseNumber = parseInt(e.target.value) || 1;
                                                    setNewSchedule({ ...newSchedule, doses: updatedDoses });
                                                }}
                                            />
                                            <select
                                                className="select select-sm select-bordered col-span-2"
                                                onChange={(e) => {
                                                    const [field, value] = e.target.value.split(':');
                                                    const updatedDoses = [...newSchedule.doses];
                                                    updatedDoses[index].recommendedAtDays = null;
                                                    updatedDoses[index].recommendedAtWeeks = null;
                                                    updatedDoses[index].recommendedAtMonths = null;
                                                    updatedDoses[index].recommendedAtYears = null;
                                                    if (field && value) {
                                                        updatedDoses[index][field] = parseFloat(value);
                                                    }
                                                    setNewSchedule({ ...newSchedule, doses: updatedDoses });
                                                }}
                                            >
                                                <option value="">Select Age</option>
                                                <option value="recommendedAtDays:0">Birth</option>
                                                <option value="recommendedAtWeeks:6">6 weeks</option>
                                                <option value="recommendedAtWeeks:10">10 weeks</option>
                                                <option value="recommendedAtWeeks:14">14 weeks</option>
                                                <option value="recommendedAtMonths:9">9 months</option>
                                                <option value="recommendedAtMonths:12">12 months</option>
                                                <option value="recommendedAtMonths:15">15 months</option>
                                                <option value="recommendedAtMonths:18">18 months</option>
                                                <option value="recommendedAtMonths:24">24 months</option>
                                                <option value="recommendedAtYears:5">5 years</option>
                                                <option value="recommendedAtYears:10">10 years</option>
                                            </select>
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => {
                                                    const updatedDoses = newSchedule.doses.filter((_, i) => i !== index);
                                                    setNewSchedule({ ...newSchedule, doses: updatedDoses });
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="label">Catch-up Rules</label>
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => setNewSchedule({
                                            ...newSchedule,
                                            catchUpRules: [...newSchedule.catchUpRules, {
                                                id: Date.now(),
                                                vaccineType: "",
                                                maxAgeDays: null,
                                                maxAgeWeeks: null,
                                                maxAgeMonths: null,
                                                maxAgeYears: null,
                                                minIntervalWeeks: null,
                                                totalDoses: 1
                                            }]
                                        })}
                                    >
                                        <Plus size={16} />
                                        Add Rule
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {newSchedule.catchUpRules.map((rule, index) => (
                                        <div key={rule.id} className="grid grid-cols-5 gap-2 p-2 bg-base-200 rounded">
                                            <select
                                                className="select select-sm select-bordered"
                                                value={rule.vaccineType}
                                                onChange={(e) => {
                                                    const updatedRules = [...newSchedule.catchUpRules];
                                                    updatedRules[index].vaccineType = e.target.value;
                                                    setNewSchedule({ ...newSchedule, catchUpRules: updatedRules });
                                                }}
                                            >
                                                <option value="">Select Vaccine</option>
                                                <option value="BCG">BCG</option>
                                                <option value="DPT_HEPB_HIB">DPT-HepB-Hib</option>
                                                <option value="ROTA">Rotavirus</option>
                                                <option value="OPV">OPV</option>
                                                <option value="FIPV">FIPV</option>
                                                <option value="PCV">PCV</option>
                                                <option value="MR">MR</option>
                                                <option value="JE">JE</option>
                                                <option value="TCV">TCV</option>
                                                <option value="HPV">HPV</option>
                                            </select>
                                            <input
                                                type="number"
                                                className="input input-sm input-bordered"
                                                placeholder="Max months"
                                                value={rule.maxAgeMonths || ''}
                                                onChange={(e) => {
                                                    const updatedRules = [...newSchedule.catchUpRules];
                                                    updatedRules[index].maxAgeMonths = parseInt(e.target.value) || null;
                                                    setNewSchedule({ ...newSchedule, catchUpRules: updatedRules });
                                                }}
                                            />
                                            <input
                                                type="number"
                                                className="input input-sm input-bordered"
                                                placeholder="Total doses"
                                                value={rule.totalDoses}
                                                onChange={(e) => {
                                                    const updatedRules = [...newSchedule.catchUpRules];
                                                    updatedRules[index].totalDoses = parseInt(e.target.value) || 1;
                                                    setNewSchedule({ ...newSchedule, catchUpRules: updatedRules });
                                                }}
                                            />
                                            <input
                                                type="number"
                                                className="input input-sm input-bordered"
                                                placeholder="Min weeks"
                                                value={rule.minIntervalWeeks || ''}
                                                onChange={(e) => {
                                                    const updatedRules = [...newSchedule.catchUpRules];
                                                    updatedRules[index].minIntervalWeeks = parseInt(e.target.value) || null;
                                                    setNewSchedule({ ...newSchedule, catchUpRules: updatedRules });
                                                }}
                                            />
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => {
                                                    const updatedRules = newSchedule.catchUpRules.filter((_, i) => i !== index);
                                                    setNewSchedule({ ...newSchedule, catchUpRules: updatedRules });
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-success"
                                onClick={createNewSchedule}
                                disabled={!newSchedule.versionName.trim()}
                            >
                                Create Schedule
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}