import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { format, subDays, subMonths, parseISO, startOfMonth } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
    AreaChart, Area, ComposedChart, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { debounce } from 'lodash';

// Import Nepali Date Picker
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { currentBSYear } from '../../helpers/calculateAge.jsx';

// Import Nepali Date Converter
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';

const wards = Array.from({ length: 20 }, (_, i) => i + 1);
const genders = ['ALL', 'MALE', 'FEMALE'];
const ageGroups = ['ALL', '0-1y', '1-5y', '5y+'];
const casteCodes = Array.from({ length: 10 }, (_, i) => i + 1);
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E74C3C', '#2ECC71', '#9B59B6'];

// Date format helper
const safeFormatDateYYMMDD = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

// Proper Nepali to English date conversion using the library
const convertNepaliToEnglish = (nepaliDate) => {
    if (!nepaliDate) return '';

    try {
        // Convert BS to AD using the library
        const englishDate = bsToAd(nepaliDate);
        return safeFormatDateYYMMDD(englishDate);
    } catch (error) {
        console.error('Error converting Nepali to English date:', error);
        return nepaliDate; // Fallback to original
    }
};

// Proper English to Nepali date conversion using the library
const convertEnglishToNepali = (englishDate) => {
    if (!englishDate) return '';

    try {
        // Convert AD to BS using the library
        const nepaliDate = adToBs(englishDate);
        return nepaliDate;
    } catch (error) {
        console.error('Error converting English to Nepali date:', error);
        return englishDate; // Fallback to original
    }
};

// BS Month Boundary Helper Functions
const getBSMonthBoundaries = (nepaliDate) => {
    if (!nepaliDate) return { start: '', end: '' };

    try {
        // Parse the BS date string (format: YYYY-MM-DD)
        const parts = nepaliDate.split('-');
        if (parts.length !== 3) return { start: '', end: '' };

        const bsYear = parseInt(parts[0]);
        const bsMonth = parseInt(parts[1]);
        const bsDay = parseInt(parts[2]);

        // Start of BS month (1st day)
        const bsStartOfMonth = `${bsYear}-${bsMonth.toString().padStart(2, '0')}-01`;

        // Calculate next BS month
        let nextBsMonth = bsMonth + 1;
        let nextBsYear = bsYear;

        if (nextBsMonth > 12) {
            nextBsMonth = 1;
            nextBsYear = bsYear + 1;
        }

        // Start of next BS month (1st day)
        const bsStartOfNextMonth = `${nextBsYear}-${nextBsMonth.toString().padStart(2, '0')}-01`;

        // Convert BS boundaries to AD using the library
        const adStartOfMonth = convertNepaliToEnglish(bsStartOfMonth);
        const adStartOfNextMonth = convertNepaliToEnglish(bsStartOfNextMonth);

        if (!adStartOfMonth || !adStartOfNextMonth) {
            throw new Error('Failed to convert BS dates to AD');
        }

        // End of BS month is day before next BS month starts
        const adEndOfMonth = new Date(adStartOfNextMonth);
        adEndOfMonth.setDate(adEndOfMonth.getDate() - 1);

        return {
            start: adStartOfMonth,
            end: format(adEndOfMonth, 'yyyy-MM-dd')
        };
    } catch (error) {
        console.error('Error calculating BS month boundaries:', error);
        return { start: '', end: '' };
    }
};

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

// FIX: Move components outside main component to prevent re-renders
const CustomDatePicker = ({ value, onChange, name, placeholder = "Select date" }) => {
    const handleChange = (newValue) => {
        onChange(name, newValue);
    };

    return (
        <div className="w-full">
            <NepaliDatePicker
                className="w-full"
                inputClassName="input input-bordered input-sm w-full pr-8"
                value={value || ''}
                onChange={handleChange}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
                language="ne"
                minYear={2000}
                maxYear={currentBSYear}
                placeholder={placeholder}
            />
        </div>
    );
};

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

const AnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [compareMode, setCompareMode] = useState(false);

    // Get current Nepali date for default values
    const getCurrentNepaliDate = () => {
        const now = new Date();
        return convertEnglishToNepali(format(now, 'yyyy-MM-dd'));
    };

    const getNepaliDateMonthAgo = () => {
        const monthAgo = subDays(new Date(), 30);
        return convertEnglishToNepali(format(monthAgo, 'yyyy-MM-dd'));
    };

    const getNepaliDateTwoMonthsAgo = () => {
        const twoMonthsAgo = subDays(new Date(), 60);
        return convertEnglishToNepali(format(twoMonthsAgo, 'yyyy-MM-dd'));
    };

    const getNepaliDateLastMonth = () => {
        const lastMonth = subDays(new Date(), 31);
        return convertEnglishToNepali(format(lastMonth, 'yyyy-MM-dd'));
    };

    const getNepaliDateStartOfMonth = () => {
        const startMonth = startOfMonth(new Date());
        return convertEnglishToNepali(format(startMonth, 'yyyy-MM-dd'));
    };

    // FIX: Two-state system - UI state vs API state
    const [filters, setFilters] = useState({
        ward: '',
        casteCode: '',
        gender: '',
        ageGroup: '',
        startDate: getNepaliDateMonthAgo(),
        endDate: getCurrentNepaliDate(),
        granularity: 'day',
        compareStartDate: getNepaliDateTwoMonthsAgo(),
        compareEndDate: getNepaliDateLastMonth(),
        monthRange: '12',
        dropoutGroup: 'vaccine',
        windowType: '1M',
        inventoryMonth: getNepaliDateStartOfMonth()
    });

    // FIX: Applied filters for API calls (separate from UI state)
    const [appliedFilters, setAppliedFilters] = useState(filters);

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

    // Use refs to manage fetch state without causing re-renders
    const fetchControllerRef = useRef(null);
    const debouncedFetchRef = useRef(null);

    // FIX: Prevent form submissions globally to stop date picker from reloading page
    useEffect(() => {
        const preventSubmit = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        // Add event listener to prevent form submissions
        window.addEventListener('submit', preventSubmit, true);
        document.addEventListener('submit', preventSubmit, true);

        return () => {
            window.removeEventListener('submit', preventSubmit, true);
            document.removeEventListener('submit', preventSubmit, true);
        };
    }, []);

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
        if (groupValue == null || groupValue === '') return 'Unknown';

        switch (groupType) {
            case 'vaccine':
                return getVaccineName(Number(groupValue)) || `Vaccine ${groupValue}`;
            case 'ward':
                return `Ward ${groupValue}`;
            case 'caste':
                return `Caste ${groupValue}`;
            case 'gender':
                return String(groupValue).charAt(0).toUpperCase() + String(groupValue).slice(1).toLowerCase();
            case 'ageGroup':
                return String(groupValue);
            default:
                return String(groupValue);
        }
    };

    // FIX: Process API response data to convert AD dates to BS for display
    const processApiData = useCallback((apiData) => {
        if (!apiData) return apiData;

        const processObject = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;

            if (Array.isArray(obj)) {
                return obj.map(item => processObject(item));
            }

            const processed = { ...obj };

            // Convert date fields from AD to BS for display
            Object.keys(processed).forEach(key => {
                const value = processed[key];

                // Check if this is a date field (you might need to adjust these patterns)
                if (typeof value === 'string' &&
                    (key.toLowerCase().includes('date') ||
                        key.toLowerCase().includes('month') ||
                        key.toLowerCase().includes('day'))) {

                    // Check if it's an AD date format (YYYY-MM-DD)
                    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        try {
                            processed[key] = convertEnglishToNepali(value);
                        } catch (error) {
                            console.warn(`Failed to convert date field ${key}:`, value);
                        }
                    }
                } else if (typeof value === 'object' && value !== null) {
                    processed[key] = processObject(value);
                }
            });

            return processed;
        };

        return processObject(apiData);
    }, []);

    // FIXED: Proper monthly dropout data processing
    const processMonthlyDropoutData = useCallback((rawData, groupBy, monthRange) => {
        if (!rawData || rawData.length === 0) {
            console.log('No monthly dropout data available');
            return { chartData: [], groups: [], radarData: [], summary: { totalMonths: 0, totalGroups: 0, avgDropoutRate: 0 } };
        }

        console.log('Processing monthly dropout data:', {
            rawDataCount: rawData.length,
            groupBy,
            monthRange,
            sampleRecords: rawData.slice(0, 3)
        });

        // Convert BS dates to AD for date calculations
        const processedData = rawData.map(item => {
            try {
                // Your data already has snapshotMonth in '2024-12' format
                const adDate = parseISO(item.snapshotMonth + '-01'); // Convert to full date
                return {
                    ...item,
                    parsedDate: adDate
                };
            } catch (error) {
                console.warn('Failed to parse date:', item.snapshotMonth, error);
                return { ...item, parsedDate: new Date() };
            }
        });

        // Filter by month range
        const cutoff = subMonths(new Date(), parseInt(monthRange || 12));
        const filtered = processedData.filter(d => d.parsedDate >= cutoff);

        console.log('After filtering:', {
            original: processedData.length,
            filtered: filtered.length,
            cutoff: format(cutoff, 'yyyy-MM')
        });

        if (filtered.length === 0) {
            console.log('No data after date filtering');
            return { chartData: [], groups: [], radarData: [], summary: { totalMonths: 0, totalGroups: 0, avgDropoutRate: 0 } };
        }

        // Determine group field based on groupBy parameter
        let groupField;
        switch (groupBy) {
            case 'vaccine': groupField = 'vaccineTypeId'; break;
            case 'ward': groupField = 'ward'; break;
            case 'gender': groupField = 'gender'; break;
            case 'ageGroup': groupField = 'ageGroup'; break;
            case 'caste': groupField = 'casteCode'; break;
            default: groupField = 'vaccineTypeId';
        }

        console.log('Grouping by field:', groupField);

        // Group data by month and then by the selected group field
        const monthlyAggregates = new Map();
        const groupStats = new Map();

        filtered.forEach(item => {
            const monthKey = format(item.parsedDate, 'yyyy-MM'); // Keep as '2024-12'
            const groupValue = item[groupField];

            if (!monthlyAggregates.has(monthKey)) {
                monthlyAggregates.set(monthKey, new Map());
            }
            if (!groupStats.has(groupValue)) {
                groupStats.set(groupValue, []);
            }

            // Store the item for this month+group combination
            monthlyAggregates.get(monthKey).set(groupValue, item);
            groupStats.get(groupValue).push(item);
        });

        const months = Array.from(monthlyAggregates.keys()).sort();
        const groups = Array.from(groupStats.keys())
            .filter(g => g != null && g !== '' && g !== 'ALL') // Filter out null/empty/ALL groups
            .sort((a, b) => {
                if (typeof a === 'number' && typeof b === 'number') return a - b;
                return String(a).localeCompare(String(b));
            });

        console.log('Groups found:', { months, groups });

        // Create chart data - one row per month with columns for each group
        const chartData = months.map(month => {
            const row = { month: format(parseISO(month + '-01'), 'MMM yy') }; // Display as "Dec 24"
            const monthData = monthlyAggregates.get(month);

            groups.forEach(group => {
                const item = monthData?.get(group);
                row[group] = item ? item.dropoutRate : null;
                row[`${group}_due`] = item ? item.totalDue : 0;
                row[`${group}_completed`] = item ? item.totalCompleted : 0;
                row[`${group}_count`] = item ? item.dropoutCount : 0;
            });

            return row;
        });

        // Create radar data - average performance per group
        const radarData = groups.map(group => {
            const items = groupStats.get(group);
            const avgDropout = items.reduce((sum, item) => sum + (item.dropoutRate || 0), 0) / items.length;
            const totalDue = items.reduce((sum, item) => sum + (item.totalDue || 0), 0);
            const totalCompleted = items.reduce((sum, item) => sum + (item.totalCompleted || 0), 0);
            const completionRate = totalDue > 0 ? (totalCompleted / totalDue) * 100 : 0;

            return {
                subject: getGroupLabel(group, groupBy),
                dropoutRate: Number(avgDropout.toFixed(2)),
                completionRate: Number(completionRate.toFixed(2)),
                fullMark: 100
            };
        });

        // Calculate summary statistics
        const validDropoutRates = filtered.map(item => item.dropoutRate).filter(rate => rate != null);
        const avgDropoutRate = validDropoutRates.length > 0
            ? validDropoutRates.reduce((sum, rate) => sum + rate, 0) / validDropoutRates.length
            : 0;

        const result = {
            chartData,
            groups,
            radarData,
            summary: {
                totalMonths: months.length,
                totalGroups: groups.length,
                avgDropoutRate: Number(avgDropoutRate.toFixed(2))
            }
        };

        console.log('Final processed result:', result);
        return result;
    }, []);

    // FIX: Use appliedFilters for API calls, not filters
    const fetchData = useCallback(async (signal) => {
        setLoading(true);
        try {
            // Convert Nepali dates to English for API calls
            const apiFilters = {
                ...appliedFilters,
                startDate: convertNepaliToEnglish(appliedFilters.startDate),
                endDate: convertNepaliToEnglish(appliedFilters.endDate),
                compareStartDate: convertNepaliToEnglish(appliedFilters.compareStartDate),
                compareEndDate: convertNepaliToEnglish(appliedFilters.compareEndDate),
                inventoryMonth: convertNepaliToEnglish(appliedFilters.inventoryMonth)
            };

            const query = new URLSearchParams(apiFilters).toString();
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
                const genderQuery = new URLSearchParams({ ...apiFilters, breakdown: 'gender' }).toString();
                const casteQuery = new URLSearchParams({ ...apiFilters, breakdown: 'casteCode' }).toString();
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
                    overview: processApiData(results[0].data.data) || {},
                    coverage: processApiData(results[1].data.data) || { byVaccine: [], byWard: [] },
                    dropout: processApiData(results[2].data.data) || [],
                    zeroDose: processApiData(results[3].data.data) || {},
                    growth: processApiData(results[4].data.data) || {},
                    tdCoverage: processApiData(results[5].data.data) || [],
                    dueOverdue: processApiData(results[6].data.data) || {}
                };
            } else if (activeTab === 'trends') {
                processedData = {
                    trends: {
                        ...processApiData(results[0].data.data),
                        monthlyDropout: processApiData(results[1].data.data) || []
                    }
                };
            } else if (activeTab === 'ward-performance') {
                processedData = { wardPerformance: processApiData(results[0].data.data) };
            } else if (activeTab === 'equity') {
                processedData = {
                    disparities: {
                        gender: processApiData(results[0].data.data),
                        caste: processApiData(results[1].data.data)
                    }
                };
            } else if (activeTab === 'comparison') {
                processedData = { comparison: processApiData(results[0].data.data) };
            } else if (activeTab === 'monthly-dropout') {
                processedData = { trends: { monthlyDropout: processApiData(results[0].data.data) || [] } };
            } else if (activeTab === 'rolling-dropout') {
                processedData = { rollingDropout: processApiData(results[0].data.data) };
            } else if (activeTab === 'inventory') {
                processedData = { inventory: processApiData(results[0].data.data) || { vaccineTypes: [], doseCounts: [], inventories: [], special: null } };
            }

            setData(prev => ({
                ...prev,
                ...processedData
            }));

            setLastUpdated(new Date());
        } catch (err) {
            if (err.name !== 'CanceledError') {
                console.error('fetchData error', err);
            }
        } finally {
            setLoading(false);
        }
    }, [appliedFilters, activeTab, processApiData]);

    // Initialize debounced fetch function
    useEffect(() => {
        const debounced = debounce(() => {
            if (fetchControllerRef.current) {
                fetchControllerRef.current.abort();
            }
            fetchControllerRef.current = new AbortController();
            fetchData(fetchControllerRef.current.signal);
        }, 500);

        debouncedFetchRef.current = debounced;

        return () => {
            debounced.cancel();
            if (fetchControllerRef.current) {
                fetchControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    useEffect(() => {
        fetchVaccineSchedule();
    }, [fetchVaccineSchedule]);

    // FIX: Only fetch data when activeTab or appliedFilters change
    useEffect(() => {
        if (debouncedFetchRef.current) {
            debouncedFetchRef.current();
        }
    }, [activeTab, appliedFilters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // FIX: Separate handler for date changes
    const handleDateChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // FIX: New function to apply UI filters to API filters
    const handleApplyFilters = () => {
        setAppliedFilters(filters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            ward: '',
            casteCode: '',
            gender: '',
            ageGroup: '',
            startDate: getNepaliDateMonthAgo(),
            endDate: getCurrentNepaliDate(),
            granularity: 'day',
            compareStartDate: getNepaliDateTwoMonthsAgo(),
            compareEndDate: getNepaliDateLastMonth(),
            monthRange: '12',
            dropoutGroup: 'vaccine',
            windowType: '1M',
            inventoryMonth: getNepaliDateStartOfMonth()
        };

        setFilters(clearedFilters);
        setAppliedFilters(clearedFilters);
    };

    const handleExport = async (type) => {
        setExportLoading(true);
        try {
            // Convert Nepali dates to English for export
            const apiFilters = {
                ...appliedFilters,
                startDate: convertNepaliToEnglish(appliedFilters.startDate),
                endDate: convertNepaliToEnglish(appliedFilters.endDate),
                compareStartDate: convertNepaliToEnglish(appliedFilters.compareStartDate),
                compareEndDate: convertNepaliToEnglish(appliedFilters.compareEndDate),
                inventoryMonth: convertNepaliToEnglish(appliedFilters.inventoryMonth)
            };

            const query = new URLSearchParams({ ...apiFilters, type }).toString();
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
            if (debouncedFetchRef.current) {
                debouncedFetchRef.current();
            }
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

    // FIXED: Monthly dropout data processing
    const monthlyDropoutData = useMemo(() => {
        return processMonthlyDropoutData(
            data.trends?.monthlyDropout,
            appliedFilters.dropoutGroup,
            appliedFilters.monthRange
        );
    }, [data.trends?.monthlyDropout, appliedFilters.dropoutGroup, appliedFilters.monthRange, processMonthlyDropoutData]);

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
        // Debug logging
        console.log('=== MONTHLY DROPOUT DEBUG ===');
        console.log('Raw data count:', data.trends?.monthlyDropout?.length || 0);
        console.log('Applied filters:', appliedFilters);
        console.log('Processed data:', monthlyDropoutData);

        if (!monthlyDropoutData.chartData || monthlyDropoutData.chartData.length === 0) {
            return (
                <div className="alert alert-warning">
                    <p>📊 Monthly Dropout Analytics</p>
                    <p>Raw records available: {data.trends?.monthlyDropout?.length || 0}</p>
                    <p>Processed chart data: {monthlyDropoutData.chartData?.length || 0}</p>
                    <p>Groups found: {monthlyDropoutData.groups?.join(', ') || 'none'}</p>
                    <p>Try changing the "Group By" filter to see different views</p>
                    <div className="mt-2">
                        <p className="text-sm">Current grouping: <strong>{appliedFilters.dropoutGroup}</strong></p>
                        <p className="text-sm">Month range: <strong>{appliedFilters.monthRange} months</strong></p>
                    </div>
                </div>
            );
        }

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
                                            name={getGroupLabel(group, appliedFilters.dropoutGroup)}
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
                                            <th key={group}>{getGroupLabel(group, appliedFilters.dropoutGroup)}</th>
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

    const InventoryTab = () => {
        const [editData, setEditData] = useState({
            vaccines: [],
            special: {
                fullWithin23m: 0,
                started24To59m: 0,
                aefiNormal: 0,
                aefiSerious: 0
            }
        });
        const [autoFilling, setAutoFilling] = useState(false);
        const [initialLoading, setInitialLoading] = useState(false);
        const [inventoryEditing, setInventoryEditing] = useState(false);

        // COMPLETELY SEPARATE STATE FOR INVENTORY
        const [inventoryMonthDraft, setInventoryMonthDraft] = useState(filters.inventoryMonth);
        const [appliedInventoryMonth, setAppliedInventoryMonth] = useState(appliedFilters.inventoryMonth);
        const [bsMonthBoundaries, setBsMonthBoundaries] = useState({ start: '', end: '' });

        useEffect(() => {
            if (appliedInventoryMonth && appliedInventoryMonth.trim() !== '') {
                // Calculate BS month boundaries when month is applied
                const boundaries = getBSMonthBoundaries(appliedInventoryMonth);
                setBsMonthBoundaries(boundaries);
                loadInventoryData(boundaries);
            }
        }, [appliedInventoryMonth]);

        const loadInventoryData = async (boundaries) => {
            if (!appliedInventoryMonth || appliedInventoryMonth.trim() === '' || !boundaries.start) {
                console.log('Skipping inventory load: No month or boundaries');
                return;
            }

            setInitialLoading(true);
            try {
                const response = await axiosClient.get('/api/analytics/inventory', {
                    params: {
                        snapshotMonth: boundaries.start,
                        snapshotMonthEnd: boundaries.end
                    }
                });

                if (response.data.success && response.data.data) {
                    const { vaccineTypes, doseCounts, inventories, special } = response.data.data;

                    const vaccineMap = new Map();

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

                    doseCounts.forEach(dc => {
                        const vac = vaccineMap.get(dc.vaccineTypeId);
                        if (vac) {
                            vac.doses[dc.doseNumber] = dc.countGiven || 0;
                        }
                    });

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

                    setEditData(processedData);
                } else {
                    if (response.data.data?.vaccineTypes) {
                        const emptyVaccines = response.data.data.vaccineTypes.map(v => ({
                            ...v,
                            doses: {},
                            inventory: {
                                received: 0,
                                spent: 0,
                                opened: 0,
                                spoiled: 0,
                                returned: 0
                            }
                        }));

                        setEditData({
                            vaccines: emptyVaccines,
                            special: {
                                fullWithin23m: 0,
                                started24To59m: 0,
                                aefiNormal: 0,
                                aefiSerious: 0
                            }
                        });
                    }
                }
            } catch (err) {
                console.error('Error loading inventory data:', err);
                alert('Failed to load inventory data');
            } finally {
                setInitialLoading(false);
            }
        };

        const handleDirectDateChange = (value) => {
            console.log('BS Date selected:', value);
            setInventoryMonthDraft(value);
        };

        const handleApplyInventoryFilters = () => {
            if (inventoryMonthDraft) {
                setAppliedInventoryMonth(inventoryMonthDraft);
                // Also update the main appliedFilters so exports work
                setAppliedFilters(prev => ({ ...prev, inventoryMonth: inventoryMonthDraft }));
            } else {
                alert('Please select a month first');
            }
        };

        const clearInventoryMonth = () => {
            setInventoryMonthDraft('');
            setAppliedInventoryMonth('');
            setBsMonthBoundaries({ start: '', end: '' });
            setAppliedFilters(prev => ({ ...prev, inventoryMonth: '' }));
        };

        const handleAutoFill = async () => {
            if (!appliedInventoryMonth || appliedInventoryMonth.trim() === '' || !bsMonthBoundaries.start) {
                alert('Please select a month first and click "Apply"');
                return;
            }

            try {
                setAutoFilling(true);

                const response = await axiosClient.get('/api/analytics/inventory/auto-fill', {
                    params: {
                        snapshotMonth: bsMonthBoundaries.start,
                        snapshotMonthEnd: bsMonthBoundaries.end
                    }
                });

                if (!response.data?.success) {
                    throw new Error(response.data?.message || 'Auto-fill failed');
                }

                const { doseCounts, inventories, special } = response.data.data;

                setEditData(currentEditData => {
                    const updatedVaccines = currentEditData.vaccines.map(vaccine => {
                        const vaccineDoses = doseCounts?.filter(dc => dc.vaccineTypeId === vaccine.id) || [];
                        const newDoses = { ...vaccine.doses };

                        vaccineDoses.forEach(dc => {
                            newDoses[dc.doseNumber] = dc.countGiven || 0;
                        });

                        const vaccineInventory = inventories?.find(inv => inv.vaccineTypeId === vaccine.id);
                        const finalInventory = vaccineInventory || { ...vaccine.inventory };

                        return {
                            ...vaccine,
                            doses: newDoses,
                            inventory: finalInventory
                        };
                    });

                    const newData = {
                        vaccines: updatedVaccines,
                        special: { ...currentEditData.special, ...special }
                    };

                    return newData;
                });

                setInventoryEditing(true);
                alert('Auto-fill completed successfully!');

            } catch (err) {
                console.error('Auto-fill error:', err);
                alert(`Auto-fill failed: ${err.message}`);
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
            if (!appliedInventoryMonth || appliedInventoryMonth.trim() === '' || !bsMonthBoundaries.start) {
                alert('Please select a month first and click "Apply"');
                return;
            }

            try {
                const payload = {
                    snapshotMonth: bsMonthBoundaries.start,
                    snapshotMonthEnd: bsMonthBoundaries.end,
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

                const response = await axiosClient.post('/api/analytics/inventory', payload);

                if (response.data.success) {
                    alert('✅ Data saved successfully!');
                    setInventoryEditing(false);
                    await loadInventoryData(bsMonthBoundaries);
                } else {
                    throw new Error(response.data.message || 'Unknown save error');
                }
            } catch (err) {
                console.error('Save error details:', err);
                const errorInfo = handleApiError(err);
                alert(`❌ Save failed: ${errorInfo.message || err.message}`);
            }
        };

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                        <label className="label font-semibold">Select BS Month</label>
                        <div className="flex gap-2 items-end">
                            <div className="relative flex-1">
                                <NepaliDatePicker
                                    className="w-full"
                                    inputClassName="input input-bordered input-sm w-full pr-8"
                                    value={inventoryMonthDraft}
                                    onChange={handleDirectDateChange}
                                    options={{ calenderLocale: "ne", valueLocale: "en" }}
                                    language="ne"
                                    minYear={2000}
                                    maxYear={currentBSYear}
                                    placeholder="Select BS month"
                                />
                                {inventoryMonthDraft && (
                                    <button
                                        type="button"
                                        onClick={clearInventoryMonth}
                                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Clear date"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleApplyInventoryFilters}
                                disabled={initialLoading || !inventoryMonthDraft}
                            >
                                {initialLoading ? '🔄' : '📅'} Apply
                            </button>
                        </div>

                        {/* Show BS month boundaries info */}
                        {bsMonthBoundaries.start && (
                            <div className="text-xs text-info mt-2">
                                📅 BS Month Range: {convertEnglishToNepali(bsMonthBoundaries.start)} to {convertEnglishToNepali(bsMonthBoundaries.end)}
                                <br />
                                📅 AD Equivalent: {bsMonthBoundaries.start} to {bsMonthBoundaries.end}
                            </div>
                        )}

                        {!inventoryMonthDraft && (
                            <div className="text-xs text-gray-500 mt-1">
                                Select a BS month and click "Apply" to load data
                            </div>
                        )}
                        {inventoryMonthDraft && inventoryMonthDraft !== appliedInventoryMonth && (
                            <div className="text-xs text-warning mt-1">
                                ⚠️ Month selected but not applied. Click "Apply" to load data.
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            className={`btn btn-outline ${autoFilling ? 'btn-disabled' : ''}`}
                            onClick={handleAutoFill}
                            disabled={autoFilling || !appliedInventoryMonth}
                        >
                            {autoFilling ? '⏳ Filling...' : '🚀 Auto-fill'}
                        </button>

                        <button
                            className="btn btn-outline"
                            onClick={() => loadInventoryData(bsMonthBoundaries)}
                            disabled={initialLoading || !appliedInventoryMonth}
                        >
                            {initialLoading ? '🔄' : '📥'} Refresh Data
                        </button>

                        {inventoryEditing ? (
                            <>
                                <button className="btn btn-primary" onClick={saveData}>💾 Save</button>
                                <button className="btn btn-ghost" onClick={() => setInventoryEditing(false)}>❌ Cancel</button>
                            </>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => setInventoryEditing(true)}
                                disabled={!appliedInventoryMonth}
                            >
                                ✏️ Edit
                            </button>
                        )}
                    </div>
                </div>

                {initialLoading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="flex flex-col items-center gap-2">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-gray-600">Loading inventory data...</p>
                        </div>
                    </div>
                )}

                {!appliedInventoryMonth && !initialLoading && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            {inventoryMonthDraft
                                ? "Click 'Apply' to load inventory data for the selected month"
                                : "Please select a BS month and click 'Apply' to load inventory data"
                            }
                        </div>
                    </div>
                )}

                {!initialLoading && appliedInventoryMonth && editData.vaccines.length > 0 && (
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

                {!initialLoading && appliedInventoryMonth && editData.vaccines.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            No inventory data found for selected month. Use Auto-fill to generate data.
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="p-6 space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }}
        >
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

            {/* FIX: Inlined Filter Section */}
            <div className="bg-base-200 p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4 items-end">
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

                    {/* Date Pickers */}
                    <div>
                        <label className="label font-semibold text-sm">Start Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={filters.startDate}
                                onChange={handleDateChange}
                                name="startDate"
                                placeholder="Start date"
                            />
                            {filters.startDate && (
                                <button
                                    type="button"
                                    onClick={() => handleDateChange('startDate', '')}
                                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-xs"
                                    title="Clear date"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="label font-semibold text-sm">End Date</label>
                        <div className="relative">
                            <CustomDatePicker
                                value={filters.endDate}
                                onChange={handleDateChange}
                                name="endDate"
                                placeholder="End date"
                            />
                            {filters.endDate && (
                                <button
                                    type="button"
                                    onClick={() => handleDateChange('endDate', '')}
                                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-xs"
                                    title="Clear date"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* FIX: Apply Button that updates appliedFilters */}
                    <div>
                        <button
                            className="btn btn-primary btn-sm w-full"
                            onClick={handleApplyFilters}
                            disabled={loading}
                        >
                            {loading ? '🔄 Loading...' : '🔍 Apply Filters'}
                        </button>
                    </div>
                </div>

                {/* Granularity filters */}
                {(activeTab === 'trends' || activeTab === 'monthly-dropout') && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 mt-4">
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
                    </div>
                )}
            </div>

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
                                <span>Comparing {appliedFilters.compareStartDate} to {appliedFilters.compareEndDate} vs {appliedFilters.startDate} to {appliedFilters.endDate}</span>
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