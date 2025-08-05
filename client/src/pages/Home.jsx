import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHeartbeat,
  FaChild,
  FaStethoscope,
  FaUserCircle,
  FaLock,
} from 'react-icons/fa';

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
    <main className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-6 tracking-tight">
          <span className="text-primary">खोप अनुगमन प्रणाली</span> मा स्वागत छ
        </h1>
        <p className="text-lg sm:text-xl text-base-content mb-10 max-w-2xl mx-auto leading-relaxed">
          छोराछोरी र आमाहरूको खोप अभिलेख सजिलै व्यवस्थापन गर्नुहोस्। हाम्रो सहज
          र सुरक्षित प्लेटफर्मले तपाईंको स्वास्थ्य डेटा व्यवस्थित र पहुँचयोग्य
          बनाउँछ।
        </p>
        <div className="flex justify-center space-x-4 mb-12">
          <Link
            to="/login"
            className="btn btn-primary btn-lg transform transition-all duration-300 hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn btn-outline btn-lg btn-primary transform transition-all duration-300 hover:scale-105"
          >
            Register
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card bg-base-100 p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-center text-primary text-4xl mb-4">
              <FaChild />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-3">
              खोप अभिलेख
            </h3>
            <p className="text-base-content text-opacity-80">
              बालबालिका र आमाहरूको खोप रेकर्डहरू सजिलै ट्र्याक र व्यवस्थापन
              गर्नुहोस्।
            </p>
          </div>
          <div className="card bg-base-100 p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-center text-primary text-4xl mb-4">
              <FaUserCircle />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-3">
              प्रोफाइल व्यवस्थापन
            </h3>
            <p className="text-base-content text-opacity-80">
              प्रोफाइलहरू थप्नुहोस् र एकै ठाउँमा सबै जानकारी व्यवस्थित
              गर्नुहोस्।
            </p>
          </div>
          <div className="card bg-base-100 p-6 shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-center text-primary text-4xl mb-4">
              <FaLock />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-3">
              सुरक्षित र सजिलो
            </h3>
            <p className="text-base-content text-opacity-80">
              हाम्रो प्लेटफर्मले डेटा सुरक्षित राख्छ र प्रयोग गर्न सजिलो बनाउँछ।
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
