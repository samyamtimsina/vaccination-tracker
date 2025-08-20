import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

/**
 * A reusable component for searching and filtering child data.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.childrenData - The array of child data objects to be searched.
 * @param {number} props.currentUserId - The ID of the current logged-in user for the "Created by me" filter.
 */
function ChildSearch({ childrenData, currentUserId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChildren, setFilteredChildren] = useState(childrenData);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterByMyCreations, setFilterByMyCreations] = useState(false);

  // useEffect to handle filtering logic whenever dependencies change.
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    // First, filter based on the "Created by me" checkbox.
    const myFilteredData = filterByMyCreations
      ? childrenData.filter(child => child.createdBy.id === currentUserId)
      : childrenData;

    // Then, filter this subset based on the search term.
    const newFilteredChildren = myFilteredData.filter(child => {
      // Check if the search term matches against fullName, sewaDartaNumber, or createdBy ID.
      const matchesName = child.fullName.toLowerCase().includes(lowercasedSearchTerm);
      const matchesSewaDarta = String(child.sewaDartaNumber).includes(lowercasedSearchTerm);
      const matchesCreatedBy = String(child.createdBy.id).includes(lowercasedSearchTerm);

      return matchesName || matchesSewaDarta || matchesCreatedBy;
    });

    setFilteredChildren(newFilteredChildren);

    // Generate search suggestions if a search term is present.
    if (lowercasedSearchTerm.length > 0) {
      const uniqueSuggestions = Array.from(
        new Set(newFilteredChildren.map(child => child.fullName))
      );
      setSuggestions(uniqueSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

  }, [searchTerm, filterByMyCreations, childrenData, currentUserId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen font-sans">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Child Data Search</h1>
        
        {/* Search Input Section */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="Search by name, Sewa Darta number, or Created By ID..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Filter Checkbox */}
        <div className="flex items-center mb-6">
          <input
            id="myCreationsFilter"
            type="checkbox"
            checked={filterByMyCreations}
            onChange={(e) => setFilterByMyCreations(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="myCreationsFilter" className="ml-2 text-sm font-medium text-gray-900">
            Show only children created by me (ID: {currentUserId})
          </label>
        </div>

        {/* Filtered Results List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredChildren.length > 0 ? (
            <ul className="space-y-4">
              {filteredChildren.map(child => (
                <li
                  key={child.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-semibold text-blue-700">{child.fullName}</h3>
                  <div className="mt-2 text-gray-600 space-y-1 text-sm">
                    <p>
                      <span className="font-medium text-gray-800">Sewa Darta Number:</span> {child.sewaDartaNumber}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Parent Name:</span> {child.parentName}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Created By ID:</span> {child.createdBy.id}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">No results found for your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChildSearch;
