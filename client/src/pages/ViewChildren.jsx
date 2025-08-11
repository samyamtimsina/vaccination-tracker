import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  FaSpinner,
  FaChevronLeft,
  FaBaby,
  FaEye,
  FaBirthdayCake,
} from 'react-icons/fa';
import {
  safeGregorianToNepali,
  safeCalculateAge,
  safeFormatDate,
} from '../utils/date.js'; // Adjust path as needed

export default function AllChildren() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axiosClient.get('/api/child/ward');
        debugger; // Set a breakpoint here to inspect the response
        console.log('Raw API response:', response);
        setChildren(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching children:', err);
        setError(
          err.response?.data?.message || 'Could not load children data.',
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <FaSpinner className="animate-spin text-5xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (selectedChild) {
    const age = safeCalculateAge(selectedChild.birthDate);

    return (
      <main className="min-h-screen bg-base-200 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedChild(null)}
            className="btn btn-ghost btn-sm mb-6"
          >
            <FaChevronLeft /> Back to All Children
          </button>

          <div className="bg-base-100 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-primary mb-4">
              {selectedChild.fullName} {selectedChild.lastName || ''}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p>
                  <strong>Gender:</strong> {selectedChild.gender}
                </p>
                <p>
                  <strong>Ward Number:</strong> {selectedChild.wardNumber}
                </p>
                <p>
                  <strong>Parent Name:</strong> {selectedChild.parentName}
                </p>
                <p>
                  <strong>Tole:</strong> {selectedChild.tole}
                </p>
                {selectedChild.phoneNumber && (
                  <p>
                    <strong>Phone:</strong> {selectedChild.phoneNumber}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <p>
                  <strong>Birth Date (B.S.):</strong>{' '}
                  {safeGregorianToNepali(selectedChild.birthDate)}
                </p>
                <p>
                  <strong>Birth Date (A.D.):</strong>{' '}
                  {safeFormatDate(selectedChild.birthDate)}
                </p>
                <p>
                  <strong>Age:</strong> {age.formatted}
                </p>
                <p>
                  <strong>Full Vaccination:</strong>{' '}
                  {selectedChild.purnaKhop ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Display vaccine information */}
            {selectedChild.vaccines && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Vaccination Records</h3>
                <div className="space-y-4">
                  {Object.entries(selectedChild.vaccines).map(
                    ([vaccineName, doses]) => (
                      <div key={vaccineName} className="card bg-base-200 p-4">
                        <h4 className="font-semibold mb-2">{vaccineName}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {doses.map((doseDate, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">
                                Dose {index + 1}:
                              </span>{' '}
                              {doseDate ? (
                                <>
                                  <span className="text-primary">
                                    {safeGregorianToNepali(doseDate)}
                                  </span>
                                  <span className="text-xs text-base-content/70 ml-2">
                                    ({safeFormatDate(doseDate)})
                                  </span>
                                </>
                              ) : (
                                <span className="text-base-content/50">
                                  Not given
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {selectedChild.remarks && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Remarks:</h4>
                <p className="text-base-content/80">{selectedChild.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-primary">
            All Children Records
          </h1>
          <button className="flex items-center btn btn-primary">
            <FaBaby /> Add New Child
          </button>
        </header>

        {children.length === 0 ? (
          <div className="alert alert-info">No children records found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => {
              const age = safeCalculateAge(child.birthDate);

              return (
                <div
                  key={child.id}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {child.fullName} {child.lastName || ''}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <FaBirthdayCake className="inline mr-2" />
                      {age.formatted}
                    </p>
                    <p className="text-base-content/70">
                      <strong>B.S.:</strong>{' '}
                      {safeGregorianToNepali(child.birthDate)}
                    </p>
                    <p className="text-base-content/70">
                      <strong>A.D.:</strong> {safeFormatDate(child.birthDate)}
                    </p>
                    <p className="text-base-content/70">
                      <strong>Ward:</strong> {child.wardNumber}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedChild(child)}
                    className="btn btn-primary btn-sm mt-4 flex items-center space-x-2"
                  >
                    <FaEye /> <span>View Details</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
