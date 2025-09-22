import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const ChildContext = createContext();

export function ChildProvider({ children }) {
  const { user, registerResetCallback, unregisterResetCallback } = useAuth();
  const [childrenData, setChildrenData] = useState([]);
  const [fetched, setFetched] = useState(false); // avoid refetch
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset function for this context
  const resetChildContext = () => {
    setChildrenData([]);
    setFetched(false);
    setLoading(false);
    setError(null);
  };

  // Register reset callback with AuthContext
  useEffect(() => {
    registerResetCallback(resetChildContext);

    return () => {
      unregisterResetCallback(resetChildContext);
    };
  }, [registerResetCallback, unregisterResetCallback]);

  async function fetchChildren() {
    if (fetched) return; // Skip if already fetched
    setLoading(true);

    try {
      let endpoint = '/api/child/ward'; // default
      if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
        endpoint = '/api/child/all';
      } else if (user?.role === 'WARD_OFFICER') {
        endpoint = '/api/child/ward';
      }

      const res = await axiosClient.get(endpoint);
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