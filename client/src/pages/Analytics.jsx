import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { format, subDays, subMonths, parseISO, startOfMonth } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
    AreaChart, Area, ComposedChart, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { debounce } from 'lodash';

const wards = Array.from({ length: 20 }, (_, i) => i + 1);
const genders = ['ALL', 'MALE', 'FEMALE'];
const ageGroups = ['ALL', '0-1y', '1-5y', '5y+'];
const casteCodes = Array.from({ length: 10 }, (_, i) => i + 1);
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E74C3C', '#2ECC71', '#9B59B6'];

const safeFixed = (v, decimals = 4) => {
    if (typeof v !== 'number' || !isFinite(v)) return v || 0;
    const effectiveDecimals = (v >= 99) ? 4 : 2;
    const fixed = v.toFixed(effectiveDecimals);
    return fixed.replace(/\.?0+$/, '');
};

// Add API error handler
const handleApiError = (error) => {
    if (error.response) {
        console.error('API Error Response:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
        });
        return error.response.data;
    } else if (error.request) {
        console.error('API No Response:', error.request);
        return { success: false, message: 'No response from server' };
    } else {
        console.error('API Error:', error.message);
        return { success: false, message: error.message };
    }
};

const AnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [compareMode, setCompareMode] = useState(false);

    const [filters, setFilters] = useState({
        ward: '',
        casteCode: '',
        gender: '',
        ageGroup: '',
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        granularity: 'day',
        compareStartDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
        compareEndDate: format(subDays(new Date(), 31), 'yyyy-MM-dd'),
        monthRange: '12',
        dropoutGroup: 'vaccine',
        windowType: '1M',
        inventoryMonth: format(startOfMonth(new Date()), 'yyyy-MM-dd')
    });

    const [data, setData] = useState({
        overview: { children: {}, mothers: {}, nutrition: {} },
        coverage: { byVaccine: [], byWard: [] },
        dropout: [],
        zeroDose: {},
        growth: {},
        tdCoverage: [],
        dueOverdue: {},
        trends: { days: [], coverage: [], dropout: [], timeliness: [], nutrition: [], monthlyDropout: [] },
        wardPerformance: [],
        disparities: { gender: [], caste: [] },
        comparison: {},
        rollingDropout: [],
        inventory: { vaccineTypes: [], doseCounts: [], inventories: [], special: null }
    });

    const [vaccineMap, setVaccineMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);
    const [inventoryEditing, setInventoryEditing] = useState(false);

    const fetchVaccineSchedule = useCallback(async () => {
        try {
            const response = await axiosClient.get('/api/vaccine-schedule');
            const schedule = response.data;
            const mapping = {};
            schedule.doses.forEach(dose => {
                if (dose.vaccineType && dose.vaccineType.name) {
                    mapping[dose.vaccineType.id] = dose.vaccineType.name;
                }
            });
            setVaccineMap(mapping);
        } catch (err) {
            console.error('Failed to fetch vaccine schedule:', err);
        }
    }, []);

    const getVaccineName = (vaccineTypeId) => {
        return vaccineMap[vaccineTypeId] || `Vaccine ${vaccineTypeId}`;
    };

    const getGroupLabel = (groupValue, groupType) => {
        const val = Number(groupValue);
        switch (groupType) {
            case 'vaccine': return getVaccineName(val);
            case 'ward': return `Ward ${val}`;
            case 'caste': return `Caste ${val}`;
            case 'gender':
            case 'ageGroup': return String(groupValue).toUpperCase();
            default: return String(groupValue);
        }
    };

    const fetchData = useCallback(async (signal) => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            let requests = [];

            if (activeTab === 'overview') {
                requests = [
                    axiosClient.get(`/api/analytics/overview?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/coverage?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/dropout?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/zero-dose?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/growth?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/td-coverage?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/due-overdue?${query}`, { signal })
                ];
            } else if (activeTab === 'trends') {
                requests = [
                    axiosClient.get(`/api/analytics/trends?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/monthly-dropout?${query}`, { signal })
                ];
            } else if (activeTab === 'ward-performance') {
                requests = [axiosClient.get(`/api/analytics/ward-performance?${query}`, { signal })];
            } else if (activeTab === 'equity') {
                const genderQuery = new URLSearchParams({ ...filters, breakdown: 'gender' }).toString();
                const casteQuery = new URLSearchParams({ ...filters, breakdown: 'casteCode' }).toString();
                requests = [
                    axiosClient.get(`/api/analytics/disparities?${genderQuery}`, { signal }),
                    axiosClient.get(`/api/analytics/disparities?${casteQuery}`, { signal })
                ];
            } else if (activeTab === 'comparison') {
                requests = [axiosClient.get(`/api/analytics/comparison?${query}`, { signal })];
            } else if (activeTab === 'monthly-dropout') {
                requests = [axiosClient.get(`/api/analytics/monthly-dropout?${query}`, { signal })];
            } else if (activeTab === 'rolling-dropout') {
                requests = [axiosClient.get(`/api/analytics/rolling-dropout?${query}`, { signal })];
            } else if (activeTab === 'inventory') {
                requests = [axiosClient.get(`/api/analytics/inventory?${query}`, { signal })];
            }

            const results = await Promise.all(requests);

            let processedData = {};

            if (activeTab === 'overview') {
                processedData = {
                    overview: results[0].data.data || {},
                    coverage: results[1].data.data || { byVaccine: [], byWard: [] },
                    dropout: results[2].data.data || [],
                    zeroDose: results[3].data.data || {},
                    growth: results[4].data.data || {},
                    tdCoverage: results[5].data.data || [],
                    dueOverdue: results[6].data.data || {}
                };
            } else if (activeTab === 'trends') {
                processedData = {
                    trends: { ...results[0].data.data, monthlyDropout: results[1].data.data || [] }
                };
            } else if (activeTab === 'ward-performance') {
                processedData = { wardPerformance: results[0].data.data };
            } else if (activeTab === 'equity') {
                processedData = {
                    disparities: {
                        gender: results[0].data.data,
                        caste: results[1].data.data
                    }
                };
            } else if (activeTab === 'comparison') {
                processedData = { comparison: results[0].data.data };
            } else if (activeTab === 'monthly-dropout') {
                processedData = { trends: { monthlyDropout: results[0].data.data || [] } };
            } else if (activeTab === 'rolling-dropout') {
                processedData = { rollingDropout: results[0].data.data };
            } else if (activeTab === 'inventory') {
                processedData = { inventory: results[0].data.data || { vaccineTypes: [], doseCounts: [], inventories: [], special: null } };
            }

            setData(prev => ({
                ...prev,
                ...processedData
            }));

            console.log(`Data fetched for ${activeTab}:`, processedData);
            setLastUpdated(new Date());
        } catch (err) {
            if (err.name !== 'CanceledError') {
                console.error('fetchData error', err);
            }
        } finally {
            setLoading(false);
        }
    }, [filters, activeTab]);

    const debouncedFetch = useMemo(() => {
        const controllerMap = { current: null };
        const debounced = debounce(() => {
            if (controllerMap.current) controllerMap.current.abort();
            controllerMap.current = new AbortController();
            fetchData(controllerMap.current.signal);
        }, 500);
        debounced.cancelController = () => {
            if (controllerMap.current) controllerMap.current.abort();
        };
        return debounced;
    }, [fetchData]);

    useEffect(() => {
        fetchVaccineSchedule();
    }, [fetchVaccineSchedule]);

    useEffect(() => {
        debouncedFetch();
        return () => debouncedFetch.cancelController?.();
    }, [filters, activeTab, debouncedFetch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            ward: '',
            casteCode: '',
            gender: '',
            ageGroup: '',
            startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
            granularity: 'day',
            compareStartDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
            compareEndDate: format(subDays(new Date(), 31), 'yyyy-MM-dd'),
            monthRange: '12',
            dropoutGroup: 'vaccine',
            windowType: '1M',
            inventoryMonth: format(startOfMonth(new Date()), 'yyyy-MM-dd')
        });
    };

    const handleExport = async (type) => {
        setExportLoading(true);
        try {
            const query = new URLSearchParams({ ...filters, type }).toString();
            const response = await axiosClient.get(`/api/analytics/export?${query}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export error:', err);
            alert('Failed to export data');
        } finally {
            setExportLoading(false);
        }
    };

    const handleRefreshCache = async () => {
        try {
            await axiosClient.get('/api/analytics/refresh-cache');
            alert('Cache refreshed successfully');
            debouncedFetch();
        } catch (err) {
            console.error('Refresh cache error:', err);
            alert('Failed to refresh cache');
        }
    };

    // Data processing functions
    const coverageChartData = useMemo(() => {
        const vaccines = data.coverage?.byVaccine || [];
        return vaccines
            .filter(v => v.vaccineTypeId !== 0)
            .map(v => ({
                vaccineTypeId: v.vaccineTypeId,
                vaccineName: getVaccineName(v.vaccineTypeId),
                coverage: Number(v.coverage || 0),
                vaccinated: v.vaccinated || 0,
                total: v.total || 0,
                dropoutRate: data.dropout.find(d => d.vaccineTypeId === v.vaccineTypeId)?.dropoutRate || 0
            }))
            .sort((a, b) => b.coverage - a.coverage);
    }, [data.coverage, data.dropout, vaccineMap]);

    const dropoutChartData = useMemo(() => {
        const dropouts = data.dropout || [];
        return dropouts.map(d => ({
            vaccineTypeId: d.vaccineTypeId,
            vaccineName: getVaccineName(d.vaccineTypeId),
            dropoutRate: Number(d.dropoutRate || 0),
        })).sort((a, b) => b.dropoutRate - a.dropoutRate);
    }, [data.dropout, vaccineMap]);

    const growthPieData = useMemo(() => {
        const nutrition = data.overview?.nutrition || {};
        return [
            { name: 'Underweight', value: nutrition.underweightCount || 0, rate: nutrition.underweightRate || 0 },
            { name: 'Normal', value: nutrition.normalWeightCount || 0, rate: nutrition.normalRate || 0 },
            { name: 'Overweight', value: nutrition.overweightCount || 0, rate: nutrition.overweightRate || 0 }
        ];
    }, [data.overview]);

    const processMonthlyDropoutData = useCallback((rawData, groupBy, monthRange) => {
        if (!rawData || rawData.length === 0) return { chartData: [], groups: [], radarData: [], summary: { totalMonths: 0, totalGroups: 0, avgDropoutRate: 0 } };

        const cutoff = subMonths(new Date(), parseInt(monthRange || 12));
        const filtered = rawData
            .map(d => ({ ...d, parsedDate: parseISO(d.snapshotMonth + '-01') }))
            .filter(d => d.parsedDate >= cutoff);

        let groupField = groupBy;
        if (groupBy === 'vaccine') groupField = 'vaccineTypeId';
        else if (groupBy === 'caste') groupField = 'casteCode';

        const monthlyAggregates = new Map();
        const groupStats = new Map();

        filtered.forEach(item => {
            const monthKey = format(item.parsedDate, 'yyyy-MM');
            const groupValue = item[groupField];

            if (!monthlyAggregates.has(monthKey)) {
                monthlyAggregates.set(monthKey, new Map());
            }
            if (!groupStats.has(groupValue)) {
                groupStats.set(groupValue, []);
            }

            monthlyAggregates.get(monthKey).set(groupValue, item);
            groupStats.get(groupValue).push(item);
        });

        const months = Array.from(monthlyAggregates.keys()).sort();
        const groups = Array.from(groupStats.keys())
            .filter(g => g != null && g !== 0)
            .sort((a, b) => (typeof a === 'number' ? a - b : String(a).localeCompare(String(b))));

        const chartData = months.map(month => {
            const row = { month: format(parseISO(month + '-01'), 'MMM yy') };
            const monthData = monthlyAggregates.get(month);

            groups.forEach(group => {
                const item = monthData?.get(group);
                row[group] = item ? item.dropoutRate : null;
                row[`${group}_due`] = item ? item.totalDue : 0;
                row[`${group}_completed`] = item ? item.totalCompleted : 0;
            });

            return row;
        });

        const radarData = groups.map(group => {
            const items = groupStats.get(group);
            const avgDropout = items.reduce((sum, item) => sum + item.dropoutRate, 0) / items.length;
            const totalDue = items.reduce((sum, item) => sum + item.totalDue, 0);
            const totalCompleted = items.reduce((sum, item) => sum + item.totalCompleted, 0);
            const completionRate = totalDue > 0 ? (totalCompleted / totalDue) * 100 : 0;

            return {
                subject: getGroupLabel(group, groupBy),
                dropoutRate: avgDropout,
                completionRate: completionRate,
                fullMark: 100
            };
        });

        return {
            chartData,
            groups,
            radarData,
            summary: {
                totalMonths: months.length,
                totalGroups: groups.length,
                avgDropoutRate: filtered.reduce((sum, item) => sum + item.dropoutRate, 0) / filtered.length
            }
        };
    }, []);

    const monthlyDropoutData = useMemo(() => {
        return processMonthlyDropoutData(
            data.trends?.monthlyDropout,
            filters.dropoutGroup,
            filters.monthRange
        );
    }, [data.trends?.monthlyDropout, filters.dropoutGroup, filters.monthRange, processMonthlyDropoutData]);

    const rollingDropoutChartData = useMemo(() => {
        const raw = data.rollingDropout || [];
        if (raw.length === 0) return [];

        const monthMap = new Map();
        raw.forEach(item => {
            const monthKey = item.snapshotMonth;
            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, []);
            }
            monthMap.get(monthKey).push(item.dropoutRate);
        });

        return Array.from(monthMap.entries())
            .map(([month, rates]) => ({
                snapshotMonth: month,
                dropoutRate: rates.reduce((sum, rate) => sum + rate, 0) / rates.length
            }))
            .sort((a, b) => a.snapshotMonth.localeCompare(b.snapshotMonth));
    }, [data.rollingDropout]);

    // Inventory data processing
    const processInventoryData = useMemo(() => {
        const { vaccineTypes = [], doseCounts = [], inventories = [], special = null } = data.inventory;

        const vaccineMap = new Map();

        // Initialize vaccine map with all vaccine types
        vaccineTypes.forEach(v => {
            vaccineMap.set(v.id, {
                ...v,
                doses: {},
                inventory: {
                    received: 0,
                    spent: 0,
                    opened: 0,
                    spoiled: 0,
                    returned: 0
                }
            });
        });

        // Populate dose counts
        doseCounts.forEach(dc => {
            const vac = vaccineMap.get(dc.vaccineTypeId);
            if (vac) {
                vac.doses[dc.doseNumber] = dc.countGiven;
            }
        });

        // Populate inventory data
        inventories.forEach(inv => {
            const vac = vaccineMap.get(inv.vaccineTypeId);
            if (vac) {
                vac.inventory = {
                    received: inv.received || 0,
                    spent: inv.spent || 0,
                    opened: inv.opened || 0,
                    spoiled: inv.spoiled || 0,
                    returned: inv.returned || 0
                };
            }
        });

        return {
            vaccines: Array.from(vaccineMap.values()),
            special: special || {
                fullWithin23m: 0,
                started24To59m: 0,
                aefiNormal: 0,
                aefiSerious: 0
            }
        };
    }, [data.inventory]);

    // Enhanced Components
    const StatCard = ({ title, value, subtitle, trend, color = 'primary', icon }) => (
        <div className={`card bg-base-100 border-l-4 border-${color} shadow-lg`}>
            <div className="card-body p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {icon && <div className="text-2xl">{icon}</div>}
                </div>
                {trend && (
                    <div className={`text-xs mt-2 ${trend.value > 0 ? 'text-success' : 'text-error'}`}>
                        {trend.value > 0 ? '↗' : '↘'} {Math.abs(trend.value)}% {trend.label}
                    </div>
                )}
            </div>
        </div>
    );

    const EnhancedTooltip = ({ active, payload, label, type = 'default' }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-xl text-sm max-w-xs">
                    <p className="font-bold text-base border-b pb-2 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                            <div className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span>{entry.name}</span>
                            </div>
                            <span className="font-semibold">
                                {typeof entry.value === 'number'
                                    ? type === 'percentage'
                                        ? `${entry.value.toFixed(2)}%`
                                        : entry.value.toLocaleString()
                                    : entry.value
                                }
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Inventory Tab Component with Auto-fill
    const InventoryTab = () => {
        const [editData, setEditData] = useState(processInventoryData);
        const [autoFilling, setAutoFilling] = useState(false);
        const [initialLoading, setInitialLoading] = useState(false);

        // Load data automatically when component mounts or month changes
        useEffect(() => {
            loadInventoryData();
        }, [filters.inventoryMonth]);

        // Load inventory data from the database
        const loadInventoryData = async () => {
            setInitialLoading(true);
            try {
                console.log('🔄 Loading inventory data for month:', filters.inventoryMonth);

                const response = await axiosClient.get('/api/analytics/inventory', {
                    params: { snapshotMonth: filters.inventoryMonth }
                });

                console.log('📥 Loaded inventory data:', response.data);

                if (response.data.success && response.data.data) {
                    const { vaccineTypes, doseCounts, inventories, special } = response.data.data;

                    // Process the data similar to processInventoryData but for editData state
                    const vaccineMap = new Map();

                    // Initialize vaccine map with all vaccine types
                    vaccineTypes.forEach(v => {
                        vaccineMap.set(v.id, {
                            ...v,
                            doses: {},
                            inventory: {
                                received: 0,
                                spent: 0,
                                opened: 0,
                                spoiled: 0,
                                returned: 0
                            }
                        });
                    });

                    // Populate dose counts
                    doseCounts.forEach(dc => {
                        const vac = vaccineMap.get(dc.vaccineTypeId);
                        if (vac) {
                            vac.doses[dc.doseNumber] = dc.countGiven || 0;
                        }
                    });

                    // Populate inventory data
                    inventories.forEach(inv => {
                        const vac = vaccineMap.get(inv.vaccineTypeId);
                        if (vac) {
                            vac.inventory = {
                                received: inv.received || 0,
                                spent: inv.spent || 0,
                                opened: inv.opened || 0,
                                spoiled: inv.spoiled || 0,
                                returned: inv.returned || 0
                            };
                        }
                    });

                    const processedData = {
                        vaccines: Array.from(vaccineMap.values()),
                        special: special || {
                            fullWithin23m: 0,
                            started24To59m: 0,
                            aefiNormal: 0,
                            aefiSerious: 0
                        }
                    };

                    console.log('✅ Processed inventory data:', processedData);
                    setEditData(processedData);
                } else {
                    console.log('📭 No existing data found for this month, using empty state');
                    // If no data exists, use the processInventoryData as fallback
                    setEditData(processInventoryData);
                }
            } catch (err) {
                console.error('💥 Error loading inventory data:', err);
                alert('Failed to load inventory data');
                // Fallback to empty state
                setEditData(processInventoryData);
            } finally {
                setInitialLoading(false);
            }
        };

        // AUTO-FILL HANDLER
        const handleAutoFill = async () => {
            setAutoFilling(true);
            try {
                const invMonth = filters.inventoryMonth;
                console.log('🚀 Starting auto-fill for month:', invMonth);

                const resp = await axiosClient.get('/api/analytics/inventory/auto-fill', {
                    params: { snapshotMonth: invMonth }
                });

                console.log('📦 Full API response:', resp);
                console.log('📊 Response data:', resp.data);

                if (!resp.data) {
                    throw new Error('No response data received from server');
                }

                if (!resp.data.success) {
                    throw new Error(resp.data.message || 'Auto-fill failed on server');
                }

                if (!resp.data.data) {
                    console.error('❌ No data property in response:', resp.data);
                    throw new Error('No data received from server');
                }

                const { doseCounts, inventories, special } = resp.data.data;

                console.log('🔍 Extracted data:', { doseCounts, inventories, special });

                if (!doseCounts) {
                    console.error('❌ doseCounts is undefined');
                    throw new Error('Dose counts data is missing');
                }

                if (!inventories) {
                    console.error('❌ inventories is undefined');
                    throw new Error('Inventory data is missing');
                }

                if (!special) {
                    console.error('❌ special is undefined');
                    throw new Error('Special counts data is missing');
                }

                if (!Array.isArray(doseCounts)) {
                    console.error('❌ doseCounts is not an array:', typeof doseCounts, doseCounts);
                    throw new Error('Dose counts should be an array');
                }

                if (!Array.isArray(inventories)) {
                    console.error('❌ inventories is not an array:', typeof inventories, inventories);
                    throw new Error('Inventories should be an array');
                }

                console.log('✅ Data validation passed');
                console.log('📝 Dose counts:', doseCounts.length, 'items');
                console.log('📦 Inventories:', inventories.length, 'items');
                console.log('⭐ Special:', special);

                // FIXED: Properly map the API data to editData state
                setEditData(prev => {
                    // Create a fresh vaccines array with the new data
                    const newVaccines = prev.vaccines.map(v => {
                        // Find inventory data for this vaccine
                        const vaccineInventory = inventories.find(inv => inv.vaccineTypeId === v.id);

                        // Create doses object for this vaccine
                        const newDoses = {};
                        doseCounts
                            .filter(dc => dc.vaccineTypeId === v.id)
                            .forEach(dc => {
                                newDoses[dc.doseNumber] = dc.countGiven || 0;
                            });

                        console.log(`📊 Mapping vaccine ${v.name} (${v.id}):`, {
                            doses: newDoses,
                            inventory: vaccineInventory
                        });

                        return {
                            ...v,
                            doses: { ...newDoses }, // Replace with new doses
                            inventory: vaccineInventory ? {
                                received: vaccineInventory.received || 0,
                                spent: vaccineInventory.spent || 0,
                                opened: vaccineInventory.opened || 0,
                                spoiled: vaccineInventory.spoiled || 0,
                                returned: vaccineInventory.returned || 0
                            } : {
                                received: 0,
                                spent: 0,
                                opened: 0,
                                spoiled: 0,
                                returned: 0
                            }
                        };
                    });

                    console.log('🔄 Updated editData:', {
                        vaccines: newVaccines,
                        special: { ...prev.special, ...special }
                    });

                    return {
                        vaccines: newVaccines,
                        special: { ...prev.special, ...special }
                    };
                });

                // Enable editing mode automatically after autofill
                setInventoryEditing(true);

                alert('Auto-fill completed successfully! Check the table for updated values.');

            } catch (err) {
                console.error('💥 Auto-fill error:', err);
                alert(`Failed to auto-fill: ${err.message}. Check console for details.`);
            } finally {
                setAutoFilling(false);
            }
        };

        const handleDoseChange = (vaccineId, doseNumber, value) => {
            setEditData(prev => ({
                ...prev,
                vaccines: prev.vaccines.map(v =>
                    v.id === vaccineId
                        ? { ...v, doses: { ...v.doses, [doseNumber]: parseInt(value) || 0 } }
                        : v
                )
            }));
        };

        const handleInventoryChange = (vaccineId, field, value) => {
            setEditData(prev => ({
                ...prev,
                vaccines: prev.vaccines.map(v =>
                    v.id === vaccineId
                        ? { ...v, inventory: { ...v.inventory, [field]: parseInt(value) || 0 } }
                        : v
                )
            }));
        };

        const handleSpecialChange = (field, value) => {
            setEditData(prev => ({
                ...prev,
                special: { ...prev.special, [field]: parseInt(value) || 0 }
            }));
        };

        const saveData = async () => {
            try {
                console.log('💾 Starting save process...');

                const payload = {
                    snapshotMonth: filters.inventoryMonth,
                    doseCounts: editData.vaccines.flatMap(v => {
                        const doseEntries = [];
                        for (let doseNum = 1; doseNum <= 3; doseNum++) {
                            doseEntries.push({
                                vaccineTypeId: v.id,
                                doseNumber: doseNum,
                                countGiven: v.doses[doseNum] || 0
                            });
                        }
                        return doseEntries;
                    }),
                    inventories: editData.vaccines.map(v => ({
                        vaccineTypeId: v.id,
                        received: v.inventory.received || 0,
                        spent: v.inventory.spent || 0,
                        opened: v.inventory.opened || 0,
                        spoiled: v.inventory.spoiled || 0,
                        returned: v.inventory.returned || 0
                    })),
                    special: {
                        fullWithin23m: editData.special.fullWithin23m || 0,
                        started24To59m: editData.special.started24To59m || 0,
                        aefiNormal: editData.special.aefiNormal || 0,
                        aefiSerious: editData.special.aefiSerious || 0
                    }
                };

                console.log('📤 Payload being sent:', JSON.stringify(payload, null, 2));

                const response = await axiosClient.post('/api/analytics/inventory', payload);

                console.log('✅ Save successful:', response.data);

                if (response.data.success) {
                    alert('✅ Data saved successfully!');
                    setInventoryEditing(false);
                    // Reload the data to reflect the changes
                    loadInventoryData();
                } else {
                    throw new Error(response.data.message || 'Unknown save error');
                }
            } catch (err) {
                console.error('💥 Save error details:', err);
                const errorInfo = handleApiError(err);
                alert(`❌ Save failed: ${errorInfo.message || err.message}`);
            }
        };

        return (
            <div className="space-y-6">
                {/* Header with month picker + buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <label className="label font-semibold">Select Month</label>
                        <input
                            type="month"
                            className="input input-bordered"
                            value={format(parseISO(filters.inventoryMonth), 'yyyy-MM')}
                            onChange={(e) => handleFilterChange({
                                target: { name: 'inventoryMonth', value: `${e.target.value}-01` }
                            })}
                        />
                    </div>

                    <div className="flex gap-2">
                        {/* AUTO-FILL BUTTON */}
                        <button
                            className={`btn btn-outline ${autoFilling ? 'btn-disabled' : ''}`}
                            onClick={handleAutoFill}
                            disabled={autoFilling}
                        >
                            {autoFilling ? '⏳ Filling...' : '🚀 Auto-fill from current month'}
                        </button>

                        {/* REFRESH BUTTON */}
                        <button
                            className="btn btn-outline"
                            onClick={loadInventoryData}
                            disabled={initialLoading}
                        >
                            {initialLoading ? '🔄' : '📥'} Refresh Data
                        </button>

                        {inventoryEditing ? (
                            <>
                                <button className="btn btn-primary" onClick={saveData}>💾 Save</button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => {
                                        console.log('🔍 Current editData state:', editData);
                                        alert('Check console for current state');
                                    }}
                                >
                                    🔍 Debug State
                                </button>
                                <button className="btn btn-ghost" onClick={() => setInventoryEditing(false)}>❌ Cancel</button>
                            </>
                        ) : (
                            <button className="btn btn-primary" onClick={() => setInventoryEditing(true)}>✏️ Edit</button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {initialLoading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="flex flex-col items-center gap-2">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-gray-600">Loading inventory data...</p>
                        </div>
                    </div>
                )}

                {/* Vaccine Table */}
                {!initialLoading && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>खोपको प्रकार</th>
                                        <th colSpan="3">खोप पाएका बच्चाहरुको संख्या</th>
                                        <th colSpan="5">खोप इन्भेन्टरी</th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th>पहिलो</th>
                                        <th>दोस्रो</th>
                                        <th>तेस्रो</th>
                                        <th>यस महिनामा प्राप्त</th>
                                        <th>खर्च भएको</th>
                                        <th>खोप दिन खोलेको</th>
                                        <th>अन्य कारणले बिग्रेको</th>
                                        <th>फिर्ता</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editData.vaccines.map(vaccine => (
                                        <tr key={vaccine.id}>
                                            <td className="font-semibold">{vaccine.name}</td>

                                            {/* Dose counts */}
                                            {[1, 2, 3].map(doseNum => (
                                                <td key={doseNum}>
                                                    {inventoryEditing ? (
                                                        <input
                                                            type="number"
                                                            className="input input-sm w-20"
                                                            value={vaccine.doses[doseNum] || 0}
                                                            onChange={(e) => handleDoseChange(vaccine.id, doseNum, e.target.value)}
                                                        />
                                                    ) : (
                                                        vaccine.doses[doseNum] || 0
                                                    )}
                                                </td>
                                            ))}

                                            {/* Inventory fields */}
                                            {['received', 'spent', 'opened', 'spoiled', 'returned'].map((field) => (
                                                <td key={field}>
                                                    {inventoryEditing ? (
                                                        <input
                                                            type="number"
                                                            className="input input-sm w-20"
                                                            value={vaccine.inventory[field] || 0}
                                                            onChange={(e) => handleInventoryChange(vaccine.id, field, e.target.value)}
                                                        />
                                                    ) : (
                                                        vaccine.inventory[field] || 0
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Special Counts Section */}
                        <div className="card bg-base-100 p-6 shadow-xl">
                            <h3 className="font-bold text-lg mb-4">विशेष गणनाहरू</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { key: 'fullWithin23m', label: '२३ म. भित्र पूर्णखोप प्राप्त गरेका बच्चा' },
                                    { key: 'started24To59m', label: '२४ – ५९ म. मा खोप शुरु गरेका बच्चा' },
                                    { key: 'aefiNormal', label: 'AEFI Cases (सामान्य)' },
                                    { key: 'aefiSerious', label: 'AEFI Cases (गम्भीर)' }
                                ].map(({ key, label }) => (
                                    <div key={key} className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">{label}</span>
                                        </label>
                                        {inventoryEditing ? (
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={editData.special[key] || 0}
                                                onChange={(e) => handleSpecialChange(key, e.target.value)}
                                            />
                                        ) : (
                                            <div className="p-2 border rounded-lg bg-base-200">
                                                {editData.special[key] || 0}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    // Tab Components
    const OverviewTab = () => {
        const { children, mothers, nutrition } = data.overview;

        const performanceData = [
            { subject: 'Coverage', A: children?.coverageRate || 0, fullMark: 100 },
            { subject: 'Timeliness', A: data.dueOverdue?.timelinessRate || 0, fullMark: 100 },
            { subject: 'Nutrition', A: 100 - (nutrition?.underweightRate || 0), fullMark: 100 },
            { subject: 'TD Coverage', A: mothers?.tdCoverage || 0, fullMark: 100 },
            { subject: 'Retention', A: 100 - (children?.dropoutRate || 0), fullMark: 100 }
        ];

        return (
            <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Children"
                        value={children?.totalRegistered?.toLocaleString() || '0'}
                        icon="👶"
                        color="primary"
                    />
                    <StatCard
                        title="Vaccination Coverage"
                        value={`${(children?.coverageRate || 0).toFixed(1)}%`}
                        subtitle={`${children?.vaccinated || 0} vaccinated`}
                        icon="💉"
                        color="success"
                    />
                    <StatCard
                        title="Mothers Registered"
                        value={mothers?.totalRegistered?.toLocaleString() || '0'}
                        icon="🤰"
                        color="info"
                    />
                    <StatCard
                        title="TD Coverage"
                        value={`${(mothers?.tdCoverage || 0).toFixed(1)}%`}
                        icon="🛡️"
                        color="warning"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coverage vs Dropout Comparison */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title">Coverage vs Dropout Rates</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={coverageChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="vaccineName" angle={-45} textAnchor="end" height={80} />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="coverage" name="Coverage %" fill="#0088FE" />
                                    <Line yAxisId="right" type="monotone" dataKey="dropoutRate" name="Dropout %" stroke="#FF8042" strokeWidth={2} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Performance Radar */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title">Performance Overview</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={performanceData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Growth Distribution */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title">Growth Distribution</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={growthPieData}
                                        cx="50%"
                                        cy="50%"
                                        nameKey="name"
                                        outerRadius={100}
                                        label={({ name, rate }) => `${name}: ${safeFixed(rate)}%`}
                                    >
                                        {growthPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Due & Overdue */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="card-title">Due & Overdue Status</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="stat">
                                    <div className="stat-title">Due Today</div>
                                    <div className="stat-value text-info text-2xl">{data.dueOverdue?.dueToday ?? 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Overdue</div>
                                    <div className="stat-value text-error text-2xl">{data.dueOverdue?.overdue ?? 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">On Time</div>
                                    <div className="stat-value text-success text-2xl">{data.dueOverdue?.onTime ?? 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Timeliness</div>
                                    <div className="stat-value text-info text-2xl">{safeFixed(data.dueOverdue?.timelinessRate)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MonthlyDropoutTab = () => {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Area Chart */}
                    <div className="card bg-base-100 shadow-xl lg:col-span-2">
                        <div className="card-body">
                            <h3 className="card-title">Monthly Dropout Trends</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={monthlyDropoutData.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                    <Legend />
                                    {monthlyDropoutData.groups.map((group, index) => (
                                        <Area
                                            key={group}
                                            dataKey={group}
                                            name={getGroupLabel(group, filters.dropoutGroup)}
                                            stackId="1"
                                            stroke={COLORS[index % COLORS.length]}
                                            fill={COLORS[index % COLORS.length]}
                                            fillOpacity={0.6}
                                        />
                                    ))}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats and Radar */}
                    <div className="space-y-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title">Dropout Summary</h3>
                                <div className="space-y-3">
                                    <StatCard
                                        title="Average Dropout"
                                        value={`${monthlyDropoutData.summary.avgDropoutRate.toFixed(1)}%`}
                                        color="warning"
                                    />
                                    <StatCard
                                        title="Groups Tracked"
                                        value={monthlyDropoutData.summary.totalGroups}
                                        color="info"
                                    />
                                    <StatCard
                                        title="Months Analyzed"
                                        value={monthlyDropoutData.summary.totalMonths}
                                        color="success"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title">Group Performance</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <RadarChart data={monthlyDropoutData.radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis domain={[0, 100]} />
                                        <Radar name="Dropout Rate" dataKey="dropoutRate" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">Detailed Monthly Data</h3>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        {monthlyDropoutData.groups.map(group => (
                                            <th key={group}>{getGroupLabel(group, filters.dropoutGroup)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyDropoutData.chartData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="font-semibold">{row.month}</td>
                                            {monthlyDropoutData.groups.map(group => (
                                                <td key={group}>
                                                    <div className={`badge ${row[group] > 20 ? 'badge-error' : row[group] > 10 ? 'badge-warning' : 'badge-success'}`}>
                                                        {row[group] ? `${row[group].toFixed(1)}%` : 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {row[`${group}_due`]} due, {row[`${group}_completed`]} completed
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TrendsTab = () => {
        return (
            <div className="space-y-6">
                <div className="flex justify-end gap-4">
                    <select
                        className="select select-bordered"
                        name="granularity"
                        value={filters.granularity}
                        onChange={handleFilterChange}
                    >
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                    </select>
                    <select
                        className="select select-bordered"
                        name="monthRange"
                        value={filters.monthRange}
                        onChange={handleFilterChange}
                    >
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="card bg-base-100 p-4 shadow-xl">
                        <h3 className="font-bold text-lg mb-4">📈 Coverage Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.trends?.coverage || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                <Legend />
                                <Line type="monotone" dataKey="coveragePct" name="Coverage %" stroke="#0088FE" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card bg-base-100 p-4 shadow-xl">
                        <h3 className="font-bold text-lg mb-4">📉 Dropout Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.trends?.dropout || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                <Legend />
                                <Line type="monotone" dataKey="dropoutRate" name="Dropout %" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card bg-base-100 p-4 shadow-xl">
                        <h3 className="font-bold text-lg mb-4">⏰ Timeliness Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.trends?.timeliness || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                <Legend />
                                <Line type="monotone" dataKey="timelinessRate" name="Timeliness %" stroke="#00C49F" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    const FilterSection = () => (
        <div className="bg-base-200 p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                <div>
                    <label className="label font-semibold text-sm">Ward</label>
                    <select className="select select-bordered w-full select-sm" name="ward" value={filters.ward} onChange={handleFilterChange}>
                        <option value="">All Wards</option>
                        {wards.map(w => <option key={w} value={w}>Ward {w}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label font-semibold text-sm">Caste</label>
                    <select className="select select-bordered w-full select-sm" name="casteCode" value={filters.casteCode} onChange={handleFilterChange}>
                        <option value="">All Castes</option>
                        {casteCodes.map(c => <option key={c} value={c}>Caste {c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label font-semibold text-sm">Gender</label>
                    <select className="select select-bordered w-full select-sm" name="gender" value={filters.gender} onChange={handleFilterChange}>
                        <option value="">All</option>
                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label font-semibold text-sm">Age Group</label>
                    <select className="select select-bordered w-full select-sm" name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange}>
                        <option value="">All</option>
                        {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label font-semibold text-sm">Start Date</label>
                    <input type="date" className="input input-bordered w-full input-sm" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                </div>
                <div>
                    <label className="label font-semibold text-sm">End Date</label>
                    <input type="date" className="input input-bordered w-full input-sm" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                </div>
            </div>

            {(activeTab === 'trends' || activeTab === 'monthly-dropout') && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
                    <div>
                        <label className="label font-semibold text-sm">Granularity</label>
                        <select className="select select-bordered w-full select-sm" name="granularity" value={filters.granularity} onChange={handleFilterChange}>
                            <option value="day">Daily</option>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label className="label font-semibold text-sm">Month Range</label>
                        <select className="select select-bordered w-full select-sm" name="monthRange" value={filters.monthRange} onChange={handleFilterChange}>
                            <option value="3">3 Months</option>
                            <option value="6">6 Months</option>
                            <option value="12">12 Months</option>
                        </select>
                    </div>
                    <div>
                        <label className="label font-semibold text-sm">Group By</label>
                        <select className="select select-bordered w-full select-sm" name="dropoutGroup" value={filters.dropoutGroup} onChange={handleFilterChange}>
                            <option value="vaccine">Vaccine</option>
                            <option value="ward">Ward</option>
                            <option value="gender">Gender</option>
                            <option value="ageGroup">Age Group</option>
                            <option value="caste">Caste</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="btn btn-primary btn-sm w-full" onClick={debouncedFetch} disabled={loading}>
                            {loading ? '🔄' : '🔍'} Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>
                    <p className="text-gray-600">Comprehensive vaccination and growth monitoring analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <div className="text-sm text-gray-500">
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={handleRefreshCache}>
                        🔄 Refresh Data
                    </button>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-sm btn-primary">
                            {exportLoading ? '⏳' : '📥'} Export
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                            <li><a onClick={() => handleExport('overview')}>Overview</a></li>
                            <li><a onClick={() => handleExport('coverage')}>Coverage</a></li>
                            <li><a onClick={() => handleExport('trends')}>Trends</a></li>
                            <li><a onClick={() => handleExport('ward-performance')}>Ward Performance</a></li>
                            <li><a onClick={() => handleExport('disparities')}>Disparities</a></li>
                            <li><a onClick={() => handleExport('monthly-dropout')}>Monthly Dropout</a></li>
                            <li><a onClick={() => handleExport('inventory')}>Inventory</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <FilterSection />

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-200">
                {[
                    { id: 'overview', label: 'Overview', icon: '📈' },
                    { id: 'trends', label: 'Trends', icon: '📊' },
                    { id: 'monthly-dropout', label: 'Monthly Dropout', icon: '🌊' },
                    { id: 'inventory', label: 'Inventory', icon: '📦' },
                    { id: 'ward-performance', label: 'Ward Performance', icon: '🏆' },
                    { id: 'equity', label: 'Equity Analysis', icon: '⚖️' },
                    { id: 'comparison', label: 'Comparison', icon: '🔄' }
                ].map(tab => (
                    <a
                        key={tab.id}
                        className={`tab tab-lg ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </a>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-gray-600">Loading analytics data...</p>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            {!loading && (
                <div className="min-h-96">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'trends' && <TrendsTab />}
                    {activeTab === 'monthly-dropout' && <MonthlyDropoutTab />}
                    {activeTab === 'inventory' && <InventoryTab />}
                    {activeTab === 'ward-performance' && (
                        <div className="space-y-6">
                            <div className="card bg-base-100 p-4 shadow-xl">
                                <h3 className="font-bold text-lg mb-4">🏆 Top Performing Wards</h3>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={data.wardPerformance || []} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="ward" type="category" width={80} />
                                        <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                        <Legend />
                                        <Bar dataKey="coverage" name="Coverage %" fill="#0088FE" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                    {activeTab === 'equity' && (
                        <div className="space-y-6">
                            <div className="card bg-base-100 p-4 shadow-xl">
                                <h3 className="font-bold text-lg mb-4">👥 Coverage by Gender</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.disparities?.gender || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="group" />
                                        <YAxis />
                                        <Tooltip content={<EnhancedTooltip type="percentage" />} />
                                        <Legend />
                                        <Bar dataKey="coverage" name="Coverage %" fill="#0088FE" />
                                        <Bar dataKey="dropoutRate" name="Dropout %" fill="#FF8042" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                    {activeTab === 'comparison' && (
                        <div className="space-y-6">
                            <div className="alert alert-info">
                                <span>Comparing {filters.compareStartDate} to {filters.compareEndDate} vs {filters.startDate} to {filters.endDate}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(data.comparison || {}).map(([key, value]) => (
                                    <div key={key} className="card bg-base-100 shadow-xl">
                                        <div className="card-body">
                                            <h3 className="card-title text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Current:</span>
                                                    <span className="font-bold">{value.current}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Previous:</span>
                                                    <span className="font-bold">{value.previous}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm">Change:</span>
                                                    <span className={`font-bold flex items-center ${value.changePct > 0 ? 'text-success' : 'text-error'}`}>
                                                        {value.changePct > 0 ? '↑' : '↓'} {Math.abs(value.changePct)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;