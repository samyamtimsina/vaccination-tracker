import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">
          <span className="text-blue-600">खोप अनुगमन प्रणाली</span> मा स्वागत छ
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          छोराछोरी र आमाहरूको खोप अभिलेख सजिलै व्यवस्थापन गर्नुहोस्। हाम्रो सहज
          र सुरक्षित प्लेटफर्मले तपाईंको स्वास्थ्य डेटा व्यवस्थित र पहुँचयोग्य
          बनाउँछ।
        </p>
        <div className="flex justify-center space-x-4 mb-12">
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Register
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              खोप अभिलेख
            </h3>
            <p className="text-gray-600">
              बालबालिका र आमाहरूको खोप रेकर्डहरू सजिलै ट्र्याक र व्यवस्थापन
              गर्नुहोस्।
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              प्रोफाइल व्यवस्थापन
            </h3>
            <p className="text-gray-600">
              प्रोफाइलहरू थप्नुहोस् र एकै ठाउँमा सबै जानकारी व्यवस्थित
              गर्नुहोस्।
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              सुरक्षित र सजिलो
            </h3>
            <p className="text-gray-600">
              हाम्रो प्लेटफर्मले डेटा सुरक्षित राख्छ र प्रयोग गर्न सजिलो बनाउँछ।
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
