import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronLeft,
  FaUserShield,
  FaUserTie,
  FaUserNurse,
  FaSpinner,
  FaHardHat // A new icon for ward officer
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function UserProfile() {
  const { t } = useTranslation('UserProfile');
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get(`/api/users/${userId}`);
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <FaUserShield className="text-xl" />;
      case 'healthworker':
        return <FaUserNurse className="text-xl" />;
      case 'staff':
      case 'ward_officer': // Handle the new role
        return <FaUserTie className="text-xl" />;
      default:
        return <FaUser className="text-xl" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-3" />
          <p className="text-base-content">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-error/20 max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-base-content mb-2">
              {t('error.title')}
            </h2>
            <p className="text-base-content text-sm">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium"
            >
              {t('error.backButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-error/20 max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-base-content mb-2">
              {t('notFound.title')}
            </h2>
            <p className="text-base-content text-sm">{t('notFound.message')}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium"
            >
              {t('error.backButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-sm border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-focus transition-colors font-medium cursor-pointer"
          >
            <FaChevronLeft className="text-sm" />
            <span>{t('backButton')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden">
          <div className="bg-primary text-primary-content p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                {getRoleIcon(user.role)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-primary-content/90">
                  {t(`roles.${user.role.toLowerCase()}`, { defaultValue: user.role })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-base-content border-b border-base-300 pb-2">
                  {t('personalInfo.title')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaEnvelope className="text-base-content/70 mt-1" />
                    <div>
                      <p className="text-xs text-base-content/60">{t('personalInfo.email')}</p>
                      <p className="text-base-content">{user.email || 'N/A'}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-start space-x-3">
                      <FaPhone className="text-base-content/70 mt-1" />
                      <div>
                        <p className="text-xs text-base-content/60">{t('personalInfo.phone')}</p>
                        <p className="text-base-content">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-start space-x-3">
                      <FaMapMarkerAlt className="text-base-content/70 mt-1" />
                      <div>
                        <p className="text-xs text-base-content/60">{t('personalInfo.address')}</p>
                        <p className="text-base-content">{user.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold text-base-content border-b border-base-300 pb-2">
                  {t('accountInfo.title')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaUser className="text-base-content/70 mt-1" />
                    <div>
                      <p className="text-xs text-base-content/60">{t('accountInfo.role')}</p>
                      <p className="text-base-content">
                        {t(`roles.${user.role.toLowerCase()}`, { defaultValue: user.role })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaCalendarAlt className="text-base-content/70 mt-1" />
                    <div>
                      <p className="text-xs text-base-content/60">{t('accountInfo.memberSince')}</p>
                      <p className="text-base-content">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 2