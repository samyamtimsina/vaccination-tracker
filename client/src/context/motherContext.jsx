import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const MotherContext = createContext();

export function MotherProvider({ children }) {
  const { registerResetCallback, unregisterResetCallback } = useAuth();
  const [mothersData, setMothersData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset function for this context
  const resetMotherContext = () => {
    setMothersData([]);
    setFetched(false);
    setLoading(false);
    setError(null);
    setPagination({ page: 1, limit: 20, total: 0 });
  };

  useEffect(() => {
    registerResetCallback(resetMotherContext);
    return () => {
      unregisterResetCallback(resetMotherContext);
    };
  }, [registerResetCallback, unregisterResetCallback]);

  const fetchMothers = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/mothers/ward', { params: { page, limit } });
      setMothersData(res.data.mothers);
      setPagination({ page: res.data.page, limit: res.data.limit, total: res.data.total });
      setFetched(true);
    } catch (err) {
      setError('Failed to load mothers records. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  async function fetchMotherDetails(sewaDartaNumber) {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/api/mothers/${sewaDartaNumber}`);
      return res.data;
    } catch (err) {
      setError('Failed to load mother details.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function addMotherToState(newMother) {
    setMothersData((prev) => [...prev, newMother]);
  }

  function updateMotherInState(updatedMother) {
    setMothersData((prev) =>
      prev.map((mother) =>
        mother.id === updatedMother.id ? updatedMother : mother,
      ),
    );
  }

  return (
    <MotherContext.Provider
      value={{
        mothersData,
        error,
        loading,
        fetchMothers,
        fetchMotherDetails,
        addMotherToState,
        updateMotherInState,
        pagination,
      }}
    >
      {children}
    </MotherContext.Provider>
  );
}

export function useMotherContext() {
  return useContext(MotherContext);
}