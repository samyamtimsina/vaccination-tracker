import React, { useEffect, useState } from "react";
import { Plus, Loader, CheckCircle, Edit, Calendar, Syringe, Clock, AlertTriangle, Search, Save, X, Trash2, Eye, Users, Shield } from "lucide-react";

export default function SuperAdminSchedulePage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState('primary');
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

    const saveScheduleChanges = async (scheduleData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/vaccine-schedule/${scheduleData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(scheduleData)
            });

            if (response.ok) {
                const updatedSchedule = await response.json();
                setSchedules(schedules.map(s => s.id === scheduleData.id ? updatedSchedule : s));
                return true;
            } else {
                console.error('Failed to save schedule');
                return false;
            }
        } catch (err) {
            console.error('Error saving schedule:', err);
            return false;
        }
    };

    const createSchedule = async (scheduleData) => {
        try {
            const response = await fetch('http://localhost:5000/api/vaccine-schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(scheduleData)
            });

            if (response.ok) {
                const newSchedule = await response.json();
                setSchedules([...schedules, newSchedule]);
                return true;
            } else {
                console.error('Failed to create schedule');
                return false;
            }
        } catch (err) {
            console.error('Error creating schedule:', err);
            return false;
        }
    };

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
            "BCG": "bg-blue-500 text-white",
            "DPT_HEPB_HIB": "bg-green-500 text-white",
            "ROTA": "bg-purple-500 text-white",
            "OPV": "bg-yellow-500 text-white",
            "FIPV": "bg-pink-500 text-white",
            "PCV": "bg-indigo-500 text-white",
            "MR": "bg-red-500 text-white",
            "JE": "bg-orange-500 text-white",
            "TCV": "bg-teal-500 text-white",
            "HPV": "bg-cyan-500 text-white"
        };
        return colors[type] || "bg-gray-500 text-white";
    };

    const handleEditSchedule = (schedule) => {
        setEditingSchedule({ ...schedule });
        setSelectedSchedule(null);
        setShowModal(true);
        setActiveTab('primary');
    };

    const handleViewSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setEditingSchedule(null);
        setShowModal(true);
        setActiveTab('primary');
    };

    const handleSaveEdit = async () => {
        if (editingSchedule) {
            const success = await saveScheduleChanges(editingSchedule);
            if (success) {
                setEditingSchedule(null);
                setShowModal(false);
            }
        }
    };

    const handleCreateSchedule = async () => {
        if (newSchedule.versionName.trim()) {
            const success = await createSchedule(newSchedule);
            if (success) {
                setNewSchedule({ versionName: "", doses: [], catchUpRules: [] });
                setShowAddModal(false);
                setActiveTab('primary');
            }
        }
    };

    const addDose = () => {
        const newDose = {
            id: Date.now(),
            vaccineType: "",
            doseNumber: 1,
            recommendedAtDays: null,
            recommendedAtWeeks: null,
            recommendedAtMonths: null,
            recommendedAtYears: null,
            isBooster: false
        };

        if (editingSchedule) {
            setEditingSchedule({
                ...editingSchedule,
                doses: [...editingSchedule.doses, newDose]
            });
        } else {
            setNewSchedule({
                ...newSchedule,
                doses: [...newSchedule.doses, newDose]
            });
        }
    };

    const removeDose = (doseId) => {
        if (editingSchedule) {
            setEditingSchedule({
                ...editingSchedule,
                doses: editingSchedule.doses.filter(d => d.id !== doseId)
            });
        } else {
            setNewSchedule({
                ...newSchedule,
                doses: newSchedule.doses.filter(d => d.id !== doseId)
            });
        }
    };

    const updateDose = (doseId, field, value) => {
        const updateDoses = (doses) =>
            doses.map(d => d.id === doseId ? { ...d, [field]: value } : d);

        if (editingSchedule) {
            setEditingSchedule({
                ...editingSchedule,
                doses: updateDoses(editingSchedule.doses)
            });
        } else {
            setNewSchedule({
                ...newSchedule,
                doses: updateDoses(newSchedule.doses)
            });
        }
    };

    const addCatchUpRule = () => {
        const newRule = {
            id: Date.now(),
            vaccineType: "",
            maxAgeDays: null,
            maxAgeWeeks: null,
            maxAgeMonths: null,
            maxAgeYears: null,
            minIntervalWeeks: null,
            totalDoses: 1
        };

        if (editingSchedule) {
            setEditingSchedule({
                ...editingSchedule,
                catchUpRules: [...editingSchedule.catchUpRules, newRule]
            });
        } else {
            setNewSchedule({
                ...newSchedule,
                catchUpRules: [...newSchedule.catchUpRules, newRule]
            });
        }
    };

    const removeCatchUpRule = (ruleId) => {
        if (editingSchedule) {
            setEditingSchedule({
                ...editingSchedule,
                catchUpRules: editingSchedule.catchUpRules.filter(r => r.id !== ruleId)
            });
        } else {
            setNewSchedule({
                ...newSchedule,
                catchUpRules: newSchedule.catchUpRules.filter(r => r.id !== ruleId)
            });
        }
    };

    const updateCatchUpRule = (ruleId, field, value) => {
        const updateRules = (rules) =>
            rules.map(r => r.id === ruleId ? { ...r, [field]: value } : r);

        if (editingSchedule) {
            setEditingSchedule({
                ...editingSchedule,
                catchUpRules: updateRules(editingSchedule.catchUpRules)
            });
        } else {
            setNewSchedule({
                ...newSchedule,
                catchUpRules: updateRules(newSchedule.catchUpRules)
            });
        }
    };

    const filteredSchedules = schedules.filter(schedule =>
        schedule.versionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.id.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-100">
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
                <div className="container mx-auto px-6 py-12">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                                <Shield className="text-3xl" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold mb-2">Vaccine Schedule Manager</h1>
                                <p className="text-xl opacity-90">Comprehensive immunization schedule management</p>
                            </div>
                        </div>
                        <div className="stats shadow-lg bg-white bg-opacity-10 backdrop-blur">
                            <div className="stat">
                                <div className="stat-figure text-primary-content">
                                    <Users className="text-2xl" />
                                </div>
                                <div className="stat-title text-primary-content opacity-80">Active Schedules</div>
                                <div className="stat-value text-primary-content">{schedules.length}</div>
                                <div className="stat-desc text-primary-content opacity-70">Currently managed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-base-200 p-6 rounded-2xl">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content opacity-60" size={20} />
                        <input
                            type="text"
                            placeholder="Search schedules by name or ID..."
                            className="input input-lg w-full pl-12 bg-base-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary btn-lg gap-3"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus size={20} />
                        Create New Schedule
                    </button>
                </div>

                {/* Schedules Grid */}
                <div className="grid gap-6 lg:gap-8">
                    {filteredSchedules.map((schedule) => {
                        const primaryDoses = schedule.doses.filter(d => !d.isBooster);
                        const boosterDoses = schedule.doses.filter(d => d.isBooster);
                        const uniqueVaccines = [...new Set(schedule.doses.map(d => d.vaccineType))];

                        return (
                            <div key={schedule.id} className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
                                <div className="card-body p-8">
                                    {/* Schedule Header */}
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <CheckCircle className="text-success" size={28} />
                                                <h2 className="text-3xl font-bold">{schedule.versionName}</h2>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm opacity-70">
                                                <span className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    Modified: {new Date(schedule.lastModifiedAt).toLocaleDateString()}
                                                </span>
                                                <span className="badge badge-outline badge-lg">ID: {schedule.id}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                className="btn btn-outline btn-info gap-2"
                                                onClick={() => handleViewSchedule(schedule)}
                                            >
                                                <Eye size={18} />
                                                View Details
                                            </button>
                                            <button
                                                className="btn btn-primary gap-2"
                                                onClick={() => handleEditSchedule(schedule)}
                                            >
                                                <Edit size={18} />
                                                Edit Schedule
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <div className="stat bg-base-200 rounded-xl">
                                            <div className="stat-figure text-primary">
                                                <Syringe size={24} />
                                            </div>
                                            <div className="stat-title">Primary Doses</div>
                                            <div className="stat-value text-2xl">{primaryDoses.length}</div>
                                        </div>
                                        <div className="stat bg-base-200 rounded-xl">
                                            <div className="stat-figure text-secondary">
                                                <Shield size={24} />
                                            </div>
                                            <div className="stat-title">Booster Doses</div>
                                            <div className="stat-value text-2xl">{boosterDoses.length}</div>
                                        </div>
                                        <div className="stat bg-base-200 rounded-xl">
                                            <div className="stat-figure text-warning">
                                                <AlertTriangle size={24} />
                                            </div>
                                            <div className="stat-title">Catch-up Rules</div>
                                            <div className="stat-value text-2xl">{schedule.catchUpRules.length}</div>
                                        </div>
                                        <div className="stat bg-base-200 rounded-xl">
                                            <div className="stat-figure text-accent">
                                                <Clock size={24} />
                                            </div>
                                            <div className="stat-title">Vaccine Types</div>
                                            <div className="stat-value text-2xl">{uniqueVaccines.length}</div>
                                        </div>
                                    </div>

                                    {/* Vaccine Preview */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Vaccines Overview</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {uniqueVaccines.map(vaccineType => (
                                                <span
                                                    key={vaccineType}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium ${getVaccineTypeColor(vaccineType)}`}
                                                >
                                                    {vaccineType.replace(/_/g, '-')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredSchedules.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-semibold mb-3">No schedules found</h3>
                        <p className="text-base-content opacity-60 mb-6">Try adjusting your search criteria or create a new schedule</p>
                        <button
                            className="btn btn-primary gap-2"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={20} />
                            Create New Schedule
                        </button>
                    </div>
                )}
            </div>

            {/* Detail/Edit Modal */}
            {showModal && (selectedSchedule || editingSchedule) && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-6xl max-h-screen overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-2xl">
                                    {editingSchedule ? 'Edit Schedule' : 'Schedule Details'}
                                </h3>
                                <p className="text-base-content opacity-70">
                                    {editingSchedule ? editingSchedule.versionName : selectedSchedule?.versionName}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {editingSchedule && (
                                    <>
                                        <button className="btn btn-success gap-2" onClick={handleSaveEdit}>
                                            <Save size={18} />
                                            Save Changes
                                        </button>
                                        <button
                                            className="btn btn-outline gap-2"
                                            onClick={() => {
                                                setEditingSchedule(null);
                                                setShowModal(false);
                                            }}
                                        >
                                            <X size={18} />
                                            Cancel
                                        </button>
                                    </>
                                )}
                                <button
                                    className="btn btn-sm btn-circle btn-ghost"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingSchedule(null);
                                        setSelectedSchedule(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {editingSchedule && (
                            <div className="mb-6">
                                <label className="label">
                                    <span className="label-text font-semibold">Schedule Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={editingSchedule.versionName}
                                    onChange={(e) => setEditingSchedule({
                                        ...editingSchedule,
                                        versionName: e.target.value
                                    })}
                                />
                            </div>
                        )}

                        <div className="tabs tabs-boxed mb-6">
                            <a
                                className={`tab ${activeTab === 'primary' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('primary')}
                            >
                                Primary Doses
                            </a>
                            <a
                                className={`tab ${activeTab === 'catchup' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('catchup')}
                            >
                                Catch-up Rules
                            </a>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {activeTab === 'primary' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold">Vaccine Doses</h4>
                                        {editingSchedule && (
                                            <button className="btn btn-primary btn-sm gap-2" onClick={addDose}>
                                                <Plus size={16} />
                                                Add Dose
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {(editingSchedule ? editingSchedule.doses : selectedSchedule?.doses || [])
                                            .sort((a, b) => {
                                                const ageA = a.recommendedAtDays || (a.recommendedAtWeeks * 7) || (a.recommendedAtMonths * 30) || (a.recommendedAtYears * 365);
                                                const ageB = b.recommendedAtDays || (b.recommendedAtWeeks * 7) || (b.recommendedAtMonths * 30) || (b.recommendedAtYears * 365);
                                                return ageA - ageB;
                                            })
                                            .map((dose) => (
                                                <div key={dose.id} className="card bg-base-200">
                                                    <div className="card-body p-4">
                                                        {editingSchedule ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                                                <div>
                                                                    <label className="label">
                                                                        <span className="label-text-alt">Vaccine Type</span>
                                                                    </label>
                                                                    <select
                                                                        className="select select-bordered w-full"
                                                                        value={dose.vaccineType}
                                                                        onChange={(e) => updateDose(dose.id, 'vaccineType', e.target.value)}
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
                                                                </div>
                                                                <div>
                                                                    <label className="label">
                                                                        <span className="label-text-alt">Dose Number</span>
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        className="input input-bordered w-full"
                                                                        value={dose.doseNumber}
                                                                        onChange={(e) => updateDose(dose.id, 'doseNumber', parseInt(e.target.value) || 1)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="label">
                                                                        <span className="label-text-alt">Age</span>
                                                                    </label>
                                                                    <select
                                                                        className="select select-bordered w-full"
                                                                        onChange={(e) => {
                                                                            const [field, value] = e.target.value.split(':');
                                                                            updateDose(dose.id, 'recommendedAtDays', null);
                                                                            updateDose(dose.id, 'recommendedAtWeeks', null);
                                                                            updateDose(dose.id, 'recommendedAtMonths', null);
                                                                            updateDose(dose.id, 'recommendedAtYears', null);
                                                                            if (field && value) {
                                                                                updateDose(dose.id, field, parseFloat(value));
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
                                                                <div>
                                                                    <label className="label">
                                                                        <span className="label-text-alt">Type</span>
                                                                    </label>
                                                                    <div className="form-control">
                                                                        <label className="label cursor-pointer">
                                                                            <span className="label-text">Booster</span>
                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox"
                                                                                checked={dose.isBooster}
                                                                                onChange={(e) => updateDose(dose.id, 'isBooster', e.target.checked)}
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    className="btn btn-error btn-sm"
                                                                    onClick={() => removeDose(dose.id)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVaccineTypeColor(dose.vaccineType)}`}>
                                                                        {dose.vaccineType.replace(/_/g, '-')}
                                                                    </span>
                                                                    <span className="font-semibold">Dose {dose.doseNumber}</span>
                                                                    <span className="badge badge-success">{formatAge(dose)}</span>
                                                                </div>
                                                                <div>
                                                                    {dose.isBooster ? (
                                                                        <span className="badge badge-warning">Booster</span>
                                                                    ) : (
                                                                        <span className="badge badge-primary">Primary</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'catchup' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold">Catch-up Rules</h4>
                                        {editingSchedule && (
                                            <button className="btn btn-warning btn-sm gap-2" onClick={addCatchUpRule}>
                                                <Plus size={16} />
                                                Add Rule
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {(editingSchedule ? editingSchedule.catchUpRules : selectedSchedule?.catchUpRules || []).map((rule) => (
                                            <div key={rule.id} className="card bg-base-200">
                                                <div className="card-body p-4">
                                                    {editingSchedule ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                                                            <div>
                                                                <label className="label">
                                                                    <span className="label-text-alt">Vaccine Type</span>
                                                                </label>
                                                                <select
                                                                    className="select select-bordered w-full"
                                                                    value={rule.vaccineType}
                                                                    onChange={(e) => updateCatchUpRule(rule.id, 'vaccineType', e.target.value)}
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
                                                            </div>
                                                            <div>
                                                                <label className="label">
                                                                    <span className="label-text-alt">Max Age (Months)</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="input input-bordered w-full"
                                                                    placeholder="Max months"
                                                                    value={rule.maxAgeMonths || ''}
                                                                    onChange={(e) => updateCatchUpRule(rule.id, 'maxAgeMonths', parseInt(e.target.value) || null)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="label">
                                                                    <span className="label-text-alt">Max Age (Years)</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="input input-bordered w-full"
                                                                    placeholder="Max years"
                                                                    value={rule.maxAgeYears || ''}
                                                                    onChange={(e) => updateCatchUpRule(rule.id, 'maxAgeYears', parseInt(e.target.value) || null)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="label">
                                                                    <span className="label-text-alt">Total Doses</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="input input-bordered w-full"
                                                                    value={rule.totalDoses}
                                                                    onChange={(e) => updateCatchUpRule(rule.id, 'totalDoses', parseInt(e.target.value) || 1)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="label">
                                                                    <span className="label-text-alt">Min Interval (Weeks)</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="input input-bordered w-full"
                                                                    placeholder="Min weeks"
                                                                    value={rule.minIntervalWeeks || ''}
                                                                    onChange={(e) => updateCatchUpRule(rule.id, 'minIntervalWeeks', parseInt(e.target.value) || null)}
                                                                />
                                                            </div>
                                                            <button
                                                                className="btn btn-error btn-sm"
                                                                onClick={() => removeCatchUpRule(rule.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVaccineTypeColor(rule.vaccineType)}`}>
                                                                    {rule.vaccineType.replace(/_/g, '-')}
                                                                </span>
                                                                <div className="flex gap-2 text-sm">
                                                                    {rule.maxAgeMonths && <span className="badge badge-outline">Max: {rule.maxAgeMonths}m</span>}
                                                                    {rule.maxAgeYears && <span className="badge badge-outline">Max: {rule.maxAgeYears}y</span>}
                                                                    <span className="badge badge-outline">Doses: {rule.totalDoses}</span>
                                                                    {rule.minIntervalWeeks && <span className="badge badge-outline">Interval: {rule.minIntervalWeeks}w</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Schedule Modal */}
            {showAddModal && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-5xl max-h-screen overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-2xl">Create New Vaccine Schedule</h3>
                                <p className="text-base-content opacity-70">Set up a comprehensive immunization schedule</p>
                            </div>
                            <button
                                className="btn btn-sm btn-circle btn-ghost"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewSchedule({ versionName: "", doses: [], catchUpRules: [] });
                                    setActiveTab('primary');
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="label">
                                <span className="label-text font-semibold">Schedule Name *</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full input-lg"
                                placeholder="Enter a descriptive name for this schedule..."
                                value={newSchedule.versionName}
                                onChange={(e) => setNewSchedule({
                                    ...newSchedule,
                                    versionName: e.target.value
                                })}
                            />
                        </div>

                        <div className="tabs tabs-boxed mb-6">
                            <a
                                className={`tab ${activeTab === 'primary' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('primary')}
                            >
                                Primary Doses ({newSchedule.doses.length})
                            </a>
                            <a
                                className={`tab ${activeTab === 'catchup' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('catchup')}
                            >
                                Catch-up Rules ({newSchedule.catchUpRules.length})
                            </a>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {activeTab === 'primary' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold">Vaccine Doses</h4>
                                        <button className="btn btn-primary btn-sm gap-2" onClick={addDose}>
                                            <Plus size={16} />
                                            Add Dose
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {newSchedule.doses.map((dose) => (
                                            <div key={dose.id} className="card bg-base-200">
                                                <div className="card-body p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Vaccine Type</span>
                                                            </label>
                                                            <select
                                                                className="select select-bordered w-full"
                                                                value={dose.vaccineType}
                                                                onChange={(e) => updateDose(dose.id, 'vaccineType', e.target.value)}
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
                                                        </div>
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Dose Number</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="input input-bordered w-full"
                                                                value={dose.doseNumber}
                                                                onChange={(e) => updateDose(dose.id, 'doseNumber', parseInt(e.target.value) || 1)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Age</span>
                                                            </label>
                                                            <select
                                                                className="select select-bordered w-full"
                                                                onChange={(e) => {
                                                                    const [field, value] = e.target.value.split(':');
                                                                    updateDose(dose.id, 'recommendedAtDays', null);
                                                                    updateDose(dose.id, 'recommendedAtWeeks', null);
                                                                    updateDose(dose.id, 'recommendedAtMonths', null);
                                                                    updateDose(dose.id, 'recommendedAtYears', null);
                                                                    if (field && value) {
                                                                        updateDose(dose.id, field, parseFloat(value));
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
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Type</span>
                                                            </label>
                                                            <div className="form-control">
                                                                <label className="label cursor-pointer">
                                                                    <span className="label-text">Booster</span>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="checkbox"
                                                                        checked={dose.isBooster}
                                                                        onChange={(e) => updateDose(dose.id, 'isBooster', e.target.checked)}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="btn btn-error btn-sm"
                                                            onClick={() => removeDose(dose.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {newSchedule.doses.length === 0 && (
                                            <div className="text-center py-8">
                                                <Syringe className="mx-auto text-4xl opacity-50 mb-4" />
                                                <p className="text-base-content opacity-60">No doses added yet. Click "Add Dose" to get started.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'catchup' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-lg font-semibold">Catch-up Rules</h4>
                                        <button className="btn btn-warning btn-sm gap-2" onClick={addCatchUpRule}>
                                            <Plus size={16} />
                                            Add Rule
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {newSchedule.catchUpRules.map((rule) => (
                                            <div key={rule.id} className="card bg-base-200">
                                                <div className="card-body p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Vaccine Type</span>
                                                            </label>
                                                            <select
                                                                className="select select-bordered w-full"
                                                                value={rule.vaccineType}
                                                                onChange={(e) => updateCatchUpRule(rule.id, 'vaccineType', e.target.value)}
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
                                                        </div>
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Max Age (Months)</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="input input-bordered w-full"
                                                                placeholder="Max months"
                                                                value={rule.maxAgeMonths || ''}
                                                                onChange={(e) => updateCatchUpRule(rule.id, 'maxAgeMonths', parseInt(e.target.value) || null)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Max Age (Years)</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="input input-bordered w-full"
                                                                placeholder="Max years"
                                                                value={rule.maxAgeYears || ''}
                                                                onChange={(e) => updateCatchUpRule(rule.id, 'maxAgeYears', parseInt(e.target.value) || null)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Total Doses</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="input input-bordered w-full"
                                                                value={rule.totalDoses}
                                                                onChange={(e) => updateCatchUpRule(rule.id, 'totalDoses', parseInt(e.target.value) || 1)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="label">
                                                                <span className="label-text-alt">Min Interval (Weeks)</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="input input-bordered w-full"
                                                                placeholder="Min weeks"
                                                                value={rule.minIntervalWeeks || ''}
                                                                onChange={(e) => updateCatchUpRule(rule.id, 'minIntervalWeeks', parseInt(e.target.value) || null)}
                                                            />
                                                        </div>
                                                        <button
                                                            className="btn btn-error btn-sm"
                                                            onClick={() => removeCatchUpRule(rule.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {newSchedule.catchUpRules.length === 0 && (
                                            <div className="text-center py-8">
                                                <AlertTriangle className="mx-auto text-4xl opacity-50 mb-4" />
                                                <p className="text-base-content opacity-60">No catch-up rules added yet. Click "Add Rule" to create vaccination catch-up guidelines.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-action pt-6 border-t border-base-300">
                            <button
                                className="btn btn-success btn-lg gap-2"
                                onClick={handleCreateSchedule}
                                disabled={!newSchedule.versionName.trim()}
                            >
                                <Save size={18} />
                                Create Schedule
                            </button>
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewSchedule({ versionName: "", doses: [], catchUpRules: [] });
                                    setActiveTab('primary');
                                }}
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