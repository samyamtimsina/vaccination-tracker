import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';


export const VaccineScheduleContext = createContext();

export const VaccineScheduleProvider = ({ children }) => {
    const [vaccineSchedule, setvaccineSchedule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchedule() {
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
            } catch (err) {
                console.error('Failed to fetch vaccine schedule', err);
            } finally {
                setLoading(false);
            }
        }

        fetchSchedule();
    }, []);


    return (
        <VaccineScheduleContext.Provider value={{ vaccineSchedule, loading }}>
            {children}
        </VaccineScheduleContext.Provider>
    );
};