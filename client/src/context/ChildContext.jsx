import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext'; // Add this import

const ChildContext = createContext();

export function ChildProvider({ children }) {
  const { registerResetCallback, unregisterResetCallback } = useAuth(); // Add this
  const [childrenData, setChildrenData] = useState([]);
  const [fetched, setFetched] = useState(false);
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
    if (fetched) return;
    setLoading(true);
    try {
      const res = await axiosClient.get('/api/child/all');
      setChildrenData(res.data);
      console.log('Fetched children data:', res.data);
      setFetched(true);
    } catch (err) {
      console.error('Failed to fetch children:', err);
      setError('Failed to load children records. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  function addChildToState(newChild) {
    setChildrenData((prev) => {
      if (!prev || !Array.isArray(prev.children)) {
        // Fallback if somehow not in expected shape
        return { children: [newChild], total: 1, page: 1, limit: 20 };
      }

      return {
        ...prev,
        children: [...prev.children, newChild],
        total: (prev.total || 0) + 1,
      };
    });
  }

  function updateChildInState(updatedChild) {
    setChildrenData((prev) => {
      if (!prev || !Array.isArray(prev.children)) return prev;

      return {
        ...prev,
        children: prev.children.map((child) =>
          child.id === updatedChild.id ? updatedChild : child
        ),
      };
    });
  }

  function updateChildInState(updatedChild) {
    setChildrenData((prev) => {
      if (!prev || !Array.isArray(prev.children)) return prev;

      return {
        ...prev,
        children: prev.children.map((child) =>
          child.id === updatedChild.id ? updatedChild : child
        ),
      };
    });
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