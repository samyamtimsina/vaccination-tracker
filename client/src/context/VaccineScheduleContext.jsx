import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';


export const VaccineScheduleContext = createContext();

export const VaccineScheduleProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [vaccineSchedule, setvaccineSchedule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchedule() {
            if (!isAuthenticated) return;
            try {
                const res = await axiosClient.get('/api/vaccine-schedule');
                const data = res.data;
                console.log("Fetched vaccine schedule data:", data);

                // Transform doses
                const dosesByVaccine = data.doses.reduce((acc, dose) => {
                    if (!acc[dose.vaccineName]) acc[dose.vaccineName] = [];
                    acc[dose.vaccineName].push(dose);
                    return acc;
                }, {});

                setvaccineSchedule({ doses: dosesByVaccine });
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch vaccine schedule', err);
            } finally {
                setLoading(false);
            }
        }

        fetchSchedule();
    }, [isAuthenticated]);


    return (
        <VaccineScheduleContext.Provider value={{ vaccineSchedule, loading }}>
            {children}
        </VaccineScheduleContext.Provider>
    );
};
export function useVaccineScheduleContext() {
    return useContext(VaccineScheduleContext);
}