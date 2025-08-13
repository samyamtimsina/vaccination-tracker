import { createContext, useContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

const ChildContext = createContext();

export function ChildProvider({ children }) {
  const [childrenData, setChildrenData] = useState([]);
  const [fetched, setFetched] = useState(false); // To avoid refetch
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchChildren() {
    if (fetched) return; // Skip if already fetched
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/child');
      setChildrenData(res.data);
      setFetched(true);
    } catch (err) {
      console.error('Failed to fetch children:', err);
      setError('Failed to load children records. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function addChildToState(newChild) {
    setChildrenData((prev) => [...prev, newChild]);
  }

  function updateChildInState(updatedChild) {
    setChildrenData((prev) =>
      prev.map((child) =>
        child.id === updatedChild.id ? updatedChild : child,
      ),
    );
  }

  return (
    <ChildContext.Provider
      value={{
        childrenData,
        error,
        loading,
        fetchChildren,
        addChildToState,
        updateChildInState,
      }}
    >
      {children}
    </ChildContext.Provider>
  );
}

export function useChildContext() {
  return useContext(ChildContext);
}
