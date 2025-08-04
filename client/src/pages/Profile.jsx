import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserCircle,
  FaEnvelope,
  FaUser,
  FaEdit,
  FaArrowLeft,
  FaLock,
  FaBuilding,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, login } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    ward: user?.ward || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback user data
  const profileUser = user || {
    name: 'Guest User',
    email: 'guest@example.com',
    ward: '',
    role: 'Guest',
  };

  const handleProfileChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await axiosClient.put('/update-profile', {
        name: profileData.name,
        email: profileData.email,
        ward: profileData.ward,
      });
      // Update user in AuthContext and localStorage
      login({ ...user, ...response.data.user }, user.token);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
      setErrors({
        server: err?.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosClient.post('/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsEditingPassword(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
      setErrors({
        server: err?.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 tracking-tight">
            प्रोफाइल
          </h2>
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <FaArrowLeft />
            <span>ड्यासबोर्डमा फर्कनुहोस्</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start p-5 bg-blue-50 rounded-lg border border-blue-100 shadow-sm mb-6">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <FaUserCircle className="text-6xl text-blue-600" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-medium text-gray-800 mb-1">
              {profileUser.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{profileUser.email}</p>
            <button
              onClick={() => {
                setIsEditingProfile(!isEditingProfile);
                setIsEditingPassword(false);
              }}
              className="flex items-center justify-center space-x-2 bg-blue-200 hover:bg-blue-300 text-blue-800 font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-200"
            >
              <FaEdit />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6 grid grid-cols-1 gap-6">
          {/* Personal Information Card */}
          <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <h4 className="text-lg font-medium text-gray-800 mb-3">
              व्यक्तिगत जानकारी
            </h4>
            {isEditingProfile ? (
              <form onSubmit={handleProfileChange} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    नाम
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="तपाईंको नाम"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    इमेल
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="तपाईंको इमेल"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    वार्ड
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="ward"
                      value={profileData.ward}
                      onChange={handleProfileInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="वार्ड नम्बर (वैकल्पिक)"
                    />
                  </div>
                </div>
                {errors.server && (
                  <p className="text-red-500 text-xs mt-1">{errors.server}</p>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-200 disabled:opacity-50 transform hover:scale-105"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-200 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-blue-600" />
                  <span className="font-medium text-gray-700">नाम:</span>
                  <span className="text-gray-600">{profileUser.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-blue-600" />
                  <span className="font-medium text-gray-700">इमेल:</span>
                  <span className="text-gray-600">{profileUser.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBuilding className="text-blue-600" />
                  <span className="font-medium text-gray-700">वार्ड:</span>
                  <span className="text-gray-600">
                    {profileUser.ward || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">भूमिका:</span>
                  <span className="text-gray-600">
                    {profileUser.role || 'Not set'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Card */}
          <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <h4 className="text-lg font-medium text-gray-800 mb-3">
              पासवर्ड परिवर्तन गर्नुहोस्
            </h4>
            {isEditingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    हालको पासवर्ड
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="हालको पासवर्ड"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    नयाँ पासवर्ड
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="नयाँ पासवर्ड"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    पासवर्ड पुष्टि गर्नुहोस्
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="पासवर्ड पुष्टि गर्नुहोस्"
                      required
                    />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
                {errors.server && (
                  <p className="text-red-500 text-xs mt-1">{errors.server}</p>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-200 disabled:opacity-50 transform hover:scale-105"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-200 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => {
                  setIsEditingPassword(true);
                  setIsEditingProfile(false);
                }}
                className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800 font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-200 transform hover:scale-105"
              >
                Change Password
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
