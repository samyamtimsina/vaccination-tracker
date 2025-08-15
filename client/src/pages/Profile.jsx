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
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation('profile');
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

  const profileUser = user || {
    name: t('guestUser.name'),
    email: t('guestUser.email'),
    ward: '',
    role: t('guestUser.role'),
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
      login({ ...user, ...response.data.user }, user.token);
      toast.success(t('success.profileUpdated'));
      setIsEditingProfile(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('error.profileUpdateFailed'));
      setErrors({
        server: err?.response?.data?.message || t('error.profileUpdateFailed'),
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
      setErrors({ confirmPassword: t('error.passwordMismatch') });
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosClient.post('/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(t('success.passwordChanged'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsEditingPassword(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('error.passwordChangeFailed'));
      setErrors({
        server: err?.response?.data?.message || t('error.passwordChangeFailed'),
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
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="min-h-screen bg-base-200 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full mx-auto card bg-base-100 shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-base-content tracking-tight">
              {t('header.title')}
            </h2>
            <Link to="/dashboard" className="btn btn-ghost btn-sm text-primary">
              <FaArrowLeft />
              <span>{t('header.backToDashboard')}</span>
            </Link>
          </div>

          <div className="card p-5 bg-base-200 border border-base-300 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <FaUserCircle className="text-6xl text-primary" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-medium text-base-content mb-1">
                  {profileUser.name}
                </h3>
                <p className="text-sm text-base-content text-opacity-70 mb-3">
                  {profileUser.email}
                </p>
                <button
                  onClick={() => {
                    setIsEditingProfile(!isEditingProfile);
                    setIsEditingPassword(false);
                  }}
                  className="btn btn-primary btn-outline btn-sm"
                >
                  <FaEdit />
                  <span>{isEditingProfile ? t('buttons.cancel') : t('buttons.editProfile')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="card bg-base-100 p-5 border border-base-200 shadow-sm">
              <h4 className="text-lg font-medium text-base-content mb-3">
                {t('personalInfo.title')}
              </h4>
              {isEditingProfile ? (
                <form onSubmit={handleProfileChange} className="space-y-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('personalInfo.name')}</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileInputChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('personalInfo.namePlaceholder')}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('personalInfo.email')}</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileInputChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('personalInfo.emailPlaceholder')}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('personalInfo.ward')}</span>
                    </label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                      <input
                        type="text"
                        name="ward"
                        value={profileData.ward}
                        onChange={handleProfileInputChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('personalInfo.wardPlaceholder')}
                      />
                    </div>
                  </div>
                  {errors.server && (
                    <p className="text-error text-xs mt-1">{errors.server}</p>
                  )}
                  <div className="flex space-x-3 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-block"
                    >
                      {isSubmitting ? t('buttons.saving') : t('buttons.saveProfile')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="btn btn-ghost btn-block"
                    >
                      {t('buttons.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-base-content">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-primary" />
                    <span className="font-medium">{t('personalInfo.name')}:</span>
                    <span className="text-base-content text-opacity-70">
                      {profileUser.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-primary" />
                    <span className="font-medium">{t('personalInfo.email')}:</span>
                    <span className="text-base-content text-opacity-70">
                      {profileUser.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaBuilding className="text-primary" />
                    <span className="font-medium">{t('personalInfo.ward')}:</span>
                    <span className="text-base-content text-opacity-70">
                      {profileUser.ward || t('personalInfo.wardNotSet')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{t('personalInfo.role')}:</span>
                    <span className="text-base-content text-opacity-70">
                      {profileUser.role || t('personalInfo.roleNotSet')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="card bg-base-100 p-5 border border-base-200 shadow-sm">
              <h4 className="text-lg font-medium text-base-content mb-3">
                {t('password.title')}
              </h4>
              {isEditingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('password.current')}</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('password.currentPlaceholder')}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('password.new')}</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('password.newPlaceholder')}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('password.confirm')}</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('password.confirmPlaceholder')}
                        required
                      />
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                  {errors.server && (
                    <p className="text-error text-xs mt-1">{errors.server}</p>
                  )}
                  <div className="flex space-x-3 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-block"
                    >
                      {isSubmitting ? t('buttons.saving') : t('buttons.savePassword')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPassword(false)}
                      className="btn btn-ghost btn-block"
                    >
                      {t('buttons.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setIsEditingPassword(true);
                    setIsEditingProfile(false);
                  }}
                  className="btn btn-secondary btn-block"
                >
                  {t('buttons.changePassword')}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}