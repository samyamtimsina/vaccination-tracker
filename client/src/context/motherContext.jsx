import { createContext, useContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

const MotherContext = createContext();

export function MotherProvider({ children }) {
  const [mothersData, setMothersData] = useState([]);
  const [fetched, setFetched] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMothers() {
    if (fetched) return;     setLoading(true);
    try {
      const res = await axiosClient.get('/api/mothers');
      setMothersData(res.data);
      setFetched(true);
    } catch (err) {
      console.error('Failed to fetch mothers:', err);
      setError('Failed to load mothers records. Please try again.');
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
        addMotherToState,
        updateMotherInState,
      }}
    >
      {children}
    </MotherContext.Provider>
  );
}

export function useMotherContext() {
  return useContext(MotherContext);
}